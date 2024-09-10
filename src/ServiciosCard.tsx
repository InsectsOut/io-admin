import { useEffect, useRef, useState } from "react"
//import React from "react";
import styled from "styled-components"
import { IoIosAddCircleOutline } from "react-icons/io";
import { Database, Tables } from "./database-types";
import { FormatoInputs } from "./CreateServiceForm";
import { Titulo } from "./Servicios";
import { createClient } from "@supabase/supabase-js";
import { useLocation, useParams } from 'react-router-dom';
import { FechaInput } from "./CreateServiceForm";
import { DateInput } from "./CreateServiceForm";
import { TimeInput } from "./CreateServiceForm";
import { Horario } from "./CreateServiceForm";
import { FaEdit } from "react-icons/fa";
import { servicioOptions } from "./tipo_servicios";
import Modal from "./ModalComponents";
type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">
import RegistrosCard from "./RegistrosCard";
import { supabase } from "./utils/ClientSupabase";
import { IoDownloadOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


export const CardContainer = styled.div /*style*/`
width: 24.625rem;
min-height:fit-content;
height: 80vh;
background: #F4F4F4;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
border-radius: 0.718rem;
margin-left:5.875rem;
padding-left:1.5rem;
padding-top:.75rem;
display:flex;
flex-direction:column;
gap:1rem;

`
export const CardInputs = styled.input /*style*/ `
width: 19.815rem;
height:2.513rem;
`

export const DetallesTitulo = styled.h1 /*style*/ `
 
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
export const InputsContainer = styled(FormatoInputs) /*style*/ `
flex-direction:column;
display:flex;
justify-content:left;
margin-left:unset;
gap:.25rem;

&.invisible {
    div {
      display: none !important;
    }
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
    height: "2.513rem",
    maxHeight: "2.513rem",
    width: "13.385rem",
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

export const DetailsTitle = styled.h2 /*style*/ `
 
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
}

export const StyledButton = styled.button<StyledButtonProps> /*style*/`
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
`


const ServiciosCardContainer = styled.div /*style*/ `
display:flex;
flex-direction:column;
position: relative;

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
}
`
const AddResponsableCard = styled.div /*style*/ `
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
const TextoAddCard = styled.h1 /*style*/`
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

const PdfMailButotn = styled.div<StyledButtonProps> /*style*/`
  
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
  fontSize:"18px";
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
    const [estatus, setSelectedEstatus] = useState<any>()
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
                const initialEmpleadoId = servicio[0]?.responsable_id ?? null;
                setEmpleadoID(initialEmpleadoId)
                const initialTime = servicio[0]?.horario_servicio ?? '00:00'
                setSelectedTime(initialTime)
                const initialTipoPlaga = servicio[0]?.tipo_plaga_id ?? null;
                setTipoPlaga(initialTipoPlaga)
                setSelectedEstatus(servicio[0]?.realizado)
                setEstatusString(servicio[0]?.realizado ? "Realizado" : "No realizado")
                setClienteId(servicio[0]?.Clientes?.id as number)
                setTipoServicio(servicio[0]?.tipo_servicio as string)
                if (servicio?.[0]?.tipo_plaga_array_id !== null) {
                    setPlagaSelected(() => [...servicio?.[0]?.tipo_plaga_array_id] ?? []);
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
                            responsable_id: empleadoId,
                            realizado: estatus,
                            tipo_plaga_id: tipoPlaga,
                            tipo_plaga_array_id: [...plagaSelected]

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
            setSelectedEstatus(true)

        }
        else if (cambio === "No realizado") {
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
                <CardContainer>
                    <DetallesTitulo>Detalles del Servicio</DetallesTitulo>
                    <InputsContainer>
                        <DetailsTitle>Folio</DetailsTitle>
                        <CardInputs readOnly id="textInputs" className="textInputs"
                            type="text"
                            value={servicios.length > 0 ? servicios[0]?.folio : ""}
                        ></CardInputs>
                    </InputsContainer>
                    <InputsContainer>

                        <DetailsTitle>Nombre</DetailsTitle>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", width: "26.125rem" }}>
                            <select value={clienteId}
                                style={mainStyle}
                                onChange={handleClientClick}
                            >
                                {/* <option  value={servicios[0]?.cliente_id} key={servicios[0]?.cliente_id} >{servicios[0]?.Clientes?.nombre} {servicios[0]?.Clientes?.apellidos}</option> */}

                                {clientes.map((cliente) => (
                                    <option
                                        value={cliente.id} key={cliente.id} >{cliente.nombre} {cliente.apellidos}</option>
                                ))}
                            </select>
                        </div>

                    </InputsContainer>
                    <InputsContainer>
                        <FechaInput>
                            <DetailsTitle >Fecha</DetailsTitle>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexDirection: "row", width: "26.125rem" }}>
                                <DateInput placeholderText={servicios[0]?.fecha_servicio} selected={selectedDate} onChange={(date) => { setSelectedDate(date); setClicked(true) }} dateFormat="YYY/MM/dd" ></DateInput>

                            </div>

                        </FechaInput>
                        <TimeInput
                            style={{ marginTop: "1rem" }}
                        >
                            <DetailsTitle >Horario</DetailsTitle>
                            <Horario

                                type="time"
                                onChange={handleTimeChange}
                                value={
                                    selectedTime?.toString()
                                }
                                step="9000" // Optional: Use a step of 15 minutes (900 seconds)
                            />
                        </TimeInput>
                    </InputsContainer>
                    <InputsContainer style={{ display: "inline-flex", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: ".25rem", width: "50%", flexDirection: "column", }}>
                                <DetailsTitle style={{ width: "100%" }}>Tipo de Servicio</DetailsTitle>
                                <select
                                    style={{ ...mainStyle, width: "10.375rem" }}
                                    value={tipoServicio}
                                    onChange={tipoServicioChange}

                                >

                                    {servicioOptions.map((options) => (
                                        <option

                                            value={options.value} key={options.id} >{options.label}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </InputsContainer>
                    <InputsContainer >

                        <DetailsTitle>Aplicador Responsable</DetailsTitle>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", width: "26.125rem" }}>
                            <select value={empleadoId?.toString()}
                                style={mainStyle}

                                onChange={handleResponsableChange}
                            >
                                <option hidden>Elegir al técnico responsable...</option>
                                {empleados.map((empleado) => (
                                    <option
                                        value={empleado.id} key={empleado.id} >{empleado.nombre}</option>
                                ))}
                            </select>

                        </div>

                    </InputsContainer>
                    <InputsContainer>

                        <DetailsTitle>Estatus</DetailsTitle>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", width: "26.125rem" }}>
                            <select value={estatusString}
                                style={mainStyle}

                                onChange={handleEstatusChange}
                            >
                                <option value={"No realizado"}  >No Realizado</option>
                                <option value={"Realizado"}  >Realizado</option>

                            </select>
                        </div>
                    </InputsContainer>

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

                    <PdfMailButotn
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

                    </PdfMailButotn>
                    <PdfMailButotn
                        posy="12.3125"
                    ></PdfMailButotn>

                </div>



            </ServiciosCardContainer>
            <ReturnButton>Regresar</ReturnButton>
            <StyledButton disabled={!isClicked} clicado={isClicked} onClick={() => { toggleNombreEditable(); updateServicios().then(() => { window.location.reload() }) }}>
                Guardar Cambios
            </StyledButton>
        </>
    )

}

export default ServiciosCard