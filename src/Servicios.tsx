import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit } from "react-icons/fa";
import { Database, Tables } from "../src/supabase/Database";
import PaginationComponent from './PaginationComponent';
import { Link, useLocation } from 'react-router-dom';
import { servicioOptions } from "./tipo_servicios";
import DelModal from "./DeleteModal";
import { supabase } from "./utils/ClientSupabase";
import { BsCalendarDate } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdDoNotDisturb } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";






type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">

export const ServiciosContainer = styled.div /*style*/ `
width:100vw;
display:flex;
flex-direction:column;
@media (max-width: 900px) {
align-items:center;

  }
`
export const LowerActionButtons = styled.div /*style*/ `
width:100% ;
display:flex;
align-items:center;
justify-content:space-between;
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
z-index:999;
.dateFilterInputs{
display:flex;
}
.dateTexts{
color:#0D4E80;
p{
margin:0;
 }
}
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
@media (max-width: 900px) {
  margin-left:0px;
  margin-bottom:1rem;

}
`
export const SearchBarForm = styled.form /*style*/ `
display:flex;
align-self:flex-start;
justify-content:flex-start;
width:100% ;
gap: .5rem;
@media (max-width: 900px) {
  margin-left:0px;
  width:85% ;
align-self:center;

}
`
export const FiltrosContainer = styled.ul /*style*/ `
padding: 0;
margin-left:5.875rem;
display:flex;
gap:.5rem;
justify-content:space-between;
width:85%;
@media (max-width: 900px) {
max-width:900px;
margin-left:0px;
}


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
@media (max-width: 900px) {
  margin-left:0px;
}
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
  width: 95%; 
  margin-top: 1rem;
  background:white;
  color:#727272;
  text-align:center;
  border:none;
  font-size:1rem;
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
  width:85%; 
  height: 26.22625rem;
  background:white;
  margin-left:5.875rem;
  display:flex;
  flex-direction:column;
  gap:.5rem;
  @media (max-width: 900px) {
  margin-left:0px;
}
`
export const ServiciosElement = styled.div /*style*/ `
display:flex;
width:100%;
height: 3.35125rem;
background:#F0F0F0;
position: relative;
`
export const ServiciosElement1 = styled.div<{ screen_width?: number }> /*style*/ `
display:flex;
color:#2395FF;
gap:2rem;
gap:${props => (props.screen_width && props.screen_width >= 900 ? "2rem" : "1rem")};
width:${props => (props.screen_width && props.screen_width >= 900 ? "37%" : "75%")};
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
export const ServiciosElement2 = styled.div<{ screen_width?: number }> /*style*/ `
display:flex;
align-items:center;
justify-content:center;
width:${props => (props.screen_width && props.screen_width >= 900 ? "23%" : "45%")};
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
gap:.5rem;
color:#727272;
h3 {
width:fit-content;
}
.primerSector{
   
  font-style: normal;
  font-weight: 400;
  font-size: 1rem;
  padding-right:1rem;
  padding-left:1rem;
}
`
export const ServiciosElement4 = styled.div<{ screen_width?: number, swipeActiator?: boolean }> /*style*/ `
display:flex;
justify-content:left;
align-items:center;
width:${props => (props.screen_width && props.screen_width >= 900 ? "5%" : "15%")};
height: 3.35125rem;
background:${props => (props.screen_width && props.screen_width >= 900 ? "none" : "red")};
#borrarServicio{
  all:unset;
  display:${props => (props.screen_width && props.screen_width >= 900 ? "block" : "none")};
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
export const ServiciosElement5 = styled.div<{ screen_width?: number, swipeActiator?: boolean }> /*style*/ `
display:flex;
justify-content:center;
align-items:center;
position: absolute;
width: ${(props) => props.swipeActiator ? "15%" : "0"};
height: 3.35125rem;
background:red;
transition:   0.2s ease; /* Animate the right position */
right:0;
 /* Adding border and shadow for sliding effect */
 border-right: ${(props) => (props.swipeActiator ? "4px solid rgba(0, 0, 0, 0.1)" : "none")}; /* Light border when swiped */
  box-shadow: ${(props) => (props.swipeActiator ? "-4px 0 8px rgba(0, 0, 0, 0.2)" : "none")}; /* Shadow to simulate behind effect */
#borrarServicio{
  all:unset;
  display:${props => (props.screen_width && props.screen_width >= 900 ? "block" : "none")};
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
position:absolute; 
font-style: normal;
font-weight: 700;
font-size: 1.005rem;
right:0%;

&:hover{
cursor: pointer;
background-color: #2980b9; 
transform: scale(1.05); 
color:white;
}
@media (max-width: 900px) {

margin-top:3rem;
width:100%;
}

`
export const FolioLink = styled(Link) <{ screen_width?: number, setWidth?: string }> /*style*/ `
width: ${(props) => props.screen_width && props.screen_width > 900 ? "50%" : props.setWidth};
max-width: ${(props) => props.screen_width && props.screen_width > 900 ? "28.6%" : "100%"};
all:unset;
&:hover{
cursor: pointer;
transform: scale(1.05); 
}
`

export const FiltrosLeft = styled.div /*style*/ `
display:flex;
gap:.5rem;
width:100%;
@media (max-width: 900px) {
justify-content:space-between;
}
`
export const FiltrosRight = styled.div /*style*/ `
@media (max-width: 900px) {
width:85%;
}
`

type QueryType = "Cliente" | "Tipo" | "fecha" | "estatus" | "";

interface serviciosProps {
  organizacion?: string;
}

export const Servicios: React.FC<serviciosProps> = (props) => {
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
  const [startDate, setStartDate] = useState<null | Date>(null)
  const [endDate, setEndDate] = useState<null | Date>(null)
  const today = new Date();
  const [_fetchError, setFetchError] = useState("");
  const [barraBusqueda, setBarraBusqueda] = useState("");
  const [condicion, setCondicion] = useState<TipoFiltro>("");
  const [filtros, setFiltros] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string>("")
  const [estatus, setEstatus] = useState<boolean | null>(null)
  const [clientId, setClientId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage: number = 8;
  const [aplicar, setAplicar] = useState(true)
  const [paginasNofilter, setPaginasNoFilter] = useState<number | null>()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deletedServicio, setDeletedServicio] = useState<any>([])
  const [textModal, setTextModal] = useState<QueryType>()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [showSwipeDeleteMenu, setShowSwipeDeleteMenu] = useState<boolean>(false)
  const [swipedItems, setSwipedItems] = useState<{ [key: number]: boolean }>({});
  const [swipeData, setSwipeData] = useState<{ [key: number]: { startX: number, startY: number, swipeDirection: string } }>
    ({});
  const [tipoServicio, setTipoServicio] = useState<string>("")
  const estatusRefRealizado = useRef<HTMLInputElement>(null);
  const estatusRefNorealizado = useRef<HTMLInputElement>(null);




  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
    const touch = e.touches[0];
    setSwipeData((prevState) => ({
      ...prevState,
      [id]: { startX: touch.clientX, startY: touch.clientY, swipeDirection: "" }, // Initialize swipe state for the item
    }));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeData[id].startX;
    const deltaY = touch.clientY - swipeData[id].startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      setSwipeData((prevState) => ({
        ...prevState,
        [id]: { ...prevState[id], swipeDirection: deltaX > 0 ? "right" : "left" }, // Update swipe direction for the specific item
      }));
    } else {
      // Vertical swipe
      setSwipeData((prevState) => ({
        ...prevState,
        [id]: { ...prevState[id], swipeDirection: deltaY > 0 ? "down" : "up" }, // Update swipe direction for the specific item
      }));
    }
  };

  const handleTouchEnd = (id: number) => {
    if (swipeData[id].swipeDirection === "left") {
      console.log("Swiped left");
      setSwipedItems((prevState) => ({
        ...prevState,
        [id]: true, // Mark the item as swiped
      }));
    } else if (swipeData[id].swipeDirection === "right") {
      console.log("Swiped right");
      setSwipedItems((prevState) => ({
        ...prevState,
        [id]: false, // Reset the swipe state for the item
      }));
    }

    // Reset swipe direction for the item
    setSwipeData((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], swipeDirection: "" },
    }));
  };




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
  const handleTipoServicio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTipoServicio(value)
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

  const clearAllFilters = () => {
    setClientId(null)
    setTipoServicio("")
    setStartDate(null)
    setEndDate(null)
    estatusRefRealizado.current && (estatusRefRealizado.current.checked = false);
    estatusRefNorealizado.current && (estatusRefNorealizado.current.checked = false);
  }


  const fetchServicios = async () => {
    setText("");
    clearAllFilters();


    if (barraBusqueda === "") {
      const { count } = await supabase
        .from("Servicios")
        .select("id", { count: "exact" })
        .filter("organizacion", "eq", props.organizacion)
      // setPaginasNoFilter(count)


      // Calculate the total number of pages
      const totalPages = count && Math.ceil(count / itemsPerPage);
      setTotalPages(totalPages || 0);
    }



    try {
      let query = supabase
        .from("Servicios")
        .select(`*, Clientes!inner(*)`, { count: "exact" })
        .filter("organizacion", "eq", props.organizacion)
        .order('fecha_servicio', { ascending: false })
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
  const formatDate = (date: Date) => date.toISOString().split('T')[0];  // For date only (YYYY-MM-DD)


  

  const filterServicios = async () => {
    try {
      let query = supabase
        .from("Servicios")
        .select(`*, Clientes!inner(*)`, { count: "exact" })
        .order("fecha_servicio", { ascending: false })
        .filter("organizacion", "eq", props.organizacion)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

      // Apply multiple filters dynamically
      if (clientId) {
        query = query.eq("Clientes.id", clientId);
      }
      if (tipoServicio !== "") {
        query = query.eq("tipo_servicio", tipoServicio);
      }
      const selectedStatuses: boolean[] = [];
      if (estatusRefRealizado.current?.checked) selectedStatuses.push(true);
      if (estatusRefNorealizado.current?.checked) selectedStatuses.push(false);

      if (selectedStatuses.length > 0) {

        query = query.in("realizado", selectedStatuses); // Allow multiple values
      }
      if (startDate && endDate) {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        query = query.gte("fecha_servicio", formattedStartDate).lte("fecha_servicio", formattedEndDate);
      }
      const { error, data: servicios, count } = await query;

      const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
      setTotalPages(totalPages);

      if (error) {
        setFetchError("No se pudieron conseguir los datos de servicio");
        setServicios([]);
        console.error("Error fetching data:", error);
      } else {
        console.log(servicios)
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
    console.log(target.id)


    const newPosition = {
      top: top + height + window.scrollY,
      left: left + window.scrollX
    };

    // If the modal is currently visible and the same element is clicked, hide the modal
    if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left) {
      setModalVisible(false);
    }
    else if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left - 100) {
      setModalVisible(false);
    }
    else {
      // Otherwise, show the modal at the new position
      if (window.innerWidth <= 900 && target.id === "estatusFilter") {
        newPosition.left -= 100
        console.log(newPosition.left)
        setModalPosition(newPosition);
        setModalVisible(true);
      }
      else {
        setModalPosition(newPosition);
        setModalVisible(true);
      }
    }
  };

  const returnRotation = () => {
    console.log(textModal)
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
    if (!modalVisible) {
      setIsRotated(false)
      setIsRotated2(false)
      setIsRotated3(false)
      setIsRotated4(false)
    }
    else{
      return
    }
   
  }, [modalVisible])

  useEffect(() => {
    returnRotation(); 
  }, [textModal])



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

  const handleSetText = async () => {
    console.log(textModal)
    const text = textModal
    if (textModal) {
      if (text) {
        setText(text)
        filterServicios()
      }
    }

  }

  const handleDelete = (servicio: Servicio) => {
    // Perform the delete action here
    deleteServicioHandler(servicio).then(() => {
      setDeleteModalVisible(true);
    });
  };



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
          <FiltrosLeft >
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
              id="estatusFilter"
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
                            handleSetText()
                              .then(() => {
                                // filterServicios()
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
                            <input type="radio" className="checked" id={tipo.id.toLocaleString()} name="choice" value={tipo.value} onChange={handleTipoServicio}
                              checked={tipoServicio === tipo.value}
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
                          handleSetText()
                            .then(() => {
                              // filterServicios()
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
                        <p style={{ color: "#727272", marginBottom: "0" }}>Selecciona una fecha</p>
                        <div className="dateFilterInputs">
                          <div className="dateTexts">
                            <StyledDatePicker selected={startDate || today} onChange={date => setStartDate(date)} dateFormat="YYY/MM/dd" ></StyledDatePicker>
                            <p>Inicial</p>
                          </div >
                          <div className="dateTexts">
                            <StyledDatePicker selected={endDate || today} onChange={date => setEndDate(date)} dateFormat="YYY/MM/dd" ></StyledDatePicker>
                            <p>Final</p>
                          </div>
                        </div>
                      </div>

                    </ModalContentTop>
                    <ModalContentBottom
                      open={modalVisible}
                    >
                      <div className="filtroActionButtons">
                        <button
                          onClick={() => {
                            setStartDate(new Date());
                            setEndDate(new Date());
                          }}
                          className="actionButtonsStyles"
                          id="limpiar"
                        >
                          Limpiar
                        </button>
                        <button type="button" className="actionButtonsStyles" id="aplicar" onClick={() => {
                          handleSetText()
                            .then(() => {
                              //filterServicios()
                              handlePageSetter();
                              setIsRotated3(false);
                            });
                        }}>Aplicar</button>
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
                          <input ref={estatusRefRealizado} type="radio" className="checked" id="realizado" name="choice" value="Realizado" onChange={handleModalCheck}
                            checked={estatus as any}
                          />
                          <label id="realizado2" htmlFor="realizado">Realizado</label>
                        </div>
                        <div className="optionsContainer" id="noRealizadoContainer">
                          <input ref={estatusRefNorealizado} type="radio" className="checked" id="no-realizado" name="choice" value="Norealizado" onChange={handleModalCheck}
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
                        <button
                          style={{ color: "white" }}
                          className="actionButtonsStyles" id="aplicar" onClick={() => {
                            handleSetText()
                              .then(() => {
                                //filterServicios()
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
          </FiltrosLeft>
          {screenWidth > 900 &&

            <>

              <div style={{ display: "flex", alignItems: "center" }}>

                <CreateButton
                  style={{ position: "relative" }}
                  to="/nuevo-servicio">Nuevo Servicio</CreateButton>

                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange} />
              </div></>
          }
        </FiltrosContainer>
        {screenWidth <= 900 &&
          <FiltrosRight>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </FiltrosRight>
        }
        <ServiciosSelectContainer>


          {servicios
            .map((servicio) => (

              <ServiciosElement
                onTouchStart={(e: any) => handleTouchStart(e, servicio.id)}
                onTouchMove={(e: any) => handleTouchMove(e, servicio.id)}
                onTouchEnd={() => handleTouchEnd(servicio.id)}
                key={servicio.id}
              >

                <ServiciosElement1 style={{ textAlign: "left" }}>
                  <div
                    style={{ textAlign: "left", padding: "0", display: "flex", justifyContent: "left", width: "40%" }}
                  >
                    <FolioLink className="primerSector" style={{ maxHeight: "3.351rem", textAlign: "left" }}
                      setWidth={"85%"}
                      to={`${location.pathname}/${servicio.folio}`}>
                      {screenWidth > 900 ? "#Folio:" : <strong>#</strong>} {servicio.folio}
                    </FolioLink>
                  </div>
                  <div
                    style={{ textAlign: "left", padding: "0", display: "flex", justifyContent: "left", width: "60%" }}
                  >
                    <FolioLink
                      setWidth={"85%"}
                      to={`/Clientes/${servicio?.Clientes?.id}`} style={{ textAlign: "left", padding: "0", display: "flex", justifyContent: "left" }} className="primerSector"> {servicio?.Clientes?.nombre} {servicio?.Clientes?.apellidos} </FolioLink>
                  </div>
                  {screenWidth > 900 &&
                    <h3 className="primerSector" id="iconSector" > <FaEdit /></h3>
                  }
                </ServiciosElement1>
                <ServiciosElement2>
                  <h3 className="primerSector"
                    style={{ fontWeight: "bold" }}
                  >{screenWidth > 900 ? "Fecha" : <BsCalendarDate></BsCalendarDate>} </h3>
                  <h3 className="primerSector">{servicio.fecha_servicio} </h3>
                </ServiciosElement2>
                <ServiciosElement3>
                  <h3 className="primerSector"
                    style={{ fontWeight: "bold", textAlign: "left" }}
                  >  Estatus :
                  </h3>
                  <h3>
                    {servicio.realizado
                      ? (<FaRegCheckCircle color="green" />)
                      : (<MdDoNotDisturb color="red" />)}
                  </h3>
                  {screenWidth > 900 &&
                    <h3 className="primerSector"> {servicio.tipo_servicio}</h3>
                  }
                </ServiciosElement3>
                {screenWidth > 900 &&
                  <ServiciosElement4
                    screen_width={screenWidth}
                  >
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
                }
                {screenWidth < 900 &&
                  <ServiciosElement5
                    screen_width={screenWidth}
                    swipeActiator={swipedItems[servicio.id]}
                    onClick={() => { deleteServicioHandler(servicio).then(() => { setDeleteModalVisible(true) }) }}
                  >
                    <RiDeleteBin6Line />
                    <button id="borrarServicio"
                      // onClick={() =>
                      //   {deleteServicio(servicio.id).then(()=>{window.location.reload()}) }}
                      // onClick={() => {setDeleteModalVisible(true),setDeletedServicio(servicio)}}
                      onClick={() => { deleteServicioHandler(servicio).then(() => { setDeleteModalVisible(true) }) }}
                    >
                      X
                    </button>
                  </ServiciosElement5>
                }
              </ServiciosElement>
            ))}


          {screenWidth < 900 &&
            <LowerActionButtons className="lowerActionButtons">

              <div style={{ width: "85%", height: "2.25rem", position: "absolute", top: "90%", right: "9%" }}>
                <CreateButton to="/nuevo-servicio" >Nuevo Servicio</CreateButton>
              </div>
            </LowerActionButtons>
          }



        </ServiciosSelectContainer>
      </ServiciosContainer>

    </>
  )
}

export default Servicios