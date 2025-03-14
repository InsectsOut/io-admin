import styled from "styled-components";
import { ServiciosContainer } from "./Servicios";
import { Titulo } from "./Servicios";
import { Enums, Tables } from "../src/supabase/Database";
import { useEffect, useRef, useState } from "react";
import { StyledDatePicker } from "./Servicios";
import { useNavigate } from 'react-router-dom'
import { supabase } from "./utils/ClientSupabase";
import PeriodicidadModal from "./PeriodicidadMOdal";

type Cliente = Tables<"Clientes">
type Responsable = Tables<"Responsables">
type Direcciones = Tables<"Direcciones">

/** Frecuencias validas para un servicio */
const frecuencias: Enums<"FrecuenciaServicio">[] = [
    "Ninguna",
    "Semanal",
    "Quincenal",
    "Mensual",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual"
];

const isFrecuencia = (value: any): value is Enums<"FrecuenciaServicio"> => {
    return frecuencias.includes(value);
};

const PeriodicidadTag = styled.div`
margin-top: .5rem;
 background: #0D4E80;
  width: 6rem;
  height: 2rem;
  border-radius: 999px; /* Fully rounded edges */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* Ensures text is visible */
  font-weight: bold;
  font-size: 0.9rem;
  padding: 0 1rem; /* Adds spacing */
  &.periodTag{
    &:hover{
        cursor: pointer;
    }
  }
`

const SearchButtonLink = styled.button /*style*/`
width: 8.5rem;
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

  @media (max-width: 900px) {
width:95%;
} 
`
const CreateFormContainer = styled.div /*style*/`
background:red;
width: 60.3125%;
background:red;
display:flex;
flex-direction:column;
background: #F3F3F3;
min-height:65rem;
height:fit-content ;
box-shadow: 0px 4px 9.8px rgba(0, 0, 0, 0.25);
@media (max-width: 900px) {
width:95%;
overflow:scroll;
min-height:99%;
}
`

const CreateContainer = styled(ServiciosContainer) /*style*/ `
@media (max-width: 900px) {
width:100vw;
overflow:hidden;
max-height:90vh;
}
.createForm{
align-self:center;
}
`

const FormHeader = styled.div /*style*/`
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

const CreateServicioForm = styled.form /*style*/`
display:flex;
gap:2rem;
flex-direction:column;
color:#474747;
height:99vh;
.formatoInputs{
display:flex;
overflow:scroll;
flex-direction:column;
}
.dateInput{
   display: flex;
   flex-direction:row;
   gap:2rem;
   }
   @media (max-width: 900px) {
padding:0 1.5rem 0 1rem
}
`

export enum Position {
    STATIC = "static",
    RELATIVE = "relative",
    ABSOLUTE = "absolute",
    FIXED = "fixed",
    STICKY = "sticky",
}

export const FormatoInputs = styled.div<{ width?: number, screen_width?: number, marginleft?: string, pos: Position }>/*style*/`
position: ${(props) => props.pos ? props.pos : "relative"};
.tagsContainer{
display:flex;
gap:.5rem;
}
@media (max-width: 900px) {

 width: calc(100%);
 margin-left: ${(props) => props.marginleft ? props.marginleft : "3.25rem"};
}
    text-align:left;
    margin-left:3.25rem;
   display:flex;
   flex-direction:column;
   width: ${(props) => `${props.width}%`};
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
const FormLabels = styled.label`
 
font-style: normal;
font-weight: 700;
font-size: 1.077rem;
line-height: 1.375rem;
color: #474747;
`
interface DateInputProps {
    width?: string;
}

export const DateInput = styled(StyledDatePicker) <{ wid?: string, height?: string }> /*style*/`
 all:unset;
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:left;
padding-left:.5rem;
color: #838383;
height:  ${props => (props.height ?? "2.5125rem")}; 
background: none;
border-radius: 0.215379rem; 
width:  ${props => (props.wid ?? "12.635625rem")};
`
export const Horario = styled.input<{ width?: string }>  /*style*/ `
 
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:left;
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

@media (max-width: 900px) {
width:  ${props => (props.width ?? "6.063rem")};
display:flex;
align-items:center;
justify-content:left;
}
`
export const TimeInput = styled.div<{ marginTop?: string, marginTopTablet?: string }> /*style*/`
display:flex;
flex-direction:column;
margin-top: ${(props) => props.marginTop ? props.marginTop : "0"};

@media (max-width: 900px) {
    margin-top: ${(props) => props.marginTopTablet ? props.marginTopTablet : "1rem"};

} 

`
export const FechaInput = styled.div<{ flexDir: string }> /*style*/ `
display:flex;
flex-direction:column;

@media (max-width: 900px) {
flex-direction: ${(props) => props.flexDir ? props.flexDir : "column"};
} 
.dateInputContainer{
background:white;
border: 0.071793rem solid #727272; 
border-radius: 0.215379rem; 

}
`

const StyledSelect = styled.select /*style*/`
  all: unset;
  background: #FFFFFF;
  color: #474747;
  height: 2.513rem;
  border: 0.072rem solid #727272;
  border-radius: 0.215rem;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  font-size: 0.9rem;
  
  /* Optional: Style for options if needed */
  option {
    background: #FFFFFF;
    color: #474747;
  }
  @media (max-width: 900px) {
width:100%;
} 

`;
interface createServicioProps {
    user_id?: string | null
}

const CreateServiceForm: React.FC<createServicioProps> = (props) => {
    const [clienteId, setClienteId] = useState<number | undefined>()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [selectedDate, setSelectedDate] = useState<null | Date>(null);
    const [_fetchError, setFetchError] = useState("");
    const [selectedTime, setSelectedTime] = useState<string>('00:00');
    const [responsables, setResponsables] = useState<Responsable[]>([])
    const [observaciones2, setObservaciones] = useState("")
    const [frecuencia, setFrecuencia] = useState<Enums<"FrecuenciaServicio">>("Ninguna")
    const [estadoFacturacion, setEstadoFacturacion] = useState("")
    const [tipoServicio, setTipoServicio] = useState("")
    const [responsableId, setResponsableId] = useState<number | null>(null)
    const [ordenDeCommpra, setOrdeDeCompra] = useState("")
    const [_, SetServicioFolio] = useState<number | null>(null)
    const [otroSelected, setOtroSelected] = useState<boolean>(true)
    const [organizacion, setOrganizacion] = useState<string>("")
    const [direccion_id, setDireccion_id] = useState<number | null>(null)
    const [dirección, setDireccion] = useState<Direcciones[]>([])
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [startDate, setStartDate] = useState<Date | null>(selectedDate);
    const [selectedDays, setSelectedDays] = useState<number | null >();
    const dayLetters = ["D", "L", "M", "X", "J", "V", "S"];
    const [numDeServicios, setNumDeServicios] = useState<number | null>(1)
    const [periodModalOpen, setPeriodModalOpen] = useState<boolean>(false)
    const navigate = useNavigate()
    const frecuenciaInputRef = useRef<HTMLSelectElement | null>(null);
    const tagRef = useRef<HTMLDivElement | null>(null);

    const fetchResponsables = async () => {
        if (clienteId !== undefined) {
            try {
                if (!clienteId) {
                    console.log("No matching id")
                    console.log(clienteId)
                }

                const { error, data: responsable } = await supabase
                    .from("Responsables")
                    .select()
                    .filter("cliente_id", "eq", `${clienteId}`);

                if (error) {
                    console.log(error)
                    setResponsables([])
                }
                if (responsable) {
                    setResponsables(responsable)
                    setResponsableId(responsable[0]?.id)
                }
            }

            catch (err) {
                console.log("Error encontrando a los responsables" + err)
            }
        }
    }


    const fetchClientes = async () => {
        try {
            const { error, data: clientes } = await supabase
                .from("Clientes")
                .select(`*`);

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


    const addServicio = async (fecha_servicio: Date | null) => {
        try {
            // const { data:folio_temp, error:error_temp } = await supabase.rpc
            // ('generate_temporal_folio');
            // if (folio_temp){
            // console.log(folio_temp)
            // }
            // if (error_temp){
            // console.log(error_temp)
            // return
            // }
            const { data, error } = await supabase
                .from("Servicios")
                .insert([
                    {
                        cliente_id: clienteId,
                        fecha_servicio: fecha_servicio,
                        horario_servicio: selectedTime,
                        observaciones: observaciones2,
                        frecuencia_recomendada: frecuencia,
                        direccion_id: direccion_id,
                        orden_compra: ordenDeCommpra,
                        tipo_servicio: tipoServicio,
                        tipo_folio: estadoFacturacion,
                        responsable_id: responsableId,
                        organizacion: organizacion,
                        user_id: props.user_id,
                        // if (frecuencia ){

                        // }
                        // //  folio:folio_temp
                    },
                ] as any)
                .select();

            if (error) {
                console.error("Error inserting data:", error.message);
            } else {
                console.log("Data inserted successfully:", data);
                let folio = data[0]?.folio
                if (folio) {

                    // navigate(`/Servicios/${folio}`)

                }
                console.log("hola")
                SetServicioFolio(folio)
            }
        } catch (err) {
            console.error("Error adding servicio:", err);
        }
    };

    const fetchOrganización = async (user_id: string | null) => {
        try {
            const { data } = await supabase
                .from("Empleados")
                .select("organizacion")
                .filter("user_id", "eq", user_id)

            //@ts-ignore
            setOrganizacion(data?.[0]?.organizacion ?? "")
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchDireccion = async (cliente_id: string) => {
        try {
            const { data, error } = await supabase
                .from("Direcciones")
                .select("*")
                .filter("cliente_id", "eq", cliente_id)
            if (data) {
                console.log(data)
                setDireccion(data)
            }
            if (error) {
                console.log(error)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchClientes()
        fetchOrganización(props.user_id ?? "")
        console.log("el dia", new Date().getDay())
    }, [])

    useEffect(() => {
        fetchResponsables()
    }, [clienteId])

    const handleClientClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSacado = +event.target.value
        setClienteId(idSacado)
        fetchDireccion(idSacado.toString())
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
        if (isFrecuencia(frecuenciaChange)) {
            setFrecuencia(frecuenciaChange)
        }

        if (frecuenciaChange === "Ninguna") {
            setOtroSelected(false)
        }

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
    const handleDireccionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = +event.target.value
        setDireccion_id(cambio)

    }

    const handleOrdenCompra = (event: React.ChangeEvent<HTMLInputElement>) => {
        const oCChange = event.target.value
        setOrdeDeCompra(oCChange)

    }

    const handleStartDateFromChild = (date: Date) => {
        setStartDate(date);
    }

    const handleNumDeServiciosFromChild = (num: number) => {
        setNumDeServicios(num);

    }


    const handleSelectedDayFromChild = (day: any) => {
        setSelectedDays(day
        );
         console.log(day)
    };

    const handleCloseFromChild = (trigger: boolean) => {
        console.log(trigger)
        setPeriodModalOpen(trigger)
    }

    useEffect(() => {
        setFrecuencia("Ninguna")
        const otroAlternativeElement = document.getElementById("otroAlternative");
        if (otroAlternativeElement) {
            otroAlternativeElement.focus();
        }
    }, [otroSelected])
    useEffect(() => {
        setFrecuencia(frecuencia);
        console.log(frecuencia)
    }, [frecuencia])

    useEffect(() => {
        setPeriodModalOpen(periodModalOpen)
    }, [periodModalOpen])

    useEffect(() => {
        if (frecuencia !== "Ninguna") {
            setPeriodModalOpen(true)
        }
        else {
            setPeriodModalOpen(false)
        }
    }, [frecuencia])

    useEffect(() => {
        setStartDate(selectedDate)
    }, [selectedDate])

    const handleSeletedDateChange = (date: Date | null, frecuencia?: Enums<"FrecuenciaServicio">) => {

        setSelectedDate(date);



    }

    const addServicioPeriodically = async (cantidadServicios: number | null, date: Date | null, frecuencia: Enums<"FrecuenciaServicio">) => {

        if (!cantidadServicios) {
            window.alert("Por favor defina la cantidad de servicios a crear")
            return;
        }
        if (!date) {
            window.alert("Por favor defina la fecha de inicio de creación de servicios")
            return;
        }
        if (cantidadServicios <= 0) {
            window.alert("Por favor defina la cantidad de servicios a crear")
        }
        if (!date) return;

        const addDays = (date: Date, days: number, day_of_the_week: number, cycles: number) => {
            let result = new Date(date.getTime()); // Ensure a proper copy

            result.setDate(result.getDate() + days);
            if (cycles === 0) {
                return result;
            }
            const prevDay = new Date(result);
            prevDay.setDate(result.getDate() - ((result.getDay() - day_of_the_week + 7) % 7 || 7)); // Ensure we don't get the same day
            
            const nextDay = new Date(result);
            nextDay.setDate(result.getDate() + ((day_of_the_week - result.getDay() + 7) % 7 || 7));

          
            if (prevDay && (cycles === 0 || cycles % 2 === 0)) {
                console.log("Even cycles (or 0), choosing prevDay:", prevDay);
                console.log("Nex day wouldve been", nextDay);
            } else if (nextDay && (cycles % 2 !== 0)) {
                console.log("Odd cycles, choosing nextDay:", nextDay);
                console.log("Prev day wouldve been", prevDay);
            } else {
                console.log("Neither condition met, returning null");
            }

            // return Math.abs(result.getTime() - prevDay.getTime()) <= Math.abs(nextDay.getTime() - result.getTime()) 
            // ? prevDay 
            // : nextDay;


        

                return prevDay && (cycles === 0 || cycles % 2 === 0)
                    ? prevDay
                    :  nextDay && (cycles % 2 !== 0) 
                        ? nextDay
                        : null;

        };

        if (frecuencia !== "Ninguna") {

            const frequency_number = frecuencia === "Anual" ? 365 : frecuencia === "Bimestral" ? 60 : frecuencia === "Mensual" ? 30 : frecuencia === "Quincenal" ? 15 : frecuencia === "Semanal" ? 7 : frecuencia === "Semestral" ? 180 : frecuencia === "Trimestral" ? 90 : 0


            for (let i = 0; i < cantidadServicios; i++) {
                let newDate = addDays(date ?? new Date , frequency_number, selectedDays ?? 0 , i);

                if (i === 0 ) {
                    newDate = addDays(date ?? new Date, 0, selectedDays ?? 0, i);
                }
                await addServicio(newDate)
                date = newDate
                console.log("pasada num:", i)

            }
        }
        else if (frecuencia === "Ninguna") {
            addServicio(date)
        }


    }

    const handleTagClicks = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const target = event.target;

        if (tagRef.current && target instanceof Node && tagRef.current.contains(target)) {
            setPeriodModalOpen(prev => !prev);

        }
    };

    return (
        <CreateContainer>
            <Titulo>Servicios</Titulo>
            <CreateFormContainer className="createForm"><FormHeader>Para registrar un nuevo servicio, complete el siguiente formulario.</FormHeader>
                <div className="detailsContainer createService">
                    <CreateServicioForm className="oli">
                        <FormatoInputs
                            width={90}
                            marginleft={"0"}
                        >
                            <FormLabels >Nombre del Cliente</FormLabels>
                            <StyledSelect value={clienteId} onChange={handleClientClick}>
                                <option >Elegir al cliente...</option>
                                {clientes.slice()
                                    .sort((a, b) => {
                                        const nameA = `${a.nombre} ${a.apellidos}`.toUpperCase();
                                        const nameB = `${b.nombre} ${b.apellidos}`.toUpperCase();
                                        return nameA.localeCompare(nameB);
                                    }).map((cliente) => (
                                        <option value={cliente.id} key={cliente.id} >{cliente.nombre} {cliente.apellidos}</option>
                                    ))}
                            </StyledSelect>
                        </FormatoInputs>
                        <FormatoInputs className="dateInput"
                            marginleft={"0"}
                            width={90}
                        >
                            <FechaInput>
                                <FormLabels >Fecha</FormLabels>
                                <div className="dateInputContainer">
                                    <DateInput placeholderText="aa-mm-dd" selected={selectedDate} onChange={date => handleSeletedDateChange(date, frecuencia)} dateFormat="YYY/MM/dd" />
                                </div>
                            </FechaInput>
                            <TimeInput
                                marginTopTablet="0"
                            >
                                <FormLabels >Horario</FormLabels>
                                <Horario
                                    style={{ width: "10rem", margin: 0 }}
                                    type="time"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    step="9000" // Optional: Use a step of 15 minutes (900 seconds)
                                />
                            </TimeInput>
                        </FormatoInputs>

                        <FormatoInputs
                            width={90}
                            screen_width={screenWidth}
                            marginleft={"0"}
                        >
                            <FormLabels >Observaciones del Servicio</FormLabels>
                            <input className="textInputs"
                                onChange={handleObservacionesChange}
                                value={observaciones2}
                                type="text"
                            />
                        </FormatoInputs>
                        <FormatoInputs
                            pos={Position.RELATIVE}
                            width={90}
                            screen_width={screenWidth}
                            marginleft={"0"}
                        >
                            <FormLabels >Frecuencia recomendada:</FormLabels>

                            <select ref={frecuenciaInputRef} value={frecuencia} onChange={handleFrecuenciaChange} className="textInputs arrowChange">
                                <option >Elegir la frecuencia del servicio...</option>
                                {frecuencias.map((frecuencia) => (
                                    <option key={frecuencia} value={frecuencia} >
                                        {frecuencia}
                                    </option>
                                ))}
                            </select>

                            {/* {!otroSelected &&
                            <input id="otroAlternative" className="textInputs"
                                onBlur={() => setOtroSelected(frecuencia === "Ninguna")}
                                onChange={handleFrecuenciaChange as any}
                                placeholder="Escriba la frecuencia del servicio"
                                value={frecuencia}
                                type="text"
                            />
                        } */}

                            {frecuencia !== "Ninguna" &&
                                <div
                                    ref={tagRef}
                                    onClick={handleTagClicks}
                                    className="tagsContainer">
                                    {startDate &&
                                        <PeriodicidadTag
                                            className="periodTag"
                                        >
                                            <p>{startDate?.toISOString().split("T")[0]}</p>
                                        </PeriodicidadTag>
                                    }

                                    {(selectedDays || selectedDays === 0) &&
                                        <PeriodicidadTag
                                            className="periodTag"
                                        >
                                            <p>{dayLetters[selectedDays as number]}</p>
                                        </PeriodicidadTag>
                                    }
                                    {numDeServicios &&
                                        <PeriodicidadTag
                                            className="periodTag"
                                        >
                                            <p>{numDeServicios}</p>
                                        </PeriodicidadTag>
                                    }
                                </div>
                            }


                            {periodModalOpen &&
                                <>


                                    <PeriodicidadModal
                                        ModalCloser={handleCloseFromChild}
                                        selectedDaySend={handleSelectedDayFromChild}
                                        startDateSend={handleStartDateFromChild}
                                        numDeServiciosSend={handleNumDeServiciosFromChild}
                                        startDateProp={selectedDate ?? null}
                                        onClose={periodModalOpen}
                                    ></PeriodicidadModal>
                                </>
                            }
                        </FormatoInputs>


                        <FormatoInputs
                            width={90}
                            marginleft={"0"}
                        >
                            <FormLabels >Dirección:</FormLabels>
                            <select value={direccion_id ?? undefined} onChange={handleDireccionChange} className="textInputs arrowChange">
                                <option>Elige la dirección</option>
                                {dirección.map((direccion) =>
                                    <option key={direccion.id} value={direccion.id}>{direccion.calle} {direccion.ciudad} {direccion.colonia} {direccion.numero_ext} {direccion.codigo_postal}</option>
                                )}
                            </select>
                        </FormatoInputs>

                        <FormatoInputs style={{ width: "19.815rem" }}
                            marginleft={"0"}
                        >
                            <FormLabels >Tipo de Folio:</FormLabels>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <input onChange={handleFacturacionChange} type="radio" className="checked" id="facturado" name="choice" value="Facturado" /> Facturado
                                <input onChange={handleFacturacionChange} type="radio" className="checked" id="noFacturado" name="choice" value="No facturado" /> No Facturado
                            </div>
                        </FormatoInputs>
                        <FormatoInputs
                            width={90}
                            marginleft={"0"}
                        >
                            <FormLabels >Tipo de Servicio:</FormLabels>
                            <select value={tipoServicio} onChange={handleTipoServicio} className="textInputs arrowChange"
                            >
                                <option value="" >Elegir el tipo de servicio...</option>
                                <option value="Residencial" >Residencial</option>
                                <option value="Industrial" >Industrial</option>
                                <option value="Comercial" >Comercial</option>
                                <option value="Gubernamental" >Gubernamental</option>
                                <option value="Hotelería" >Hotelería</option>
                                <option value="Escolar" >Escolar</option>
                            </select>
                        </FormatoInputs>
                        {tipoServicio !== "Residencial" &&
                            <FormatoInputs
                                width={90}
                                marginleft={"0"}
                            >
                                <FormLabels >Responsable:</FormLabels>
                                <select value={responsableId ?? undefined} onChange={handleResponsableChange} className="textInputs arrowChange">
                                    <option >Elige al Responsable...</option>
                                    {responsables.map((responsable) =>
                                        <option key={responsable.id} value={responsable.id}>{responsable.nombre}</option>
                                    )}
                                </select>
                            </FormatoInputs>
                        }
                        <FormatoInputs
                            width={90}
                            marginleft={"0"}
                        >
                            <FormLabels >Orden de compra</FormLabels>
                            <input className="textInputs"
                                onChange={handleOrdenCompra}
                                value={ordenDeCommpra}
                                type="text"
                            />
                        </FormatoInputs>
                        <div className="buttonRegistrar" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <SearchButtonLink type="button" onClick={() => { addServicioPeriodically(numDeServicios, startDate, frecuencia) }}>Registrar</SearchButtonLink>
                        </div>
                    </CreateServicioForm>
                </div>
            </CreateFormContainer>
        </CreateContainer >
    )

}

export default CreateServiceForm