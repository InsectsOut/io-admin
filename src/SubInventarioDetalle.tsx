import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";
import { CreateButton } from "./rehusableComponents/CreateInventariosModal";
import { Tables } from "./supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import { FaEdit } from "react-icons/fa";
import { Enums } from "./supabase/Database";
import DelModal from "./DeleteModal";
import PaginationComponent from "./PaginationComponent";
import InventarioActionModal from "./rehusableComponents/InventarioActionModal";
import { set } from "ts-pattern/dist/patterns";
type Movimientos = Tables<"Movimientos">;

interface SubInventarioDetalleProps {
    name?: string;
    items: InventarioItem[];
    onAddItem: (item: string) => void;
    flag: Enums<"TipoInventario">;
}
type Productos = Tables<"Productos">;
type InventarioProducos = Tables<"Inventario_productos">;
type Inventarios = Tables<"Inventario">;

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
`;

export const FormRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.75rem;
`;

export const StyledLabel = styled.label`
    min-width: 150px;
    font-weight: 600;
    color: #0d4e80;
    font-size: 0.9rem;
    text-align: left;
`;

export const SectionTitle = styled.h2`
    color: #0d4e80;
    margin-bottom: 1rem;
`;

export const EntryList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const EntryItem = styled.li`
    background: white;
    margin-bottom: 0.75rem;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.1);
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-family: "Open Sans", sans-serif;
    .h3 {
        cursor: pointer;
    }
`;

export const EntryText = styled.span`
    font-size: 1rem;
`;
export const Icono = styled(FaEdit)`
    &:hover {
        color: #2395ff;
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
    background: #0d4e80;
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
`;

const SubInventarioDetalle: React.FC<SubInventarioDetalleProps> = ({ name, items, onAddItem, flag }) => {
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
                console.log("la data que se borrará", data);

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
            const { error, data } = await supabase.from("Inventario_productos").delete().eq("id", entryId);
            if (error) {
                console.error("Error trying to delete the entry", error);
            } else {
                if (flag === "empleado") {
                    const itemDeOrigen = (await inventarioEntry?.[0]?.item_de_origen) ?? -1;
                    createMovimiento(
                        inventarioPrincipalId!,
                        "producto",
                        new Date(),
                        entryId,
                        "salida",
                        stockFromEmpleados!,
                        null
                    );
                    const newEntry = await fetchSingleEntry(itemDeOrigen);
                    const stockOrigen = newEntry?.stock ?? 0;
                    const entradaNuevaId = newEntry?.id ?? -1;
                    const nuevoInventarioPrincipalId = newEntry?.inventario_id ?? -1;

                    await regresarProductoAlnventarioPrincipal(stockFromEmpleados!, stockOrigen!, itemDeOrigen);
                    await createMovimiento(
                        nuevoInventarioPrincipalId!,
                        "producto",
                        new Date(),
                        entradaNuevaId!,
                        "traspaso",
                        stockFromEmpleados!,
                        null
                    );
                }
                console.log("Deleted entry", data);
                await fetchInventarioProductosConEntradas();
                await nullAllParameters();
            }
        } catch (err) {
            console.log(err);
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
            const { data, error } = await supabase.from("Movimientos").insert([
                {
                    inventario_id: inventarioID,
                    item_type: itemType,
                    date: fecha.toISOString(),
                    item_id: ItemID,
                    type: type,
                    quantity: quanity,
                    tecnico_id: tecnicoID,
                },
            ] as Movimientos[]);

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                console.log("Inventario creado:", data);
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
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
    }, []);

    useEffect(() => {
        if (flag === "principal") fetchInventarioProductosConEntradas();
        if (flag === "empleado") {
            fetchInventarioProductosConEntradas();
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
                                        <strong>Stock:</strong> {entry.stock}
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
                                        <strong>Valor:</strong> ${entry.stock * (entry?.Productos?.precio ?? 0)}
                                    </EntryText>
                                </EntryRow>
                                {flag === "principal" && (
                                    <EntryRow
                                        onClick={() => {
                                            fetchSingleEntry(entry.id);
                                            setEditable(true);
                                            setIsModalOpen(true);
                                            setEntryId(entry.id);
                                        }}
                                        style={{ alignSelf: "left" }}
                                        className="entrySixthElement"
                                        id="entrySixthElement"
                                    >
                                        {" "}
                                        <Icono size={20} />
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
                                        style={{ alignSelf: "left" }}
                                        className="entrySixthElement"
                                        id="entrySixthElement"
                                    >
                                        {" "}
                                        <Edit size={20} />
                                    </EntryRow>
                                )}
                                <button
                                    onClick={async () => {
                                        await setDeleteModalOpen(true);
                                        await setEntryId(entry.id);
                                        await fetchSingleEntry(entry.id);
                                        await setStockFromEmpleados(entry.stock);
                                    }}
                                    id="borrarServicio"
                                    style={{ fontWeight: "bold", fontSize: "105%" }}
                                >
                                    X
                                </button>
                            </EntryItem>
                        ))}
                    </EntryList>
                </>
            )}
            {deleteModalOpen && (
                <DelModal
                    closeModal={() => {
                        setDeleteModalOpen(false);
                    }}
                    titulo="¿Seguro quiere eliminar los productos?"
                    btnText="Eliminar productos"
                    del={() => {
                        deleteInventarioEntry(entryId!);
                    }}
                    tipo={productos.find(item => item.id === inventarioEntry?.[0]?.producto_id)?.nombre!}
                    stock={inventarioEntry?.[0].stock}
                    invNombre={params.get("Nombre") || "Inventario Principal"}
                    principal={["entradas"]}
                ></DelModal>
            )}
            <CreateButton
                onClick={() => {
                    nullAllParameters();
                    setEditable(false);
                    setIsModalOpen(true);
                }}
            >
                <FaPlus />
            </CreateButton>

            {isModalOpen && (
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
                ></InventarioActionModal>
            )}
        </SectionContainer>
    );
};

export default SubInventarioDetalle;
