import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit } from "react-icons/fa";
import { Database, Tables } from "./database-types";
import PaginationComponent from './PaginationComponent';
import { Link, useLocation } from 'react-router-dom';
import { servicioOptions } from "./tipo_servicios";
import DelModal from "./DeleteModal";
import { supabase } from "./utils/ClientSupabase";




type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">

export const ServiciosContainer = styled.div /*style*/ `
width:100vw;
display:flex;
flex-direction:column;
`




export const ModalContainer = styled.div<{ open?: boolean }> /*style*/ `
transition: 125ms  ;
position: absolute;
margin-top: .5rem;
box-sizing: border-box;
width:${props => (props.open ? '273.83px' : '0px')}; 
height:${props => (props.open ? '143px' : '0px')}; 
background: #FFFFFF;
border:${props => (props.open ? '1px solid #CFCACA' : 'none')}; 
box-shadow: 0px 6.08511px 6.08511px rgba(0, 0, 0, 0.25);
border-radius: 7.60638px;



`
export const Titulo = styled.h1 /*style*/ `
 
font-style: normal;
font-weight: 700;
font-size: 2.5rem;
line-height: 3.25rem;
text-align:left;
margin-left:5.875rem;
margin-bottom:0;
color: #0D4E80;
`
export const SearchBarForm = styled.form /*style*/ `
align-self:flex-start;
display:flex;
justify-content:flex-start;
width:100% ;
gap: .5rem;
`
export const FiltrosContainer = styled.ul /*style*/ `
padding: 0;
margin-left:5.875rem;
display:flex;
gap:.5rem;
`
export const FiltrosLista = styled.li /*style*/ `
width: max-content;
padding-left:1rem;
padding-right:1rem;
height: 2.063rem;
background: #6B8AAC;
border-radius: 0.938rem;
 
font-style: normal;
font-weight: 700;
font-size: 1.125rem;
line-height: 1.438rem;
display: flex;
align-items: center;
justify-content:center;
text-align: center;
color: #FFFFFF;
&:hover {
    background-color: #2980b9; 
    transform: scale(1.05); 
    cursor:pointer;
  }
`
export const FlechaAbajo = styled.div /*style*/ `
position: relative;
  width: 2.5rem; /* Adjust the width as needed */
  height: 3.75rem; /* Adjust the height as needed */
  border-bottom: none; /* Remove the border at the bottom to create an open top */

  &::before {
    transition: 125ms linear all;
    content: '';
    position: absolute;
    left: 50%;
   top:1.35rem; /* Adjust the top position to cover the border */
    transform: translateX(-50%);
    width: .5rem; /* Adjust the width of the arrow */
    height: .5rem; /* Adjust the height of the arrow */
    border-left: 3px solid white; /* Change the color as needed */
    border-bottom: 3px solid white; /* Change the color as needed */
    transform: rotate(-45deg);
  }
  &.rotated::before {
    transition: 125ms linear all;
    transform: rotate(135deg);
  }
  &.rotated2::before {
    transition: 125ms linear all;

    transform: rotate(135deg);
  }
  &.rotated3::before {
    transition: 125ms linear all;

    transform: rotate(135deg);
  }
  &.rotated4::before {
    transition: 125ms linear all;
    transform: rotate(135deg);
  }
`

export const SearchBar = styled.input /*style*/ `
/* barra busqueda */
width: 18.104rem;
height: 2.188rem;
border:none;
background: #F0F0F0;
box-shadow: inset 0px 4.82759px 4.82759px rgba(0, 0, 0, 0.25);
border-radius: .375rem;
margin-left:5.875rem;
color:#838383;
`
export const SearchButton = styled.button /*style*/ `
width: 4.5rem;
height: 2.188rem;
background: #0D4E80;
border-radius: .375rem;
 
font-style: normal;
font-weight: 400;
font-size: 0.875rem;
line-height: 0px;
display: flex;
justify-content:center;
align-items:center;
`

export const ModalContentTop = styled.div <{ open?: boolean }> /*style*/ `
height:5.895rem;
width:100%;
border-bottom: 0.095rem solid #E2E2E2;
display: ${props => (props.open ? 'flex' : 'none')};
flex-direction:column;
flex-wrap:wrap;
overflow:scroll;

`

export const EstatusForma = styled.form /*style*/ `
color:black;
font-size:1.141rem;
display:flex;
flex-direction:column;
justify-content:left;
width:100%;
margin-top:.8rem;
gap:.5rem;

.checked{
box-sizing: border-box;
width: 1.141625rem; 
height: 1.141625rem;
border: 0.09508rem solid #E2E2E2; 
border-radius: 50%;
appearance: none; 
&:checked {
  background-color: #A01F27;
    border-color: #E2E2E2;
    cursor: pointer;
  }
}

#realizado2{
 
font-style: normal;
font-weight: 400;
font-size: 1.141rem;
line-height: 24px;
}
#noRealizado2{
font-style: normal;
font-weight: 400;
font-size: 1.141rem;
line-height: 24px;
}
}
.optionsContainer {
gap:.5rem;
display:flex;
margin-left:1rem;
}
`

export const ModalContentBottom = styled.div <{ open?: boolean }> /*style*/ `
transition:1s;
width: ${props => (props.open ? '100%' : 'none')};
height:3.043rem ;
display: ${props => (props.open ? 'flex' : 'none')};
.filtroActionButtons{
width: 100%; 
height: 100%; 
display:flex;
justify-content:right;
align-items:center;

}
.actionButtonsStyles{
  width: 3.993125rem;
height: 1.52125rem;
 
font-style: normal;
font-weight: 400;
font-size: 0.8557rem;
line-height: 1.125rem; 
display:flex;
align-items:center;
justify-content:center;
margin-right:1rem;
}
#limpiar{
  color: #6B8AAC;
  background-color:white;
}
#aplicar{
  background: #6B8AAC;
  border-radius: 0.28524rem; 
}

`

export const StyledDatePicker = styled(DatePicker) /*style*/`
  width: 100%; 
  margin-top: 1rem;
  background:white;
  color:#727272;
  text-align:center;
  border:none;
  font-size:1.25rem;
  margin-top:.25rem;

  &:hover{
    cursor:pointer;
  }
`;


export const ClientList = styled.div /*style*/ `
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ClientName = styled.div /*style*/`
  font-style: normal;
  font-weight: 400;
  font-size: 1.141rem;
  border-bottom: 1px solid #E2E2E2;
  line-height: 24px;
  color:#727272;
  text-align:left;
  padding-left: 1rem;
  &:hover{
  cursor:pointer;
  background-color: #d3c7e9;
    font-size:1.3rem;

  }
`;

export const ServiciosSelectContainer = styled.div /*style*/ `
  width: 82.485625rem; 
  height: 26.22625rem;
  background:white;
  margin-left:5.875rem;
  display:flex;
  flex-direction:column;
  gap:.5rem;
`
export const ServiciosElement = styled.div /*style*/ `
display:flex;
width:100%;
height: 3.35125rem;
background:#F0F0F0;
`
export const ServiciosElement1 = styled.div /*style*/ `
display:flex;
color:#2395FF;
gap:2rem;
width:37%;
height: 3.35125rem;
  justify-content:space-between;
  align-items:center;
.primerSector{
font-style: normal;
font-weight: 400;
font-size: 1rem;
padding-right:1rem;
padding-left:1rem;

}
#iconSector{
}

`
export const ServiciosElement2 = styled.div /*style*/ `
display:flex;
align-items:center;
justify-content:center;
width:23%;
height: 3.35125rem;
color:#727272;
.primerSector{
   
font-style: normal;
font-weight: 400;
font-size: 1rem;
padding-right:1rem;
padding-left:1rem;

}
`
export const ServiciosElement3 = styled.div /*style*/ `
display:flex;
justify-content:left;
align-items:center;
width:35%;
height: 3.35125rem;
gap:rem;
color:#727272;

.primerSector{
   
  font-style: normal;
  font-weight: 400;
  font-size: 1rem;
  padding-right:1rem;
  padding-left:1rem;
}
`
export const ServiciosElement4 = styled.div /*style*/ `
display:flex;
justify-content:left;
align-items:center;
width:5%;
height: 3.35125rem;
#borrarServicio{
  all:unset;
  width:2rem;
  height:2rem;
  background:#C1716E;
  border-radius: 50%;
  &:hover{
  cursor: pointer;
  transform:scale(1.15);
  }
}
`

export const CreateButton = styled(Link) /*style*/ `
all:unset;
display:flex;
align-items:center;
justify-content:center;
width: 8.625rem;
min-height:  2.25rem;
height: 2.25rem;
background: #0D4E80;
border-radius: 0.359rem;
 
font-style: normal;
font-weight: 700;
font-size: 1.005rem;
align-self: flex-end;
top: 51rem;
position: absolute;

&:hover{
cursor: pointer;
background-color: #2980b9; 
transform: scale(1.05); 
color:white;
}
`
export const FolioLink = styled(Link) /*style*/ `
all:unset;
&:hover{
cursor: pointer;
transform: scale(1.05); 
}
`

type QueryType = "Cliente" | "Tipo" | "fecha" | "estatus" | "";

export const Servicios = () => {
  type TipoFiltro = "nombres" | "folio" | "";



  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [isRotated2, setIsRotated2] = useState(false);
  const [isRotated3, setIsRotated3] = useState(false);
  const [isRotated4, setIsRotated4] = useState(false);
  const [text, setText] = useState<QueryType>("");
  const [selectedDate, setSelectedDate] = useState<null | Date>(null);
  const today = new Date();
  const [_fetchError, setFetchError] = useState("");
  const [barraBusqueda, setBarraBusqueda] = useState("");
  const [condicion, setCondicion] = useState<TipoFiltro>("");
  const [filtros, setFiltros] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("")
  const [estatus, setEstatus] = useState<boolean | null>(null)
  const [clientId, setClientId] = useState(0)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage: number = 8;
  const [aplicar, setAplicar] = useState(true)
  const [paginasNofilter, setPaginasNoFilter] = useState<number | null>()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deletedServicio, setDeletedServicio] = useState<any>([])
  const [textModal, setTextModal] = useState<QueryType>()

  type ServicioConClientes = Servicio & {
    Clientes: Cliente | null
  };

  const handleModalCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value === "Realizado") {
      setEstatus(true)
    }
    else if (value === "Norealizado") {
      setEstatus(false)
    }
    setSelectedOptions(value);
  }

  const deleteServicioHandler = async (servicio: any) => {
    setDeletedServicio(servicio)
    console.log("deleted", deletedServicio)
  }

  const [servicios, setServicios] = useState<ServicioConClientes[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])


  const handleSearchChange = (e: any) => {
    const cambio = e.target.value
    setBarraBusqueda(cambio)
  }


  const fetchServicios = async () => {
    setText("");

    if (barraBusqueda === "") {
      const { count } = await supabase
        .from("Servicios")
        .select("id", { count: "exact" })
      // setPaginasNoFilter(count)


      // Calculate the total number of pages
      const totalPages = count && Math.ceil(count / itemsPerPage);
      setTotalPages(totalPages || 0);
    }



    try {
      let query = supabase
        .from("Servicios")
        .select(`*, Clientes!inner(*)`, { count: "exact" })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      if (barraBusqueda !== "") {
        query = isNaN(parseInt(barraBusqueda))
          ? query.ilike("Clientes.nombre", `%${barraBusqueda}%`)
          : query.eq("folio", `${barraBusqueda}`);
      }

      const { error, data: servicios, count } = await query;
      const totalPages = count && Math.ceil(count / itemsPerPage);
      setTotalPages(totalPages || 0);

      if (error) {
        setFetchError("No se pudieron conseguir los datos de servicio");
        setServicios([]);
        console.error("Error fetching data:", error);
      }

      if (servicios) {

        setServicios(servicios);
        setFetchError("");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }
  const fetchConteo = async () => {

    const { count } = await supabase
      .from("Servicios")
      .select("id", { count: "exact" });
    setPaginasNoFilter(() => count)


    // Calculate the total number of pages
    //const totalPages = count && Math.ceil(count / itemsPerPage);
    //setTotalPages(totalPages || 0);


    try {

    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filterServicios = async () => {
    let filtroQuery = "";
    let paramteros = null;

    switch (text) {
      case "Cliente":
        filtroQuery = "Clientes.id";
        paramteros = clientId;
        break;
      case "Tipo":
        filtroQuery = "tipo_servicio";
        paramteros = selectedOptions;
        break;
      case "fecha":
        // Additional logic for filtering by fecha (if needed)
        break;
      case "estatus":
        filtroQuery = "realizado";
        paramteros = estatus;
        break;
      default:
        filtroQuery = "";
        paramteros = null;
        break;
    }

    try {
      let query = supabase
        .from("Servicios")
        .select(`*, Clientes!inner(*)`, { count: "exact" })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

      if (filtroQuery && paramteros !== null) {
        query = query.eq(filtroQuery, paramteros);
      }

      const { error, data: servicios, count } = await query;

      const totalPages = count && Math.ceil(count / itemsPerPage);
      setTotalPages(totalPages || 0);

      if (error) {
        setFetchError("No se pudieron conseguir los datos de servicio");
        setServicios([]);
        console.error("Error fetching data:", error);
      }

      if (servicios) {
        setServicios(servicios);
        setFetchError("");
      }
      setModalVisible(false);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };


  useEffect(() => {
    filterServicios()
  }, [currentPage])

  const deleteServicio = async (servicioId: number) => {
    try {
      let query = supabase
        .from("Servicios")
        .delete()
        .eq("id", servicioId)


      const { error, data: servicios } = await query

      if (error) {
        console.log("There was an error ", error)
      }
    }
    catch (err) {

    }
  }




  const getClientNameStyle = (clienteId: number) => ({
    backgroundColor: clientId === clienteId ? '#d3c7e9' : 'white',
    cursor: 'pointer', // Optional: add a pointer cursor for better UX
  });

  const handleClientClick = (clienteId: number) => {
    setClientId(clienteId);

  };

  useEffect(() => {

    const fetchClientes = async () => {
      try {

        const { data, error } = await supabase
          .from("Clientes")
          .select("*");

        if (error) {
          setClientes([])
          console.log("Error consiguiendo los datos del cliente", error)
        }
        if (data) {
          setClientes(data)
        }

      }
      catch (err) {
        console.log("Ocurrió un error al realizar la operacó", err)
      }
    }
    fetchClientes()
  }, [])

  const handleFiltrosClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const target = event.currentTarget as HTMLLIElement;
    const { top, left, height } = target.getBoundingClientRect();


    const newPosition = {
      top: top + height + window.scrollY,
      left: left + window.scrollX
    };

    // If the modal is currently visible and the same element is clicked, hide the modal
    if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left) {
      setModalVisible(false);
    } else {
      // Otherwise, show the modal at the new position
      setModalPosition(newPosition);
      setModalVisible(true);
    }
  };

  const returnRotation = () => {
    if (textModal !== "Cliente") {
      setIsRotated(false)
    }
    if (textModal !== "Tipo") {
      setIsRotated2(false)
    }
    if (textModal !== "fecha") {
      setIsRotated3(false)
    }
    if (textModal !== "estatus") {
      setIsRotated4(false)
    }
  }



  useEffect(() => {
    returnRotation()
  }, [modalPosition])



  const handleRotation = () => {
    setTextModal("Cliente")

    setIsRotated((prev) => !prev);
  }
  const handleRotation2 = () => {
    // setText("Tipo")
    setTextModal("Tipo")

    setIsRotated2((prev) => !prev);
  }
  const handleRotatio3 = () => {
    // setText("fecha")
    setTextModal("fecha")
    setIsRotated3((prev) => !prev);
  }
  const handleRotatio4 = () => {
    //  setText("estatus")
    setTextModal("estatus")
    setIsRotated4((prev) => !prev);
  }

  const handlePageSetter = async () => {
    //await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second
    setCurrentPage(1);
  }

  const handleClearSelection = () => {
    document.querySelectorAll<HTMLInputElement>('div.optionsContainer input[type="radio"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    setSelectedOptions("")
    setEstatus(null)
  }

  const handleModalClose = () => {
    setDeleteModalVisible(false)
  }



  return (
    <>

      {deleteModalVisible && deletedServicio && (
        <DelModal
          closeModal={handleModalClose}
          folio={deletedServicio?.folio}
          nombre={deletedServicio?.Clientes.nombre}
          apellido={deletedServicio?.Clientes.apellidos}
          fecha={deletedServicio?.fecha_servicio}
          del={() => {
            deleteServicio(deletedServicio?.id).then(() => window.location.reload());
          }}
          titulo="¿Seguro quiere eliminar el servicio?"
          btnText="Eliminar Servicio"
        ></DelModal>
      )}

      <ServiciosContainer
      >
        <Titulo
          tabIndex={-1}>
          Servicios
        </Titulo>
        <SearchBarForm>
          <SearchBar
            type="text"
            name="barra"
            onChange={handleSearchChange}
            value={barraBusqueda}
            placeholder=" 🔍 Folio, nombre, fecha..."
          />
          <SearchButton
            type="button"
            onClick={() => { setCondicion("nombres"); fetchServicios(), setModalVisible(false) }}
          >Buscar
          </SearchButton>
        </SearchBarForm>
        <FiltrosContainer>
          <FiltrosLista
            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => { handleFiltrosClick(event); handleRotation(); }}
          >Cliente <FlechaAbajo
              className={isRotated ? "rotated" : ""}
            /> </FiltrosLista>
          <FiltrosLista
            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => { handleFiltrosClick(event); handleRotation2(); }}
          >Tipo de servicio <FlechaAbajo
              className={isRotated2 ? "rotated2" : ""}
            /> </FiltrosLista>
          <FiltrosLista
            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => { handleFiltrosClick(event); handleRotatio3(); }}
          >Fecha <FlechaAbajo
              className={isRotated3 ? "rotated3" : ""}
            /></FiltrosLista>
          <FiltrosLista
            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => { handleFiltrosClick(event); handleRotatio4(); }}
          >Estatus <FlechaAbajo
              className={isRotated4 ? "rotated4" : ""}
            /></FiltrosLista>
          {modalVisible && (
            <ModalContainer
              open={modalVisible}
              style={{ top: modalPosition.top, left: modalPosition.left }}
              ref={modalRef}
            >
              {textModal === "Cliente" && (
                <>
                  <ModalContentTop
                    open={modalVisible}
                  >

                    {clientes && (
                      <ClientList>
                        {clientes
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
                      <button className="actionButtonsStyles" id="limpiar"
                        onClick={() => { setClientId(0) }}
                      >Limpiar</button>
                      <button className="actionButtonsStyles" id="aplicar"
                        onClick={() => {
                          setText("Cliente");
                          filterServicios()
                            .then(() => {
                              handlePageSetter();
                              setIsRotated(false);
                            });
                        }}>Aplicar</button>
                    </div>
                  </ModalContentBottom>
                </>
              )}
              {textModal === "Tipo" && (
                <>
                  <ModalContentTop
                    open={modalVisible}
                  >
                    <EstatusForma>
                      {servicioOptions.map((tipo) =>
                        <div key={tipo.id} className="optionsContainer" id="realizadoContainer">
                          <input type="radio" className="checked" id={tipo.id.toLocaleString()} name="choice" value={tipo.value} onChange={handleModalCheck}
                            checked={selectedOptions === tipo.value}
                          />
                          <label id="realizado2" htmlFor={tipo.id.toLocaleString()}>{tipo.label}</label>
                        </div>
                      )}
                    </EstatusForma>
                  </ModalContentTop>
                  <ModalContentBottom
                    open={modalVisible}
                  >
                    <div className="filtroActionButtons">
                      <button className="actionButtonsStyles" id="limpiar"
                        onClick={() => { handleClearSelection(); }}
                      >Limpiar</button>
                      <button className="actionButtonsStyles" id="aplicar" onClick={() => {
                        setText("Tipo")
                        filterServicios()
                          .then(() => {
                            handlePageSetter();
                            setIsRotated2(false);
                          });
                      }}>Aplicar</button>
                    </div>
                  </ModalContentBottom>
                </>
              )}
              {textModal === "fecha" && (
                <>
                  <ModalContentTop
                    open={modalVisible}
                  >
                    <div>
                      <h2 style={{ color: "#727272", marginBottom: "0" }}>Selecciona una fecha</h2>
                      <StyledDatePicker selected={selectedDate || today} onChange={date => setSelectedDate(date)} dateFormat="YYY/MM/dd" ></StyledDatePicker>
                    </div>

                  </ModalContentTop>
                  <ModalContentBottom
                    open={modalVisible}
                  >
                    <div className="filtroActionButtons">
                      <button className="actionButtonsStyles" id="limpiar">Limpiar</button>
                      <button className="actionButtonsStyles" id="aplicar">Aplicar</button>
                    </div>
                  </ModalContentBottom>
                </>
              )}
              {textModal === "estatus" && (
                <>
                  <ModalContentTop
                    open={modalVisible}
                  >
                    <EstatusForma>
                      <div className="optionsContainer" id="realizadoContainer">
                        <input type="radio" className="checked" id="realizado" name="choice" value="Realizado" onChange={handleModalCheck}
                          checked={estatus as any}
                        />
                        <label id="realizado2" htmlFor="realizado">Realizado</label>
                      </div>
                      <div className="optionsContainer" id="noRealizadoContainer">
                        <input type="radio" className="checked" id="no-realizado" name="choice" value="Norealizado" onChange={handleModalCheck}
                          checked={!estatus && estatus !== null as any}
                        />
                        <label id="noRealizado2" htmlFor="no-realizado">No realizado </label>
                      </div>
                    </EstatusForma>
                  </ModalContentTop>
                  <ModalContentBottom
                    open={modalVisible}
                  >
                    <div className="filtroActionButtons">
                      <button className="actionButtonsStyles" id="limpiar"
                        onClick={() => { handleClearSelection() }}
                      >Limpiar</button>
                      <button className="actionButtonsStyles" id="aplicar" onClick={() => {
                        setText("estatus")
                        filterServicios()
                          .then(() => {
                            handlePageSetter();
                            setIsRotated4(false);
                          });
                      }}>Aplicar</button>
                    </div>
                  </ModalContentBottom>
                </>
              )}
            </ModalContainer>
          )}
        </FiltrosContainer>
        <ServiciosSelectContainer>
          {servicios.map((servicio) => (
            <ServiciosElement
              key={servicio.id}
            >

              <ServiciosElement1 style={{ textAlign: "left" }}>
                <FolioLink className="primerSector" style={{ minWidth: "28.6%", maxHeight: "3.351rem", maxWidth: "28.6%", textAlign: "left", marginLeft: "1rem" }} to={`${location.pathname}/${servicio.folio}`}>
                  #Folio: {servicio.folio}
                </FolioLink>
                <div
                  style={{ textAlign: "left", padding: "0", display: "flex", justifyContent: "left", width: "50%" }}
                >
                  <FolioLink
                    to={`/Clientes/${servicio?.Clientes?.id}`} style={{ textAlign: "left", padding: "0", display: "flex", justifyContent: "left" }} className="primerSector"> {servicio?.Clientes?.nombre} {servicio?.Clientes?.apellidos} </FolioLink>
                </div>
                <h3 className="primerSector" id="iconSector" > <FaEdit /></h3>
              </ServiciosElement1>
              <ServiciosElement2>
                <h3 className="primerSector"
                  style={{ fontWeight: "bold" }}
                >Fecha: </h3>
                <h3 className="primerSector">{servicio.fecha_servicio} </h3>
              </ServiciosElement2>
              <ServiciosElement3>
                <h3 className="primerSector"
                  style={{ fontWeight: "bold", minWidth: "42.67%", textAlign: "left" }}
                >  Estatus : {servicio.realizado ? 'Realizado' : 'No realizado'}
                </h3>
                <h3 className="primerSector"> {servicio.tipo_servicio}</h3>
              </ServiciosElement3>
              <ServiciosElement4>
                <button id="borrarServicio"
                  // onClick={() =>
                  //   {deleteServicio(servicio.id).then(()=>{window.location.reload()}) }}
                  // onClick={() => {setDeleteModalVisible(true),setDeletedServicio(servicio)}}
                  onClick={() => { deleteServicioHandler(servicio).then(() => { setDeleteModalVisible(true) }) }}
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

          <CreateButton to="/nuevo-servicio" >Nuevo Servicio</CreateButton>

        </ServiciosSelectContainer>
      </ServiciosContainer>

    </>
  )
}

export default Servicios