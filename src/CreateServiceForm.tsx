import styled from "styled-components";
import { ServiciosContainer } from "./Servicios";
import { Titulo } from "./Servicios";
import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "./database-types";
import { useEffect, useState } from "react";
import { StyledDatePicker } from "./Servicios";
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
type Cliente = Tables<"Clientes">
type Responsable = Tables<"Responsables">
import { SearchButton } from "./Servicios";




const SearchButtonLink = styled.button /*style*/ `
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
color:white;
&:hover {
    background-color: #2980b9; 
    transform: scale(1.05); 
    cursor:pointer;
    color:white;
  }
`
const CreateFormContainer = styled.div /*style*/ `
background:red;
width: 60.3125%;
background:red;
display:flex;
flex-direction:column;
background: #F3F3F3;
min-height:99vh;
height:fit-content ;
box-shadow: 0px 4px 9.8px rgba(0, 0, 0, 0.25);
`

const CreateContainer = styled(ServiciosContainer) /*style*/ `
.createForm{
align-self:center;
}
`

const FormHeader = styled.div /*style*/ `
width:100%;
height:6.25rem ;
background:#6B8AAC;
color:#FFFFFF;
 
font-style: normal;
font-weight: 500;
font-size: 1.25rem;
line-height: 1.625rem;
border-radius: 5px 5px 0px 0px;
display:flex;
justify-content:center;
align-items:center;
margin-bottom:2rem;
`

const CreateServicioForm = styled.form /*style*/ `
display:flex;
gap:2rem;
flex-direction:column;
color:#474747;
height:99vh;
.formatoInputs{
display:flex;
flex-direction:column;
}
.dateInput{
   display: flex;
   flex-direction:row;
   gap:2rem;
   }
`

export const FormatoInputs = styled.div /*style*/ `
    text-align:left;
    margin-left:6.25rem;
   display:flex;
   flex-direction:column;
   width:12.698rem;
   
   .textInputs{
   all:unset;
   background-image: url('data:image/svg+xml;utf8,<svg fill="%23000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
   display:flex;
   align-items:center;
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:left;
padding-left:.5rem;
color: #838383;
width: 100%;
height: 2.5125rem; 
background: #FFFFFF;
border: 0.071793rem solid #727272; 
border-radius: 0.215379rem; 
   }
   .arrowChange{
   background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: .5rem;
   }
.checked{
background: linear-gradient(180deg, #FFFFFF 0%, #C7C7C7 100%);
border: 1px solid #838383;
width:1rem;
height:1rem;
&:checked {
    border-color: #E2E2E2;
    cursor: pointer;
  }

}
 
`
const FormLabels = styled.label /*style*/ `
 
font-style: normal;
font-weight: 700;
font-size: 1.077rem;
line-height: 1.375rem;
color: #474747;
`

export const DateInput = styled(StyledDatePicker) /*style*/ `
 
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:left;
padding-left:.5rem;
color: #838383;
width: 12.635625rem;
height: 2.5125rem; 
background: #FFFFFF;
border: 0.071793rem solid #727272; 
border-radius: 0.215379rem; 
`
export const Horario = styled.input /*style*/ `
 
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:center;
padding-left:1rem;
color: #838383;
width:6.063rem;
height: 2.5125rem; 
background: #FFFFFF;
border: 0.071793rem solid #727272; 
border-radius: 0.215379rem; 
margin-top: .25rem;
&::-webkit-calendar-picker-indicator{
  filter: invert(100%);
}
`
export const TimeInput = styled.div /*style*/ `
display:flex;
flex-direction:column;

`
export const FechaInput = styled.div /*style*/ `
display:flex;
flex-direction:column;
`


const CreateServiceForm = () => {
    const supabaseUrl = 'https://stnrrgqnedpadgelrkbx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bnJyZ3FuZWRwYWRnZWxya2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUzNDQxNDIsImV4cCI6MjAxMDkyMDE0Mn0.NIEDU3CpqCTJQfGmJInrQc_wYITz2BGSMEF08RL4s6I';
    const supabase = createClient<Database>(supabaseUrl, supabaseKey)
    const [clienteId, setClienteId] = useState<number | undefined>()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [responsableError, setResponsableError] = useState("")
    const [selectedDate, setSelectedDate] = useState<null | Date>(null);
    const today = new Date();
    const [_fetchError, setFetchError] = useState("");
    const [selectedTime, setSelectedTime] = useState<string>('00:00');
    const [responsables, setResponsables] = useState<Responsable[]>([])
    const [nombreCliente, setNombreDelCliente] = useState("")
    const [nombreResponsable, setNombreDelResponsable] = useState("")
    const [url, setUrl] = useState("")
    const [observaciones2, setObservaciones] = useState("")
    const [frecuencia, setFrecuencia] = useState("")
    const [estadoFacturacion, setEstadoFacturacion] = useState("")
    const [tipoServicio, setTipoServicio] = useState("")
    const [responsableId, setResponsableId] = useState<number | undefined>()
    const [ordenDeCommpra, setOrdeDeCompra] = useState("")
    const [servicioFolio, SetServicioFolio] = useState<number | null>(null)
    const [otroSelected, setOtroSelected] = useState<boolean>(true)
    const navigate = useNavigate()

    const fetchResponsables = async () => {
        if (clienteId !== undefined) {
            try {


                if (!clienteId) {
                    console.log("No matching id")
                    console.log(clienteId)
                }
                let query = supabase
                    .from("Responsables")
                    .select()
                    .filter("cliente_id", "eq", `${clienteId}`)

                const { error, data: responsable } = await query;

                if (error) {
                    console.log(error)
                    setResponsables([])
                }
                if (responsable) {
                    setResponsables(responsable)

                }
            }

            catch (err) {
                console.log("Error encontrando a los responsables" + err)
            }
        }
    }


    const fetchClientes = async () => {
        try {
            let query = supabase
                .from("Clientes")
                .select(`*`)

            const { error, data: clientes } = await query;

            if (error) {
                setFetchError("No se pudieron conseguir los datos de servicio");
                setClientes([]);
                console.error("Error fetching data:", error);
            }

            if (clientes) {
                setClientes(clientes);
                setFetchError("");
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    }

    const addServicio = async () => {
        try {
            const { data, error } = await supabase
                .from("Servicios")
                .insert([
                    {
                        cliente_id: clienteId,
                        fecha_servicio: selectedDate,
                        horario_servicio: selectedTime,
                        observaciones: observaciones2,
                        frecuencia_recomendada: frecuencia,
                        direccion_id: 7,
                        orden_compra: ordenDeCommpra,
                        tipo_servicio: tipoServicio,
                        tipo_folio: estadoFacturacion,
                        responsable_id: responsableId,

                    },
                ] as any)
                .select();

            if (error) {
                console.error("Error inserting data:", error.message);
            } else {
                console.log("Data inserted successfully:", data);
                let folio = data[0]?.folio
                if (folio) {

                    navigate(`/Servicios/${folio}`)

                }
                console.log("hola")
                SetServicioFolio(folio)



            }
        } catch (err) {
            console.error("Error adding servicio:", err);
        }
    };

    useEffect(() => {
        fetchClientes()
    }, [])

    useEffect(() => {
        fetchResponsables()
    }, [clienteId])

    const handleClientClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSacado = +event.target.value
        setClienteId(idSacado)
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTime(event.target.value);
    };

    const handleObservacionesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const observacionesChange = event.target.value
        setObservaciones(observacionesChange)
    }

    const handleFrecuenciaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const frecuenciaChange = event.target.value
        if (frecuenciaChange === "Otro") {
            setFrecuencia("")
            setOtroSelected(false)

        }

        setFrecuencia(frecuenciaChange)

    }

    const handleFacturacionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facturaChange = event.target.value
        setEstadoFacturacion(facturaChange)
        console.log(estadoFacturacion)
    }

    const handleTipoServicio = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tipo = event.target.value
        setTipoServicio(tipo)
    }
    const handleResponsableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const responsableChange = +event.target.value
        setResponsableId(responsableChange)

    }

    const handleOrdenCompra = (event: React.ChangeEvent<HTMLInputElement>) => {
        const oCChange = event.target.value
        setOrdeDeCompra(oCChange)

    }

    useEffect(() => {
        setFrecuencia("")
        const otroAlternativeElement = document.getElementById("otroAlternative");
        if (otroAlternativeElement) {
            otroAlternativeElement.focus();
        }
    }, [otroSelected])



    return (
        <CreateContainer>
            <Titulo>Servicios</Titulo>
            <CreateFormContainer className="createForm"><FormHeader>Para registrar un nuevo servicio, complete el siguiente formulario.</FormHeader>
                <CreateServicioForm>
                    <FormatoInputs>
                        <FormLabels >Nombre del Cliente</FormLabels>
                        <select value={clienteId} onChange={handleClientClick} style={{ all: "unset", background: "#FFFFFF", color: "#474747", height: "2.513rem", width: "12.635625rem", border: "0.072rem solid #727272", borderRadius: "0.215rem", display: "flex", alignItems: "center", paddingLeft: ".5rem", fontSize: ".9rem" }}>
                            <option disabled selected hidden>Elegir al cliente...</option>
                            {clientes.map((cliente) => (
                                <option value={cliente.id} key={cliente.id} >{cliente.nombre} {cliente.apellidos}</option>
                            ))}
                        </select>
                    </FormatoInputs>
                    <FormatoInputs className="dateInput">
                        <FechaInput>
                            <FormLabels >Fecha</FormLabels>
                            <DateInput placeholderText="aa-mm-dd" selected={selectedDate} onChange={date => setSelectedDate(date)} dateFormat="YYY/MM/dd" ></DateInput>
                        </FechaInput>
                        <TimeInput>
                            <FormLabels >Horario</FormLabels>
                            <Horario
                                type="time"
                                value={selectedTime}
                                onChange={handleTimeChange}
                                step="9000" // Optional: Use a step of 15 minutes (900 seconds)
                            />
                        </TimeInput>
                    </FormatoInputs>
                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Observaciones del Servicio</FormLabels>
                        <input className="textInputs"
                            type="text"
                            value={observaciones2}
                            onChange={handleObservacionesChange}
                        ></input>
                    </FormatoInputs>
                    <FormatoInputs style={{ width: "19.815rem" }}>


                        <FormLabels >Frecuencia recomendada:</FormLabels>
                        {otroSelected &&
                            <>
                                <select value={frecuencia} onChange={handleFrecuenciaChange} className="textInputs arrowChange"
                                >
                                    <option hidden >Elegir la frecuencia del servicio...</option>
                                    <option value="Mensual" >Mensual</option>
                                    <option value="Quincenal" >Quincenal</option>
                                    <option value="Semanal" >Semanal</option>
                                    <option value="Unico" >Único Puntual</option>
                                    <option value="Otro">Otro </option>
                                </select>
                            </>
                        }
                        {!otroSelected &&
                            <>
                                <input id="otroAlternative" className="textInputs"
                                    type="text"
                                    placeholder="Escriba la frecuencia del servicio"
                                    value={frecuencia}
                                    onChange={handleFrecuenciaChange as any}
                                    // onFocus={() => { setFrecuencia("") }}
                                    onBlur={() => { frecuencia === "" ? setOtroSelected(true) : setOtroSelected(false); }}
                                ></input>
                            </>
                        }
                    </FormatoInputs>

                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Tipo de Folio:</FormLabels>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <input onChange={handleFacturacionChange} type="radio" className="checked" id="facturado" name="choice" value="Facturado" /> Facturado
                            <input onChange={handleFacturacionChange} type="radio" className="checked" id="noFacturado" name="choice" value="No facturado" /> No Facturado
                        </div>
                    </FormatoInputs>
                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Tipo de Servicio:</FormLabels>
                        <select value={tipoServicio} onChange={handleTipoServicio} className="textInputs arrowChange"
                        >
                            <option value="" disabled selected hidden>Elegir el tipo de servicio...</option>
                            <option value="Residencial" >Residencial</option>
                            <option value="Industrial" >Industrial</option>
                            <option value="Comercial" >Comercial</option>
                            <option value="Gubernamental" >Gubernamental</option>
                            <option value="Hotelería" >Hotelería</option>
                            <option value="Escolar" >Escolar</option>
                        </select>
                    </FormatoInputs>
                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Responsable:</FormLabels>
                        <select value={responsableId} onChange={handleResponsableChange} className="textInputs arrowChange"
                        >
                            <option disabled selected hidden>Elige al Responsable...</option>
                            {responsables.map((responsable) =>
                                <option key={responsable.id} value={responsable.id}>{responsable.nombre}</option>

                            )}
                        </select>
                    </FormatoInputs>
                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Orden de compra</FormLabels>
                        <input className="textInputs"
                            type="text"
                            value={ordenDeCommpra}
                            onChange={handleOrdenCompra}
                        ></input>
                    </FormatoInputs>
                    <div className="buttonRegistrar" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <SearchButtonLink type="button" onClick={addServicio}>Registrar</SearchButtonLink>
                    </div>
                </CreateServicioForm>
            </CreateFormContainer>
        </CreateContainer >
    )

}

export default CreateServiceForm