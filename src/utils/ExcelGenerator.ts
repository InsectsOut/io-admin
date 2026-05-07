import ExcelJS from "exceljs";
import { supabase } from "./ClientSupabase";

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
            `*, Clientes!inner(*), Empleados!Servicios_tecnico_id_fkey(*), RegistroAplicacion(*, Productos(*), Plagas(*))`,
            { count: "exact" }
        )
        .filter("organizacion", "eq", organizacion)
        .order("fecha_servicio", { ascending: false });

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

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Servicios");

    const headers = [
        { header: "Folio", key: "folio", width: 10 },
        { header: "Cliente", key: "cliente", width: 30 },
        { header: "Fecha", key: "fecha", width: 14 },
        { header: "Estatus", key: "estatus", width: 14 },
        { header: "Tipo de Servicio", key: "tipoServicio", width: 20 },
        { header: "Técnico", key: "tecnico", width: 20 },
        { header: "Tipo de Aplicación", key: "tipoAplicacion", width: 25 },
        { header: "Plaga", key: "plaga", width: 25 },
        { header: "Lugar de Aplicación", key: "lugar", width: 25 },
        { header: "Insecticida", key: "insecticida", width: 30 },
    ];
    sheet.columns = headers;

    // Estilo de encabezado
    sheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D6F42" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    const bulletCols = new Set(["tipoAplicacion", "plaga", "lugar", "insecticida"]);

    for (const s of servicios as any[]) {
        const registros: any[] = s.RegistroAplicacion ?? [];

        const joinBullets = (values: (string | undefined | null)[]) =>
            values
                .filter(Boolean)
                .map(v => `• ${(v as string).trim()}`)
                .join("\n\n");

        const joinBulletsUnique = (values: (string | undefined | null)[]) =>
            [...new Set(values.filter(Boolean))].map(v => `• ${v}`).join("\n");

        const tipoAplicacion = joinBullets(registros.map(r => r.tipo_aplicacion));
        const plaga = joinBullets(registros.map(r => r.Plagas?.plaga));
        const lugar = joinBullets(registros.map(r => r.area_aplicacion));
        const insecticida = joinBullets(registros.map(r => r.Productos?.nombre));

        const row = sheet.addRow({
            folio: s.folio < 0 ? `FT-${s.folio * -1}` : s.folio,
            cliente: `${s.Clientes?.nombre ?? ""} ${s.Clientes?.apellidos ?? ""}`.trim(),
            fecha: s.fecha_servicio,
            estatus: s.realizado ? "Realizado" : "No realizado",
            tipoServicio: s.tipo_servicio ?? "",
            tecnico: s.Empleados?.nombre?.trim() ?? "",
            tipoAplicacion,
            plaga,
            lugar,
            insecticida,
        });

        row.eachCell((cell, colNum) => {
            const key = headers[colNum - 1]?.key ?? "";
            cell.alignment = {
                vertical: "top",
                wrapText: bulletCols.has(key),
            };
        });
    }

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

