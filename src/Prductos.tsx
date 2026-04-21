import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaUserCog, FaWarehouse, FaLaptop, FaCar, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import SubInventarioList from "./SubInventarioList";
import SubInventarioDetalle, {
    EntryItem,
    EntryList,
    EntryRow,
    EntryText,
    EntryTableHeader,
    EntryHeaderCell,
    FormRow,
    Icono,
    SectionContainer,
    SectionTitle,
    StyledLabel,
    DeleteBtn,
} from "./SubInventarioDetalle";
import { Database, Enums, Tables } from "./supabase/Database";
import DelModal from "./DeleteModal";
import { supabase } from "./utils/ClientSupabase";
import { useToast } from "./rehusableComponents/Toast";
import {
    FiltrosLeft,
    FiltrosLista,
    FlechaAbajo,
    ModalContainer,
    ModalContentBottom,
    ModalContentTop,
} from "./Servicios";
import {
    CreateButton,
    ModalButton,
    ModalContent,
    ModalForm,
    ModalOverlay,
} from "./rehusableComponents/CreateInventariosModal";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import PaginationComponent from "./PaginationComponent";
type Productos = Tables<"Productos">;
type Equipos = Tables<"Equipos">;
type TipoProducto = Database["public"]["Enums"]["TipoProducto"];
import Switch from "./rehusableComponents/ToggleSwitch";
import EquipoCreateModal from "./rehusableComponents/EquipoVehiculoCreateModal";
type TipoEquipoControlOption = Database["public"]["Enums"]["TipoEquipo"];

const ToolbarWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
    @media (max-width: 600px) {
        gap: 0.5rem;
    }
`;
const ToolbarLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    @media (max-width: 600px) {
        overflow-x: hidden;
        width: 100%;
        flex: 0 0 100%;
    }
`;
const ToolbarRight = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    @media (max-width: 600px) {
        width: 100%;
        justify-content: center;
    }
`;

const MobileSelect = styled.select`
    display: none;
    @media (max-width: 600px) {
        display: block;
        flex: 1;
        padding: 0.6rem 1rem;
        border: 2px solid #0d4e80;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: #0d4e80;
        background: #fff;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230d4e80' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
    }
`;

const SwitchHideOnMobile = styled.div`
    @media (max-width: 600px) {
        display: none;
    }
`;

const ProdActionsRow = styled.div`
    display: contents;
    @media (max-width: 600px) {
        display: flex;
        width: 100%;
        gap: 0.6rem;
        margin-top: 0.75rem;
        padding-top: 0.6rem;
        border-top: 1.5px solid #eef2f7;
        align-items: stretch;
        align-items: center;

        .entrySixthElement {
            flex: 1;
            margin-top: 0 !important;
            margin-left: 0 !important;
            width: auto;
            height: 2.5rem;
            background: #eef5fb;
            border: 1.5px solid #0d4e80;
            border-radius: 0.45rem;
            justify-content: center;
            align-items: center;
            gap: 0.4rem;
            cursor: pointer;
            font-size: 0.82rem;
            font-weight: 600;
            color: #0d4e80;
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

interface ProductosProps {
    organizacion: string;
}

enum ProductoOption {
    Plaguicidas = "Plaguicidas",
    EquiposDeControl = "Equipos de control",
    Computo = "Computo",
    Otros = "Otros",
}

const ProductosMenu: React.FC<ProductosProps> = ({ organizacion }) => {
    const { showToast } = useToast();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productoId, setProductoId] = useState<number | null>(null);
    const [inventarioEntry, setInventarioEntry] = useState<any[]>([]); // Adjust type as needed
    const [productos, setProductos] = useState<Productos[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nombreProducto, setNombreProducto] = useState<string>("");
    const [registroCofepris, setRegistroCofepris] = useState<string>("");
    const [ingredienteActivo, setIngredienteActivo] = useState<string>("");
    const [dosisMinima, setDosisMinima] = useState<number>();
    const [dosisMaxima, setDosisMaxima] = useState<number>();
    const [tipoProducto, setTipoProducto] = useState<TipoProducto>();
    const [unidadGasto, setUnidadGasto] = useState<Enums<"UnidadDeGasto">>();
    const [cantidadPresentacion, setCantidadPresentacion] = useState<number>();
    const [unidadPresentacion, setUnidadPresentacion] = useState<Enums<"PresentacionUnidad">>();
    const tipoProductoOptions: TipoProducto[] = ["cebo", "gel", "plaguicida", "trampa"];
    const unnidadDeGastoOptions: Enums<"UnidadDeGasto">[] = ["g", "ml", "pzs"];
    const unnidadPresentacionOptions: Enums<"PresentacionUnidad">[] = ["L", "g", "kg", "ml", "pzs"];
    const [unidadDosisMinima, setUnidadDosisMinima] = useState("ml/L");
    const [unidadDosisMaxima, setUnidadDosisMaxima] = useState("ml/L");
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 8;
    const [productoNombre, setProductoNombre] = useState<string>("");
    const [singleProduct, setSingleProduct] = useState<Productos[]>();
    const [singleEquipo, setSingleEquipo] = useState<Equipos[]>();
    const [editable, setEditable] = useState<boolean>(false);
    const [precio, setPrecio] = useState<number | null>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [modalRef, setModalRef] = useState<HTMLDivElement | null>(null);
    const [textModal, setTextModal] = useState<string>("");
    const [isRotated, setIsRotated] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ProductoOption>(ProductoOption.Plaguicidas);
    const [isModalOpenEquipoVehiculo, setIsModalOpenEquipoVehiculo] = useState(false);
    const [Equipos, setEquipos] = useState<Equipos[]>([]);
    const [equipoId, setEquipoId] = useState<number | null>(null);
    const [equipoNombre, setEquipoNombre] = useState<string>("");
    const [editableEquipo, setEditableEquipo] = useState<boolean>(false);
    const [tipoProductoFiltro, setTipoProductoFiltro] = useState<TipoProducto | undefined>(undefined);
    const [tipoProductoFiltroTemp, setTipoProductoFiltroTemp] = useState<TipoProducto | undefined>(undefined);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOptionChange = useCallback((option: ProductoOption) => {
        setSelectedOption(option);
    }, []);

    const switchOptions = useMemo(
        () => [
            ProductoOption.Plaguicidas,
            ProductoOption.EquiposDeControl,
            ProductoOption.Computo,
            ProductoOption.Otros,
        ],
        []
    );

    const handleNombreProductoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreProducto(e.target.value);
    };

    const handleRegistroCofeprisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegistroCofepris(e.target.value);
    };

    const handleIngredienteActivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIngredienteActivo(e.target.value);
    };

    const handleDosisMinimaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setDosisMinima(undefined);
            return;
        }

        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed >= 0) {
            setDosisMinima(parsed);
        }
    };

    const handleDosisMaximaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setDosisMaxima(undefined);
            return;
        }

        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed >= 0) {
            setDosisMaxima(parsed);
        }
    };
    const handleTipoProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoProducto(e.target.value as Enums<"TipoProducto">);
    };

    const handleUnidadGastoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnidadGasto(e.target.value as Enums<"UnidadDeGasto">);
    };

    const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrecio(+e.target.value);
    };

    const handleCantidadPresentacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === "") {
            setCantidadPresentacion(undefined);
            return;
        }

        const parsed = parseFloat(value);

        if (!isNaN(parsed) && parsed >= 0) {
            setCantidadPresentacion(parsed);
        }
    };
    const handleUnidadPresentacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnidadPresentacion(e.target.value as Enums<"PresentacionUnidad">);
    };

    const resetForm = () => {
        setNombreProducto("");
        setRegistroCofepris("");
        setIngredienteActivo("");
        setDosisMinima(undefined);
        setDosisMaxima(undefined);
        setTipoProducto(undefined);
        setUnidadGasto(undefined);
        setCantidadPresentacion(undefined);
        setUnidadPresentacion(undefined);
        setUnidadDosisMaxima("");
        setUnidadDosisMinima("");
    };

    const createProducto = async () => {
        try {
            const { error, data } = await supabase.from("Productos").insert([
                {
                    dosis_max: `${dosisMaxima}${unidadDosisMaxima}`,
                    dosis_min: `${dosisMinima}${unidadDosisMinima}`,
                    ingrediente_activo: ingredienteActivo || null,
                    nombre: nombreProducto || null,
                    presentacion: `${cantidadPresentacion} ${unidadPresentacion?.toUpperCase()}`,
                    presentacion_cantidad: cantidadPresentacion ?? null,
                    presentacion_unidad: unidadPresentacion ?? null,
                    registro: registroCofepris || null,
                    tipo_de_producto: tipoProducto ?? null,
                    unidad_de_gasto: unidadGasto ?? null,
                    organizacion: organizacion,
                },
            ] as Productos[]);
            if (error) {
                console.log("Error creating a product", error);
                showToast("Error al crear el producto", "error");
            } else {
                showToast("Producto creado correctamente", "success");
            }
            setIsModalOpen(false);
            fetchproductos(tipoProductoFiltro);
        } catch (error) {}
    };
    const updateProduct = async (productoId: number) => {
        try {
            const { error, data } = await supabase
                .from("Productos")
                .update({
                    dosis_max:
                        dosisMaxima !== undefined && unidadDosisMaxima ? `${dosisMaxima}${unidadDosisMaxima}` : null,
                    dosis_min:
                        dosisMinima !== undefined && unidadDosisMinima ? `${dosisMinima}${unidadDosisMinima}` : null,
                    ingrediente_activo: ingredienteActivo || null,
                    nombre: nombreProducto || null,
                    presentacion:
                        cantidadPresentacion !== undefined && unidadPresentacion
                            ? `${cantidadPresentacion} ${unidadPresentacion.toUpperCase()}`
                            : null,
                    presentacion_cantidad: cantidadPresentacion ?? null,
                    presentacion_unidad: unidadPresentacion ?? null,
                    registro: registroCofepris || null,
                    tipo_de_producto: tipoProducto ?? null,
                    unidad_de_gasto: unidadGasto ?? null,
                    precio: precio,
                })
                .eq("id", productoId)
                .select();
            if (error) {
                console.log("Error updating a product", error);
                showToast("Error al actualizar el producto", "error");
            } else {
                showToast("Producto actualizado correctamente", "success");
            }
            setIsModalOpen(false);
            fetchproductos(tipoProductoFiltro);
        } catch (error) {}
    };

    const fetchproductos = async (filtroTipo?: TipoProducto) => {
        try {
            let query = supabase.from("Productos").select("*", { count: "exact" });
            if (filtroTipo) {
                query = query.eq("tipo_de_producto", filtroTipo);
            }
            const { data, error, count } = await query.range(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            );
            const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
            setTotalPages(totalPages);
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
    const fetchEquipos = async (equipoOption: ProductoOption) => {
        let filtro = [""];
        switch (equipoOption) {
            case "Equipos de control":
                filtro = ["bomba_ulv", "termo_nebulizadora", "estacion_control"];
                break;
            case "Computo":
                filtro = ["computo"];
                break;
            case "Otros":
                filtro = ["otro"];
                break;
            default:
                filtro = [""];
        }

        try {
            const { data, error, count } = await supabase
                .from("Equipos")
                .select("*", { count: "exact" })
                .eq("organizacion", organizacion)
                .in("tipo_equipo", filtro)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
            setTotalPages(totalPages);
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

    function splitNumberAndUnit(value: string): [string, string] {
        const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (match) {
            const [, numberPart, unitPart] = match;
            return [numberPart, unitPart];
        }
        return [value, ""];
    }

    const fetchSingleProduct = async (productoId: number) => {
        try {
            const { data, error, count } = await supabase.from("Productos").select("*").eq("id", productoId);
            if (error) {
                throw error;
            }

            if (data) {
                const [productos] = data;
                console.log("Productos fetched successfully:", data);
                setSingleProduct(data);
                setNombreProducto(productos.nombre ?? "");
                setRegistroCofepris(productos.registro ?? "");
                setIngredienteActivo(productos.ingrediente_activo ?? "");
                setTipoProducto(productos.tipo_de_producto ?? undefined);
                setUnidadGasto(productos.unidad_de_gasto ?? undefined);
                setCantidadPresentacion(productos.presentacion_cantidad ?? 0);
                setUnidadPresentacion(productos.presentacion_unidad ?? undefined);
                setPrecio(productos.precio);
                if (productos.dosis_max) {
                    const dosisMaxDestructured = splitNumberAndUnit(productos?.dosis_max);
                    console.log(dosisMaxDestructured);
                    setDosisMaxima(Number(dosisMaxDestructured[0]));
                    setUnidadDosisMaxima(dosisMaxDestructured[1].toUpperCase());
                }
                if (productos.dosis_min) {
                    const dosisMinDestructured = splitNumberAndUnit(productos?.dosis_min);
                    console.log(dosisMinDestructured);
                    setDosisMinima(Number(dosisMinDestructured[0]));
                    setUnidadDosisMinima(dosisMinDestructured[1].toUpperCase());
                }
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (selectedOption === "Plaguicidas") {
            fetchproductos(tipoProductoFiltro);
        }
        if (selectedOption !== "Plaguicidas") {
            fetchEquipos(selectedOption);
        }
    }, [currentPage, selectedOption, tipoProductoFiltro]);

    const deleteProduct = async (productoId: number) => {
        try {
            const { error, data } = await supabase.from("Productos").delete().eq("id", productoId);
            if (error) {
                console.error("Error trying to delete the entry", error);
                showToast("Error al eliminar el producto", "error");
            } else {
                console.log("Deleted entry", data);
                showToast("Producto eliminado correctamente", "success");
                setDeleteModalOpen(false);
                fetchproductos(tipoProductoFiltro);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const deleteEquipo = async (equipoId: number) => {
        try {
            const { error, data } = await supabase.from("Equipos").delete().eq("id", equipoId);
            if (error) {
                console.error("Error trying to delete the entry", error);
                showToast("Error al eliminar el equipo", "error");
            } else {
                console.log("Deleted entry", data);
                showToast("Equipo eliminado correctamente", "success");
                setDeleteModalOpen(false);
                fetchEquipos(selectedOption);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleFiltrosClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = event.currentTarget as HTMLLIElement;
        const { top, left, height } = target.getBoundingClientRect();
        console.log(target.id);

        const modalWidth = 274;
        const margin = 8;
        const rawLeft = left + window.scrollX;
        const clampedLeft = Math.min(rawLeft, window.innerWidth - modalWidth - margin);

        const newPosition = {
            top: top + height + window.scrollY,
            left: clampedLeft,
        };

        // If the modal is currently visible and the same element is clicked, hide the modal
        if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left) {
            setModalVisible(false);
        } else if (
            modalVisible &&
            modalPosition.top === newPosition.top &&
            modalPosition.left === newPosition.left - 100
        ) {
            setModalVisible(false);
        } else {
            // Otherwise, show the modal at the new position
            if (window.innerWidth <= 900 && target.id === "estatusFilter") {
                newPosition.left -= 100;
                console.log(newPosition.left);
                setModalPosition(newPosition);
                setModalVisible(true);
            } else {
                setModalPosition(newPosition);
                setModalVisible(true);
            }
        }
    };

    const handleRotation = () => {
        setTextModal("TipoProd");

        setIsRotated(prev => !prev);
    };

    const optionMatch = (option: TipoEquipoControlOption) => {
        switch (option) {
            case "bomba_ulv":
                return "Bomba de aspersión";
            case "estacion_control":
                return "Estación de Control";
            case "termo_nebulizadora":
                return "Termo Nebulizadora";
            case "otro":
                return option;
        }
    };

    const renderProducto = (entry: Productos, index: number) => {
        return (
            <EntryItem key={index}>
                <EntryRow className="entryFirstElement prod1">
                    <EntryText>
                        <strong>{selectedOption === ProductoOption.EquiposDeControl ? "Equipo" : "Producto"}:</strong>{" "}
                        {entry?.nombre}
                    </EntryText>
                </EntryRow>
                <EntryRow className="entrySecondElement prod2">
                    <EntryText>
                        <strong>Tipo:</strong> {entry.tipo_de_producto}
                    </EntryText>
                </EntryRow>
                <EntryRow className="entryThirdElement prod3">
                    <EntryText>
                        <strong>Presentación:</strong>
                        <h4 style={{ all: "unset", textTransform: "uppercase" }}>{entry.presentacion}</h4>
                    </EntryText>
                </EntryRow>
                <EntryRow className="entryFourthElement prod4">
                    <EntryText>
                        <strong>Dósis mínima:</strong> {entry.dosis_min}
                    </EntryText>
                </EntryRow>
                <EntryRow className="entryFourthElement prod4">
                    <EntryText>
                        <strong>Dósis máxima:</strong> {entry.dosis_max}
                    </EntryText>
                </EntryRow>

                <ProdActionsRow
                
                >
                    <EntryRow
                        onClick={() => {
                            fetchSingleProduct(entry.id);
                            setEditable(true);
                            setIsModalOpen(true);
                            setProductoId(entry.id);
                        }}
                        style={{ alignSelf: "left" }}
                        className="entrySixthElement prod6"
                        id="entrySixthElement"
                    >
                        <Icono size={16} />
                        <span>Editar</span>
                    </EntryRow>
                    <DeleteBtn
                        onClick={() => {
                            setProductoId(entry.id);
                            setProductoNombre(entry.nombre ?? "sin nombre");
                            setDeleteModalOpen(true);
                        }}
                        id="borrarServicio"
                    >
                        ✕
                    </DeleteBtn>
                </ProdActionsRow>
            </EntryItem>
        );
    };
    const renderEquipo = (equipo: any, index: number) => {
        return (
            <EntryItem key={index}>
                <EntryRow className="entryFirstElement prod1">
                    <EntryText>
                        <strong>Nombre:</strong> {equipo.nombre}
                    </EntryText>
                </EntryRow>
                <EntryRow className="entrySecondElement prod2">
                    <EntryText>
                        <strong>Equipo:</strong> {optionMatch(equipo.tipo_equipo)}
                    </EntryText>
                </EntryRow>
                <EntryRow className="entryThirdElement prod3">
                    <EntryText>
                        <strong>Marca:</strong> {equipo.marca ?? "—"}
                    </EntryText>
                </EntryRow>
                <EntryRow className="entryFourthElement prod4">
                    <EntryText>
                        <strong>Modelo:</strong> {equipo.modelo ?? "—"}
                    </EntryText>
                </EntryRow>
                {selectedOption === ProductoOption.EquiposDeControl && (
                    <EntryRow className="entryFifthElement prod5">
                        <EntryText>
                            <strong>Estación de control:</strong> {equipo.estacion_de_control ?? "—"}
                        </EntryText>
                    </EntryRow>
                )}

                {/* Acciones */}
                <ProdActionsRow>
                    <EntryRow
                        onClick={() => {
                            setEditableEquipo(true);
                            setIsModalOpenEquipoVehiculo(true);
                            setEquipoId(equipo.id);
                        }}
                        className="entrySixthElement"
                    >
                        <Icono size={16} />
                        <span>Editar</span>
                    </EntryRow>

                    <DeleteBtn
                        onClick={() => {
                            setEquipoId(equipo.id);
                            setEquipoNombre(equipo.nombre ?? "sin nombre");
                            setDeleteModalOpen(true);
                        }}
                        id="borrarServicio"
                    >
                        ✕
                    </DeleteBtn>
                </ProdActionsRow>
            </EntryItem>
        );
    };

    return (
        <SectionContainer>
            <SectionTitle>Contenido de Productos</SectionTitle>

            {modalVisible && (
                <ModalContainer
                    open={modalVisible}
                    style={{ top: modalPosition.top, left: modalPosition.left }}
                    //@ts-ignore
                    ref={modalRef}
                >
                    {textModal === "TipoProd" && (
                        <>
                            {/* <ModalContentTop open={modalVisible}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="cebo"
                                            checked={tipoProducto === "cebo"}
                                            onChange={() => setTipoProducto("cebo")}
                                        />
                                        Plaguicida
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="gel"
                                            checked={tipoProducto === "gel"}
                                            onChange={() => setTipoProducto("gel")}
                                        />
                                        Equipos de control
                                    </label>
                                </div>
                            </ModalContentTop> */}
                            <ModalContentTop open={modalVisible}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="cebo"
                                            checked={tipoProductoFiltroTemp === "cebo"}
                                            onChange={() => setTipoProductoFiltroTemp("cebo")}
                                        />
                                        Cebo
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="gel"
                                            checked={tipoProductoFiltroTemp === "gel"}
                                            onChange={() => setTipoProductoFiltroTemp("gel")}
                                        />
                                        Gel
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="plaguicida"
                                            checked={tipoProductoFiltroTemp === "plaguicida"}
                                            onChange={() => setTipoProductoFiltroTemp("plaguicida")}
                                        />
                                        Plaguicida
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="trampa"
                                            checked={tipoProductoFiltroTemp === "trampa"}
                                            onChange={() => setTipoProductoFiltroTemp("trampa")}
                                        />
                                        Trampa
                                    </label>
                                </div>
                            </ModalContentTop>
                            <ModalContentBottom open={modalVisible}>
                                <div className="filtroActionButtons">
                                    <button
                                        className="actionButtonsStyles"
                                        id="limpiar"
                                        onClick={() => {
                                            setTipoProductoFiltroTemp(undefined);
                                            setTipoProductoFiltro(undefined);
                                            setCurrentPage(1);
                                            setModalVisible(false);
                                        }}
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        className="actionButtonsStyles"
                                        id="aplicar"
                                        onClick={() => {
                                            setTipoProductoFiltro(tipoProductoFiltroTemp);
                                            setCurrentPage(1);
                                            setModalVisible(false);
                                        }}
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </ModalContentBottom>
                        </>
                    )}
                </ModalContainer>
            )}
            <div style={{}}>
                <ToolbarWrapper>
                    <ToolbarLeft>
                        <SwitchHideOnMobile>
                            <Switch optionSender={handleOptionChange} options={switchOptions} />
                        </SwitchHideOnMobile>
                        <MobileSelect
                            value={selectedOption}
                            onChange={e => setSelectedOption(e.target.value as ProductoOption)}
                        >
                            <option value={ProductoOption.Plaguicidas}>Plaguicidas</option>
                            <option value={ProductoOption.EquiposDeControl}>Equipos de control</option>
                            <option value={ProductoOption.Computo}>Computo</option>
                            <option value={ProductoOption.Otros}>Otros</option>
                        </MobileSelect>
                        <FiltrosLista
                            // id="estatusFilter"
                            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                                handleFiltrosClick(event);
                                handleRotation();
                            }}
                            style={{ display: selectedOption !== ProductoOption.Plaguicidas ? "none" : undefined }}
                        >
                            {tipoProductoFiltro
                                ? tipoProductoFiltro.charAt(0).toUpperCase() + tipoProductoFiltro.slice(1)
                                : "Tipo"}
                            <FlechaAbajo />
                        </FiltrosLista>
                    </ToolbarLeft>
                    <ToolbarRight>
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        ></PaginationComponent>
                    </ToolbarRight>
                </ToolbarWrapper>
            </div>
            {selectedOption === ProductoOption.Plaguicidas && (
                <EntryTableHeader>
                    <EntryHeaderCell className="col-first">Producto</EntryHeaderCell>
                    <EntryHeaderCell className="col-second">Tipo</EntryHeaderCell>
                    <EntryHeaderCell className="col-third">Presentación</EntryHeaderCell>
                    <EntryHeaderCell className="col-fourth">Dósis mín.</EntryHeaderCell>
                    <EntryHeaderCell className="col-fifth">Dósis máx.</EntryHeaderCell>
                    <EntryHeaderCell className="col-sixth">Edit</EntryHeaderCell>
                    <EntryHeaderCell className="col-delete">Acción</EntryHeaderCell>
                </EntryTableHeader>
            )}
            {selectedOption !== ProductoOption.Plaguicidas && (
                <EntryTableHeader>
                    <EntryHeaderCell className="col-first">Nombre</EntryHeaderCell>
                    <EntryHeaderCell className="col-second">Tipo</EntryHeaderCell>
                    <EntryHeaderCell className="col-third">Marca</EntryHeaderCell>
                    <EntryHeaderCell className="col-fourth">Modelo</EntryHeaderCell>
                    {selectedOption === ProductoOption.EquiposDeControl && (
                        <EntryHeaderCell className="col-fifth">Estación ctrl.</EntryHeaderCell>
                    )}
                    <EntryHeaderCell className="col-sixth">Edit</EntryHeaderCell>
                    <EntryHeaderCell className="col-delete">Acción</EntryHeaderCell>
                </EntryTableHeader>
            )}
            <EntryList>
                {selectedOption === ProductoOption.Plaguicidas &&
                    productos?.map((entry, index) => renderProducto(entry, index))}
                {selectedOption !== ProductoOption.Plaguicidas &&
                    Equipos?.map((entry, index) => renderEquipo(entry, index))}
            </EntryList>

            {deleteModalOpen && (
                <DelModal
                    closeModal={() => {
                        setDeleteModalOpen(false);
                    }}
                    titulo={
                        selectedOption === ProductoOption.EquiposDeControl
                            ? `¿Seguro quiere eliminar el equipo?`
                            : `¿Seguro quiere eliminar el producto?`
                    }
                    btnText={
                        selectedOption === ProductoOption.EquiposDeControl ? "Eliminar equipo" : "Eliminar producto"
                    }
                    del={() => {
                        selectedOption === ProductoOption.Plaguicidas
                            ? deleteProduct(productoId!)
                            : selectedOption === ProductoOption.EquiposDeControl
                              ? deleteEquipo(equipoId!)
                              : null;
                    }}
                    tipo={productoNombre}
                ></DelModal>
            )}

            {isModalOpenEquipoVehiculo && (
                <EquipoCreateModal
                    selectedOption={selectedOption}
                    equipoId={equipoId ?? null}
                    editable={editableEquipo}
                    fetchEquipos={() => {
                        fetchEquipos(selectedOption);
                    }}
                    organizacion={organizacion}
                    closeModal={() => {
                        setIsModalOpenEquipoVehiculo(false);
                        setEditableEquipo(false);
                    }}
                ></EquipoCreateModal>
            )}

            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h2 style={{ color: "black" }}>{editable ? "Editar Producto" : "Añadir Producto"}</h2>
                        <ModalForm>
                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="inventarioNombre">Nombre del producto</StyledLabel>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Nombre del producto"
                                    type="text"
                                    required
                                    name="inventarioNombre"
                                    id="inventarioNombre"
                                    autoComplete="off"
                                    autoFocus
                                    value={nombreProducto}
                                    onChange={handleNombreProductoChange}
                                />
                            </FormRow>

                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="registroCofepris">Registro Cofepris</StyledLabel>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Registro Cofepris"
                                    type="text"
                                    required
                                    name="registroCofepris"
                                    id="registroCofepris"
                                    autoComplete="off"
                                    value={registroCofepris}
                                    onChange={handleRegistroCofeprisChange}
                                />
                            </FormRow>

                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="ingredienteActivo">Ingrediente activo</StyledLabel>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Ingrediente activo"
                                    type="text"
                                    required
                                    name="ingredienteActivo"
                                    id="ingredienteActivo"
                                    autoComplete="off"
                                    value={ingredienteActivo}
                                    onChange={handleIngredienteActivoChange}
                                />
                            </FormRow>

                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="tipoProducto">Tipo de producto</StyledLabel>
                                <StyledSelect
                                    id="tipoProducto"
                                    name="tipoProducto"
                                    required
                                    value={tipoProducto}
                                    onChange={handleTipoProductoChange}
                                >
                                    <option value="">Selecciona un tipo</option>
                                    {tipoProductoOptions.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </StyledSelect>
                            </FormRow>

                            <>
                                <FormRow className="productoModalRows">
                                    <StyledLabel htmlFor="dosisMinima">Dosis mínima</StyledLabel>
                                    <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                                        <CardInputs
                                            largo="100%"
                                            placeholder="dosis mínima"
                                            type="number"
                                            min={0}
                                            required
                                            name="dosisMinima"
                                            id="dosisMinima"
                                            autoComplete="off"
                                            value={dosisMinima}
                                            onChange={handleDosisMinimaChange}
                                        />
                                        <StyledSelect
                                            value={unidadDosisMinima}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                setUnidadDosisMinima(e.target.value.toUpperCase() as any)
                                            }
                                            style={{ padding: "0.5rem", borderRadius: "4px" }}
                                        >
                                            <option value="">Elija la unidad</option>
                                            <option value="ML/LITRO">ml/litro</option>
                                            <option value="G/LITRO">g/litro</option>
                                            <option value="L/LITRO">l/litro</option>
                                            <option value="L/LITRO">l/litro</option>
                                            <option value="/G">gramos</option>
                                        </StyledSelect>
                                    </div>
                                </FormRow>
                                <FormRow className="productoModalRows">
                                    <StyledLabel htmlFor="dosisMaxima">Dosis máxima</StyledLabel>
                                    <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                                        <CardInputs
                                            largo="100%"
                                            placeholder="dosis máxima"
                                            type="number"
                                            min={0}
                                            required
                                            name="dosisMaxima"
                                            id="dosisMaxima"
                                            autoComplete="off"
                                            value={dosisMaxima}
                                            onChange={handleDosisMaximaChange}
                                        />
                                        <StyledSelect
                                            value={unidadDosisMaxima}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                setUnidadDosisMaxima(e.target.value.toUpperCase() as any)
                                            }
                                            style={{ padding: "0.5rem", borderRadius: "4px" }}
                                        >
                                            <option value="">Elija la unidad</option>
                                            <option value="ML/LITRO">ml/litro</option>
                                            <option value="G/LITRO">g/litro</option>
                                            <option value="L/LITRO">l/litro</option>
                                            <option value="/G">gramos</option>
                                        </StyledSelect>
                                    </div>
                                </FormRow>
                            </>

                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="unidadGasto">Unidad de gasto</StyledLabel>
                                <StyledSelect
                                    id="unidadGasto"
                                    name="unidadGasto"
                                    required
                                    value={unidadGasto}
                                    onChange={handleUnidadGastoChange}
                                >
                                    <option value="">Selecciona una unidad</option>
                                    {unnidadDeGastoOptions.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </StyledSelect>
                            </FormRow>

                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="cantidadPresentacion">Cantidad de presentación</StyledLabel>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Cantidad de presentación"
                                    type="number"
                                    required
                                    step="any"
                                    name="cantidadPresentacion"
                                    id="cantidadPresentacion"
                                    autoComplete="off"
                                    min={0}
                                    value={cantidadPresentacion}
                                    onChange={handleCantidadPresentacionChange}
                                />
                            </FormRow>

                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="unidadPresentacion">Unidad de presentación</StyledLabel>
                                <StyledSelect
                                    id="unidadPresentacion"
                                    name="unidadPresentacion"
                                    required
                                    value={unidadPresentacion}
                                    onChange={handleUnidadPresentacionChange}
                                >
                                    <option value="">Selecciona una unidad</option>
                                    {unnidadPresentacionOptions.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </StyledSelect>
                            </FormRow>
                            <FormRow className="productoModalRows">
                                <StyledLabel htmlFor="unidadPrecio">Precio por unidad</StyledLabel>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Precio del producto"
                                    id="unidadPrecio"
                                    name="unidadPrecio"
                                    type="number"
                                    required
                                    value={precio}
                                    onChange={handlePrecioChange}
                                ></CardInputs>
                            </FormRow>
                        </ModalForm>
                        {!editable && (
                            <ModalButton
                                onClick={() => {
                                    createProducto();
                                }}
                                margin="0"
                            >
                                Añadir Producto
                            </ModalButton>
                        )}
                        {editable && (
                            <ModalButton
                                onClick={() => {
                                    updateProduct(productoId!);
                                    resetForm();
                                }}
                                margin="0"
                            >
                                Editar Producto
                            </ModalButton>
                        )}
                        <ModalButton
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(false);
                                resetForm();
                            }}
                        >
                            Cerrar
                        </ModalButton>
                    </ModalContent>
                </ModalOverlay>
            )}
            <CreateButton
                onClick={() => {
                    if (selectedOption === ProductoOption.Plaguicidas) {
                        setEditable(false);
                        setIsModalOpen(true);
                    } else {
                        setEditableEquipo(false);
                        setIsModalOpenEquipoVehiculo(true);
                    }
                }}
            >
                <FaPlus />
            </CreateButton>
        </SectionContainer>
    );
};

export default ProductosMenu;

