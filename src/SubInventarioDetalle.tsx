import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CreateButton } from "./rehusableComponents/CreateInventariosModal";
import { Tables } from "./supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Enums } from "./supabase/Database";
import DelModal from "./DeleteModal";
import PaginationComponent from "./PaginationComponent";
import InventarioActionModal from "./rehusableComponents/InventarioActionModal";
import InventarioVehiculoEquipoModal from "./rehusableComponents/InventarioActionModalVehiculoEquipo";
import { useToast } from "./rehusableComponents/Toast";

interface SubInventarioDetalleProps {
    name?: string;
    items: InventarioItem[];
    onAddItem: (item: string) => void;
    flag: Enums<"TipoInventario">;
    organizacion: string | null;
}
type Productos = Tables<"Productos">;
type InventarioProducos = Tables<"Inventario_productos">;
type Inventarios = Tables<"Inventario">;
type GrupoDeMovimientos = Tables<"GrupoDeMovimientos">;
type Movimientos = Tables<"Movimientos">;
type InventarioEquipos = Tables<"Inventario_equipos">;
type Equipos = Tables<"Equipos">;

type InventarioProductoEntradas = InventarioProducos & {
    Productos: Productos | null;
};

interface InventarioItem {
    inventario_id: number;
    producto_id: number;
    stock: number;
    unidad_de_gasto: string;
    presentacion_cantidad: number;
    presentacion_unidad: string;
    precio: number;
}
export const SectionContainer = styled.div`
    width: 95%;
    background-color: #f7f9fb;
    border-radius: 0.5rem;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
    padding: 1.5rem;
    margin: 1rem auto;
    font-family: "Open Sans";
    @media (max-width: 900px) {
        width: 100%;
        margin: 0;
        border-radius: 0;
        padding: 1rem 0.5rem;
        box-sizing: border-box;
        overflow-x: auto;
    }
    @media (max-width: 600px) {
        overflow-x: hidden;
    }
`;

export const FormRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.75rem;
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const StyledLabel = styled.label`
    min-width: 150px;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryColor};
    font-size: 0.9rem;
    text-align: left;
    @media (max-width: 900px) {
        min-width: unset;
        width: 100%;
    }
`;

export const SectionTitle = styled.h2`
    color: ${({ theme }) => theme.primaryColor};
    margin-bottom: 1rem;
`;

export const EntryList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const EntryTableHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 0.3rem 1rem 0.3rem 1.15rem;
    gap: 1rem;
    font-family: "Open Sans", sans-serif;
    border-bottom: 2px solid #d0dce8;
    margin-bottom: 0.25rem;
    min-width: 540px;
    @media (max-width: 600px) {
        display: none;
    }
`;

export const EntryHeaderCell = styled.span`
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #7a9bb5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.col-first {
        width: 20%;
    }
    &.col-second {
        width: 15%;
    }
    &.col-third {
        width: 15%;
    }
    &.col-fourth {
        width: 15%;
    }
    &.col-fifth {
        width: 15%;
    }
    &.col-sixth {
        width: 5%;
        margin-left: auto;
    }
    &.col-delete {
        width: 8%;
    }
`;

export const EntryItem = styled.li`
    background: white;
    margin-bottom: 0.3rem;
    padding: 0.55rem 1rem 0.55rem 1.1rem;
    border-radius: 0.4rem;
    border-left: 3px solid ${({ theme }) => theme.primaryColor};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    color: #2c3e50;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    min-width: 540px;
    font-family: "Open Sans", sans-serif;
    transition:
        background 0.15s ease,
        box-shadow 0.15s ease;
    .h3 {
        cursor: pointer;
    }
    &:hover {
        background: #f2f7fc;
        box-shadow: 0 2px 10px rgba(14, 78, 126, 0.1);
    }
    @media (max-width: 600px) {
        min-width: unset;
        flex-wrap: wrap;
        gap: 0;
        padding: 0.85rem 1rem;
        margin-bottom: 0.75rem;
        align-items: flex-start;
    }
`;

export const EntryText = styled.span`
    font-size: 0.9rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    strong {
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #7a9bb5;
        font-weight: 700;
        display: none; /* oculto en desktop — el header lo cubre */
    }
    @media (max-width: 900px) {
        white-space: normal;
        strong {
            display: inline; /* visible en mobile sin header */
        }
    }
    @media (max-width: 600px) {
        flex-direction: row;
        align-items: baseline;
        gap: 0.35rem;
        flex-wrap: wrap;
        font-size: 0.88rem;
        strong {
            font-size: 0.75rem;
            color: ${({ theme }) => theme.primaryColor};
        }
    }
`;
export const Icono = styled(FaEdit)`
    &:hover {
        color: #2395ff;
    }
`;
export const MobileLabel = styled.span`
    display: none;
    @media (max-width: 600px) {
        display: inline;
    }
`;
export const Edit = styled(FaEdit)`
    &:hover {
        color: #2395ff;
    }
`;
export const Minus = styled(FaMinus)`
    &:hover {
        color: #2395ff;
    }
`;

export const DeleteBtn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.secondaryColor};
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
    align-self: center;
    transition:
        background 0.15s ease,
        transform 0.1s ease;
    &:hover {
        filter: brightness(0.85);
        transform: scale(1.1);
    }
    &:active {
        transform: scale(0.95);
    }
    @media (max-width: 600px) {
        margin-top: 0.65rem;
        margin-left: 0.5rem;
        align-self: flex-end;
        width: 2.6rem;
        height: 2.6rem;
        border-radius: 0.45rem;
        font-size: 1.1rem;
    }
`;

const ActionsRow = styled.div`
    display: contents;
    @media (max-width: 600px) {
        display: flex;
        width: 100%;
        gap: 0.6rem;
        margin-top: 0.75rem;
        padding-top: 0.6rem;
        border-top: 1.5px solid #eef2f7;
        align-items: center;

        .entrySixthElement {
            flex: 1;
            margin-top: 0 !important;
            margin-left: 0 !important;
            width: auto;
            height: 2.5rem;
            background: ${({ theme }) => theme.accentColor};
            border: 1.5px solid ${({ theme }) => theme.primaryColor};
            border-radius: 0.45rem;
            justify-content: center;
            align-items: center;
            gap: 0.4rem;
            cursor: pointer;
            font-size: 0.82rem;
            font-weight: 600;
            color: ${({ theme }) => theme.primaryColor};
        }

        ${DeleteBtn} {
            flex: 1;
            width: auto;
            height: 2.5rem;
            border-radius: 0.45rem;
            gap: 0.4rem;
            font-size: 0.82rem;
            font-weight: 600;
            margin-top: 0;
            margin-left: 0;
            align-self: auto;
        }
    }
`;
const AddForm = styled.form`
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const AddInput = styled.input`
    padding: 0.5rem;
    flex: 1;
`;

const AddButton = styled.button`
    background: ${({ theme }) => theme.primaryColor};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
`;

export const EntryRow = styled.div`
    text-transform: lowercase;
    &.entryFirstElement {
        justify-content: left;
    }
    width: 20%;
    display: flex;
    &.entrySecondElement {
        width: 15%;
        justify-content: left;
    }
    &.entryThirdElement {
        width: 15%;
        justify-content: left;
    }
    &.entryFourthElement {
        width: 15%;
        justify-content: left;
    }
    &.entryFifthElement {
        width: 15%;
        justify-content: left;
    }
    &.entrySixthElement {
        cursor: pointer;
        width: 5%;
        justify-content: flex-end;
    }
    justify-content: left;
    &.prod1,
    &.prod2,
    &.prod3,
    &.prod4,
    &.prod5,
    &.prod6 {
    }
    @media (max-width: 600px) {
        &.entryFirstElement,
        &.entrySecondElement,
        &.entryThirdElement,
        &.entryFourthElement,
        &.entryFifthElement {
            width: 100%;
            padding: 0.3rem 0;
            border-bottom: 1px solid #eef2f7;
        }
        &.entryFirstElement {
            border-bottom: none;
            padding-bottom: 0;
            font-weight: 600;
            font-size: 1rem;
        }
        &.entrySixthElement {
            width: auto;
            margin-top: 0.65rem;
            margin-left: auto;
            justify-content: flex-end;
        }
    }
`;

const SubInventarioDetalle: React.FC<SubInventarioDetalleProps> = ({ name, items, onAddItem, flag, organizacion }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoId, setProductoId] = useState<number>(-1);
    const [stock, setStock] = useState<number>();
    const [productos, setProductos] = useState<Productos[]>([]);
    const [inventarioId, setInventarioId] = useState<number>(
        Number(new URLSearchParams(window.location.search).get("inventarioId"))
    );
    const [inventarioEntry, setInventarioEntry] = useState<InventarioProducos[] | null>(null);
    const [editable, setEditable] = useState<boolean>(false);
    const [entryId, setEntryId] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const { showToast } = useToast();
    const [entradasConProductos, setEntradasConProductos] = useState<InventarioProductoEntradas[]>([]);
    const [entradasConProductosPrincipal, setEntradasConProductosPrincipal] = useState<InventarioProductoEntradas[]>(
        []
    );
    const [lote, setLote] = useState<string>("");
    const [fechaDeCaducidad, setFechaDeCaducidad] = useState<Date | null>(new Date());
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;
    const [inventariosPrincipales, setInventariosPrincipales] = useState<Inventarios[] | null>();
    const [inventarioPrincipalId, setInventarioPrincipalId] = useState<number | null>(-1);
    const [itemType, setItemType] = useState<Enums<"TipoItem">>();
    const [cantidad, setCantidad] = useState<number>(1);
    const [itemId, setItemId] = useState<number | null>(-1);
    const [stockFromEmpleados, setStockFromEmpleados] = useState<number | null>(null);
    const [entryOrigen, setEntryOrigen] = useState<number | null>(null);
    const params = new URLSearchParams(window.location.search);
    const [inventarioEquipos, setInventarioEquipos] = useState<InventarioEquipos[] | null>([]);
    const [equipos, setEquipos] = useState<Equipos[]>([]);
    const [inventarioEquipoSingleEntry, setInventarioEquipoSingleEntry] = useState<InventarioEquipos | null>(null);
    const [tipoEquipoInventario, setTipoEquipoInventario] = useState<Enums<"TipoEquipoOptions">>();

    const nullAllParameters = () => {
        setProductoId(-1);
        setStock(undefined);
        setInventarioPrincipalId(-1);
        setInventarioEntry(null);
        setFechaDeCaducidad(null);
        setEntryOrigen(-1);
        setLote("");
        setEntryId(null);
    };

    const handleActionModalClose = () => {
        nullAllParameters();
        setIsModalOpen(false);
    };

    const fetchInventarioProductosConEntradas = async () => {
        try {
            const { data, error, count } = await supabase
                .from("Inventario_productos")
                .select("*, Productos!inner(*)", { count: "exact" })
                .eq("inventario_id", inventarioId)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
            setTotalPages(totalPages);
            if (error) {
                throw error;
            }

            if (data) {
                console.log("Inventario productos fetched successfully:", data);
                setEntradasConProductos(data);
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };
    const fetchInventarioProductosConEntradasPorPrincipal = async (singleEntryId: number | null) => {
        try {
            let query = supabase
                .from("Inventario_productos")
                .select("*, Productos!inner(*)")
                .eq("inventario_id", inventarioPrincipalId!);

            if (singleEntryId !== null) {
                console.log("cricoso", singleEntryId);
                query = query.eq("id", singleEntryId);
            }
            const { data, error } = await query;
            if (error) {
                throw error;
            }

            if (data) {
                console.log("Entradas de productos fetched successfully:", data);
                setEntradasConProductosPrincipal(data);
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };

    const fetchSingleEntry = async (entryId: number) => {
        try {
            if (flag === "equipo") {
                const { data, error } = await supabase.from("Inventario_equipos").select("*").eq("id", entryId);
                if (data) {
                    console.log("la equipa", data[0]);
                    await setInventarioEquipoSingleEntry(data[0]);
                    console.log("Inventario de equipo fetched successfully:", data);
                    return;
                }
                if (error) {
                    console.log("Error fetching inventario de equipo:", error);
                }
            }
            if (flag === "empleado" || flag === "principal") {
                const { data, error } = await supabase.from("Inventario_productos").select("*").eq("id", entryId);
                nullAllParameters();

                if (error) {
                    throw error;
                }

                if (data) {
                    console.log("Inventario prod entradas fetched successfully:", data);
                    setItemId(data[0]?.id ?? -1);
                    setInventarioEntry(data);
                    setProductoId(data?.[0]?.producto_id ?? productoId);
                    setStock(data[0]?.stock);
                    setLote(data[0]?.Lote ?? "");
                    setFechaDeCaducidad(null);
                    setInventarioPrincipalId(data[0]?.inventario_id!);
                    setEntryId(data[0]?.id ?? null);
                    console.log("la data que se trajo", data);

                    if (data[0]?.fecha_de_caducidad) {
                        const [year, month, day] = data[0]?.fecha_de_caducidad.split("-").map(Number);
                        const formattedDob = new Date(year, month - 1, day);
                        setFechaDeCaducidad(formattedDob);
                    }
                    if (flag === "empleado") {
                        return data[0];
                    }
                } else {
                    console.log("No inventario productos found.");
                }
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };

    const fetchproductos = async () => {
        try {
            const { data, error } = await supabase.from("Productos").select("*");

            if (error) {
                throw error;
            }

            if (data) {
                console.log("Productos fetched successfully:", data);
                setProductos(data);
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };
    const fetchInventariosPrincipales = async () => {
        if (inventariosPrincipales) {
            if (inventariosPrincipales?.length > 0) {
                return;
            }
        }

        try {
            const { data, error } = await supabase.from("Inventario").select("*").eq("tipo_inventario", "principal");

            if (error) {
                throw error;
            }

            if (data) {
                console.log("Inventarios principales fetched successfully:", data);
                setInventariosPrincipales(data);
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    const createGrupoDeMovimientos = async (movimientoIds?: number[] | null, grupoId?: number | null) => {
        try {
            let existingIds: number[] = [];

            // If we already have a group, fetch its current movimientos_id
            if (grupoId) {
                const { data: existing, error: fetchError } = await supabase
                    .from("GrupoDeMovimientos")
                    .select("movimientos_id")
                    .eq("id", grupoId)
                    .single();

                if (fetchError) {
                    console.error("Error fetching existing group:", fetchError);
                    return null;
                }

                if (existing?.movimientos_id) {
                    existingIds = existing.movimientos_id;
                }
            }

            // Merge old + new (avoid duplicates)
            const mergedIds = [...new Set([...(existingIds || []), ...(movimientoIds || [])])];

            // Upsert with merged IDs
            const { data, error } = await supabase
                .from("GrupoDeMovimientos")
                .upsert([
                    {
                        ...(grupoId !== undefined && grupoId !== null && { id: grupoId }),
                        movimientos_id: mergedIds,
                        organizacion: organizacion,
                    },
                ] as GrupoDeMovimientos[])
                .select("id");

            if (error) {
                console.error("Error in upsert:", error);
                return null;
            }

            return data?.[0]?.id ?? null;
        } catch (err) {
            console.error("Exception:", err);
            return null;
        }
    };

    const regresarProductoAlnventarioPrincipal = async (
        stockFromEmpleados: number,
        stockPrincipal: number,
        entryId: number
    ) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .update({ stock: stockFromEmpleados! + stockPrincipal })
                .eq("id", entryId);
            if (!error) {
                console.log("Producto regresado al inventario principal:", data);
                fetchInventarioProductosConEntradas();
            }
        } catch (error) {
            console.error("Error regresando producto al inventario principal:", error);
        }
    };

    const deleteInventarioEntry = async (entryId: number) => {
        console.log("Deleting entry with ID:", entryId);
        try {
            let error, data;
            if (flag === "equipo") {
                // Delete from Inventario_equipos table
                ({ error, data } = await supabase.from("Inventario_equipos").delete().eq("id", entryId));
            } else {
                // Default: Delete from Inventario_productos table
                ({ error, data } = await supabase.from("Inventario_productos").delete().eq("id", entryId));
            }
            if (error) {
                console.error("Error trying to delete the entry", error);
                showToast("Error al eliminar la entrada", "error");
            } else {
                if (flag === "empleado" || flag === "principal") {
                    const itemDeOrigen = (await inventarioEntry?.[0]?.item_de_origen) ?? -1;
                    const grupoMovId = await createGrupoDeMovimientos([], null);
                    const firstMovId = await createMovimiento(
                        inventarioPrincipalId!,
                        "producto",
                        new Date(),
                        entryId,
                        "salida",
                        stockFromEmpleados!,
                        null
                    );
                    if (!firstMovId) {
                        return window.alert("Error al crear el movimiento de salida");
                    }
                    await createGrupoDeMovimientos([firstMovId], grupoMovId);
                    const newEntry = await fetchSingleEntry(itemDeOrigen);
                    const stockOrigen = newEntry?.stock ?? 0;
                    const entradaNuevaId = newEntry?.id ?? -1;
                    const nuevoInventarioPrincipalId = newEntry?.inventario_id ?? -1;

                    await regresarProductoAlnventarioPrincipal(stockFromEmpleados!, stockOrigen!, itemDeOrigen);
                    const secondMovId = await createMovimiento(
                        nuevoInventarioPrincipalId!,
                        "producto",
                        new Date(),
                        entradaNuevaId!,
                        "traspaso",
                        stockFromEmpleados!,
                        null
                    );
                    if (!secondMovId) {
                        return window.alert("Error al crear el movimiento de entrada");
                    }
                    await createGrupoDeMovimientos([secondMovId], grupoMovId);
                    console.log("Deleted entry", data);
                    showToast("Entrada eliminada correctamente", "success");
                    await fetchInventarioProductosConEntradas();
                    await nullAllParameters();
                }
                if (flag === "equipo") {
                    showToast("Entrada eliminada correctamente", "success");
                    FetchInventarioEquipo();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteInventarioEquipoEntry = async () => {
        try {
            if (flag === "equipo" && inventarioEquipoSingleEntry) {
                const { error } = await supabase
                    .from("Inventario_equipos")
                    .delete()
                    .eq("id", inventarioEquipoSingleEntry.id);
                if (error) throw error;
                showToast("Entrada eliminada correctamente", "success");
                FetchInventarioEquipo();
                setIsModalOpen(false);
            } else {
                window.alert("No hay inventario de equipo seleccionado para eliminar.");
            }
            if (flag === "vehiculo") {
                return;
            }
        } catch (err) {
            console.error("Error eliminando inventario:", err);
            showToast("Error al eliminar la entrada", "error");
        }
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const createMovimiento = async (
        inventarioID: Number,
        itemType: Enums<"TipoItem">,
        fecha: Date,
        ItemID: number,
        type: Enums<"TipoMovimiento">,
        quanity: number,
        tecnicoID: number | null = null
    ) => {
        try {
            const { data, error } = await supabase
                .from("Movimientos")
                .insert([
                    {
                        inventario_id: inventarioID,
                        item_type: itemType,
                        date: fecha.toISOString(),
                        item_id: ItemID,
                        type: type,
                        quantity: quanity,
                        tecnico_id: tecnicoID,
                        organizacion: organizacion,
                    },
                ] as Movimientos[])
                .select("*");

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                console.log("Inventario creado:", data);
                return data?.[0].id;
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    };

    const FetchInventarioEquipo = async () => {
        try {
            const { data, error } = await supabase
                .from("Inventario_equipos")
                .select("*")
                .eq("inventario_id", inventarioId);

            if (data) {
                setInventarioEquipos(data);
                console.log("Inventario de equipo fetched:", data);
            }
            if (error) {
                console.log("Error fetching inventario de equipo:", error);
            }
        } catch (error) {
            console.error("Error fetching inventario de equipo:", error);
        }
    };

    const fetchequipoTipoFromInventario = async () => {
        try {
            const { data, error } = await supabase.from("Inventario").select("tipo_de_equipo").eq("id", inventarioId);
            if (error) {
                console.log(error);
            } else {
                if (data && data.length > 0) {
                    setTipoEquipoInventario(data[0].tipo_de_equipo ?? undefined);
                }

                console.log("Inventario data:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchEquipos = async (organizacion: string) => {
        try {
            const { data, error } = await supabase
                .from("Equipos")
                .select("*", { count: "exact" })
                .eq("organizacion", organizacion);
            if (error) {
                throw error;
            }

            if (data) {
                console.log("Productos fetched successfully:", data);
                setEquipos(data);
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    useEffect(() => {
        if (flag === "principal") {
            nullAllParameters();
            fetchproductos();
        }
        if (flag === "empleado") {
            fetchproductos();
            nullAllParameters();
            fetchInventariosPrincipales();
        }
        if (flag === "equipo") {
            if (organizacion) {
                fetchEquipos(organizacion);
                fetchequipoTipoFromInventario();
            }
        }
    }, []);

    useEffect(() => {
        if (flag === "principal") fetchInventarioProductosConEntradas();
        if (flag === "empleado") {
            fetchInventarioProductosConEntradas();
        }
        if (flag === "equipo") {
            FetchInventarioEquipo();
        }
    }, [currentPage]);

    useEffect(() => {
        if (flag === "empleado" && inventarioPrincipalId) fetchInventarioProductosConEntradasPorPrincipal(null);
    }, [inventarioPrincipalId]);

    return (
        <SectionContainer>
            <SectionTitle>Contenido de {flag}</SectionTitle>
            {(flag === "principal" || flag === "empleado") && (
                <>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "right",
                            marginBottom: "1rem",
                            alignItems: "center",
                        }}
                    >
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        ></PaginationComponent>
                    </div>
                    <EntryTableHeader>
                        <EntryHeaderCell className="col-first">Producto</EntryHeaderCell>
                        <EntryHeaderCell className="col-second">Stock</EntryHeaderCell>
                        <EntryHeaderCell className="col-third">Lote</EntryHeaderCell>
                        <EntryHeaderCell className="col-fourth">Caducidad</EntryHeaderCell>
                        <EntryHeaderCell className="col-fifth">Valor</EntryHeaderCell>
                        <EntryHeaderCell className="col-sixth">Edit</EntryHeaderCell>
                        <EntryHeaderCell className="col-delete">Acción</EntryHeaderCell>
                    </EntryTableHeader>
                    <EntryList>
                        {entradasConProductos?.map((entry, index) => (
                            <EntryItem key={index}>
                                <EntryRow className="entryFirstElement">
                                    <EntryText>
                                        <strong>Producto:</strong>{" "}
                                        {productos.find(item => item.id === entry?.producto_id)?.nombre}
                                    </EntryText>
                                </EntryRow>

                                <EntryRow className="entrySecondElement">
                                    <EntryText>
                                        <strong>Stock:</strong> {entry?.stock}
                                    </EntryText>
                                </EntryRow>
                                <EntryRow className="entryThirdElement">
                                    <EntryText>
                                        <strong>Lote:</strong> {entry.Lote}
                                    </EntryText>
                                </EntryRow>
                                <EntryRow className="entryFourthElement">
                                    <EntryText>
                                        <strong>Caducidad: </strong>
                                        <h4 style={{ all: "unset", textTransform: "uppercase" }}>
                                            {entry.fecha_de_caducidad}
                                        </h4>
                                    </EntryText>
                                </EntryRow>
                                <EntryRow className="entryFifthElement">
                                    <EntryText>
                                        <strong>Valor:</strong> ${entry?.stock * (entry?.Productos?.precio ?? 0)}
                                    </EntryText>
                                </EntryRow>
                                <ActionsRow>
                                    {flag === "principal" && (
                                        <EntryRow
                                            onClick={async () => {
                                                if (entry) {
                                                    await fetchSingleEntry(entry.id);
                                                    await setEditable(true);
                                                    await setIsModalOpen(true);
                                                    await setEntryId(entry.id);
                                                }
                                            }}
                                            style={{ alignSelf: "left" }}
                                            className="entrySixthElement"
                                            id="entrySixthElement"
                                        >
                                            <Icono size={16} />
                                            <MobileLabel>Editar</MobileLabel>
                                        </EntryRow>
                                    )}
                                    {flag === "empleado" && (
                                        <EntryRow
                                            onClick={async () => {
                                                if (entry) {
                                                    await fetchSingleEntry(entry.item_de_origen!);
                                                    await setEditable(true);

                                                    try {
                                                        await setIsModalOpen(true);
                                                        await setEntryId(entry.id);
                                                        await setStockFromEmpleados(entry.stock);
                                                        await setEntryOrigen(entry.item_de_origen);
                                                        await setCantidad(1);
                                                    } catch (error) {
                                                        console.error("Error fetching data:", error);
                                                    }
                                                }
                                            }}
                                            style={{ alignSelf: "left", display: "flex", justifyContent: "center" }}
                                            className="entrySixthElement"
                                            id="entrySixthElement"
                                        >
                                            <Edit size={16} />
                                            <MobileLabel>Editar</MobileLabel>
                                        </EntryRow>
                                    )}
                                    <DeleteBtn
                                        onClick={async () => {
                                            await setDeleteModalOpen(true);
                                            await setEntryId(entry.id);
                                            await fetchSingleEntry(entry.id);
                                            await setStockFromEmpleados(entry.stock);
                                        }}
                                        id="borrarServicio"
                                    >
                                        ✕
                                    </DeleteBtn>
                                </ActionsRow>
                            </EntryItem>
                        ))}
                    </EntryList>
                </>
            )}
            {flag === "equipo" && (
                <>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "right",
                            marginBottom: "1rem",
                            alignItems: "center",
                        }}
                    >
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        ></PaginationComponent>
                    </div>
                    <EntryTableHeader>
                        <EntryHeaderCell className="col-first">Equipo</EntryHeaderCell>
                        <EntryHeaderCell className="col-second">Stock</EntryHeaderCell>
                        <EntryHeaderCell className="col-third">Funcional</EntryHeaderCell>
                        <EntryHeaderCell className="col-fourth">Núm. serie</EntryHeaderCell>
                        <EntryHeaderCell className="col-fifth">Valor</EntryHeaderCell>
                        <EntryHeaderCell className="col-sixth">Edit</EntryHeaderCell>
                        <EntryHeaderCell className="col-delete">Acción</EntryHeaderCell>
                    </EntryTableHeader>
                    <EntryList>
                        {inventarioEquipos?.map((entry, index) => (
                            <EntryItem key={index}>
                                <EntryRow className="entryFirstElement">
                                    <EntryText>
                                        <strong>Equipo:</strong>{" "}
                                        {equipos.find(item => item.id === entry?.equipo_id)?.nombre}
                                    </EntryText>
                                </EntryRow>

                                <EntryRow className="entrySecondElement">
                                    <EntryText>
                                        <strong>Stock:</strong> {entry?.stock}
                                    </EntryText>
                                </EntryRow>
                                <EntryRow className="entryThirdElement">
                                    <EntryText>
                                        <strong>Funcional:</strong> {entry?.equipo_id ? "Sí" : "No"}
                                    </EntryText>
                                </EntryRow>
                                <EntryRow className="entryFourthElement">
                                    <EntryText>
                                        <strong>Número de serie: </strong>
                                        <h4 style={{ all: "unset", textTransform: "uppercase" }}>
                                            {entry.num_de_serie}
                                        </h4>
                                    </EntryText>
                                </EntryRow>
                                <EntryRow className="entryFifthElement">
                                    <EntryText>
                                        <strong>Valor:</strong> ${entry.stock * (entry?.precio ?? 0)}
                                    </EntryText>
                                </EntryRow>
                                <ActionsRow>
                                    {flag === "equipo" && (
                                        <EntryRow
                                            onClick={async () => {
                                                await fetchSingleEntry(entry.id);
                                                await setEditable(true);
                                                await setIsModalOpen(true);
                                                await setEntryId(entry.id);
                                            }}
                                            style={{ alignSelf: "left" }}
                                            className="entrySixthElement"
                                            id="entrySixthElement"
                                        >
                                            <Icono size={16} />
                                            <MobileLabel>Editar</MobileLabel>
                                        </EntryRow>
                                    )}
                                    <DeleteBtn
                                        onClick={async () => {
                                            const queryParams = new URLSearchParams(window.location.search);
                                            queryParams.set("stock", entry.stock?.toString() ?? "");
                                            queryParams.set("equipoId", entry.id?.toString() ?? "");
                                            // ✅ Update the search bar without reloading or removing other params
                                            window.history.replaceState(null, "", `?${queryParams.toString()}`);
                                            await fetchSingleEntry(entry.id);
                                            await setDeleteModalOpen(true);
                                            await setEntryId(entry.id);
                                        }}
                                        id="borrarServicio"
                                    >
                                        ✕ <span>Eliminar</span>
                                    </DeleteBtn>
                                </ActionsRow>
                            </EntryItem>
                        ))}
                    </EntryList>
                </>
            )}
            {deleteModalOpen && (
                <DelModal
                    closeModal={() => {
                        setDeleteModalOpen(false);

                        // 🧹 Remove the query params we added
                        const queryParams = new URLSearchParams(window.location.search);
                        queryParams.delete("stock");
                        queryParams.delete("itemId");

                        // ✅ Update the search bar without reloading
                        const newUrl =
                            window.location.pathname + (queryParams.toString() ? `?${queryParams.toString()}` : "");
                        window.history.replaceState(null, "", newUrl);
                    }}
                    titulo={
                        flag === "equipo"
                            ? "¿Seguro quiere eliminar el equipo?"
                            : "¿Seguro quiere eliminar los productos?"
                    }
                    btnText={flag === "equipo" ? "Eliminar equipo" : "Eliminar productos"}
                    del={() => {
                        if (flag === "equipo") {
                            deleteInventarioEquipoEntry();
                        } else {
                            deleteInventarioEntry(entryId!);
                        }
                    }}
                    tipo={
                        flag === "equipo"
                            ? (equipos.find(item => item.id === inventarioEquipoSingleEntry?.equipo_id)?.nombre ?? "")
                            : (productos.find(item => item.id === inventarioEntry?.[0]?.producto_id)?.nombre ?? "")
                    }
                    stock={flag === "equipo" ? inventarioEquipoSingleEntry?.stock : inventarioEntry?.[0].stock}
                    invNombre={params.get("Nombre") || "Inventario Principal"}
                    principal={["entradas"]}
                ></DelModal>
            )}
            <CreateButton
                onClick={() => {
                    nullAllParameters();
                    setInventarioEquipoSingleEntry(null);
                    setEditable(false);
                    setIsModalOpen(true);
                }}
            >
                <FaPlus />
            </CreateButton>

            {isModalOpen && (flag === "empleado" || flag === "principal") && (
                <InventarioActionModal
                    flag={flag}
                    editable={editable}
                    entryId={entryId}
                    stockFromEmpleados={stockFromEmpleados}
                    itemId={entryOrigen}
                    inventarioEntry={inventarioEntry}
                    stock={inventarioEntry?.[0]?.stock || -1}
                    lote={inventarioEntry?.[0]?.Lote || ""}
                    fechaDeCaducidad={
                        inventarioEntry?.[0]?.fecha_de_caducidad
                            ? new Date(inventarioEntry?.[0]?.fecha_de_caducidad)
                            : null
                    }
                    inventarioPrincipalId={inventarioPrincipalId}
                    closeModal={() => setIsModalOpen(false)}
                    fetchInventarioProductosConEntradas={() => {
                        fetchInventarioProductosConEntradas();
                    }}
                    fetchInventarioProductosConEntradasPorPrincipal={(singleEntryId: number | null) => {
                        fetchInventarioProductosConEntradasPorPrincipal(singleEntryId);
                    }}
                    organizacion={organizacion}
                ></InventarioActionModal>
            )}
            {isModalOpen && (flag === "equipo" || flag === "vehiculo") && (
                <InventarioVehiculoEquipoModal
                    editable={editable}
                    inventarioEquipoEntry={inventarioEquipoSingleEntry}
                    fetchInventarioEquipo={() => {
                        FetchInventarioEquipo();
                    }}
                    organizacion={organizacion!}
                    closeModal={() => setIsModalOpen(false)}
                    flag={flag}
                    inventarioTiPoEquipo={tipoEquipoInventario}
                />
            )}
        </SectionContainer>
    );
};

export default SubInventarioDetalle;
