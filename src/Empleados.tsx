import { useEffect, useState, useRef } from "react";
import { Tables } from "../src/supabase/Database";
import {
    ClientList,
    ClientName,
    CreateButton,
    EstatusForma,
    FiltrosContainer,
    FiltrosLista,
    FlechaAbajo,
    FolioLink,
    LowerActionButtons,
    ModalContainer,
    ModalContentBottom,
    ModalContentTop,
    SearchBar,
    SearchBarForm,
    SearchButton,
    ServiciosContainer,
    ServiciosElement,
    ServiciosElement1,
    ServiciosElement2,
    ServiciosElement3,
    ServiciosElement4,
    ServiciosElement5,
    ServiciosSelectContainer,
    Titulo,
} from "./Servicios";
import PaginationComponent from "./PaginationComponent";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import DelModal from "./DeleteModal";
import { useToast } from "./rehusableComponents/Toast";
import { supabase } from "./utils/ClientSupabase";
import { FiltrosLeft, FiltrosRight } from "./Servicios";

type Cliente = Tables<"Clientes">;
type Empleados = Tables<"Empleados">;

const ClientesElement1 = styled(ServiciosElement1) /*style*/ `
    justify-content: unset;
    justify-content: left;
    &:hover {
        cursor: pointer;
        transform: scale(1.05);
    }
`;
interface empleadosProps {
    organizacion?: string;
}
const Empleados: React.FC<empleadosProps> = props => {
    const [isRotated, setIsRotated] = useState(false);
    const [isRotated2, setIsRotated2] = useState(false);
    const [text, setText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [_, SetClientes] = useState<Cliente[]>([]);
    const [clientId, setClientId] = useState<number | null>();
    const [selectedOptions, setSelectedOptions] = useState(() => {
        return new URLSearchParams(window.location.search).get("estatus") ?? "";
    });
    const [_fetchError] = useState("");
    const [barraBusqueda, setBarraBusqueda] = useState(() => {
        return new URLSearchParams(window.location.search).get("busqueda") ?? "";
    });
    const [clientesFiltrados] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const p = new URLSearchParams(window.location.search).get("currentPage");
        return p ? Number(p) : 1;
    });
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage: number = 8;
    const [allClientes] = useState<Cliente[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletedEmpleado, setDeletedEmpleado] = useState<any>([]);
    const { showToast } = useToast();
    const [empleados, setEmpleados] = useState<Empleados[]>();
    const [empleadosFijos, setEmpleadosFijos] = useState<Empleados[]>();
    const [estatus, setEstatus] = useState<boolean>();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [swipedItems, setSwipedItems] = useState<{ [key: number]: boolean }>({});
    const [swipeData, setSwipeData] = useState<{
        [key: number]: { startX: number; startY: number; swipeDirection: string };
    }>({});
    const isFirstRender = useRef(true);

    const setQueryParam = (key: string, value: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.replaceState({}, "", url.toString());
    };

    const clearQueryParam = (key: string) => {
        const url = new URL(window.location.href);
        url.searchParams.delete(key);
        window.history.replaceState({}, "", url.toString());
    };

    // const [totalPages, setTotalPages] = useState<number>(1);
    // const [currentPage, setCurrentPage] = useState<number>(1);
    // const [totalPages, setTotalPages] = useState<number>(1);
    // const itemsPerPage: number = 8;

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
        const touch = e.touches[0];
        setSwipeData(prevState => ({
            ...prevState,
            [id]: { startX: touch.clientX, startY: touch.clientY, swipeDirection: "" },
        }));
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - swipeData[id].startX;
        const deltaY = touch.clientY - swipeData[id].startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setSwipeData(prevState => ({
                ...prevState,
                [id]: { ...prevState[id], swipeDirection: deltaX > 0 ? "right" : "left" },
            }));
        } else {
            setSwipeData(prevState => ({
                ...prevState,
                [id]: { ...prevState[id], swipeDirection: deltaY > 0 ? "down" : "up" },
            }));
        }
    };

    const handleTouchEnd = (id: number) => {
        if (swipeData[id].swipeDirection === "left") {
            setSwipedItems(prevState => ({
                ...prevState,
                [id]: true,
            }));
        } else if (swipeData[id].swipeDirection === "right") {
            setSwipedItems(prevState => ({
                ...prevState,
                [id]: false,
            }));
        }
        setSwipeData(prevState => ({
            ...prevState,
            [id]: { ...prevState[id], swipeDirection: "" },
        }));
    };

    const handleSearchChange = (e: any) => {
        const cambio = e.target.value;
        setBarraBusqueda(cambio);
    };

    const handleFiltrosClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = event.currentTarget as HTMLLIElement;
        const { top, left, height } = target.getBoundingClientRect();

        const newPosition = {
            top: top + height + window.scrollY,
            left: left + window.scrollX,
        };
        if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left) {
            setModalVisible(false);
        } else {
            // Otherwise, show the modal at the new position
            setModalPosition(newPosition);
            setModalVisible(true);
        }
    };

    const handleRotation = () => {
        setText("Estatus");

        setIsRotated(prev => !prev);
    };

    const handleRotation2 = () => {
        setText("Puesto");

        setIsRotated2(prev => !prev);
    };
    const handleRotation3 = async () => {
        await setText("limpiar");

        setIsRotated2(prev => !prev);
    };

    const returnRotation = () => {
        if (text !== "Estatus") {
            setIsRotated(false);
        }
        if (text !== "Puesto") {
            setIsRotated2(false);
        }
    };

    const handleModalCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSelectedOptions(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        filtrarEmpleadosFromUrl();
    }, []);

    const FetchEmpleados = async () => {
        clearQueryParam("estatus");
        clearQueryParam("puesto");
        if (barraBusqueda) {
            setQueryParam("busqueda", barraBusqueda);
        } else {
            clearQueryParam("busqueda");
        }

        if (barraBusqueda === "") {
            const { data: empleado, count } = await supabase
                .from("Empleados")
                .select("*", { count: "exact" })
                .filter("organizacion", "eq", props.organizacion);
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);
            if (empleado) {
                setEmpleados(empleado);
                setEmpleadosFijos(empleado);
            }
            return;
        }
        try {
            let query = supabase
                .from("Empleados")
                .select("*", { count: "exact" }) // Include count for pagination
                .filter("organizacion", "eq", props.organizacion)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            // If search bar has input, modify query before awaiting execution
            if (barraBusqueda) {
                query = query.or(`nombre.ilike.%${barraBusqueda}%`);
            }

            // Await execution after the query is fully built
            const { data, error, count } = await query;

            if (error) {
                console.log("Error consiguiendo los datos del cliente", error);
                setEmpleados([]);
                return;
            }

            if (data) {
                setEmpleados(data);
                setEmpleadosFijos(data);
                console.log("jeronimo");

                // Set total pages if count is available
                if (count !== null && count !== undefined) {
                    setTotalPages(Math.ceil(count / itemsPerPage));
                }
            }
        } catch (err) {
            console.log("Ocurrió un error al realizar la operacó", err);
        }
    };

    const filtrarEmpleadosFromUrl = async () => {
        const params = new URLSearchParams(window.location.search);
        const estatusParam = params.get("estatus");
        const puestoParam = params.get("puesto");
        const busquedaParam = params.get("busqueda");
        const pageParam = params.get("currentPage");
        const page = pageParam ? Number(pageParam) : currentPage;

        try {
            let query = supabase
                .from("Empleados")
                .select("*", { count: "exact" })
                .filter("organizacion", "eq", props.organizacion)
                .range((page - 1) * itemsPerPage, page * itemsPerPage);

            if (estatusParam) {
                query = query.eq("activo", estatusParam);
            } else if (puestoParam) {
                query = query.eq("puesto", puestoParam);
            } else if (busquedaParam) {
                query = query.or(`nombre.ilike.%${busquedaParam.trimEnd()}%`);
            }

            const { data, count } = await query;
            const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
            setTotalPages(totalPages);

            if (data) {
                setEmpleados(data);
                setEmpleadosFijos(data);
            }
        } catch (error) {
            console.log("Error restaurando filtros desde URL", error);
        }
    };

    const filtrarEmpleados = async () => {
        let filtroQuery = "";
        let parametros = "";

        switch (text) {
            case "Estatus":
                filtroQuery = "activo";
                parametros = selectedOptions;
                setBarraBusqueda("");
                clearQueryParam("busqueda");
                clearQueryParam("puesto");
                if (selectedOptions) setQueryParam("estatus", selectedOptions);
                break;

            case "Puesto":
                console.log("Pipip");
                filtroQuery = "puesto";
                parametros = selectedOptions;
                setBarraBusqueda("");
                clearQueryParam("busqueda");
                clearQueryParam("estatus");
                if (selectedOptions) setQueryParam("puesto", selectedOptions);
                break;

            case "limpiar":
                filtroQuery = "";
                parametros = "";
                break;
            default:
                filtroQuery = "";
                parametros = "";
                break;
        }

        try {
            let query = supabase
                .from("Empleados")
                .select("*", { count: "exact" })
                .filter("organizacion", "eq", props.organizacion)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            if (filtroQuery && parametros !== null) {
                query = query.eq(filtroQuery, parametros);
            }

            const { data: empleado, count } = await query;
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);
            console.log(empleado);
            if (empleado) {
                setEmpleados(empleado);
                setModalVisible(false);
            }
        } catch (error) {
            console.log("Error al filtrar los clientes ", error);
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (currentPage > 1) setQueryParam("currentPage", currentPage.toString());
        else clearQueryParam("currentPage");
        filtrarEmpleadosFromUrl();
    }, [currentPage]);

    useEffect(() => {
        returnRotation();
        console.log(clientesFiltrados);
    }, [modalPosition]);

    const handleClientClick = (clienteId: number) => {
        setClientId(clienteId);
        console.log("Clicked client ID:", clienteId);
    };

    const getClientNameStyle = (clienteId: number) => ({
        backgroundColor: clientId === clienteId ? "#d3c7e9" : "white",
        cursor: "pointer", // Optional: add a pointer cursor for better UX
    });

    const handleModalClose = () => {
        setDeleteModalVisible(false);
    };

    const deleteClienteHandler = (empleado: any) => {
        setDeletedEmpleado(empleado);
        setDeleteModalVisible(true);
    };

    const deleteEmpleado = async (empleadoId: number) => {
        try {
            const { error } = await supabase
                .from("Empleados")
                .delete()
                .eq("id", empleadoId)
                .eq("organizacion", props.organizacion ?? "");

            if (error) {
                console.log("There was an error ", error);
                return false;
            }
            return true;
        } catch (err) {
            return false;
        }
    };

    useEffect(() => {
        if (!modalVisible) {
            setIsRotated(false);
            setIsRotated2(false);
        }
    }, [modalVisible]);

    return (
        <>
            {deleteModalVisible && (
                <DelModal
                    closeModal={handleModalClose}
                    nombre={deletedEmpleado?.nombre}
                    puesto={deletedEmpleado?.puesto}
                    del={async () => {
                        const success = await deleteEmpleado(deletedEmpleado.id);
                        if (success) {
                            showToast("Empleado eliminado correctamente", "success");
                            FetchEmpleados();
                            setDeleteModalVisible(false);
                        } else {
                            showToast("Error al eliminar el empleado", "error");
                        }
                    }}
                    titulo="¿Seguro quiere eliminar al empleado?"
                    btnText="Eliminar Empleado"
                ></DelModal>
            )}

            <ServiciosContainer>
                <Titulo>Empleados</Titulo>
                <SearchBarForm>
                    <SearchBar
                        type="text"
                        name="barra"
                        onChange={handleSearchChange}
                        value={barraBusqueda}
                        placeholder=" 🔍 Nombre..."
                    />
                    <SearchButton
                        type="button"
                        onClick={() => {
                            FetchEmpleados();
                            setModalVisible(false);
                        }}
                    >
                        Buscar
                    </SearchButton>
                </SearchBarForm>
                <FiltrosContainer>
                    <FiltrosLeft>
                        <FiltrosLista
                            onClick={(event: any) => {
                                handleFiltrosClick(event);
                                handleRotation();
                            }}
                        >
                            Estatus <FlechaAbajo className={isRotated ? "rotated" : ""} />{" "}
                        </FiltrosLista>
                        <FiltrosLista
                            onClick={(event: any) => {
                                handleFiltrosClick(event);
                                handleRotation2();
                            }}
                        >
                            Puesto <FlechaAbajo className={isRotated2 ? "rotated2" : ""} />
                        </FiltrosLista>
                        {modalVisible && (
                            <ModalContainer
                                open={modalVisible}
                                style={{ top: modalPosition.top, left: modalPosition.left }}
                            >
                                {text === "Estatus" && (
                                    <>
                                        <ModalContentTop open={modalVisible}>
                                            <EstatusForma>
                                                <div className="optionsContainer" id="realizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="residencial"
                                                        name="choice"
                                                        value="TRUE"
                                                        onChange={e => {
                                                            handleModalCheck(e);
                                                        }}
                                                    />
                                                    <label id="realizado2" htmlFor="residencial">
                                                        Activo
                                                    </label>
                                                </div>
                                                <div className="optionsContainer" id="noRealizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="industrial"
                                                        name="choice"
                                                        value="FALSE"
                                                        onChange={e => {
                                                            handleModalCheck(e);
                                                        }}
                                                    />
                                                    <label id="noRealizado2" htmlFor="industrial">
                                                        Inactivo
                                                    </label>
                                                </div>
                                            </EstatusForma>
                                        </ModalContentTop>
                                        <ModalContentBottom open={modalVisible}>
                                            <div className="filtroActionButtons">
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="limpiar"
                                                    onClick={() => {
                                                        clearQueryParam("estatus");
                                                        clearQueryParam("busqueda");
                                                        FetchEmpleados().then(() => {
                                                            setCurrentPage(1);
                                                            setModalVisible(false);
                                                        });
                                                    }}
                                                >
                                                    Limpiar
                                                </button>
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="aplicar"
                                                    type="button"
                                                    onClick={() => {
                                                        filtrarEmpleados().then(() => {
                                                            setCurrentPage(1);
                                                            setIsRotated(false);
                                                        });
                                                    }}
                                                >
                                                    Aplicar
                                                </button>
                                            </div>
                                        </ModalContentBottom>
                                    </>
                                )}
                                {text === "Puesto" && (
                                    <>
                                        <ModalContentTop open={modalVisible}>
                                            <EstatusForma>
                                                {empleadosFijos
                                                    ?.filter(
                                                        (empleado, index, self) =>
                                                            index === self.findIndex(e => e.puesto === empleado.puesto) // Ensure unique puesto
                                                    )
                                                    .map(empleado => (
                                                        <div
                                                            className="optionsContainer"
                                                            id="realizadoContainer"
                                                            key={empleado.id}
                                                        >
                                                            {" "}
                                                            {/* Add a unique key prop */}
                                                            <input
                                                                type="radio"
                                                                className="checked"
                                                                id={`residencial-${empleado.id}`}
                                                                name="choice"
                                                                value={empleado?.puesto as string}
                                                                onChange={e => {
                                                                    handleModalCheck(e);
                                                                }}
                                                            />
                                                            <label
                                                                id="realizado2"
                                                                htmlFor={`residencial-${empleado.id}`}
                                                            >
                                                                {empleado.puesto}
                                                            </label>
                                                        </div>
                                                    ))}
                                            </EstatusForma>
                                        </ModalContentTop>
                                        <ModalContentBottom open={modalVisible}>
                                            <div className="filtroActionButtons">
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="limpiar"
                                                    onClick={() => {
                                                        clearQueryParam("puesto");
                                                        clearQueryParam("busqueda");
                                                        FetchEmpleados().then(() => {
                                                            setCurrentPage(1);
                                                            setModalVisible(false);
                                                        });
                                                    }}
                                                >
                                                    Limpiar
                                                </button>
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="aplicar"
                                                    onClick={() => {
                                                        filtrarEmpleados().then(() => {
                                                            setCurrentPage(1);
                                                            setIsRotated2(false);
                                                        });
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
                    </FiltrosLeft>
                    {screenWidth >= 900 && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <CreateButton style={{ position: "relative", width: "9.65rem" }} to="/nuevo-empleado">
                                Nuevo Empleado
                            </CreateButton>
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </FiltrosContainer>
                {screenWidth < 900 && (
                    <FiltrosRight>
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </FiltrosRight>
                )}
            </ServiciosContainer>
            <ServiciosSelectContainer>
                {empleados?.map(empleado => (
                    <ServiciosElement
                        key={empleado?.id}
                        onTouchStart={(e: any) => handleTouchStart(e, empleado.id)}
                        onTouchMove={(e: any) => handleTouchMove(e, empleado.id)}
                        onTouchEnd={() => handleTouchEnd(empleado.id)}
                    >
                        <ClientesElement1
                            style={{
                                minWidth: screenWidth >= 900 ? "15%" : "55%",
                                maxWidth: screenWidth >= 900 ? "25%" : "60%",
                            }}
                        >
                            <FolioLink
                                to={`${location.pathname}/${empleado.id}`}
                                className="primerSector"
                                style={
                                    screenWidth < 900
                                        ? {
                                              width: "100%",
                                              maxWidth: "100%",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                              textAlign: "left",
                                              paddingLeft: "0.75rem",
                                          }
                                        : {}
                                }
                            >
                                {" "}
                                {empleado.nombre}{" "}
                            </FolioLink>
                        </ClientesElement1>
                        {screenWidth >= 900 && (
                            <ServiciosElement2 style={{ justifyContent: "left" }}>
                                <h3 style={{ alignSelf: "left" }} className="primerSector" id="iconSector">
                                    {" "}
                                    <FaEdit size={20} />
                                </h3>
                            </ServiciosElement2>
                        )}
                        <ServiciosElement3 style={screenWidth < 900 ? { width: "35%", flexShrink: 0 } : {}}>
                            <h3
                                className="primerSector"
                                style={{ fontWeight: "bold", minWidth: "42.67%", textAlign: "left" }}
                            >
                                {" "}
                                {screenWidth < 900 ? "" : "Estatus: "}
                                {empleado.activo ? "Activo" : "Dado de baja"}
                            </h3>
                        </ServiciosElement3>
                        {screenWidth >= 900 && (
                            <ServiciosElement3>
                                <h3
                                    className="primerSector"
                                    style={{ fontWeight: "bold", minWidth: "42.67%", textAlign: "left" }}
                                >
                                    {" "}
                                    Puesto: {empleado?.puesto}
                                </h3>
                            </ServiciosElement3>
                        )}
                        {screenWidth >= 900 && (
                            <ServiciosElement4
                                style={{ flexGrow: "1", justifyContent: "right", paddingRight: "1rem" }}
                                screen_width={screenWidth}
                            >
                                <button
                                    id="borrarServicio"
                                    onClick={() => {
                                        deleteClienteHandler(empleado);
                                    }}
                                    style={{ fontWeight: "bold", fontSize: "105%" }}
                                >
                                    X
                                </button>
                            </ServiciosElement4>
                        )}
                        {screenWidth < 900 && (
                            <ServiciosElement5
                                screen_width={screenWidth}
                                swipeActiator={swipedItems[empleado.id]}
                                onClick={() => {
                                    deleteClienteHandler(empleado);
                                }}
                            >
                                <RiDeleteBin6Line />
                            </ServiciosElement5>
                        )}
                    </ServiciosElement>
                ))}
                {screenWidth < 900 && (
                    <LowerActionButtons>
                        <div
                            style={{
                                width: "100%",
                                height: "2.25rem",
                                margin: "0 auto",
                                position: "relative",
                            }}
                        >
                            <CreateButton to="/nuevo-empleado">Nuevo Empleado</CreateButton>
                        </div>
                    </LowerActionButtons>
                )}
            </ServiciosSelectContainer>
        </>
    );
};

export default Empleados;
