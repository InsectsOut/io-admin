import { useEffect, useState } from "react";
import { Tables } from "./database-types";
import { ClientList, ClientName, CreateButton, EstatusForma, FiltrosContainer, FiltrosLista, FlechaAbajo, FolioLink, ModalContainer, ModalContentBottom, ModalContentTop, SearchBar, SearchBarForm, SearchButton, ServiciosContainer, ServiciosElement, ServiciosElement1, ServiciosElement2, ServiciosElement3, ServiciosElement4, ServiciosSelectContainer, Titulo } from "./Servicios";
import PaginationComponent from "./PaginationComponent";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import DelModal from "./DeleteModal";
import { supabase } from "./utils/ClientSupabase";

type Cliente = Tables<"Clientes">
type Empleados = Tables<"Empleados">

const ClientesElement1 = styled(ServiciosElement1)`
justify-content:unset;
justify-content:left;
&:hover{
cursor: pointer;
transform: scale(1.05); 
}
`

const Empleados = () => {
    const [isRotated, setIsRotated] = useState(false);
    const [isRotated2, setIsRotated2] = useState(false)
    const [text, setText] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [_, SetClientes] = useState<Cliente[]>([])
    const [clientId, setClientId] = useState<number | null>()
    const [selectedOptions, setSelectedOptions] = useState("")
    const [_fetchError,] = useState("");
    const [barraBusqueda, setBarraBusqueda] = useState("");
    const [clientesFiltrados,] = useState<Cliente[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const itemsPerPage: number = 8;
    const [allClientes,] = useState<Cliente[]>([])
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deletedEmpleado, setDeletedEmpleado] = useState<any>([])
    const [empleados, setEmpleados] = useState<Empleados[]>()


    // const [totalPages, setTotalPages] = useState<number>(1);
    // const [currentPage, setCurrentPage] = useState<number>(1);
    // const [totalPages, setTotalPages] = useState<number>(1);
    // const itemsPerPage: number = 8;





    const handleSearchChange = (e: any) => {
        const cambio = e.target.value
        setBarraBusqueda(cambio)
    }

    const handleFiltrosClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = event.currentTarget as HTMLLIElement;
        const { top, left, height } = target.getBoundingClientRect();


        const newPosition = {
            top: top + height + window.scrollY,
            left: left + window.scrollX
        };
        if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left) {
            setModalVisible(false);
        } else {
            // Otherwise, show the modal at the new position
            setModalPosition(newPosition);
            setModalVisible(true);
        }
    }

    const handleRotation = () => {
        setText("Cliente")

        setIsRotated((prev) => !prev);
    }

    const handleRotation2 = () => {
        setText("Tipo")

        setIsRotated2((prev) => !prev);
    }


    const returnRotation = () => {
        if (text !== "Cliente") {
            setIsRotated(false)
        }
        if (text !== "Tipo") {
            setIsRotated2(false)
        }
    }

    const handleModalCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setSelectedOptions(value);
        console.log(selectedOptions)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchClientes = async () => {
        setText("")

        if (barraBusqueda === "") {
            const { count } = await supabase
                .from("Clientes")
                .select("id", { count: "exact" });
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);
        }
        try {
            let query = supabase
                .from("Clientes")
                .select("*", { count: "exact" })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            if (barraBusqueda) {
                query.or(`apellidos.ilike.%${barraBusqueda}%,nombre.ilike.%${barraBusqueda}%`)
                const { data: cliente, count } = await query
                if (cliente) {
                    console.log(cliente)
                    SetClientes(cliente);
                    const totalPages = count && Math.ceil(count / itemsPerPage);
                    setTotalPages(totalPages || 0);
                }
            }
            const { data: cliente } = await query
            if (cliente) {
                SetClientes(cliente);
            }
        }

        catch (err) {
            console.log("Ocurrió un error al realizar la operacó", err)
        }
    }

    useEffect(() => {
        FetchEmpleados()
    }, [])

    const FetchEmpleados = async () => {
        try {

            const { data, error } = await supabase
                .from("Empleados")
                .select("*")

            if (error) {
                setEmpleados([])
                console.log("Error consiguiendo los datos del cliente", error)
            }
            if (data) {
                // console.log("Recividos datos de clientes");
                setEmpleados(data)
            }

        }
        catch (err) {
            console.log("Ocurrió un error al realizar la operacó", err)
        }
    }

    const filtrarEmpleados = async () => {

        let filtroQuery = ""
        let parametros = "" as any || ""

        switch (text) {
            case "Cliente":
                filtroQuery = "id"
                parametros = clientId
                setBarraBusqueda("")
                break;

            case "Tipo":
                filtroQuery = "tipo_cliente"
                parametros = selectedOptions
                setBarraBusqueda("")
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
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

            if (filtroQuery && parametros !== null) {
                query = query.eq(filtroQuery, parametros);
            }

            const { data: cliente, count } = await query
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);

            if (cliente) {
                SetClientes(cliente)
                setModalVisible(false)

            }
        }
        catch (error) {
            console.log("Error al filtrar los clientes ", error)
        }
    }

    useEffect(() => {
        filtrarEmpleados()
    }, [currentPage])

    useEffect(() => {
        returnRotation()
        console.log(clientesFiltrados)
    }, [modalPosition])

    const handleClientClick = (clienteId: number) => {
        setClientId(clienteId);
        console.log('Clicked client ID:', clienteId);
    };

    const getClientNameStyle = (clienteId: number) => ({
        backgroundColor: clientId === clienteId ? '#d3c7e9' : 'white',
        cursor: 'pointer', // Optional: add a pointer cursor for better UX
    });

    const handleModalClose = () => {
        setDeleteModalVisible(false)
    }




    const deleteClienteHandler = async (empleado: any) => {
        setDeletedEmpleado(empleado)
        //console.log(servicio)
        console.log("deleted", deletedEmpleado)
    }

    const deleteCliente = async (empleadoId: number) => {
        try {
            let query = supabase
                .from("Empleados")
                .delete()
                .eq("id", empleadoId)

            const { error, data: clientes } = await query

            if (error) {
                console.log("There was an error ", error)
            }

            if (clientes) {
                console.log("Empleado eliminado", clientes)
            }
        }

        catch (err) {

        }
    }

    return (
        <>

            {deleteModalVisible && (
                <DelModal
                    closeModal={handleModalClose}
                    nombre={deletedEmpleado?.nombre}
                    puesto={deletedEmpleado?.puesto}
                    //   del={() => {
                    //     deleteCliente(deletedClient.id).then(() => window.location.reload());
                    //   }}
                    del={() => deleteCliente(deletedEmpleado?.id)}
                    titulo="¿Seguro quiere eliminar al empleado?"
                    btnText="Eliminar Empleado"
                ></DelModal>
            )}

            <ServiciosContainer
            >
                <Titulo>
                    Empleados
                </Titulo>
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
                        onClick={() => { fetchClientes(); setModalVisible(false); }}
                    >Buscar
                    </SearchButton>
                </SearchBarForm>
                <FiltrosContainer>
                    <FiltrosLista
                        onClick={(event: any) => { handleFiltrosClick(event); handleRotation(); }}
                    >Estatus <FlechaAbajo
                            className={isRotated ? "rotated" : ""}

                        /> </FiltrosLista>
                    <FiltrosLista
                        onClick={(event: any) => { handleFiltrosClick(event); handleRotation2(); }}
                    >Puesto <FlechaAbajo
                            className={isRotated2 ? "rotated2" : ""}
                        />
                    </FiltrosLista>
                    {modalVisible && (

                        <ModalContainer
                            open={modalVisible}
                            style={{ top: modalPosition.top, left: modalPosition.left }}

                        >
                            {text === "Cliente" && (
                                <>
                                    <ModalContentTop
                                        open={modalVisible}
                                    >

                                        {allClientes && (
                                            <ClientList>
                                                {allClientes
                                                    .slice()
                                                    .sort((a, b) => {
                                                        const nameA = `${a.nombre} ${a.apellidos}`.toUpperCase();
                                                        const nameB = `${b.nombre} ${b.apellidos}`.toUpperCase();
                                                        return nameA.localeCompare(nameB);
                                                    })
                                                    .map((cliente) => (
                                                        <ClientName key={cliente.id}
                                                            onClick={() => { handleClientClick(cliente.id) }}
                                                            style={getClientNameStyle(cliente.id)}
                                                        >{cliente.nombre
                                                            } {cliente.apellidos}</ClientName>
                                                    ))}
                                            </ClientList>
                                        )}

                                    </ModalContentTop>
                                    <ModalContentBottom
                                        open={modalVisible}
                                    >
                                        <div className="filtroActionButtons">
                                            <button className="actionButtonsStyles" id="limpiar">Limpiar</button>
                                            <button className="actionButtonsStyles" id="aplicar"
                                                type="button"
                                                onClick={() => {
                                                    filtrarEmpleados()
                                                        .then(() => {
                                                            setCurrentPage(1);
                                                            setIsRotated(false);
                                                        });
                                                }}
                                            >Aplicar</button>
                                        </div>
                                    </ModalContentBottom>
                                </>
                            )}
                            {text === "Tipo" && (
                                <>
                                    <ModalContentTop
                                        open={modalVisible}
                                    >
                                        <EstatusForma>
                                            <div className="optionsContainer" id="realizadoContainer">
                                                <input type="radio" className="checked" id="residencial" name="choice" value="Residencial" onChange={handleModalCheck} />
                                                <label id="realizado2" htmlFor="residencial">Residencial</label>
                                            </div>
                                            <div className="optionsContainer" id="noRealizadoContainer">
                                                <input type="radio" className="checked" id="industrial" name="choice" value="Industrial" onChange={handleModalCheck} />
                                                <label id="noRealizado2" htmlFor="industrial">Industrial</label>
                                            </div>
                                            <div className="optionsContainer" id="realizadoContainer">
                                                <input type="radio" className="checked" id="comercial" name="choice" value="Comercial" onChange={handleModalCheck} />
                                                <label id="realizado2" htmlFor="comercial">Comercial</label>
                                            </div>
                                            <div className="optionsContainer" id="noRealizadoContainer">
                                                <input type="radio" className="checked" id="gubernamental" name="choice" value="Gubernamental" onChange={handleModalCheck} />
                                                <label id="noRealizado2" htmlFor="gubernamental">Gubernamental </label>
                                            </div>
                                            <div className="optionsContainer" id="noRealizadoContainer">
                                                <input type="radio" className="checked" id="hoteleria" name="choice" value="Hotelería" onChange={handleModalCheck} />
                                                <label id="noRealizado2" htmlFor="hoteleria">Hotelería </label>
                                            </div>
                                            <div className="optionsContainer" id="noRealizadoContainer">
                                                <input type="radio" className="checked" id="escolar" name="choice" value="Escolar" onChange={handleModalCheck} />
                                                <label id="noRealizado2" htmlFor="escolar">Escolar </label>
                                            </div>
                                        </EstatusForma>
                                    </ModalContentTop>
                                    <ModalContentBottom
                                        open={modalVisible}
                                    >
                                        <div className="filtroActionButtons">
                                            <button className="actionButtonsStyles" id="limpiar">Limpiar</button>
                                            <button className="actionButtonsStyles" id="aplicar" onClick={() => {
                                                filtrarEmpleados()
                                                    .then(() => {
                                                        setCurrentPage(1);
                                                        setIsRotated2(false);
                                                    });
                                            }}>Aplicar</button>
                                        </div>
                                    </ModalContentBottom>
                                </>
                            )}
                        </ModalContainer>
                    )}
                </FiltrosContainer>

            </ServiciosContainer>
            <ServiciosSelectContainer>

                {empleados?.map((empleado) => (
                    <ServiciosElement
                        key={empleado?.id}
                    >

                        <ClientesElement1 style={{ minWidth: "15%", maxWidth: "25%" }}>
                            <FolioLink to={`${location.pathname}/${empleado.id}`} className="primerSector"> {empleado.nombre}  </FolioLink>
                        </ClientesElement1>
                        <ServiciosElement2 style={{ justifyContent: "left" }}>
                            <h3 style={{ alignSelf: "left" }} className="primerSector" id="iconSector" > <FaEdit size={20} /></h3>
                        </ServiciosElement2>
                        <ServiciosElement3>
                            <h3 className="primerSector"
                                style={{ fontWeight: "bold", minWidth: "42.67%", textAlign: "left" }}
                            >  Estatus: {empleado.activo ? "Activo" : "Dado de baja"}
                            </h3>

                        </ServiciosElement3>
                        <ServiciosElement3>
                            <h3 className="primerSector"
                                style={{ fontWeight: "bold", minWidth: "42.67%", textAlign: "left" }}
                            >  Puesto: {empleado?.puesto}
                            </h3>

                        </ServiciosElement3>
                        <ServiciosElement4 style={{ flexGrow: "1", justifyContent: "right", paddingRight: "1rem" }}>
                            <button id="borrarServicio"
                                onClick={() => { deleteClienteHandler(empleado).then(() => { setDeleteModalVisible(true) }) }}
                                style={{ fontWeight: "bold", fontSize: "105%" }}
                            >
                                X
                            </button>
                        </ServiciosElement4>
                    </ServiciosElement>
                ))}
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <CreateButton to="/nuevo-cliente" >Nuevo Empleado</CreateButton>

            </ServiciosSelectContainer>
        </>
    )


}

export default Empleados

