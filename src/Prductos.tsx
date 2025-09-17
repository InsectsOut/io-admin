import { useEffect, useState } from "react";
import { FaUserCog, FaWarehouse, FaLaptop, FaCar, FaPlus } from "react-icons/fa";
import SubInventarioList from "./SubInventarioList";
import SubInventarioDetalle, {
    EntryItem,
    EntryList,
    EntryRow,
    EntryText,
    FormRow,
    Icono,
    SectionContainer,
    SectionTitle,
    StyledLabel,
} from "./SubInventarioDetalle";
import { Database, Enums, Tables } from "./supabase/Database";
import DelModal from "./DeleteModal";
import { supabase } from "./utils/ClientSupabase";
import {
    CreateButton,
    FiltrosLeft,
    FiltrosLista,
    FlechaAbajo,
    ModalContainer,
    ModalContentBottom,
    ModalContentTop,
} from "./Servicios";
import { ModalButton, ModalContent, ModalForm, ModalOverlay } from "./rehusableComponents/CreateInventariosModal";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import PaginationComponent from "./PaginationComponent";
type Productos = Tables<"Productos">;
type Equipos = Tables<"Equipos">;
type TipoProducto = Database["public"]["Enums"]["TipoProducto"];
import Switch from "./rehusableComponents/ToggleSwitch";
import EquipoCreateModal from "./rehusableComponents/EquipoVehiculoCreateModal";
import { set } from "ts-pattern/dist/patterns";
type TipoEquipoControlOption = Database["public"]["Enums"]["TipoEquipo"];

interface ProductosProps {
    organizacion: string;
}

enum ProductoOption {
    Plaguicidas = "Plaguicidas",
    EquiposDeControl = "Equipos de control",
    Computo="Computo",
    Otros="Otros",
}

const ProductosMenu: React.FC<ProductosProps> = ({ organizacion }) => {
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
            }
            setIsModalOpen(false);
            fetchproductos();
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
            }
            setIsModalOpen(false);
            fetchproductos();
        } catch (error) {}
    };

    const fetchproductos = async () => {
        try {
            const { data, error, count } = await supabase
                .from("Productos")
                .select("*", { count: "exact" })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
    const fetchEquipos = async (equipoOption:ProductoOption) => {
        let filtro = [""]
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
                .in("tipo_equipo",filtro)
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
            fetchproductos();
        }
        if (selectedOption !== "Plaguicidas") {
            fetchEquipos(selectedOption);
        }
    }, [currentPage, selectedOption]);

    const deleteProduct = async (productoId: number) => {
        try {
            const { error, data } = await supabase.from("Productos").delete().eq("id", productoId);
            if (error) {
                console.error("Error trying to delete the entry", error);
            } else {
                console.log("Deleted entry", data);
                setDeleteModalOpen(false);
                fetchproductos();
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
            } else {
                console.log("Deleted entry", data);
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

        const newPosition = {
            top: top + height + window.scrollY,
            left: left + window.scrollX,
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
                    <Icono size={20} />
                </EntryRow>
                <button
                    onClick={() => {
                        setProductoId(entry.id);
                        setProductoNombre(entry.nombre ?? "sin nombre");
                        setDeleteModalOpen(true);
                    }}
                    id="borrarServicio"
                    style={{ fontWeight: "bold", fontSize: "105%" }}
                >
                    X
                </button>
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
            {selectedOption === ProductoOption.EquiposDeControl &&
                <EntryRow className="entryFifthElement prod5">
                    <EntryText>
                        <strong>Estación de control:</strong> {equipo.estacion_de_control ?? "—"}
                    </EntryText>
                </EntryRow>
    }

                {/* Acciones */}
                <EntryRow
                    onClick={() => {
                        setEditableEquipo(true);
                        setIsModalOpenEquipoVehiculo(true);
                        setEquipoId(equipo.id);
                    }}
                    className="entrySixthElement "
                >
                    <Icono size={20} />
                </EntryRow>

                <button
                    onClick={() => {
                        setEquipoId(equipo.id);
                        setEquipoNombre(equipo.nombre ?? "sin nombre");
                        setDeleteModalOpen(true);
                    }}
                    id="borrarServicio"
                    style={{ fontWeight: "bold", fontSize: "105%" }}
                >
                    X
                </button>
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
                                            checked={tipoProducto === "cebo"}
                                            onChange={() => setTipoProducto("cebo")}
                                        />
                                        Cebo
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="gel"
                                            checked={tipoProducto === "gel"}
                                            onChange={() => setTipoProducto("gel")}
                                        />
                                        Gel
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="radio"
                                            name="tipoProductoFiltro"
                                            value="plaguicida"
                                            checked={tipoProducto === "plaguicida"}
                                            onChange={() => setTipoProducto("plaguicida")}
                                        />
                                        Plaguicida
                                    </label>
                                </div>
                            </ModalContentTop>
                            <ModalContentBottom open={modalVisible}>
                                <div className="filtroActionButtons">
                                    <button className="actionButtonsStyles" id="limpiar" onClick={() => {}}>
                                        Limpiar
                                    </button>
                                    <button className="actionButtonsStyles" id="aplicar" onClick={() => {}}>
                                        Aplicar
                                    </button>
                                </div>
                            </ModalContentBottom>
                        </>
                    )}
                </ModalContainer>
            )}
            <div style={{}}>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "right",
                        marginBottom: "1rem",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignSelf: "left",
                            width: "50%",
                            justifyContent:"left",
                            gap:"1rem"
                        }}
                    >
                        <Switch
                            optionSender={option => {
                                setSelectedOption(option);
                            }}
                            options={[
                                ProductoOption.Plaguicidas,
                                ProductoOption.EquiposDeControl,
                                ProductoOption.Computo,
                                ProductoOption.Otros,
                            ]}
                        />
                        <FiltrosLista
                            // id="estatusFilter"
                            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                                handleFiltrosClick(event);
                                handleRotation();
                            }}
                        >
                            {selectedOption === "Plaguicidas"
                                ? "Plaguicidas"
                                : selectedOption === "Equipos de control"
                                  ? "Equipos de control"
                                  : ""}
                            <FlechaAbajo />
                        </FiltrosLista>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            width: "50%",
                            alignItems: "center",
                            justifyContent: "right",
                        }}
                    >
                        {selectedOption === ProductoOption.Plaguicidas && (
                            <ModalButton
                                onClick={() => {
                                    setIsModalOpen(true);
                                }}
                                margin="0"
                            >
                                Nuevo Producto
                            </ModalButton>
                        )}
                        {selectedOption === ProductoOption.EquiposDeControl && (
                            <ModalButton
                                onClick={() => {
                                    setIsModalOpenEquipoVehiculo(true);
                                }}
                                margin="0"
                            >
                                Nuevo Equipo de control
                            </ModalButton>
                        )}
                        {selectedOption === ProductoOption.Computo && (
                            <ModalButton
                                onClick={() => {
                                    setIsModalOpenEquipoVehiculo(true);
                                }}
                                margin="0"
                            >
                                Nuevo Equipo de computo
                            </ModalButton>
                        )}
                        {selectedOption === ProductoOption.Otros && (
                            <ModalButton
                                onClick={() => {
                                    setIsModalOpenEquipoVehiculo(true);
                                }}
                                margin="0"
                            >
                                Nuevo Equipo general
                            </ModalButton>
                        )}
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        ></PaginationComponent>
                    </div>
                </div>
            </div>
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
        </SectionContainer>
    );
};

export default ProductosMenu;

