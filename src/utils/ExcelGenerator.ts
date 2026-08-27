import ExcelJS from "exceljs";
import JSZip from "jszip";
import { supabase } from "./ClientSupabase";
import logoGrandeUrl from "../assets/logoGrande.png";

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

type BitacoraTipoExcel = "ECEXTT" | "ECINT" | "VOLADORES";

const BITACORA_LABELS: Record<BitacoraTipoExcel, string> = {
    ECEXTT: "Exterior",
    ECINT: "Interior",
    VOLADORES: "Voladores",
};

const INTERIOR_PLAGA_ORDER = [
    "ABEJA",
    "AVISPA",
    "ALACRAN",
    "ARAÑA",
    "CHAPULIN / SALTAMONTE",
    "CUCARACHA AMERICANA",
    "CUCARACHA ALEMANA",
    "CHINCHE",
    "COCHINILLA",
    "ESCARABAJO",
    "GARRAPATA",
    "GRILLO",
    "HORMIGA",
    "LAGARTIJA",
    "MOSCO",
    "MOSCA",
    "PALOMILLA",
    "PULGA",
    "PESCADITO DE PLATA",
    "TERMITA MADERA SECA",
    "TERMITA SUBTERRÁNEA",
    "TIJERILLA",
    "VÍBORA",
    "RATÓN",
    "RATA",
    "OTRO",
];

const VOLADORES_PLAGA_ORDER = [
    "ABEJA",
    "AVISPA",
    "ARAÑA",
    "CUC. ALEMANA",
    "CUCARACHA ALEMANA",
    "GORGOJOS",
    "HORMIGA",
    "LAGARTIJA",
    "MOSCO",
    "MOSCA DOMÉSTICA",
    "MOSCA DE LA FRUTA",
    "MOSCA DEL DRENAJE",
    "MOSCAS FORIDAS",
    "MOSCA METÁLICA",
    "PALOMILLA",
    "PALOMILLAS",
    "OTRO",
];

const normalizePlagaName = (name: string) =>
    name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s*\/\s*/g, "/")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

const sortPlagaNames = (names: Iterable<string>, preferredOrder: string[]) => {
    const preferredIndex = new Map(preferredOrder.map((name, index) => [normalizePlagaName(name), index]));
    const uniqueNames = new Map<string, string>();
    for (const name of names) {
        const trimmedName = String(name).trim();
        const normalizedName = normalizePlagaName(trimmedName);
        if (trimmedName && !uniqueNames.has(normalizedName)) uniqueNames.set(normalizedName, trimmedName);
    }
    return [...uniqueNames.values()].sort((a, b) => {
        const aIndex = preferredIndex.get(normalizePlagaName(a));
        const bIndex = preferredIndex.get(normalizePlagaName(b));
        if (aIndex != null && bIndex != null) return aIndex - bIndex;
        if (aIndex != null) return -1;
        if (bIndex != null) return 1;
        return a.localeCompare(b, "es");
    });
};

const getNiceAxisMaximum = (maximum: number) => {
    if (!Number.isFinite(maximum) || maximum <= 0) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(maximum));
    const normalized = maximum / magnitude;
    const step = normalized <= 2 ? 0.5 : normalized <= 5 ? 1 : 2;
    return Math.ceil(maximum / (step * magnitude)) * step * magnitude;
};

const getHallazgoPlagaName = (item: any) => String(item.Plagas?.plaga ?? `Plaga ${item.plaga_id ?? ""}`).trim();

const excelHeaderStyle = (cell: ExcelJS.Cell, color = "FF1F5C99") => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
        top: { style: "thin", color: { argb: "FFFFFFFF" } },
        bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
        left: { style: "thin", color: { argb: "FFFFFFFF" } },
        right: { style: "thin", color: { argb: "FFFFFFFF" } },
    };
};

const addExcelTable = (
    sheet: ExcelJS.Worksheet,
    headers: string[],
    rows: unknown[][],
    startRow = 5,
    includeNativeTable = true
) => {
    headers.forEach((header, index) => {
        const cell = sheet.getCell(startRow, index + 1);
        cell.value = header;
        excelHeaderStyle(cell);
    });
    sheet.getRow(startRow).height = 30;

    rows.forEach((row, rowIndex) => {
        const excelRow = sheet.addRow(row);
        excelRow.eachCell({ includeEmpty: true }, cell => {
            cell.alignment = { vertical: "top", wrapText: true };
            cell.border = { bottom: { style: "hair", color: { argb: "FFCCCCCC" } } };
            if (rowIndex % 2 === 0) {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F7FB" } };
            }
        });
    });

    if (includeNativeTable) {
        const tableEndColumn = excelColumnName(headers.length);
        const tableEndRow = startRow + Math.max(rows.length, 1);
        if (rows.length === 0) {
            sheet.getRow(startRow + 1).values = headers.map(() => "");
        }
        sheet.addTable({
            name: `Tabla${sheet.id}_${startRow}`,
            ref: `A${startRow}:${tableEndColumn}${tableEndRow}`,
            headerRow: true,
            totalsRow: false,
            style: {
                theme: "TableStyleMedium2",
                showRowStripes: true,
            },
            columns: headers.map(header => ({ name: header })),
            rows: (rows.length > 0 ? rows : [headers.map(() => "")]) as any[][],
        });
    }
};

const photoGroupHeaderStyle = (cell: ExcelJS.Cell) => {
    cell.font = { bold: true, color: { argb: "FF222222" }, size: 9 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDBDBD" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
        top: { style: "thin", color: { argb: "FF444444" } },
        bottom: { style: "thin", color: { argb: "FF444444" } },
        left: { style: "thin", color: { argb: "FF444444" } },
        right: { style: "thin", color: { argb: "FF444444" } },
    };
};

const addPhotoGroupHeader = (sheet: ExcelJS.Worksheet, startColumn: number, endColumn: number, label: string) => {
    if (endColumn < startColumn) return;
    if (endColumn > startColumn) sheet.mergeCells(4, startColumn, 4, endColumn);
    const cell = sheet.getCell(4, startColumn);
    cell.value = label;
    photoGroupHeaderStyle(cell);
};

const styleBitacoraTable = (
    sheet: ExcelJS.Worksheet,
    headers: string[],
    rows: unknown[][],
    plagueStartColumn: number,
    plagueEndColumn: number
) => {
    const headerRow = sheet.getRow(5);
    headerRow.height = plagueEndColumn >= plagueStartColumn ? 92 : 42;
    headerRow.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
        cell.font = { bold: true, color: { argb: "FF222222" }, size: 9 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDBDBD" } };
        cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
            ...(columnNumber >= plagueStartColumn && columnNumber <= plagueEndColumn
                ? { textRotation: 90 as const }
                : {}),
        };
        cell.border = {
            top: { style: "thin", color: { argb: "FF444444" } },
            bottom: { style: "thin", color: { argb: "FF444444" } },
            left: { style: "thin", color: { argb: "FF444444" } },
            right: { style: "thin", color: { argb: "FF444444" } },
        };
    });

    rows.forEach((_, rowIndex) => {
        const row = sheet.getRow(6 + rowIndex);
        row.height = 28;
        row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
            cell.alignment = {
                horizontal: columnNumber === 1 ? "center" : "center",
                vertical: "middle",
                wrapText: true,
            };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: rowIndex % 2 === 0 ? "FFE2E2E2" : "FFF8F8F8" },
            };
            cell.border = {
                top: { style: "thin", color: { argb: "FF777777" } },
                bottom: { style: "thin", color: { argb: "FF777777" } },
                left: { style: "thin", color: { argb: "FF777777" } },
                right: { style: "thin", color: { argb: "FF777777" } },
            };
            if (columnNumber === 1) cell.font = { bold: true, size: 11 };
        });
    });

    headers.forEach((header, index) => {
        const column = sheet.getColumn(index + 1);
        if (index + 1 >= plagueStartColumn && index + 1 <= plagueEndColumn) {
            column.width = Math.max(9, Math.min(14, header.length / 2));
        } else if (header === "Observaciones" || header === "CLAVES") {
            column.width = header === "Observaciones" ? 32 : 24;
        } else if (header === "Producto aplicado") {
            column.width = 26;
        } else {
            column.width = index < 3 ? 17 : 16;
        }
    });
    sheet.views = [{ state: "frozen", ySplit: 5, xSplit: 3 }];
};

type NativeChartSeries = {
    label: string;
    columnNumber: number;
    values: number[];
    color?: string;
};

type NativeChartConfig = {
    targetSheetId: string;
    dataSheetName: string;
    anchorRow: number;
    anchorColumn?: number;
    width?: number;
    height?: number;
    categories: string[];
    categoryColumnNumber: number;
    dataStartRow: number;
    seriesHeaderRow?: number;
    series: NativeChartSeries[];
    title: string;
    grouping: "clustered" | "stacked";
    gapWidth: number;
    showLegend: boolean;
    valueNumberFormat?: string;
    valueMaximum?: number;
    chartKind?: "columns" | "pareto";
    lineSeries?: NativeChartSeries[];
    secondaryValueNumberFormat?: string;
    secondaryValueMaximum?: number;
};

const escapeXml = (value: unknown) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const excelColumnName = (columnNumber: number) => {
    let number = columnNumber;
    let name = "";
    while (number > 0) {
        const remainder = (number - 1) % 26;
        name = String.fromCharCode(65 + remainder) + name;
        number = Math.floor((number - 1) / 26);
    }
    return name;
};

const quoteExcelSheetName = (sheetName: string) => `'${sheetName.replace(/'/g, "''")}'`;

const CHART_COLORS = [
    "5B9BD5",
    "ED7D31",
    "A5A5A5",
    "FFC000",
    "4472C4",
    "70AD47",
    "255E91",
    "9E480E",
    "636363",
    "997300",
    "264478",
    "43682B",
];

const buildStringCache = (values: string[]) =>
    `<c:strCache><c:ptCount val="${values.length}"/>${values
        .map((value, index) => `<c:pt idx="${index}"><c:v>${escapeXml(value)}</c:v></c:pt>`)
        .join("")}</c:strCache>`;

const buildNumberCache = (values: number[]) =>
    `<c:numCache><c:formatCode>General</c:formatCode><c:ptCount val="${values.length}"/>${values
        .map(value => Number(value))
        .map((value, index) =>
            Number.isFinite(value) ? `<c:pt idx="${index}"><c:v>${value}</c:v></c:pt>` : `<c:pt idx="${index}"/>`
        )
        .join("")}</c:numCache>`;

const buildNativeChartXml = (config: NativeChartConfig) => {
    const sheetReference = quoteExcelSheetName(config.dataSheetName);
    const categoryColumn = excelColumnName(config.categoryColumnNumber);
    const dataEndRow = config.dataStartRow + config.categories.length - 1;
    const categoryFormula = `${sheetReference}!$${categoryColumn}$${config.dataStartRow}:$${categoryColumn}$${dataEndRow}`;
    const categoryCache = buildStringCache(config.categories);

    const buildSeries = (item: NativeChartSeries, index: number, kind: "columns" | "line") => {
        const seriesColumn = excelColumnName(item.columnNumber);
        const valuesFormula = `${sheetReference}!$${seriesColumn}$${config.dataStartRow}:$${seriesColumn}$${dataEndRow}`;
        const color = item.color ?? CHART_COLORS[index % CHART_COLORS.length];
        const shapeProperties =
            kind === "line"
                ? `<c:spPr><a:ln w="28575"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:ln></c:spPr>`
                : `<c:spPr><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:ln></c:spPr>`;
        const marker = kind === "line" ? `<c:marker><c:symbol val="none"/></c:marker><c:smooth val="0"/>` : "";
        const seriesTag = kind === "line" ? "lineSer" : "ser";
        return `
                <c:${seriesTag}>
                    <c:idx val="${index}"/>
                    <c:order val="${index}"/>
                    <c:tx><c:strRef><c:f>${sheetReference}!$${seriesColumn}$${config.seriesHeaderRow ?? 5}</c:f>${buildStringCache([item.label])}</c:strRef></c:tx>
                    ${shapeProperties}
                    ${marker}
                    ${kind === "columns" ? '<c:invertIfNegative val="0"/>' : ""}
                    <c:cat><c:strRef><c:f>${categoryFormula}</c:f>${categoryCache}</c:strRef></c:cat>
                    <c:val><c:numRef><c:f>${valuesFormula}</c:f>${buildNumberCache(item.values)}</c:numRef></c:val>
                    ${kind === "line" ? '<c:smooth val="0"/>' : ""}
                </c:${seriesTag}>`;
    };

    const chartSeries = config.series.map((item, index) => buildSeries(item, index, "columns")).join("");
    const overlap = config.grouping === "stacked" ? `<c:overlap val="100"/>` : "";
    const legend = config.showLegend
        ? `<c:legend><c:legendPos val="b"/><c:layout/><c:overlay val="0"/></c:legend>`
        : "";
    const chartKind = config.chartKind ?? "columns";
    const lineSeries = (config.lineSeries ?? []).map((item, index) => buildSeries(item, index, "line")).join("");
    const lineChart =
        chartKind === "pareto"
            ? `
            <c:lineChart>
                <c:grouping val="standard"/>
                <c:varyColors val="0"/>
                ${lineSeries}
                <c:axId val="605839298"/>
                <c:axId val="605839300"/>
            </c:lineChart>`
            : "";
    const secondaryAxis =
        chartKind === "pareto"
            ? `<c:valAx>
                <c:axId val="605839300"/><c:scaling><c:orientation val="minMax"/>${
                    config.secondaryValueMaximum == null ? "" : `<c:max val="${config.secondaryValueMaximum}"/>`
                }</c:scaling><c:delete val="0"/><c:axPos val="r"/>
                <c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/>
                <c:numFmt formatCode="${escapeXml(config.secondaryValueNumberFormat ?? "0%")}" sourceLinked="0"/>
                <c:crossAx val="605839298"/><c:crosses val="autoZero"/><c:crossBetween val="between"/>
            </c:valAx>`
            : "";

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <c:date1904 val="0"/>
    <c:lang val="es-MX"/>
    <c:roundedCorners val="0"/>
    <c:style val="2"/>
    <c:chart>
        <c:title>
            <c:tx><c:rich><a:bodyPr rot="0" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr"/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1400" b="0"/></a:pPr><a:r><a:rPr lang="es-MX" b="1"/><a:t>${escapeXml(config.title)}</a:t></a:r></a:p></c:rich></c:tx>
            <c:layout/><c:overlay val="0"/><c:spPr><a:noFill/><a:ln><a:noFill/></a:ln></c:spPr>
        </c:title>
        <c:autoTitleDeleted val="0"/>
        <c:plotArea>
            <c:layout/>
            <c:barChart>
                <c:barDir val="col"/>
                <c:grouping val="${config.grouping}"/>
                <c:varyColors val="0"/>
                ${chartSeries}
                <c:dLbls><c:showLegendKey val="0"/><c:showVal val="0"/><c:showCatName val="0"/><c:showSerName val="0"/><c:showPercent val="0"/><c:showBubbleSize val="0"/></c:dLbls>
                <c:gapWidth val="${config.gapWidth}"/>
                ${overlap}
                <c:axId val="605839298"/>
                <c:axId val="605839299"/>
            </c:barChart>
            ${lineChart}
            <c:catAx>
                <c:axId val="605839298"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/>
                <c:numFmt formatCode="General" sourceLinked="1"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:crossAx val="605839299"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/><c:noMultiLvlLbl val="0"/>
            </c:catAx>
            <c:valAx>
                <c:axId val="605839299"/><c:scaling><c:orientation val="minMax"/>${config.valueMaximum == null ? "" : `<c:max val="${config.valueMaximum}"/>`}</c:scaling><c:delete val="0"/><c:axPos val="l"/>
                <c:majorGridlines/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:numFmt formatCode="${escapeXml(config.valueNumberFormat ?? "General")}" sourceLinked="0"/><c:crossAx val="605839298"/><c:crosses val="autoZero"/><c:crossBetween val="between"/>
            </c:valAx>
            ${secondaryAxis}
        </c:plotArea>
        <c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/><c:showDLblsOverMax val="0"/>
        ${legend}
    </c:chart>
    <c:printSettings><c:headerFooter/><c:pageMargins b="0.75" l="0.7" r="0.7" t="0.75" header="0.3" footer="0.3"/><c:pageSetup/></c:printSettings>
</c:chartSpace>`;
};

const nextRelationshipId = (relationships: string) => {
    const ids = [...relationships.matchAll(/Id="rId(\d+)"/g)].map(match => Number(match[1]));
    return `rId${Math.max(0, ...ids) + 1}`;
};

const addNativeChartsToWorkbook = async (buffer: ArrayBuffer, charts: NativeChartConfig[]) => {
    if (charts.length === 0) return buffer;
    const zip = await JSZip.loadAsync(buffer);
    const getNextPartNumber = (folder: string, prefix: string) => {
        const numbers = Object.keys(zip.files)
            .map(path => path.match(new RegExp(`^${folder}/${prefix}(\\d+)\\.xml$`)))
            .filter(Boolean)
            .map(match => Number(match![1]));
        return Math.max(0, ...numbers) + 1;
    };
    const chartNumber = getNextPartNumber("xl/charts", "chart");
    const drawingNumber = getNextPartNumber("xl/drawings", "drawing");

    const chartsByTargetSheet = new Map<string, NativeChartConfig[]>();
    charts.forEach(config => {
        const targetCharts = chartsByTargetSheet.get(config.targetSheetId) ?? [];
        targetCharts.push(config);
        chartsByTargetSheet.set(config.targetSheetId, targetCharts);
    });

    let chartIndex = 0;
    let drawingIndex = 0;
    for (const [targetSheetId, targetCharts] of chartsByTargetSheet.entries()) {
        const drawingId = drawingNumber + drawingIndex++;
        const drawingPath = `xl/drawings/drawing${drawingId}.xml`;
        const drawingRelationshipsPath = `xl/drawings/_rels/drawing${drawingId}.xml.rels`;
        const relationships: string[] = [];
        const anchors: string[] = [];

        targetCharts.forEach((config, targetIndex) => {
            const currentChartNumber = chartNumber + chartIndex++;
            const drawingRelationshipId = `rId${targetIndex + 1}`;
            const chartPath = `xl/charts/chart${currentChartNumber}.xml`;
            const width = config.width ?? 11000000;
            const height = config.height ?? 6000000;
            const column = config.anchorColumn ?? 0;

            zip.file(chartPath, buildNativeChartXml(config));
            relationships.push(
                `<Relationship Id="${drawingRelationshipId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${currentChartNumber}.xml"/>`
            );
            anchors.push(
                `<xdr:oneCellAnchor editAs="oneCell"><xdr:from><xdr:col>${column}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${config.anchorRow}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:ext cx="${width}" cy="${height}"/><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${targetIndex + 1}" name="Gráfica ${targetIndex + 1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart r:id="${drawingRelationshipId}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:oneCellAnchor>`
            );
        });

        zip.file(
            drawingRelationshipsPath,
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships.join("")}</Relationships>`
        );
        zip.file(
            drawingPath,
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${anchors.join("")}</xdr:wsDr>`
        );

        const sheetPath = `xl/worksheets/sheet${targetSheetId}.xml`;
        const sheetRelationshipsPath = `xl/worksheets/_rels/sheet${targetSheetId}.xml.rels`;
        let sheetRelationships = zip.file(sheetRelationshipsPath)
            ? await zip.file(sheetRelationshipsPath)!.async("string")
            : `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;
        const sheetRelationshipId = nextRelationshipId(sheetRelationships);
        sheetRelationships = sheetRelationships.replace(
            "</Relationships>",
            `<Relationship Id="${sheetRelationshipId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${drawingId}.xml"/></Relationships>`
        );
        zip.file(sheetRelationshipsPath, sheetRelationships);

        let sheetXml = await zip.file(sheetPath)!.async("string");
        if (!sheetXml.includes("xmlns:r=")) {
            sheetXml = sheetXml.replace(
                "<worksheet ",
                '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
            );
        }
        const drawingTag = `<drawing r:id="${sheetRelationshipId}"/>`;
        sheetXml = sheetXml.includes("<pageSetup")
            ? sheetXml.replace(/(<pageSetup\b[^>]*\/>)\s*/, `$1${drawingTag}`)
            : sheetXml.includes("<pageMargins")
              ? sheetXml.replace(/(<pageMargins\b[^>]*\/>)\s*/, `$1${drawingTag}`)
              : sheetXml.replace("</worksheet>", `${drawingTag}</worksheet>`);
        zip.file(sheetPath, sheetXml);
    }

    const contentTypesPath = "[Content_Types].xml";
    let contentTypes = await zip.file(contentTypesPath)!.async("string");
    charts.forEach((_, index) => {
        contentTypes = contentTypes.replace(
            "</Types>",
            `<Override PartName="/xl/charts/chart${chartNumber + index}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/></Types>`
        );
    });
    [...chartsByTargetSheet.keys()].forEach((_, index) => {
        contentTypes = contentTypes.replace(
            "</Types>",
            `<Override PartName="/xl/drawings/drawing${drawingNumber + index}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>`
        );
    });
    zip.file(contentTypesPath, contentTypes);
    return zip.generateAsync({ type: "arraybuffer" });
};

const repairExcelTableTotalsFlags = async (buffer: ArrayBuffer) => {
    const zip = await JSZip.loadAsync(buffer);
    const tablePaths = Object.keys(zip.files).filter(path => /^xl\/tables\/table\d+\.xml$/.test(path));
    for (const tablePath of tablePaths) {
        let tableXml = await zip.file(tablePath)!.async("string");
        tableXml = tableXml
            .replace(/\s+totalsRowShown="1"/g, "")
            .replace(/\s+totalsRowLabel="[^"]*"/g, "")
            .replace(/\s+totalsRowFunction="none"/g, "");
        zip.file(tablePath, tableXml);
    }
    return zip.generateAsync({ type: "arraybuffer" });
};

export async function downloadBitacoraExcel(servicioId: number, organizacion: string): Promise<void> {
    const { data: servicio, error: servicioError } = await (supabase as any)
        .from("Servicios")
        .select("id, folio, fecha_servicio, direccion_id, cliente_id, Clientes(*), Direcciones(*)")
        .eq("id", servicioId)
        .eq("organizacion", organizacion)
        .single();

    if (servicioError || !servicio) throw new Error("No se pudo obtener el servicio");

    const { data: bitacoras, error: bitacorasError } = await (supabase as any)
        .from("Bitacoras")
        .select("id, tipo, nombre")
        .eq("organizacion", organizacion)
        .eq("direccion_id", servicio.direccion_id)
        .eq("estado", "activa");
    if (bitacorasError) throw bitacorasError;

    const { data: revisiones, error: revisionesError } = await (supabase as any)
        .from("RevisionesBitacora")
        .select("id, bitacora_id, estado")
        .eq("servicio_id", servicioId);
    if (revisionesError) throw revisionesError;

    const revisionIds = (revisiones ?? []).map((revision: any) => revision.id);
    const { data: estaciones } = await (supabase as any)
        .from("EstacionesBitacora")
        .select("id, bitacora_id, direccion_id, tipo, codigo_estacion, area, zona, orden")
        .eq("direccion_id", servicio.direccion_id)
        .eq("activa", true)
        .order("orden", { ascending: true });
    const { data: capturas } = await (supabase as any)
        .from("RevisionEstacionesBitacora")
        .select("id, revision_id, estacion_id, revisada, consumo_porcentaje, goma_cambiada, observacion")
        .in("revision_id", revisionIds.length ? revisionIds : [0]);
    const capturaIds = (capturas ?? []).map((captura: any) => captura.id);
    const { data: hallazgos } = await (supabase as any)
        .from("HallazgosBitacora")
        .select("revision_estacion_id, plaga_id, cantidad, comentario, Plagas(plaga)")
        .in("revision_estacion_id", capturaIds.length ? capturaIds : [0]);
    const { data: clavesMarcadas } = await (supabase as any)
        .from("RevisionEstacionesClaves")
        .select("revision_estacion_id, clave_id, ClavesBitacora(clave, concepto)")
        .in("revision_estacion_id", capturaIds.length ? capturaIds : [0]);
    const { data: productos } = await (supabase as any)
        .from("RegistroAplicacion")
        .select("producto_id, cantidad, unidad, Productos(nombre)")
        .eq("servicio_id", servicioId);
    const { data: plagasCatalogo, error: plagasError } = await (supabase as any)
        .from("Plagas")
        .select("id, plaga")
        .order("id", { ascending: true });
    if (plagasError) throw plagasError;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "IO Admin";
    workbook.created = new Date();
    const nativeCharts: NativeChartConfig[] = [];
    const cliente = `${servicio.Clientes?.nombre ?? ""} ${servicio.Clientes?.apellidos ?? ""}`.trim();
    const direccion = servicio.Direcciones
        ? [
              servicio.Direcciones.calle,
              servicio.Direcciones.numero_ext,
              servicio.Direcciones.colonia,
              servicio.Direcciones.ciudad,
          ]
              .filter(Boolean)
              .join(", ")
        : "";
    const folio = servicio.folio < 0 ? `FT-${Math.abs(servicio.folio)}` : servicio.folio;
    const catalogPlagaNames = (plagasCatalogo ?? [])
        .map((item: any) => String(item.plaga ?? "").trim())
        .filter(Boolean);
    const voladoresCatalogKeys = new Set(VOLADORES_PLAGA_ORDER.map(normalizePlagaName));
    const revisionByBitacora = new Map((revisiones ?? []).map((revision: any) => [revision.bitacora_id, revision]));
    const capturaByEstacion = new Map((capturas ?? []).map((captura: any) => [captura.estacion_id, captura]));
    const setSheetHeader = (sheet: ExcelJS.Worksheet, title: string, lastColumn: number) => {
        sheet.mergeCells(1, 1, 1, Math.max(lastColumn, 5));
        sheet.getCell(1, 1).value = title;
        sheet.getCell(1, 1).font = { bold: true, size: 18, color: { argb: "FF1F5C99" } };
        sheet.getCell(1, 1).alignment = { horizontal: "center" };
        sheet.mergeCells(2, 1, 2, Math.max(lastColumn, 5));
        sheet.getCell(2, 1).value = `Folio: ${folio} | Cliente: ${cliente} | Fecha: ${servicio.fecha_servicio}`;
        sheet.getCell(2, 1).alignment = { horizontal: "center" };
        sheet.mergeCells(3, 1, 3, Math.max(lastColumn, 5));
        sheet.getCell(3, 1).value = `Dirección: ${direccion}`;
        sheet.getCell(3, 1).alignment = { horizontal: "center", wrapText: true };
    };

    const buildRows = (tipo: BitacoraTipoExcel) => {
        const bitacora = (bitacoras ?? []).find((item: any) => item.tipo === tipo);
        const revision: any = bitacora ? revisionByBitacora.get(bitacora.id) : null;
        const typeStations = (estaciones ?? []).filter((station: any) => station.tipo === tipo);
        return { bitacora, revision, typeStations };
    };

    const addBitacoraSheet = (tipo: BitacoraTipoExcel) => {
        const { bitacora, revision, typeStations } = buildRows(tipo);
        const isExterior = tipo === "ECEXTT";
        const observedPlagas = new Set<string>();
        let typeIncidenceTotal = 0;
        typeStations.forEach((station: any) => {
            const captura: any = capturaByEstacion.get(station.id);
            (hallazgos ?? [])
                .filter((item: any) => item.revision_estacion_id === captura?.id)
                .forEach((item: any) => {
                    const name = getHallazgoPlagaName(item);
                    observedPlagas.add(name);
                });
        });
        const catalogNamesForType =
            tipo === "ECINT"
                ? catalogPlagaNames
                : tipo === "VOLADORES"
                  ? catalogPlagaNames.filter(name => voladoresCatalogKeys.has(normalizePlagaName(name)))
                  : [];
        const sortedPlagas = sortPlagaNames(
            [...catalogNamesForType, ...observedPlagas],
            tipo === "VOLADORES" ? VOLADORES_PLAGA_ORDER : INTERIOR_PLAGA_ORDER
        );
        const incidenceMatrix = typeStations.map(() => sortedPlagas.map(() => 0));
        const headers = isExterior
            ? [
                  "Estación",
                  "Área",
                  "Zona",
                  ...sortedPlagas,
                  "Total incidencias",
                  "Producto aplicado",
                  "Consumo (%)",
                  "Revisada",
                  "CLAVES",
                  "Observaciones",
              ]
            : [
                  "Estación",
                  "Área",
                  "Zona",
                  ...sortedPlagas,
                  "Total incidencias",
                  "Cambio de placa",
                  "Revisada",
                  "CLAVES",
                  "Observaciones",
              ];
        const rows = typeStations.map((station: any, stationIndex: number) => {
            const captura: any = capturaByEstacion.get(station.id);
            const stationHallazgos = (hallazgos ?? []).filter((item: any) => item.revision_estacion_id === captura?.id);
            const claveText = (clavesMarcadas ?? [])
                .filter((item: any) => item.revision_estacion_id === captura?.id)
                .map(
                    (item: any) =>
                        `${item.ClavesBitacora?.clave ?? item.clave_id}: ${item.ClavesBitacora?.concepto ?? ""}`
                )
                .join("\n");
            const incidenceTotal = stationHallazgos.reduce(
                (sum: number, item: any) => sum + Number(item.cantidad ?? 0),
                0
            );
            typeIncidenceTotal += incidenceTotal;
            const productText = (productos ?? [])
                .map(
                    (item: any) =>
                        `${item.Productos?.nombre ?? "Producto"}${item.cantidad ? ` (${item.cantidad} ${item.unidad ?? ""})` : ""}`
                )
                .join("\n");
            const plagaCells = sortedPlagas.map(name => {
                const plagueIndex = sortedPlagas.indexOf(name);
                const quantity = stationHallazgos
                    .filter((item: any) => normalizePlagaName(getHallazgoPlagaName(item)) === normalizePlagaName(name))
                    .reduce((sum: number, item: any) => sum + Number(item.cantidad ?? 0), 0);
                incidenceMatrix[stationIndex][plagueIndex] = quantity;
                return quantity;
            });
            if (isExterior) {
                return [
                    station.codigo_estacion,
                    station.area ?? "",
                    station.zona ?? "",
                    ...plagaCells,
                    incidenceTotal,
                    productText,
                    captura?.consumo_porcentaje == null ? "" : Number(captura.consumo_porcentaje) / 100,
                    captura?.revisada ? "Sí" : "No",
                    claveText,
                    captura?.observacion ?? "",
                ];
            }
            return [
                station.codigo_estacion,
                station.area ?? "",
                station.zona ?? "",
                ...plagaCells,
                incidenceTotal,
                captura?.goma_cambiada == null ? "" : captura.goma_cambiada ? "Sí" : "No",
                captura?.revisada ? "Sí" : "No",
                claveText,
                captura?.observacion ?? "",
            ];
        });
        const sheet = workbook.addWorksheet(BITACORA_LABELS[tipo]);
        setSheetHeader(sheet, `BITÁCORA DE ${BITACORA_LABELS[tipo].toUpperCase()}`, headers.length);
        if (!bitacora) {
            sheet.getCell(5, 1).value = "Sin bitácora activa para este tipo";
        } else {
            addExcelTable(sheet, headers, rows);
            addPhotoGroupHeader(sheet, 1, 3, "ESTACIÓN / UBICACIÓN");
            addPhotoGroupHeader(sheet, 4, 3 + sortedPlagas.length, "INCIDENCIAS DE PLAGAS");
            const controlStart = 4 + sortedPlagas.length;
            addPhotoGroupHeader(
                sheet,
                controlStart,
                headers.length,
                isExterior ? "APLICACIÓN Y CONTROL" : "CONTROL DE ESTACIÓN"
            );
            styleBitacoraTable(sheet, headers, rows, 4, 3 + sortedPlagas.length);
        }
        const categories = typeStations.map((station: any) => station.codigo_estacion);
        const consumptionValues = typeStations.map((station: any) => {
            const consumption = (capturaByEstacion.get(station.id) as any)?.consumo_porcentaje;
            return consumption == null ? Number.NaN : Number(consumption) / 100;
        });
        const consumptionColumnNumber = headers.indexOf("Consumo (%)") + 1;
        if (isExterior && consumptionColumnNumber > 0) sheet.getColumn(consumptionColumnNumber).numFmt = "0%";
        return {
            tipo,
            revision,
            bitacora,
            sheet,
            headers,
            categories,
            sortedPlagas,
            incidenceMatrix,
            consumptionValues,
            stationCount: typeStations.length,
            reviewedCount: typeStations.filter((station: any) => (capturaByEstacion.get(station.id) as any)?.revisada)
                .length,
            incidenceTotal: typeIncidenceTotal,
        };
    };

    const results = (["ECEXTT", "ECINT", "VOLADORES"] as BitacoraTipoExcel[]).map(addBitacoraSheet);
    const catalog = workbook.addWorksheet("Catálogo de claves");
    const claveRows = (clavesMarcadas ?? []).map((item: any) => [
        item.ClavesBitacora?.clave ?? item.clave_id,
        item.ClavesBitacora?.concepto ?? "",
    ]);
    const uniqueClaveRows: unknown[][] = claveRows.length
        ? claveRows.filter((row, index, allRows) => index === allRows.findIndex(candidate => candidate[0] === row[0]))
        : [["", "No se marcaron claves"]];
    addExcelTable(catalog, ["Clave", "Concepto"], uniqueClaveRows);
    catalog.getColumn(1).width = 16;
    catalog.getColumn(2).width = 45;

    const chartData = workbook.addWorksheet("Datos gráficos");
    chartData.state = "hidden";

    const writeChartDataBlock = (startColumn: number, headers: string[], rows: unknown[][], tableName: string) => {
        const tableRows = rows.length > 0 ? rows : [headers.map(() => "")];
        headers.forEach((header, columnIndex) => {
            chartData.getCell(1, startColumn + columnIndex).value = header;
        });
        tableRows.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                chartData.getCell(2 + rowIndex, startColumn + columnIndex).value = value as any;
            });
        });
        const endColumn = startColumn + headers.length - 1;
        const endRow = tableRows.length + 1;
        chartData.addTable({
            name: tableName,
            ref: `${excelColumnName(startColumn)}1:${excelColumnName(endColumn)}${endRow}`,
            headerRow: true,
            totalsRow: false,
            style: { theme: "TableStyleMedium2", showRowStripes: true },
            columns: headers.map(header => ({ name: header })),
            rows: tableRows as any[][],
        });
    };

    const buildParetoRows = (result: (typeof results)[number]) => {
        const totals = result.sortedPlagas.map((plaga, plagueIndex) => ({
            plaga,
            total: result.incidenceMatrix.reduce((sum, row) => sum + Number(row[plagueIndex] ?? 0), 0),
            originalIndex: plagueIndex,
        }));
        totals.sort((a, b) => b.total - a.total || a.originalIndex - b.originalIndex);
        const grandTotal = totals.reduce((sum, item) => sum + item.total, 0);
        let accumulated = 0;
        return totals.map(item => {
            accumulated += item.total;
            return [item.plaga, item.total, grandTotal > 0 ? accumulated / grandTotal : 0];
        });
    };

    const interiorResult = results.find(result => result.tipo === "ECINT");
    const voladoresResult = results.find(result => result.tipo === "VOLADORES");
    const exteriorResult = results.find(result => result.tipo === "ECEXTT");
    const interiorParetoRows = interiorResult ? buildParetoRows(interiorResult) : [];
    const voladoresParetoRows = voladoresResult ? buildParetoRows(voladoresResult) : [];
    writeChartDataBlock(1, ["Plaga", "Total", "% acumulado"], interiorParetoRows, "DatosParetoInterior");
    writeChartDataBlock(5, ["Plaga", "Total", "% acumulado"], voladoresParetoRows, "DatosParetoVoladores");

    // La pestaña de resumen se crea al final para que sea la primera vista analítica y la última pestaña del libro.
    const summary = workbook.addWorksheet("Resumen", { views: [{ state: "frozen", ySplit: 5 }] });
    setSheetHeader(summary, "RESUMEN DE BITÁCORA", 12);
    addExcelTable(
        summary,
        ["Tipo", "Estado", "Estaciones", "Revisadas", "Pendientes", "Incidencias", "Productos exteriores"],
        results.map(result => {
            return [
                BITACORA_LABELS[result.tipo],
                result.revision?.estado ?? "Sin bitácora",
                result.stationCount,
                result.reviewedCount,
                result.stationCount - result.reviewedCount,
                result.incidenceTotal,
                result.tipo === "ECEXTT" ? (productos ?? []).length : "",
            ];
        }),
        5
    );
    summary.getColumn(1).width = 20;
    summary.getColumn(2).width = 18;
    summary.getColumn(3).width = 14;
    summary.getColumn(4).width = 14;
    summary.getColumn(5).width = 14;
    summary.getColumn(6).width = 14;
    summary.getColumn(7).width = 22;
    for (let column = 8; column <= 12; column += 1) summary.getColumn(column).width = 14;

    const summarySheetId = String(summary.id);
    const fullChartWidth = 15000000;
    const halfChartWidth = 7300000;
    const chartHeight = 6200000;
    const addSummaryChart = (config: Omit<NativeChartConfig, "targetSheetId">) => {
        nativeCharts.push({ ...config, targetSheetId: summarySheetId });
    };

    if (exteriorResult?.bitacora && exteriorResult.stationCount > 0) {
        addSummaryChart({
            dataSheetName: exteriorResult.sheet.name,
            anchorRow: 9,
            anchorColumn: 0,
            width: fullChartWidth,
            height: chartHeight,
            categories: exteriorResult.categories,
            categoryColumnNumber: 1,
            dataStartRow: 6,
            series: [
                {
                    label: "Consumo (%)",
                    columnNumber: exteriorResult.headers.indexOf("Consumo (%)") + 1,
                    values: exteriorResult.consumptionValues,
                },
            ],
            title: "% DE CONSUMO DE CEBOS EN ESTACIONES EXTERNAS",
            grouping: "clustered",
            gapWidth: 182,
            showLegend: false,
            valueNumberFormat: "0%",
            valueMaximum: 1.2,
        });
    }

    if (interiorResult?.bitacora && interiorResult.stationCount > 0 && interiorResult.sortedPlagas.length > 0) {
        const interiorParetoTotal = interiorParetoRows.map(row => Number(row[1]));
        addSummaryChart({
            dataSheetName: chartData.name,
            anchorRow: 48,
            anchorColumn: 0,
            width: fullChartWidth,
            height: chartHeight,
            categories: interiorParetoRows.map(row => String(row[0])),
            categoryColumnNumber: 1,
            dataStartRow: 2,
            seriesHeaderRow: 1,
            series: [{ label: "TOTAL", columnNumber: 2, values: interiorParetoTotal }],
            lineSeries: [
                {
                    label: "% ACUMULADO",
                    columnNumber: 3,
                    values: interiorParetoRows.map(row => Number(row[2])),
                    color: "ED7D31",
                },
            ],
            title: "TOTAL DE PLAGA EN ECR INTERNAS",
            grouping: "clustered",
            gapWidth: 150,
            showLegend: false,
            valueNumberFormat: "0",
            valueMaximum: getNiceAxisMaximum(Math.max(0, ...interiorParetoTotal)),
            chartKind: "pareto",
            secondaryValueNumberFormat: "0%",
            secondaryValueMaximum: 1,
        });
        addSummaryChart({
            dataSheetName: interiorResult.sheet.name,
            anchorRow: 87,
            anchorColumn: 0,
            width: fullChartWidth,
            height: chartHeight,
            categories: interiorResult.categories,
            categoryColumnNumber: 1,
            dataStartRow: 6,
            series: interiorResult.sortedPlagas.map((plaga, plagueIndex) => ({
                label: plaga,
                columnNumber: interiorResult.headers.indexOf(plaga) + 1,
                values: interiorResult.incidenceMatrix.map(row => Number(row[plagueIndex] ?? 0)),
            })),
            title: "PLAGA EN ECR INTERNAS",
            grouping: "stacked",
            gapWidth: 150,
            showLegend: true,
            valueNumberFormat: "0",
            valueMaximum: getNiceAxisMaximum(
                Math.max(0, ...interiorResult.incidenceMatrix.map(row => row.reduce((sum, value) => sum + value, 0)))
            ),
        });
    }

    if (voladoresResult?.bitacora && voladoresResult.stationCount > 0 && voladoresResult.sortedPlagas.length > 0) {
        const voladoresParetoTotal = voladoresParetoRows.map(row => Number(row[1]));
        addSummaryChart({
            dataSheetName: chartData.name,
            anchorRow: 126,
            anchorColumn: 0,
            width: halfChartWidth,
            height: chartHeight,
            categories: voladoresParetoRows.map(row => String(row[0])),
            categoryColumnNumber: 5,
            dataStartRow: 2,
            seriesHeaderRow: 1,
            series: [{ label: "TOTAL", columnNumber: 6, values: voladoresParetoTotal }],
            lineSeries: [
                {
                    label: "% ACUMULADO",
                    columnNumber: 7,
                    values: voladoresParetoRows.map(row => Number(row[2])),
                    color: "ED7D31",
                },
            ],
            title: "TOTAL PLAGAS EN EC DE VOLADORES",
            grouping: "clustered",
            gapWidth: 150,
            showLegend: false,
            valueNumberFormat: "0",
            valueMaximum: getNiceAxisMaximum(Math.max(0, ...voladoresParetoTotal)),
            chartKind: "pareto",
            secondaryValueNumberFormat: "0%",
            secondaryValueMaximum: 1,
        });
        addSummaryChart({
            dataSheetName: voladoresResult.sheet.name,
            anchorRow: 126,
            anchorColumn: 8,
            width: halfChartWidth,
            height: chartHeight,
            categories: voladoresResult.categories,
            categoryColumnNumber: 1,
            dataStartRow: 6,
            series: voladoresResult.sortedPlagas.map((plaga, plagueIndex) => ({
                label: plaga,
                columnNumber: voladoresResult.headers.indexOf(plaga) + 1,
                values: voladoresResult.incidenceMatrix.map(row => Number(row[plagueIndex] ?? 0)),
            })),
            title: "PLAGA POR ECVOLADORES",
            grouping: "clustered",
            gapWidth: 150,
            showLegend: true,
            valueNumberFormat: "0",
            valueMaximum: getNiceAxisMaximum(Math.max(0, ...voladoresResult.incidenceMatrix.flat())),
        });
    }

    const workbookBuffer = await workbook.xlsx.writeBuffer();
    const bufferWithCleanTables = await repairExcelTableTotalsFlags(workbookBuffer as unknown as ArrayBuffer);
    const buffer = await addNativeChartsToWorkbook(bufferWithCleanTables, nativeCharts);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bitacora_${folio}.xlsx`;
    anchor.click();
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
    companyCell.value = "INSECTS OUT PREVENCIÓN Y MANEJO INTEGRAL DE PLAGAS, S.A. DE C.V.";
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
    equipoCell.value = "EQUIPO INSECTS OUT MANEJO INTEGRADO DE PLAGAS";
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

