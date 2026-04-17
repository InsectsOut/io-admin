import { useEffect, useState } from "react";
import { supabase } from "./utils/ClientSupabase";
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
import { FaEdit, FaTag } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import DelModal from "./DeleteModal";
import { LowerActionButtons, FiltrosRight } from "./Servicios";
import { FiltrosLeft } from "./Servicios";

type Cliente = Tables<"Clientes">;

const ClientesElement1 = styled(ServiciosElement1)`
    justify-content: unset;
    justify-content: left;
    &:hover {
    }
`;
interface clientesProps {
    user_id?: string;
    organizacion?: string;
}

const Clientes: React.FC<clientesProps> = props => {
    const [isRotated, setIsRotated] = useState(false);
    const [isRotated2, setIsRotated2] = useState(false);
    const [text, setText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [clientes, SetClientes] = useState<Cliente[]>([]);
    const [clientId, setClientId] = useState<number | null>();
    const [selectedOptions, setSelectedOptions] = useState("");
    const [_fetchError] = useState("");
    const [barraBusqueda, setBarraBusqueda] = useState("");
    const [clientesFiltrados] = useState<Cliente[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage: number = 8;
    const [allClientes, setAllCliente] = useState<Cliente[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletedClient, setDeletedCliente] = useState<any>([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [swipedItems, setSwipedItems] = useState<{ [key: number]: boolean }>({});
    const [swipeData, setSwipeData] = useState<{
        [key: number]: { startX: number; startY: number; swipeDirection: string };
    }>({});

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
        setText("Cliente");

        setIsRotated(prev => !prev);
    };

    const handleRotation2 = () => {
        setText("Tipo");

        setIsRotated2(prev => !prev);
    };

    const returnRotation = () => {
        if (text !== "Cliente") {
            setIsRotated(false);
        }
        if (text !== "Tipo") {
            setIsRotated2(false);
        }
    };

    const handleModalCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setSelectedOptions(value);
        console.log(selectedOptions);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchClientes = async () => {
        setText("");

        if (barraBusqueda === "") {
            const { count } = await supabase
                .from("Clientes")
                .select("id", { count: "exact" })
                .filter("organizacion", "eq", props.organizacion);
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);
        }
        try {
            let query = supabase
                .from("Clientes")
                .select("*", { count: "exact" })
                .filter("organizacion", "eq", props.organizacion)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            if (barraBusqueda) {
                const search = barraBusqueda.trimEnd();

                query.or(`apellidos.ilike.%${search}%,nombre.ilike.%${search}%`);

                const { data: cliente, count } = await query;

                if (cliente) {
                    console.log(cliente);
                    SetClientes(cliente);

                    const totalPages = count && Math.ceil(count / itemsPerPage);
                    setTotalPages(totalPages || 0);
                }
            }
            const { data: cliente } = await query;
            if (cliente) {
                SetClientes(cliente);
            }
        } catch (err) {
            console.log("Ocurrió un error al realizar la operacó", err);
        }
    };

    useEffect(() => {
        fetchClientes2();
    }, []);

    const fetchClientes2 = async () => {
        try {
            const { data, error } = await supabase
                .from("Clientes")
                .select("*")
                .filter("organizacion", "eq", props.organizacion);

            if (error) {
                SetClientes([]);
                console.log("Error consiguiendo los datos del cliente", error);
            }
            if (data) {
                // console.log("Recividos datos de clientes");
                setAllCliente(data);
            }
        } catch (err) {
            console.log("Ocurrió un error al realizar la operacó", err);
        }
    };

    const filtrarClientes = async () => {
        let filtroQuery = "";
        let parametros = "" as any;

        switch (text) {
            case "Cliente":
                filtroQuery = "id";
                parametros = clientId;
                setBarraBusqueda("");
                break;

            case "Tipo":
                filtroQuery = "tipo_cliente";
                parametros = selectedOptions;
                setBarraBusqueda("");
                break;

            default:
                filtroQuery = "";
                parametros = null;
                break;
        }

        try {
            let query = supabase
                .from("Clientes")
                .select("*", { count: "exact" })
                .filter("organizacion", "eq", props.organizacion)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            if (filtroQuery && parametros !== null) {
                query = query.eq(filtroQuery, parametros);
            }

            const { data: cliente, count } = await query;
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);

            if (cliente) {
                SetClientes(cliente);
                setModalVisible(false);
            }
        } catch (error) {
            console.log("Error al filtrar los clientes ", error);
        }
    };

    useEffect(() => {
        filtrarClientes();
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

    const deleteClienteHandler = async (cliente: any) => {
        setDeletedCliente(cliente);
        //console.log(servicio)
        console.log("deleted", deletedClient);
    };

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

    const deleteCliente = async (clienteId: number) => {
        try {
            let query = supabase
                .from("Clientes")
                .delete()
                .eq("id", clienteId)
                .eq("organizacion", props.organizacion ?? "");

            const { error, data: clientes } = await query;

            if (error) {
                console.log("There was an error ", error);
                return;
            }
            console.log("cliente eliminado", clientes);
            location.reload();
        } catch (err) {}
    };

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                    folio={deletedClient?.nombre}
                    nombre={deletedClient?.nombre}
                    apellido={deletedClient?.apellidos}
                    fecha={deletedClient?.fecha_servicio}
                    del={() => {
                        deleteCliente(deletedClient.id).then(() => window.location.reload());
                    }}
                    // del={() => deleteCliente(deletedClient?.id)}
                    titulo="¿Seguro quiere eliminar al cliente?"
                    btnText="Eliminar Cliente"
                    tipo={deletedClient?.tipo_cliente}
                ></DelModal>
            )}

            <ServiciosContainer>
                <Titulo>Clientes</Titulo>
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
                            fetchClientes();
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
                            Cliente <FlechaAbajo className={isRotated ? "rotated" : ""} />{" "}
                        </FiltrosLista>
                        <FiltrosLista
                            onClick={(event: any) => {
                                handleFiltrosClick(event);
                                handleRotation2();
                            }}
                        >
                            Tipo de Cliente <FlechaAbajo className={isRotated2 ? "rotated2" : ""} />
                        </FiltrosLista>
                        {modalVisible && (
                            <ModalContainer
                                open={modalVisible}
                                style={{ top: modalPosition.top, left: modalPosition.left }}
                            >
                                {text === "Cliente" && (
                                    <>
                                        <ModalContentTop open={modalVisible}>
                                            {allClientes && (
                                                <ClientList>
                                                    {allClientes
                                                        .slice()
                                                        .sort((a, b) => {
                                                            const nameA = `${a.nombre} ${a.apellidos}`.toUpperCase();
                                                            const nameB = `${b.nombre} ${b.apellidos}`.toUpperCase();
                                                            return nameA.localeCompare(nameB);
                                                        })
                                                        .map(cliente => (
                                                            <ClientName
                                                                key={cliente.id}
                                                                onClick={() => {
                                                                    handleClientClick(cliente.id);
                                                                }}
                                                                style={getClientNameStyle(cliente.id)}
                                                            >
                                                                {cliente.nombre} {cliente.apellidos}
                                                            </ClientName>
                                                        ))}
                                                </ClientList>
                                            )}
                                        </ModalContentTop>
                                        <ModalContentBottom open={modalVisible}>
                                            <div className="filtroActionButtons">
                                                <button className="actionButtonsStyles" id="limpiar">
                                                    Limpiar
                                                </button>
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="aplicar"
                                                    type="button"
                                                    onClick={() => {
                                                        filtrarClientes().then(() => {
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
                                {text === "Tipo" && (
                                    <>
                                        <ModalContentTop open={modalVisible}>
                                            <EstatusForma>
                                                <div className="optionsContainer" id="realizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="residencial"
                                                        name="choice"
                                                        value="Residencial"
                                                        onChange={handleModalCheck}
                                                    />
                                                    <label id="realizado2" htmlFor="residencial">
                                                        Residencial
                                                    </label>
                                                </div>
                                                <div className="optionsContainer" id="noRealizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="industrial"
                                                        name="choice"
                                                        value="Industrial"
                                                        onChange={handleModalCheck}
                                                    />
                                                    <label id="noRealizado2" htmlFor="industrial">
                                                        Industrial
                                                    </label>
                                                </div>
                                                <div className="optionsContainer" id="realizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="comercial"
                                                        name="choice"
                                                        value="Comercial"
                                                        onChange={handleModalCheck}
                                                    />
                                                    <label id="realizado2" htmlFor="comercial">
                                                        Comercial
                                                    </label>
                                                </div>
                                                <div className="optionsContainer" id="noRealizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="gubernamental"
                                                        name="choice"
                                                        value="Gubernamental"
                                                        onChange={handleModalCheck}
                                                    />
                                                    <label id="noRealizado2" htmlFor="gubernamental">
                                                        Gubernamental{" "}
                                                    </label>
                                                </div>
                                                <div className="optionsContainer" id="noRealizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="hoteleria"
                                                        name="choice"
                                                        value="Hotelería"
                                                        onChange={handleModalCheck}
                                                    />
                                                    <label id="noRealizado2" htmlFor="hoteleria">
                                                        Hotelería{" "}
                                                    </label>
                                                </div>
                                                <div className="optionsContainer" id="noRealizadoContainer">
                                                    <input
                                                        type="radio"
                                                        className="checked"
                                                        id="escolar"
                                                        name="choice"
                                                        value="Escolar"
                                                        onChange={handleModalCheck}
                                                    />
                                                    <label id="noRealizado2" htmlFor="escolar">
                                                        Escolar{" "}
                                                    </label>
                                                </div>
                                            </EstatusForma>
                                        </ModalContentTop>
                                        <ModalContentBottom open={modalVisible}>
                                            <div className="filtroActionButtons">
                                                <button className="actionButtonsStyles" id="limpiar">
                                                    Limpiar
                                                </button>
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="aplicar"
                                                    onClick={() => {
                                                        filtrarClientes().then(() => {
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
                            <CreateButton style={{ position: "relative" }} to="/nuevo-cliente">
                                Nuevo Cliente
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
                {clientes.map(cliente => (
                    <ServiciosElement
                        key={cliente.id}
                        onTouchStart={(e: any) => handleTouchStart(e, cliente.id)}
                        onTouchMove={(e: any) => handleTouchMove(e, cliente.id)}
                        onTouchEnd={() => handleTouchEnd(cliente.id)}
                    >
                        <ClientesElement1
                            style={{
                                minWidth: screenWidth >= 900 ? "15%" : "55%",
                                maxWidth: screenWidth >= 900 ? "25%" : "60%",
                            }}
                        >
                            <FolioLink
                                to={`${location.pathname}/${cliente.id}`}
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
                                {cliente.nombre} {cliente.apellidos}{" "}
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
                                {screenWidth < 900 ? <FaTag size={14} /> : "Tipo de Cliente :"} {cliente.tipo_cliente}
                            </h3>
                        </ServiciosElement3>
                        {screenWidth >= 900 && (
                            <ServiciosElement4
                                style={{ flexGrow: "1", justifyContent: "right", paddingRight: "1rem" }}
                                screen_width={screenWidth}
                            >
                                <button
                                    id="borrarServicio"
                                    onClick={() => {
                                        deleteClienteHandler(cliente).then(() => {
                                            setDeleteModalVisible(true);
                                        });
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
                                swipeActiator={swipedItems[cliente.id]}
                                onClick={() => {
                                    deleteClienteHandler(cliente).then(() => {
                                        setDeleteModalVisible(true);
                                    });
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
                            <CreateButton to="/nuevo-cliente">Nuevo Cliente</CreateButton>
                        </div>
                    </LowerActionButtons>
                )}
            </ServiciosSelectContainer>
        </>
    );
};

export default Clientes;
