import ExcelJS from "exceljs";
import { supabase } from "./ClientSupabase";
import logoGrandeUrl from "../assets/logoserviplax.png";

export async function downloadServiciosExcel(organizacion: string): Promise<void> {
    const params = new URLSearchParams(window.location.search);

    const clienteParam = params.get("cliente");
    const tipoServicioParam = params.get("tipo_servicio");
    const tecnicoIdParam = params.get("tecnico_id");
    const realizadoParam = params.get("realizado");
    const startDateParam = params.get("startDate");
    const endDateParam = params.get("endDate");
    const busquedaParam = params.get("busqueda");

    const clienteId = clienteParam ? Number(clienteParam) : null;
    const tecnicoId = tecnicoIdParam ? Number(tecnicoIdParam) : null;
    const estatus = realizadoParam === "true" ? true : realizadoParam === "false" ? false : undefined;

    let query = supabase
        .from("Servicios")
        .select(
            `*, Clientes!inner(*), Empleados!Servicios_tecnico_id_fkey(*), RegistroAplicacion(*, Productos(*), Plagas(*)), Direcciones(*)`,
            { count: "exact" }
        )
        .filter("organizacion", "eq", organizacion)
        .order("fecha_servicio", { ascending: true })
        .order("horario_servicio", { ascending: true });

    if (busquedaParam) {
        if (!isNaN(parseInt(busquedaParam))) {
            query = query.eq("folio", parseInt(busquedaParam));
        } else {
            query = query.or(`nombre.ilike.%${busquedaParam}%,apellidos.ilike.%${busquedaParam}%`, {
                foreignTable: "Clientes",
            });
        }
    }

    if (clienteId) query = query.eq("Clientes.id", clienteId);
    if (tipoServicioParam) query = query.eq("tipo_servicio", tipoServicioParam);
    if (tecnicoId) query = query.eq("tecnico_id", tecnicoId);
    if (estatus !== undefined) query = query.eq("realizado", estatus);
    if (startDateParam && endDateParam) {
        const formattedStart = new Date(startDateParam).toISOString().split("T")[0];
        const formattedEnd = new Date(endDateParam).toISOString().split("T")[0];
        query = query.gte("fecha_servicio", formattedStart).lte("fecha_servicio", formattedEnd);
    }

    const { data: servicios, error } = await query;

    if (error || !servicios) {
        console.error("Error al obtener servicios para Excel:", error);
        throw new Error("No se pudieron obtener los servicios");
    }

    // --- Calcular etiqueta de fecha para el encabezado ---
    const MESES_REPORTE = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
    ];
    const formatFechaLabel = (iso: string) => {
        const d = new Date(iso + "T12:00:00");
        return `${d.getDate()} DE ${MESES_REPORTE[d.getMonth()]} DE ${d.getFullYear()}`;
    };
    let fechaLabel = "";
    if (startDateParam && endDateParam && startDateParam === endDateParam) {
        fechaLabel = `DEL DÍA  ${formatFechaLabel(startDateParam)}`;
    } else if (startDateParam && endDateParam) {
        fechaLabel = `DEL ${formatFechaLabel(startDateParam)}  AL  ${formatFechaLabel(endDateParam)}`;
    } else {
        const hoy = new Date();
        fechaLabel = `DEL DÍA  ${hoy.getDate()} DE ${MESES_REPORTE[hoy.getMonth()]} DE ${hoy.getFullYear()}`;
    }

    // --- Workbook ---
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Servicios");

    const COL_COUNT = 13;
    const GREEN_DARK = "FF1D5C30";
    const GREEN_HEADER = "FF1D6F42";

    // Anchos de columnas de datos (A–L)
    const dataColumns = [
        { key: "folio", width: 10 },
        { key: "cliente", width: 30 },
        { key: "fecha", width: 14 },
        { key: "horario", width: 10 },
        { key: "direccion", width: 38 },
        { key: "apodo", width: 22 },
        { key: "estatus", width: 14 },
        { key: "tipoServicio", width: 18 },
        { key: "tecnico", width: 22 },
        { key: "tipoAplicacion", width: 24 },
        { key: "plaga", width: 22 },
        { key: "lugar", width: 26 },
        { key: "insecticida", width: 28 },
    ];
    dataColumns.forEach((col, i) => {
        sheet.getColumn(i + 1).width = col.width;
    });

    // --- Fila 1: Logo + Título ---
    // Logo en A1
    try {
        const response = await fetch(logoGrandeUrl);
        if (response.ok) {
            const buffer = await response.arrayBuffer();
            const imageId = workbook.addImage({ buffer, extension: "png" });
            sheet.addImage(imageId, "A1:C3");
        }
    } catch {
        /* sin logo */
    }

    sheet.getRow(1).height = 55;
    sheet.getRow(2).height = 38;
    sheet.getRow(3).height = 34;

    // Título "REPORTE DE SERVICIOS" en D1:L1
    sheet.mergeCells(1, 4, 1, COL_COUNT);
    const titleCell = sheet.getCell(1, 4);
    titleCell.value = "REPORTE DE SERVICIOS";
    titleCell.font = { bold: true, size: 16, color: { argb: "FF000000" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Fecha en D2:L2
    sheet.mergeCells(2, 4, 2, COL_COUNT);
    const fechaCell = sheet.getCell(2, 4);
    fechaCell.value = fechaLabel;
    fechaCell.font = { bold: true, size: 11 };
    fechaCell.alignment = { horizontal: "center", vertical: "middle" };

    // --- Fila 4: encabezados de tabla ---
    const headerRow = sheet.getRow(4);
    headerRow.height = 28;
    const headerLabels = [
        "Folio",
        "Cliente",
        "Fecha",
        "Horario",
        "Dirección",
        "Área",
        "Estatus",
        "Tipo de Servicio",
        "Técnico",
        "Tipo de Aplicación",
        "Plaga",
        "Lugar de Aplicación",
        "Insecticida",
    ];
    headerLabels.forEach((label, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = label;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN_HEADER } };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = {
            top: { style: "thin", color: { argb: "FFFFFFFF" } },
            bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
            left: { style: "thin", color: { argb: "FFFFFFFF" } },
            right: { style: "thin", color: { argb: "FFFFFFFF" } },
        };
    });

    // --- Filas de datos ---
    const bulletCols = new Set([10, 11, 12, 13]); // 1-based: tipoAplicacion, plaga, lugar, insecticida
    const LIGHT_GREEN = "FFE8F5E9";

    servicios.forEach((s: any, rowIndex) => {
        const registros: any[] = s.RegistroAplicacion ?? [];

        const joinBullets = (values: (string | undefined | null)[]) =>
            values
                .filter(Boolean)
                .map(v => `• ${(v as string).trim()}`)
                .join("\n\n");

        const tipoAplicacion = joinBullets(registros.map(r => r.tipo_aplicacion));
        const plaga = joinBullets(registros.map(r => r.Plagas?.plaga));
        const lugar = joinBullets(registros.map(r => r.area_aplicacion));
        const insecticida = joinBullets(registros.map(r => r.Productos?.nombre));

        const dir = s.Direcciones;
        const direccionStr = dir
            ? [dir.calle, dir.numero_ext ? `#${dir.numero_ext}` : null, dir.colonia, dir.ciudad, dir.estado]
                  .filter(Boolean)
                  .join(", ")
            : "";
        const apodoStr = dir?.apodo_direccion ?? "";

        const dataRow = sheet.addRow([
            s.folio < 0 ? `FT-${s.folio * -1}` : s.folio,
            `${s.Clientes?.nombre ?? ""} ${s.Clientes?.apellidos ?? ""}`.trim(),
            s.fecha_servicio,
            s.horario_servicio ?? "",
            direccionStr,
            apodoStr,
            s.realizado ? "Realizado" : "No realizado",
            s.tipo_servicio ?? "",
            s.Empleados?.nombre?.trim() ?? "",
            tipoAplicacion,
            plaga,
            lugar,
            insecticida,
        ]);

        const isEven = rowIndex % 2 === 0;
        dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.alignment = {
                vertical: "top",
                wrapText: bulletCols.has(colNumber),
                horizontal: colNumber <= 2 ? "left" : "center",
            };
            if (isEven) {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
            }
            cell.border = {
                bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
            };
        });
    });

    // Descargar en el navegador
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_servicios.xlsx";
    a.click();
    URL.revokeObjectURL(url);
}

const MESES_ES = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
];
const DIAS_ES = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

export async function downloadCalendarioExcel(servicioIds: number[]): Promise<void> {
    const { data: servicios, error } = await supabase
        .from("Servicios")
        .select(`*, Clientes(*), Responsables!Servicios_responsable_id_fkey(*), Direcciones(*)`)
        .in("id", servicioIds)
        .order("fecha_servicio", { ascending: true });

    if (error || !servicios || servicios.length === 0) {
        throw new Error("No se pudieron obtener los servicios del grupo");
    }

    const primero = servicios[0];
    const clienteNombre = primero?.Clientes?.nombre
        ? `${primero.Clientes.nombre}${primero.Clientes.apellidos ? ` ${primero.Clientes.apellidos}` : ""}`.toUpperCase()
        : "CLIENTE";
    const responsableNombre = (primero as any)?.Responsables?.nombre?.toUpperCase() ?? "";
    const ciudadDir = (primero?.Direcciones as any)?.ciudad?.toUpperCase() ?? "";
    const estadoDir = (primero?.Direcciones as any)?.estado?.toUpperCase() ?? "";

    const hoy = new Date();
    const fechaDoc = `${ciudadDir}${estadoDir ? `, ${estadoDir}` : ""}. A ${hoy.getDate()} DE ${MESES_ES[hoy.getMonth()]} DE ${hoy.getFullYear()}`;
    const anioServicios = new Date(servicios[0].fecha_servicio + "T12:00:00").getFullYear();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Calendario de Servicios");

    // Anchos de columna: A=espaciador, B=PERIODO, C=ÁREA, D=FECHA, E=espaciador
    sheet.getColumn("A").width = 4;
    sheet.getColumn("B").width = 22;
    sheet.getColumn("C").width = 38;
    sheet.getColumn("D").width = 22;
    sheet.getColumn("E").width = 4;

    const BLUE = "1F5C99";
    const LIGHT_BLUE = "D6E4F0";

    // --- Logo ---
    try {
        const response = await fetch(logoGrandeUrl);
        if (response.ok) {
            const buffer = await response.arrayBuffer();
            const imageId = workbook.addImage({ buffer, extension: "png" });
            sheet.addImage(imageId, {
                tl: { col: 0.2, row: 0.2 },
                ext: { width: 110, height: 55 },
            });
        }
    } catch {
        // Sin logo
    }

    // Filas 1–3: espacio para el logo
    sheet.getRow(1).height = 20;
    sheet.getRow(2).height = 20;
    sheet.getRow(3).height = 20;

    // Fila 4: Nombre de la empresa
    sheet.mergeCells("B4:D4");
    sheet.getRow(4).height = 30;
    const companyCell = sheet.getCell("B4");
    companyCell.value = "SERVICOPLAX CONTROL DE PLAGAS";
    companyCell.font = { bold: true, size: 13, color: { argb: BLUE } };
    companyCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

    // Fila 5: Ciudad y fecha
    sheet.getRow(5).height = 18;
    const dateCell = sheet.getCell("D5");
    dateCell.value = fechaDoc;
    dateCell.font = { size: 10 };
    dateCell.alignment = { horizontal: "right", vertical: "middle" };

    // Fila 6: Nombre del cliente (centrado)
    sheet.mergeCells("B6:D6");
    sheet.getRow(6).height = 20;
    const clienteCell = sheet.getCell("B6");
    clienteCell.value = `${clienteNombre}.`;
    clienteCell.font = { bold: true, size: 11, color: { argb: BLUE } };
    clienteCell.alignment = { horizontal: "center", vertical: "middle" };

    // Fila 7: Espaciador
    sheet.getRow(7).height = 14;

    // Fila 8: AT'N responsable (derecha)
    sheet.getRow(8).height = 20;
    const atnCell = sheet.getCell("D8");
    atnCell.value = `AT´N: ${responsableNombre}.`;
    atnCell.font = { bold: true, size: 11, color: { argb: BLUE } };
    atnCell.alignment = { horizontal: "right", vertical: "middle" };

    // Fila 9: Espaciador
    sheet.getRow(9).height = 14;

    // Fila 10: Título del calendario
    sheet.mergeCells("B10:D10");
    sheet.getRow(10).height = 38;
    const titleCell = sheet.getCell("B10");
    titleCell.value = `CALENDARIO DE SERVICIOS ${anioServicios}`;
    titleCell.font = { bold: true, size: 18, color: { argb: BLUE } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Fila 11: Espaciador
    sheet.getRow(11).height = 12;

    // Fila 12: Encabezados de tabla
    sheet.getRow(12).height = 28;
    const hPeriodo = sheet.getCell("B12");
    hPeriodo.value = "PERIODO";
    hPeriodo.font = { bold: true, size: 12, color: { argb: BLUE } };
    hPeriodo.alignment = { horizontal: "left", vertical: "middle" };

    const hArea = sheet.getCell("C12");
    hArea.value = "DIRECCIÓN";
    hArea.font = { bold: true, size: 12, color: { argb: BLUE } };
    hArea.alignment = { horizontal: "center", vertical: "middle" };

    const hFecha = sheet.getCell("D12");
    hFecha.value = "FECHA";
    hFecha.font = { bold: true, size: 12, color: { argb: BLUE } };
    hFecha.alignment = { horizontal: "center", vertical: "middle" };

    // Filas de datos
    servicios.forEach((servicio, index) => {
        const fechaDate = new Date(servicio.fecha_servicio + "T12:00:00");
        const mes = MESES_ES[fechaDate.getMonth()];
        const diaName = DIAS_ES[fechaDate.getDay()];
        const diaNum = fechaDate.getDate().toString().padStart(2, "0");

        const dir = servicio.Direcciones as any;
        const area = dir?.apodo_direccion
            ? (dir.apodo_direccion as string).toUpperCase()
            : dir
              ? `${dir.calle ?? ""} ${dir.numero_ext ? `#${dir.numero_ext}` : ""} ${dir.colonia ?? ""}`
                    .trim()
                    .toUpperCase()
              : (servicio.tipo_servicio ?? "").toUpperCase();

        const rowNum = 13 + index;
        sheet.getRow(rowNum).height = 28;

        const pCell = sheet.getCell(`B${rowNum}`);
        pCell.value = mes;
        pCell.font = { bold: true, size: 11 };
        pCell.alignment = { horizontal: "left", vertical: "middle" };

        const aCell = sheet.getCell(`C${rowNum}`);
        aCell.value = area;
        aCell.font = { size: 9 };
        aCell.alignment = { horizontal: "center", vertical: "middle", wrapText: false };

        const fCell = sheet.getCell(`D${rowNum}`);
        fCell.value = `${diaName}/${diaNum}`;
        fCell.alignment = { horizontal: "center", vertical: "middle" };

        if (index % 2 === 0) {
            [pCell, aCell, fCell].forEach(cell => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_BLUE } };
            });
        }
    });

    // Filas de pie
    const lastDataRow = 13 + servicios.length;
    sheet.getRow(lastDataRow).height = 14;
    sheet.getRow(lastDataRow + 1).height = 14;

    const equipoRow = lastDataRow + 2;
    sheet.getRow(equipoRow).height = 18;
    const equipoCell = sheet.getCell(`B${equipoRow}`);
    equipoCell.value = "EQUIPO SERVICOPLAX CONTROL DE PLAGAS";
    equipoCell.font = { bold: true, size: 10 };
    equipoCell.alignment = { vertical: "middle" };

    const fechaPieRow = equipoRow + 1;
    sheet.getRow(fechaPieRow).height = 16;
    const fechaPieCell = sheet.getCell(`B${fechaPieRow}`);
    fechaPieCell.value = `${ciudadDir} , ${estadoDir} . A ${hoy.getDate()} DE ${MESES_ES[hoy.getMonth()]} DE ${hoy.getFullYear()}`;
    fechaPieCell.font = { size: 10 };
    fechaPieCell.alignment = { vertical: "middle" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendario_servicios_${anioServicios}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
}

