import { useEffect, useState } from "react"
import styled from "styled-components"
import { IoIosAddCircleOutline } from "react-icons/io";
import { Tables } from "../src/supabase/Database";
import { FormatoInputs } from "./CreateServiceForm";
import { Titulo } from "./Servicios";
import { useParams } from 'react-router-dom';
import { FechaInput } from "./CreateServiceForm";
import { DateInput } from "./CreateServiceForm";
import { TimeInput } from "./CreateServiceForm";
import { Horario } from "./CreateServiceForm";
import { servicioOptions } from "./tipo_servicios";
import Modal from "./ModalComponents";
import RegistrosCard from "./RegistrosCard";
import { supabase } from "./utils/ClientSupabase";
import { IoDownloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ButtonComponents } from "./EmpleadosCard";
import { CardContainer } from "./rehusableComponents/CardContainer";
import { CardInputs } from "./rehusableComponents/CardInputs";

type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">
type Direcciones = Tables<"Direcciones">

const RegistrosAdd = styled(ButtonComponents)`

`




export const DetallesTitulo = styled.h1`
 
font-style: normal;
font-weight: 700;
font-size: 1.436rem;
line-height: 1.875rem;
display: flex;
align-items: center;
color: #000000;
margin-bottom:unset;
margin-top:0;
`
export const InputsContainer = styled(FormatoInputs)<{flexDir:string}> /*style*/`
flex-direction: ${(props) => props.flexDir ? props.flexDir : "column"};

display:flex;
justify-content:left;
margin-left:unset;
gap:.25rem;
&.invisible {
    div {
      display: none !important;
    }
  }
  @media (max-width: 900px) {
flex-direction: ${(props) => props.flexDir ? props.flexDir : "column"};
} 
`
const iconStyle = {
    backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "100%",
    backgroundPositionY: ".5rem",
};
export const mainStyle = {
    WebkitAppearance: "none", // Hide the default arrow for WebKit browsers (Safari, Chrome)
    MozAppearance: "none", // Hide the default arrow for Mozilla browsers (Firefox)
    appearance: "none", // Hide the default arrow for other browsers

    background: "#FFFFFF",
    color: "#474747",
    height: "42.2px",
    width: "85%",
    border: "0.072rem solid #727272",
    borderRadius: "0.215rem",
    display: "flex",
    alignItems: "center",
    paddingLeft: ".5rem",
    ...iconStyle, // Merge iconStyle into mainStyle
} as any;
export const mainStyleNoArrow = {
    color: "#474747",
    height: "2.513rem",
    maxHeight: "2.513rem",
    width: "13.385rem",
    border: "0.072rem solid #727272",
    borderRadius: "0.215rem",
    display: "flex",
    alignItems: "center",
    paddingLeft: ".5rem",
} as any;

export const DetailsTitle = styled.h2`
 
font-style: normal;
font-weight: 400;
font-size: 1.077rem;
line-height: 1.25rem;
display: flex;
align-items: center;
color: #474747;
margin:unset;
`

type StyledButtonProps = {
    clicado?: boolean
    posy?: string
    position?:string
}

export const StyledButton = styled.button<StyledButtonProps>`
all:unset;
  background-color: ${props => (props.clicado ? '#0D4E80' : 'gray')};
   
  font-weight:bold;
  width:9.62rem;
  position:absolute;
  bottom:0;
  right:0;
  height:2.226rem;
  margin-bottom: .5rem; 
  margin-right: 1rem; 
  font-size:.8rem;
  border-radius:.359rem;
  &:hover{
cursor: pointer;
background-color: ${props => (props.clicado ? '#2980b9' : 'gray')};
transform: ${props => (props.clicado ? 'scale(1.05)' : 'scale(1)')};
}
`
export const ReturnButton = styled.button/*style*/ `
   
  background:none;
  color:#0D4E80;
  font-size:.8rem;
  font-weight:normal;
  position:absolute;
  bottom:0;
  right:12%;
  margin-bottom: .5rem; 
  margin-right: 1rem; 
  left:50%;
`


const ServiciosCardContainer = styled.div /*style*/ `
display:flex;
flex-direction:column;
position: relative;
overflow:visible;


.responsableCard{
display:flex;
width:50%;
justify-content:flex-start;
height:100%;
position:absolute;
flex-direction:row;
top:0;
right:13%;
padding-top:4.925rem;

@media (max-width: 900px) {
display: none;

  }

}
@media (max-width: 900px) {
    align-items:center;
    overflow: hidden;
  }

`
const AddResponsableCard = styled.div`
width: 24.625rem; 
height: 5.875rem; 
background: #FFFFFF;
border: 0.125rem solid #727272; 
border-radius: 0.7179rem; 
display:flex;
justify-content:center;
align-items:center;

:hover{
cursor: pointer;
}
`
const TextoAddCard = styled.h1`
height:min-content;
margin:unset;
 
font-style: normal;
font-weight: 500;
font-size: 1.125rem; /* 18px converted to rem */
line-height: 1.438rem; /* 23px converted to rem */
display: flex;
align-items: center;
text-align: center;
color: #727272;
`;

const PdfMailButton = styled.div<StyledButtonProps>`
  width: 32%; 
  height: 90px; 
  top: 153px;
  background: #F4F4F4;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: .7179rem; 
  position:absolute;
  top:0;
  margin-top: ${props => (`${props.posy}rem`)};
  right:5%;
  border-color:black;

  p{
  font-size:"18px";
  color:#727272;
  font-weight:600;
  }
  p:nth-child(2){
  color:#2395FF;
  margin:0;
  }
  :hover p {
  cursor:pointer;
  }
  @media (max-width: 900px) {
    align-items:center;
  position: ${props => (`${props.position}`)};
  width:100%;
right:0;
  }
`;




const ServiciosCard = () => {
    const [readOnly, setReadOnly] = useState(true);
    const [nombreEditable, setNombreEditable] = useState(true)
    const [fechaEditable, setFechaEditable] = useState(true)
    const { folio } = useParams()
    const [servicios, setServicios] = useState<ServicioConClientes[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const fechaServicioString = servicios.length > 0 ? servicios[0]?.fecha_servicio : '';
    const fechaServicioDate = fechaServicioString ? new Date(fechaServicioString) : null;
    const [selectedTime, setSelectedTime] = useState<string | null>("null");
    const [clienteId, setClienteId] = useState<number>(0)
    const [selectedDate, setSelectedDate] = useState<null | Date>(null)
    const [isClicked, setClicked] = useState<boolean>(false);
    const [fechaIsClicked, setFechaClicked] = useState(false)
    const [servicioOptoins, SetServicioOptions] = useState("")
    const [tipoServicio, setTipoServicio] = useState<string>("")
    const [estatus, setSelectedEstatus] = useState<boolean>()
    const [estatusString, setEstatusString] = useState<string>("")
    const [plagas, setPlagas] = useState<any[]>([])
    const [tipoPlaga, setTipoPlaga] = useState<number | null>(null)
    const [empleados, setEmpleados] = useState<any[]>([])
    const [empleadoId, setEmpleadoID] = useState<number | null>(null)
    const [modalOpen, setModalOpen] = useState<boolean | null>(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [plagaSelected, setPlagaSelected] = useState<number[]>([])
    const [dataFromRegistros, setDataFromRegistros] = useState<number>()
    const navigate = useNavigate()
    const [addButtonClicked, setAddButtonClicked] = useState(false)
    const [direccion_id, setDireccion_id] = useState<string>("")
    const [dirección, setDireccion] = useState<Direcciones[]>([])
    const [infoTab, setInfoTab] = useState<string>("general")
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    type ServicioConClientes = Servicio & {
        Clientes: Cliente | null
    };
    const options = [
        { value: true, label: 'Realizado' },
        { value: false, label: 'No Realizado' },
    ];

    const handleChildData = async (data: number) => {
        setDataFromRegistros(data)
        setAddButtonClicked(false)
    }

    const FetchServicios = async () => {
        try {
            if (!folio) {
                console.log("No matching Folio")
            }
            let query = supabase
                .from("Servicios")
                .select(`*,Clientes!inner(*)`)
                .filter("folio", "eq", `${folio}`)
            const { error, data: servicio } = await query;
            if (servicio) {
                setServicios(servicio)
                const initialDateString = servicio[0]?.fecha_servicio;
                const initialDate = initialDateString ? new Date(initialDateString) : null;
                setSelectedDate(initialDate)
                const initialEmpleadoId = servicio[0]?.aplicador_Responsable ?? null;
                console.log(initialEmpleadoId)
                setEmpleadoID(initialEmpleadoId ?? null)
                const initialTime = servicio[0]?.horario_servicio ?? '00:00'
                setSelectedTime(initialTime)
                const initialTipoPlaga = servicio[0]?.tipo_plaga_id ?? null;
                setTipoPlaga(initialTipoPlaga)
                setSelectedEstatus(servicio[0]?.realizado ?? false)
                setEstatusString(servicio[0]?.realizado ? "Realizado" : "No realizado")
                setClienteId(servicio[0]?.Clientes?.id as number)
                console.log(servicio[0]?.tipo_servicio as string)
                setTipoServicio(servicio[0]?.tipo_servicio as string)
                if (servicio?.[0]?.tipo_plaga_array_id !== null) {
                    setPlagaSelected(() => [...(servicio?.[0]?.tipo_plaga_array_id ?? [])]);
                }
                else {
                    setPlagaSelected([])
                }
            }

        }

        catch (err) {
            console.log("Error fetching servicio")
        }
    }

    const FetchPlagas = async () => {
        try {
            let query = supabase
                .from("Plagas")
                .select("*")
            const { error, data: plaga } = await query;
            if (plaga) {
                setPlagas(plaga)
            }

        }

        catch (err) {
            console.log("Error fetching plagas")
        }
    }
    const FetchEmpleado = async () => {
        try {
            let query = supabase
                .from("Empleados")
                .select("*")
            const { error, data: empleado } = await query;
            if (empleado) {
                setEmpleados(empleado)

            }

        }

        catch (err) {
            console.log("Error fetching plagas")
        }
    }

    const FetchClientes = async () => {
        try {

            let query = supabase
                .from("Clientes")
                .select("*")
            const { error, data: cliente } = await query;
            if (cliente) {
                setClientes(cliente)
            }
        }

        catch (err) {
            console.log("Error fetching Clientes")
        }
    }

    const updateServicios = async () => {

        try {
            const { data, error } = await supabase
                .from("Servicios")
                .update(
                    [
                        {
                            cliente_id: clienteId,
                            fecha_servicio: selectedDate,
                            horario_servicio: selectedTime,
                            tipo_servicio: tipoServicio,
                            aplicador_Responsable: empleadoId ?? null,
                            realizado: estatus,
                            tipo_plaga_id: tipoPlaga,
                            direccion_id: direccion_id


                        },
                    ] as any
                )
                .filter("id", "eq", `${servicios[0].id}`)
            if (error) {
                console.error("Error updating data:", error.message);
            } else {
                console.log("Data updated successfully:", data);
            }
        }
        catch (err) {
            console.log("Error making the update request")
        }
    }



    useEffect(() => {
        FetchEmpleado()
        FetchPlagas()
        FetchClientes()
        FetchServicios()

    }, [])
    useEffect(() => {
        if (clienteId) {
            fetchDireccion(clienteId.toString())
        }
    }, [clienteId])



    const toggleEditable = () => {
        setReadOnly(!readOnly);
    };
    const toggleNombreEditable = () => {
        setNombreEditable(!nombreEditable);
    };
    const toggleFechaEditable = () => {
        setFechaClicked(!fechaIsClicked);
        setFechaEditable(!fechaEditable);
    };
    const handleClientClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        const idSacado = +event.target.value
        setClienteId(idSacado)
    }
    const handleEstatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        const cambio = event.target.value
        setEstatusString(cambio)

        if (cambio === "Realizado") {
            console.log("realizado")
            setSelectedEstatus(true)

        }
        else if (cambio === "No realizado") {
            console.log("norealizado")
            setSelectedEstatus(false)

        }

    }
    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        setSelectedTime(event.target.value);
    };
    const tipoServicioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setTipoServicio(cambio)
    }

    const esRealizado = servicios[0]?.realizado;

    const HandleplagaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        const cambio = +event?.target.value
        setTipoPlaga(cambio)
    }

    const handleResponsableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        setEmpleadoID(+event.target.value)
    }

    const appearModal = () => {
        if (estatusString === "Realizado") {
            setModalOpen(true)

        }
    }

    const closeModal = () => {
        setModalOpen(false)
    }
    type OptionType = {
        value: string | number;
        label: string;
    };

    const loadOptions = (inputValue: any, callback: any) => {

        const options = plagas.map((plaga) => ({
            value: plaga.id,
            label: plaga.plaga,
        }));
        callback(options)
    };

    const handleFiltrosClick = (event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
        const target = event.currentTarget as HTMLSelectElement;
        const { top, left, height } = target.getBoundingClientRect();

        // Adjust the modal position by adding an offset
        const offset = 20; // Adjust this value as needed
        const newPosition = {
            top: top + height + window.scrollY + offset,
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

    const handleSelectedPlaga = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = +event.target.value;

        if (plagaSelected.includes(cambio)) {
            setPlagaSelected(prevState => prevState.filter(item => item !== cambio));
        } else {
            setPlagaSelected(prevState => [...prevState, cambio]);
        }
    }

    const handleClearSelection = () => {
        document.querySelectorAll<HTMLInputElement>('div.optionsContainer input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });
        setPlagaSelected([])
    }
    const handleNavigate = () => {
        navigate(`/Servicios/pdf/${servicios[0].folio}`);
    };

    const handleDireccionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = event.target.value
        setDireccion_id(cambio)

    }

    const fetchDireccion = async (cliente_id: string) => {
        try {
            let query = supabase;
            const { data, error } = await query
                .from("Direcciones")
                .select("*")
                .filter("cliente_id", "eq", cliente_id)
            if (data) {
                setDireccion(data)
                setDireccion_id(data[0]?.id.toString())

            }
            if (error) {
                console.log(error)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const setInfoTag = (event: React.MouseEvent<HTMLDivElement>, tag: string) => {
        setInfoTab(tag);
    }

    const selectTag = (infoTab: string) => {
        return (
            <div className="selectTag">
                <div className="genInfo infoButtons"
                    onClick={(e) => { setInfoTag(e, "general") }}
                    style={{ background: infoTab === "general" ? "white" : "#0D4E80", color: infoTab === "general" ? "#0D4E80" : "white" }}
                ><p>General</p></div>
                <div className="workInfo infoButtons"
                    onClick={(e) => { setInfoTag(e, "registros") }}
                    style={{ background: infoTab === "registros" ? "white" : "#0D4E80", color: infoTab === "registros" ? "#0D4E80" : "white" }}
                ><p>Registros</p></div>
                <div className="workInfo infoButtons"
                    onClick={(e) => { setInfoTag(e, "constancia") }}
                    style={{ background: infoTab === "constancia" ? "white" : "#0D4E80", color: infoTab === "constancia" ? "#0D4E80" : "white" }}
                ><p>Constancia</p></div>
            </div>
        )
    }

    return (
        <>
            {modalOpen && (
                <Modal
                    registroApId={dataFromRegistros}
                    closeModal={closeModal}
                    plagas={plagas}
                    addBtnClicked={addButtonClicked}

                ></Modal>
            )}
            <ServiciosCardContainer  >
                <Titulo>Servicios</Titulo>
                <CardContainer
            
                >
                    <DetallesTitulo>Detalles del Servicio</DetallesTitulo>
                    {selectTag(infoTab)}
                    {(infoTab === "general" || screenWidth > 900) && (
                        <>
                        <div className="detailsContainer">
                            <InputsContainer width={90}>
                                <DetailsTitle>Folio</DetailsTitle>
                                <CardInputs
                                    largo="calc(100%-2px)"
                                    readOnly
                                    type="text"
                                    placeholder={servicios.length > 0 ? servicios[0]?.folio : ""}
                                />
                            </InputsContainer>

                            <InputsContainer width={90}
                            >
                                <DetailsTitle>Nombre</DetailsTitle>

                                <select
                                    value={clienteId}
                                    style={{ ...mainStyle, width: "100%" }}
                                    onChange={handleClientClick}
                                >
                                    {clientes.map((cliente) => (
                                        <option value={cliente.id} key={cliente.id}>
                                            {cliente.nombre} {cliente.apellidos}
                                        </option>
                                    ))}
                                </select>

                            </InputsContainer>

                            <InputsContainer 
                            style={{gap:"1rem", alignItems:"center"}}
                           flexDir={"row"}
                            width={90}>
                                <FechaInput
                                >
                                    <DetailsTitle>Fecha</DetailsTitle>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            flexDirection: "row",
                                            background: "white",
                                            border: "0.071793rem solid #727272",
                                            borderRadius: "0.215rem",
                                        }}
                                    >
                                        <DateInput
                                        //@ts-ignore
                                        wid={"12rem"}
                                            placeholderText={servicios[0]?.fecha_servicio}
                                            selected={selectedDate}
                                            onChange={(date) => {
                                                setSelectedDate(date);
                                                setClicked(true);
                                            }}
                                            dateFormat="YYY/MM/dd"
                                        />
                                    </div>
                                </FechaInput>
                                <TimeInput 
                                marginTop={"0"}
                                marginTopTablet={"0"}
                                style={{width:"100%"}}
                                >
                                    <DetailsTitle>Horario</DetailsTitle>
                                    <Horario
                                    width={"10rem"}
                                        style={{
                                            textAlign: "left",
                                            marginTop:"0",
                                            flexGrow:"1",
                                            padding: "0 2rem 0 .5rem",
                                            display:"flex",
                                            justifyContent:"left"
                                           
                                        }}
                                        type="time"
                                        onChange={handleTimeChange}
                                        value={selectedTime?.toString()}
                                        step="9000" // Optional: Use a step of 15 minutes (900 seconds)
                                    />
                                </TimeInput>
                            </InputsContainer>

                            <InputsContainer width={90}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: ".25rem",
                                            flexDirection: "column",
                                            width: "100%",
                                        }}
                                    >
                                        <DetailsTitle style={{ width: "100%" }}>Dirección</DetailsTitle>
                                        <select
                                            style={{ ...mainStyle, width: "100%" }}
                                            value={direccion_id}
                                            onChange={handleDireccionChange}
                                        >
                                            {dirección.map((options) => (
                                                <option value={options.id} key={options.id}>
                                                    {options.calle} {options.ciudad} {options.colonia}{" "}
                                                    {options.numero_ext} {options.codigo_postal}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </InputsContainer>

                            <InputsContainer width={90}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: ".25rem",
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    <DetailsTitle style={{ width: "100%" }}>
                                        Tipo de Servicio
                                    </DetailsTitle>
                                    <select
                                        style={{ ...mainStyle, width: "100%" }}
                                        value={tipoServicio}
                                        onChange={tipoServicioChange}
                                    >
                                        {servicioOptions.map((options) => (
                                            <option value={options.value} key={options.id}>
                                                {options.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </InputsContainer>

                            <InputsContainer width={90}>
                                <DetailsTitle>Aplicador Responsable</DetailsTitle>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                                    <select
                                        value={empleadoId ?? undefined}
                                        style={{ ...mainStyle, width: "100%" }}
                                        onChange={handleResponsableChange}
                                    >
                                        {!empleadoId && <option>Elegir al técnico responsable...</option>}
                                        {empleados.map((empleado) => (
                                            <option value={empleado.id} key={empleado.id}>
                                                {empleado.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </InputsContainer>

                            <InputsContainer
                                width={90}
                            >
                                <DetailsTitle>Estatus</DetailsTitle>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                                    <select
                                        value={estatusString}
                                        style={{ ...mainStyle, width: "100%" }}
                                        onChange={handleEstatusChange}
                                    >
                                        <option value={"No realizado"}>No Realizado</option>
                                        <option value={"Realizado"}>Realizado</option>
                                    </select>
                                </div>
                            </InputsContainer>
                            </div>
                        </>
                    )}
                    {infoTab === "registros" && (
                        <div>
                            <ButtonComponents
                                background="white"
                                height="3rem"
                                color="#0D4E80"
                                justify="center"
                                gap={1}
                                onClick={() => { setModalOpen(true); setAddButtonClicked(true) }}
                            >
                                <p>Añadir registro</p> <IoIosAddCircleOutline 
                                size={25}
                                />
                            </ButtonComponents>

                            <RegistrosCard
                            sendDataParent={handleChildData}
                            openModal={() => { setModalOpen(true) }}
                            servicioId={servicios[0]?.id}
                        ></RegistrosCard>

                        </div>
                    )}
                    {infoTab === "constancia" && (
                        <div>
                            <PdfMailButton
                        position="relative"
                    >
                        <p>Registro de aplicación</p>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: ".25rem" }}
                            onClick={handleNavigate}
                        >
                            <IoDownloadOutline size={20} color="#2395FF" />
                            <p

                            >Descargar PDF</p>
                        </div>

                    </PdfMailButton>
                        </div>
                    )}
                </CardContainer>

                <div className="responsableCard">
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <AddResponsableCard >
                            <div>
                                <IoIosAddCircleOutline size={30} style={{ color: "black" }}
                                    onClick={() => { setModalOpen(true); setAddButtonClicked(true) }}
                                />
                                <TextoAddCard>Añadir registro</TextoAddCard>
                            </div>
                        </AddResponsableCard>
                        <RegistrosCard
                            sendDataParent={handleChildData}
                            openModal={() => { setModalOpen(true) }}
                            servicioId={servicios[0]?.id}
                        ></RegistrosCard>
                    </div>

                    <PdfMailButton
                        posy="4.925"
                    >
                        <p>Registro de aplicación</p>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: ".25rem" }}
                            onClick={handleNavigate}
                        >
                            <IoDownloadOutline size={20} color="#2395FF" />
                            <p

                            >Descargar PDF</p>
                        </div>

                    </PdfMailButton>
                    <PdfMailButton
                        posy="12.3125"
                    />

                </div>
            </ServiciosCardContainer>
            <ReturnButton
           onClick={() => window.history.back()}
            >Regresar</ReturnButton>
            <StyledButton disabled={!isClicked} clicado={isClicked} onClick={() => { toggleNombreEditable(); updateServicios().then(() => { location.reload() }) }}>
                Guardar Cambios
            </StyledButton>
        </>
    )

}

export default ServiciosCard