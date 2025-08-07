// ✅ SubInventarioDetalle.tsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { CardInputs as CardInputs2, TextAlign } from "./rehusableComponents/CardInputs";
import {
    CreateButton,
    ModalButton,
    ModalContent,
    ModalForm,
    ModalOverlay,
} from "./rehusableComponents/CreateInventariosModal";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { Database, Tables } from "./supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import { FaEdit } from "react-icons/fa";
import { Enums } from "./supabase/Database";
import DelModal from "./DeleteModal";
import { DateInput } from "./CreateServiceForm";
import ReactDatePicker from "react-datepicker";
import PaginationComponent from "./PaginationComponent";
import { StyledInput } from "./FormComponents";
import { set } from "ts-pattern/dist/patterns";

interface SubInventarioDetalleProps {
    name?: string;
    items: InventarioItem[];
    onAddItem: (item: string) => void;
    flag: Enums<"TipoInventario">;
}

type TipoDeGasto = Database["public"]["Enums"]["UnidadDeGasto"];
type PresentaciónUnidad = Database["public"]["Enums"]["PresentacionUnidad"];
type Productos = Tables<"Productos">;
type InventarioProducos = Tables<"Inventario_productos">;
type Inventarios = Tables<"Inventario">;
type Movimientos = Tables<"Movimientos">;

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

enum InventarioFlag {
    tecnicos = "tecnicos",
    principal = "principal",
    equipo = "equipo",
    vehiculos = "vehiculos",
    menu_Principal = "menu_principal",
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
export const Plus = styled(FaPlus)`
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
    const [newItem, setNewItem] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoId, setProductoId] = useState<number>(-1);
    const [stock, setStock] = useState<number>();
    const [productos, setProductos] = useState<Productos[]>([]);
    const [inventarioId, setInventarioId] = useState<number>(
        Number(new URLSearchParams(window.location.search).get("inventarioId"))
    );
    const [inventarioEntries, setInventarioEntries] = useState<InventarioProducos[] | null>(null);
    const [inventarioEntry, setInventarioEntry] = useState<InventarioProducos[] | null>(null);
    const [editable, setEditable] = useState<boolean>(false);
    const [entryId, setEntryId] = useState<number | null>(null);
    const [colorTrigger, setColorTrigger] = useState<boolean>(false);
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
    const [invPrincipalesProductos, setInvPrincipalesproductos] = useState<number | null>();
    const [itemType, setItemType] = useState<Enums<"TipoItem">>();
    const [cantidad, setCantidad] = useState<number>(1);
    const [itemId, setItemId] = useState<number | null>(-1);
    const productoSeleccionado = entradasConProductosPrincipal?.find(inv => inv.id === itemId);
    const inventario = inventariosPrincipales?.find(i => i.id === inventarioPrincipalId) ?? null;
    const [selectedInventario, setSelectedInventario] = useState<InventarioProducos | null>(null);
    const [singleEntry,setSingleEntry] = useState<InventarioProducos | null>(null);
    const[stockFromEmpleados,setStockFromEmpleados] = useState<number | null>(null);

    const [tecnicoId, setTecnicoId] = useState<number>();

    const params = new URLSearchParams(window.location.search);

    enum TipoDeGastoEnum {
        gramos = "g",
        mililitros = "ml",
        piezas = "pzs",
    }

    enum PresentacionUnidadEnum {
        gramos = "g",
        litros = "L",
        mililitros = "ml",
        kilogramos = "kg",
        piezas = "pzs",
    }

    const nullAllParameters = () => {
      // setEntradasConProductos([]);
      // setEntradasConProductosPrincipal([]);
        setProductoId(-1);
        setStock(undefined);
        setInventarioPrincipalId(-1);
        setInventarioEntry(null)
        setFechaDeCaducidad(null);
        setLote("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAddItem(newItem.trim());
            setNewItem("");
        }
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
    const fetchSingleInventarioID = async (itemId: number | null) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .select("inventario_id")
                .eq("item_de_origen", itemId ?? -1);
            if (error) {
                throw error;
            }

            if (data) {
                console.log("Inventario productos fetched successfully:", data);
                setInventarioPrincipalId(data[0].inventario_id);
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
            nullAllParameters()

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
                setInventarioPrincipalId(data[0]?.inventario_id ?? -1);

                if (data[0]?.fecha_de_caducidad) {
                    const [year, month, day] = data[0]?.fecha_de_caducidad.split("-").map(Number);
                    const formattedDob = new Date(year, month - 1, day);
                    setFechaDeCaducidad(formattedDob);
                }
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };

    const handleFechaDeCaducidadChange = (date: Date | null) => {
        setFechaDeCaducidad(date);
    };

    const createEntry = async (
        inventarioID: number,
        productoID: number,
        stock: number,
        fechaCad: Date,
        itemDeOrigen: number | null,
        lote: string | null
    ) => {
        try {
            const { data, error } = await supabase.from("Inventario_productos").insert([
                {
                    inventario_id: inventarioID,
                    producto_id: productoID,
                    stock: stock,
                    fecha_de_caducidad: fechaCad.toISOString(),
                    item_de_origen: itemDeOrigen ?? null,
                    Lote: lote,
                },
            ] as InventarioProducos[]);

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                console.log("Inventario creado:", data);
                setProductoId(-1);
                setStock(undefined);
                setLote("");
                setFechaDeCaducidad(null);
                setIsModalOpen(false);
                fetchInventarioProductosConEntradas();
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    };
    const editEntry = async (
        entryId: number,
        {
            productoId,
            stock,
            lote,
            fechaDeCaducidad,
        }: {
            productoId?: number;
            stock?: number;
            lote?: string;
            fechaDeCaducidad?: string;
        }
    ) => {
        try {
            const updateData: Partial<InventarioProducos> = {};
            if (productoId !== undefined) updateData.producto_id = productoId;
            if (stock !== undefined) updateData.stock = stock;
            if (lote !== undefined) updateData.Lote = lote;
            if (fechaDeCaducidad !== undefined) updateData.fecha_de_caducidad = fechaDeCaducidad;

            const { data, error } = await supabase.from("Inventario_productos").update(updateData).eq("id", entryId);

            if (error) {
                console.error("Error editando inventario:", error);
            } else {
                console.log("Inventario editado:", data);
                setProductoId(-1);
                setStock(undefined);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error editing inventario:", err);
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

    const deleteInventarioEntry = async (entryId: number) => {
        try {
            const { error, data } = await supabase.from("Inventario_productos").delete().eq("id", entryId);
            if (error) {
                console.error("Error trying to delete the entry", error);
            } else {
                console.log("Deleted entry", data);
                fetchInventarioProductosConEntradas();
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (flag === "principal") {
          nullAllParameters()
            fetchproductos();
        }
        if (flag === "empleado") {
            fetchproductos();
            nullAllParameters()
            fetchInventariosPrincipales();
        }
    }, []);

    const createMovimiento = async (
        inventarioID: Number,
        itemType: Enums<"TipoItem">,
        fecha: Date,
        ItemID: number,
        type: Enums<"TipoMovimiento">,
        quanity: number,
        tecnicoID: number
    ) => {
        try {
            const { data, error } = await supabase.from("Movimientos").insert([
                {
                    // inventario_id: inventarioId,
                    // item_type: itemType,
                    // date:new Date().toISOString(),
                    // item_id:itemId,
                    // type:"traspaso",
                    // quantity:cantidad,
                    // tecnico_id:0,
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
                setProductoId(-1);
                setStock(undefined);
                setLote("");
                setFechaDeCaducidad(null);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    };

    const consumirDeInventarioPrincipal = async () => {};

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
                                        //TODO LUEGO HACER CON SELECTORS QUE SI ESTOY EN UNO SE CAMBIE DE COLOR
                                        // onMouseEnter={() => setColorTrigger(true)}
                                        // onMouseOut={() => setColorTrigger(false)}
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
                                                setEditable(true);

                                                try {
                                                    await fetchSingleEntry(entry.item_de_origen!);
                                                    setIsModalOpen(true);
                                                    setEntryId(entry.id);
                                                    setStockFromEmpleados(entry.stock);
                                                    setCantidad(1)
                                                } catch (error) {
                                                    console.error("Error fetching data:", error);
                                                }
                                            }
                                        }}
                                        //TODO LUEGO HACER CON SELECTORS QUE SI ESTOY EN UNO SE CAMBIE DE COLOR
                                        // onMouseEnter={() => setColorTrigger(true)}
                                        // onMouseOut={() => setColorTrigger(false)}
                                        style={{ alignSelf: "left" }}
                                        className="entrySixthElement"
                                        id="entrySixthElement"
                                    >
                                        {" "}
                                        <Plus size={20} />
                                    </EntryRow>
                                )}
                                <button
                                    onClick={() => {
                                        setDeleteModalOpen(true);
                                        setEntryId(entry.id);
                                        fetchSingleEntry(entry.id);
                                        //  deleteInventarioEntry(entry.id);
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
                <ModalOverlay>
                    <ModalContent>
                        <h2>{editable ? "Editar Entrada" : "Crear Nueva Entrada"}</h2>
                        <ModalForm>
                            {flag === "empleado" && (
                                <FormRow>
                                    <StyledLabel htmlFor="inventario_id">Inventario Principal</StyledLabel>
                                    <StyledSelect
                                        name="inventario_id"
                                        required
                                        disabled={editable}
                                        value={inventarioPrincipalId}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setInventarioPrincipalId(+e.target.value);
                                        }}
                                    >
                                        <option value={-1} disabled>
                                            Selecciona un Inventario
                                        </option>
                                        {inventariosPrincipales?.map(inventario => (
                                            <option key={inventario.id} value={inventario.id}>
                                                {inventario.inv_nombre ?? "Inventario Principal"}
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormRow>
                            )}
                            {flag === "principal" && (
                                <FormRow>
                                    <StyledLabel htmlFor="producto_id">Producto</StyledLabel>
                                    <StyledSelect
                                        name="producto_id"
                                        value={productoId}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                            setProductoId(+e.target.value)
                                        }
                                    >
                                        <option value={-1} disabled>
                                            Selecciona un Producto
                                        </option>
                                        {productos.map(producto => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.nombre}
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormRow>
                            )}
                            {flag === "empleado" && (
                                <FormRow>
                                    <StyledLabel htmlFor="producto_id">Producto</StyledLabel>
                                    <StyledSelect
                                        name="producto_id"
                                        required
                                        value={itemId}
                                        disabled={editable}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setItemId(+e.target.value);
                                            if (!itemType) setItemType("producto");
                                            fetchSingleEntry(+e.target.value);
                                            setCantidad(1); // reset quantity when product changes
                                        }}
                                    >
                                        <option value={-1} disabled>
                                            Producto | Lote | Stock
                                        </option>
                                        {entradasConProductosPrincipal?.map(inventario => (
                                            <option key={inventario.id} value={inventario.id as number}>
                                                Producto: {inventario.Productos?.nombre} | Lote: {inventario.Lote} |
                                                Stock: {inventario.stock}
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormRow>
                            )}

                            {/* Conditionally show the quantity input if a product is selected */}
                            {productoSeleccionado && (
                                <FormRow>
                                    <StyledLabel htmlFor="cantidad">
                                        Cantidad (max: {productoSeleccionado.stock})
                                    </StyledLabel>
                                    <CardInputs2
                                        type="number"
                                        largo="100%"
                                        // @ts-ignore
                                        textAlign="center"
                                        name="cantidad"
                                          min={-stockFromEmpleados!}
                                        step="1"
                                        max={productoSeleccionado.stock}
                                        value={cantidad}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = Number(e.target.value);
                                            const max = productoSeleccionado.stock;
                                            setCantidad(Math.min(value, max));
                                        }}
                                    />
                                </FormRow>
                            )}
                            {flag === "principal" && (
                                <>
                                    <FormRow>
                                        <StyledLabel htmlFor="stock">Stock</StyledLabel>
                                        <CardInputs2
                                            textAlign={TextAlign.Center}
                                            largo="100%"
                                            name="stock"
                                            type="number"
                                            step="1"
                                            placeholder="Ej. 25.5"
                                            value={stock}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                setStock(parseFloat(e.target.value))
                                            }
                                        />
                                    </FormRow>
                                    <>
                                        <FormRow>
                                            <StyledLabel htmlFor="presentacion_cantidad">
                                                Fecha de Caducidad
                                            </StyledLabel>

                                            <ReactDatePicker
                                                //@ts-ignore
                                                wrapperClassName="datepicker-wrapper"
                                                className="my-custom-datepicker"
                                                dateFormat="YYYY-MM-dd"
                                                onChange={date => {
                                                    handleFechaDeCaducidadChange(date);
                                                }}
                                                selected={fechaDeCaducidad}
                                            ></ReactDatePicker>
                                        </FormRow>
                                        <FormRow>
                                            <StyledLabel htmlFor="presentacion_cantidad">Lote</StyledLabel>
                                            <CardInputs2
                                                textAlign={TextAlign.Center}
                                                largo="100%"
                                                name="presentacion_cantidad"
                                                type="text"
                                                placeholder="Lote del producto"
                                                value={lote}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setLote(e.target.value)
                                                }
                                            />
                                        </FormRow>
                                    </>
                                </>
                            )}
                            <FormRow style={{ justifyContent: "flex-end", gap: "1rem" }}>
                                {editable && entryId && flag === "principal" && (
                                    <ModalButton
                                        onClick={() => {
                                            editEntry(entryId, {
                                                stock: stock,
                                                lote: lote,
                                                fechaDeCaducidad: fechaDeCaducidad?.toISOString(),
                                            });
                                            fetchInventarioProductosConEntradas();
                                            
                                        }}
                                        type="button"
                                    >
                                        Editar Entrada
                                    </ModalButton>
                                )}
                                {editable && entryId && flag === "empleado" && (
                                    <ModalButton
                                        onClick={async () => {
                                            try {
                                                if (!inventarioId) return window.alert("Falta el Inventario destino");
                                                if (!productoId) return window.alert("Falta el Producto");
                                                if (!stock) return window.alert("Falta el Stock");
                                              
                                                await createMovimiento(
                                                    inventarioPrincipalId!,
                                                    "producto",
                                                    new Date(),
                                                    itemId!,
                                                   cantidad > 1  ? "salida" : "traspaso",
                                                    cantidad < 1 ? cantidad * -1 : cantidad,
                                                    tecnicoId!
                                                );
                                                await createMovimiento(
                                                    inventarioId!,
                                                    "producto",
                                                    new Date(),
                                                    entryId!,
                                                     cantidad > 1  ? "traspaso" : "salida",
                                                     cantidad < 1 ? cantidad * -1 : cantidad,
                                                    tecnicoId!
                                                );

                                                 if (inventarioEntry?.[0]) {
                                                    
                                                

                                                 await editEntry(inventarioEntry[0].id, {
                                                        stock: inventarioEntry[0].stock - cantidad,
                                                    });

                                                    if (inventarioEntry[0].stock - cantidad === 0) {
                                                        await deleteInventarioEntry(inventarioEntry[0].id);
                                                        return;
                                                    }

                                                  

                                                     await editEntry(entryId, {
                                                    stock: stockFromEmpleados! + cantidad,
                                                    });

                                                    if (stockFromEmpleados! + cantidad === 0) {
                                                    
                                                        await deleteInventarioEntry(entryId);
                                                        return;
                                                    }

                                                   
                                                fetchInventarioProductosConEntradasPorPrincipal(null);
                                                fetchInventarioProductosConEntradas();

                                                }

                                                 
                                                
                                                
                                            } catch (error) {
                                                console.error("Error during the operation:", error);
                                                window.alert(
                                                    "Ocurrió un error durante la operación. Revisa la consola."
                                                );
                                            }
                                        }}
                                        type="button"
                                    >
                                        Editar Entrada
                                    </ModalButton>
                                )}
                                {!editable && flag === "principal" && (
                                    <ModalButton
                                        onClick={() =>
                                            createEntry(
                                                inventarioId,
                                                productoId!,
                                                stock!,
                                                fechaDeCaducidad!,
                                                null,
                                                lote
                                            )
                                        }
                                        type="button"
                                    >
                                        Crear Entrada
                                    </ModalButton>
                                )}
                                {!editable && flag === "empleado" && (
                                    <ModalButton
                                        onClick={async () => {
                                            try {
                                                if (!inventarioId) return window.alert("Falta el Inventario destino");
                                                if (!productoId) return window.alert("Falta el Producto");
                                                if (!stock) return window.alert("Falta el Stock");
                                                if (!fechaDeCaducidad)
                                                    return window.alert("Falta la Fecha de caducidad");

                                                // 1. CREAR MOVIMIENTO DE SALIDA
                                                await createMovimiento(
                                                    inventarioPrincipalId!,
                                                    "producto",
                                                    new Date(),
                                                    itemId!,
                                                    "salida",
                                                    cantidad,
                                                    tecnicoId!
                                                );

                                                // 2. CREAR MOVIMIENTO DE ENTRADA
                                                await createMovimiento(
                                                    inventarioId!,
                                                    "producto",
                                                    new Date(),
                                                    itemId!,
                                                    "traspaso",
                                                    cantidad,
                                                    tecnicoId!
                                                );

                                                // 3. CREAR ENTRADA

                                                // 4. ACTUALIZAR STOCK DE LA ENTRADA ORIGINAL
                                                if (inventarioEntry?.[0]) {
                                                    await createEntry(
                                                        inventarioId,
                                                        productoId,
                                                        cantidad,
                                                        fechaDeCaducidad,
                                                        itemId,
                                                        inventarioEntry?.[0].Lote
                                                    );
                                                    if (inventarioEntry[0].stock - cantidad === 0) {
                                                        await deleteInventarioEntry(inventarioEntry[0].id);
                                                        return;
                                                    }
                                                    await editEntry(inventarioEntry[0].id, {
                                                        stock: inventarioEntry[0].stock - cantidad,
                                                    });
                                                }
                                            } catch (error) {
                                                console.error("Error durante la operación secuencial:", error);
                                                window.alert(
                                                    "Ocurrió un error durante la operación. Revisa la consola."
                                                );
                                            }
                                        }}
                                    >
                                        Confirmar Traspaso
                                    </ModalButton>
                                )}

                                <ModalButton onClick={() => setIsModalOpen(false)}>Cerrar</ModalButton>
                            </FormRow>
                        </ModalForm>
                    </ModalContent>
                </ModalOverlay>
            )}
        </SectionContainer>
    );
};

export default SubInventarioDetalle;
