import styled from "styled-components";
import { ServiciosContainer } from "./Servicios";
import { Titulo } from "./Servicios";
import { Enums, Tables } from "../src/supabase/Database";
import { useEffect, useRef, useState } from "react";
import { StyledDatePicker } from "./Servicios";
import { useNavigate } from "react-router-dom";
import { supabase } from "./utils/ClientSupabase";
import PeriodicidadModal from "./PeriodicidadMOdal";

type Cliente = Tables<"Clientes">;
type Responsable = Tables<"Responsables">;
type Direcciones = Tables<"Direcciones">;
type GruposDeServicios = Tables<"GruposDeServicios">;

/** Frecuencias validas para un servicio */
const frecuencias: Enums<"FrecuenciaServicio">[] = [
    "Ninguna",
    "Semanal",
    "Quincenal",
    "Mensual",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual",
];

const isFrecuencia = (value: any): value is Enums<"FrecuenciaServicio"> => {
    return frecuencias.includes(value);
};

const PeriodicidadTag = styled.div`
    margin-top: 0.5rem;
    background: #0d4e80;
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
    &.periodTag {
        &:hover {
            cursor: pointer;
        }
    }
`;

const SearchButtonLink = styled.button /*style*/ `
    width: 8.5rem;
    height: 2.188rem;
    background: #0d4e80;
    border-radius: 0.375rem;

    font-style: normal;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    &:hover {
        background-color: #2980b9;
        transform: scale(1.05);
        cursor: pointer;
        color: white;
    }

    @media (max-width: 900px) {
        width: 95%;
    }
`;
const CreateFormContainer = styled.div /*style*/ `
    background: red;
    width: 60.3125%;
    background: red;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    min-height: 65rem;
    height: fit-content;
    box-shadow: 0px 4px 9.8px rgba(0, 0, 0, 0.25);
    @media (max-width: 900px) {
        width: 95%;
        overflow: scroll;
        min-height: 99%;
    }
`;

const CreateContainer = styled(ServiciosContainer) /*style*/ `
    @media (max-width: 900px) {
        width: 100vw;
        overflow: hidden;
        max-height: 90vh;
    }
    .createForm {
        align-self: center;
    }
`;

const FormHeader = styled.div /*style*/ `
    width: 100%;
    height: 6.25rem;
    background: #6b8aac;
    color: #ffffff;

    font-style: normal;
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1.625rem;
    border-radius: 5px 5px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
`;

const CreateServicioForm = styled.form /*style*/ `
    display: flex;
    gap: 2rem;
    flex-direction: column;
    color: #474747;
    height: 99vh;
    .formatoInputs {
        display: flex;
        overflow: scroll;
        flex-direction: column;
    }
    .dateInput {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }
    @media (max-width: 900px) {
        padding: 0 1.5rem 0 1rem;
    }
`;

export enum Position {
    STATIC = "static",
    RELATIVE = "relative",
    ABSOLUTE = "absolute",
    FIXED = "fixed",
    STICKY = "sticky",
}

export const FormatoInputs = styled.div<{
    width?: number;
    screen_width?: number;
    marginleft?: string;
    pos: Position;
}> /*style*/ `
    position: ${props => (props.pos ? props.pos : "relative")};
    .tagsContainer {
        display: flex;
        gap: 0.5rem;
    }
    @media (max-width: 900px) {
        width: calc(100%);
        margin-left: ${props => (props.marginleft ? props.marginleft : "3.25rem")};
    }
    text-align: left;
    margin-left: 3.25rem;
    display: flex;
    flex-direction: column;
    width: ${props => `${props.width}%`};
    .textInputs {
        all: unset;
        background-image: url('data:image/svg+xml;utf8,<svg fill="%23000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
        display: flex;
        align-items: center;
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 20px;
        text-align: left;
        padding-left: 0.5rem;
        color: #838383;
        width: 100%;
        height: 2.5125rem;
        background: #ffffff;
        border: 0.071793rem solid #727272;
        border-radius: 0.215379rem;
    }
    .arrowChange {
        background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position-x: 100%;
        background-position-y: 0.5rem;
    }
    .checked {
        background: linear-gradient(180deg, #ffffff 0%, #c7c7c7 100%);
        border: 1px solid #838383;
        width: 1rem;
        height: 1rem;
        &:checked {
            border-color: #e2e2e2;
            cursor: pointer;
        }
    }
`;
const FormLabels = styled.label`
    font-style: normal;
    font-weight: 700;
    font-size: 1.077rem;
    line-height: 1.375rem;
    color: #474747;
`;
interface DateInputProps {
    width?: string;
}

export const DateInput = styled(StyledDatePicker)<{ wid?: string; height?: string }> /*style*/ `
    all: unset;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    text-align: left;
    padding-left: 0.5rem;
    color: #838383;
    height: ${props => props.height ?? "2.5125rem"};
    background: none;
    border-radius: 0.215379rem;
    width: ${props => props.wid ?? "12.635625rem"};
`;
export const Horario = styled.input<{ width?: string }> /*style*/ `
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    text-align: left;
    padding-left: 1rem;
    color: #838383;
    width: 6.063rem;
    height: 2.5125rem;
    background: #ffffff;
    border: 0.071793rem solid #727272;
    border-radius: 0.215379rem;
    margin-top: 0.25rem;
    &::-webkit-calendar-picker-indicator {
        filter: invert(100%);
    }

    @media (max-width: 900px) {
        width: ${props => props.width ?? "6.063rem"};
        display: flex;
        align-items: center;
        justify-content: left;
    }
`;
export const TimeInput = styled.div<{ marginTop?: string; marginTopTablet?: string }> /*style*/ `
    display: flex;
    flex-direction: column;
    margin-top: ${props => (props.marginTop ? props.marginTop : "0")};

    @media (max-width: 900px) {
        margin-top: ${props => (props.marginTopTablet ? props.marginTopTablet : "1rem")};
    }
`;
export const FechaInput = styled.div<{ flexDir: string }> /*style*/ `
    display: flex;
    flex-direction: column;

    @media (max-width: 900px) {
        flex-direction: ${props => (props.flexDir ? props.flexDir : "column")};
    }
    .dateInputContainer {
        background: white;
        border: 0.071793rem solid #727272;
        border-radius: 0.215379rem;
    }
`;

const StyledSelect = styled.select /*style*/ `
    all: unset;
    background: #ffffff;
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
        background: #ffffff;
        color: #474747;
    }
    @media (max-width: 900px) {
        width: 100%;
    }
`;
interface createServicioProps {
    user_id?: string | null;
}

const CreateServiceForm: React.FC<createServicioProps> = props => {
    const [clienteId, setClienteId] = useState<number | undefined>();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedDate, setSelectedDate] = useState<null | Date>(null);
    const [_fetchError, setFetchError] = useState("");
    const [selectedTime, setSelectedTime] = useState<string>("00:00");
    const [responsables, setResponsables] = useState<Responsable[]>([]);
    const [observaciones2, setObservaciones] = useState("");
    const [frecuencia, setFrecuencia] = useState<Enums<"FrecuenciaServicio">>("Ninguna");
    const [estadoFacturacion, setEstadoFacturacion] = useState("");
    const [tipoServicio, setTipoServicio] = useState("");
    const [responsableId, setResponsableId] = useState<number | null>(null);
    const [ordenDeCommpra, setOrdeDeCompra] = useState("");
    const [_, SetServicioFolio] = useState<number | null>(null);
    const [otroSelected, setOtroSelected] = useState<boolean>(true);
    const [organizacion, setOrganizacion] = useState<string>("");
    const [direccion_id, setDireccion_id] = useState<number | null>(null);
    const [dirección, setDireccion] = useState<Direcciones[]>([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [startDate, setStartDate] = useState<Date | null>(selectedDate);
    const [selectedDays, setSelectedDays] = useState<number | null>();
    const dayLetters = ["D", "L", "M", "X", "J", "V", "S"];
    const [numDeServicios, setNumDeServicios] = useState<number | null>(1);
    const [periodModalOpen, setPeriodModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const frecuenciaInputRef = useRef<HTMLSelectElement | null>(null);
    const tagRef = useRef<HTMLDivElement | null>(null);
    const [fechas_recomendadas, set_fechas_recomendadas] = useState<Date[]>([]);
    const [dateTag, setDateTag] = useState<boolean>(false);

    const fetchResponsables = async () => {
        if (clienteId !== undefined) {
            try {
                if (!clienteId) {
                    console.log("No matching id");
                    console.log(clienteId);
                }

                const { error, data: responsable } = await supabase
                    .from("Responsables")
                    .select()
                    .filter("cliente_id", "eq", `${clienteId}`);

                if (error) {
                    console.log(error);
                    setResponsables([]);
                }
                if (responsable) {
                    setResponsables(responsable);
                    setResponsableId(responsable[0]?.id);
                }
            } catch (err) {
                console.log("Error encontrando a los responsables" + err);
            }
        }
    };

    const fetchClientes = async (organizacion: string) => {
        try {
            const { error, data: clientes } = await supabase
                .from("Clientes")
                .select(`*`)
                .filter("organizacion", "eq", organizacion);

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
    };

    const createGrupoDeServicios = async (servicioId?: number[] | null[], grupoId?: number | null) => {
        try {
            const { data, error } = await supabase
                .from("GruposDeServicios")
                .upsert([
                    {
                        ...(grupoId !== undefined && grupoId !== null && { id: grupoId }),
                        ...(servicioId !== undefined && servicioId !== null && { servicios_id: servicioId }),
                        organizacion: organizacion,
                    },
                ] as any)
                .select("id"); // Select only "id" field

            if (error) {
                console.error("Error in upsert:", error);
                return null;
            }

            return data?.[0]?.id ?? null; // Return the first id or null if not found
        } catch (err) {
            console.error("Exception:", err);
            return null;
        }
    };

    const addServicio = async (fecha_servicio: Date | null, grupo_de_servicios?: number | null) => {
        try {
            const { data: folio_temp, error: error_temp } = await supabase.rpc(
                "generate_temporal_folio",
                { org_name: organizacion } as any // Pass the organization name here
            );

            if (folio_temp) {
                console.log("Generated Folio:", folio_temp);
            }

            if (error_temp) {
                console.error("Error:", error_temp);
                return;
            }
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
                        grupo_de_servicios: grupo_de_servicios ?? null,
                        folio: folio_temp,
                    },
                ] as any)
                .select();

            if (error) {
                console.error("Error inserting data:", error.message);
            } else {
                console.log("Data inserted successfully:", data);
                let folio = data[0]?.folio;

                console.log("hola");

                if (folio) {
                    SetServicioFolio(folio);
                    return folio;
                }
            }
        } catch (err) {
            console.error("Error adding servicio:", err);
        }
    };

    const getServicioId = async (folio: number) => {
        try {
            const { data, error } = await supabase
                .from("Servicios")
                .select("id")
                .eq("folio", folio)
                .eq("organizacion", organizacion);

            if (data) {
                return data[0]?.id;
            }
        } catch (err) {
            if (err) {
                console.log(err);
            }
        }
    };

    const fetchOrganización = async (user_id: string | null) => {
        try {
            const { data } = await supabase.from("Empleados").select("organizacion").filter("user_id", "eq", user_id);

            setOrganizacion(data?.[0]?.organizacion ?? "");
            return data?.[0]?.organizacion;
        } catch (err) {
            console.log(err);
        }
    };

    const fetchDireccion = async (cliente_id: string) => {
        try {
            const { data, error } = await supabase
                .from("Direcciones")
                .select("*")
                .filter("cliente_id", "eq", cliente_id);
            if (data) {
                console.log(data);
                setDireccion(data);
            }
            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrganización(props.user_id ?? "").then(org => {
            fetchClientes(org ?? "");
        });
    }, []);
    // useEffect(() => {

    //    // fetchOrganización(props.user_id ?? "")
    //     setOrganizacion(organizacion)

    // }, [organizacion])

    useEffect(() => {
        fetchResponsables();
    }, [clienteId]);

    const handleClientClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idSacado = +event.target.value;
        setClienteId(idSacado);
        fetchDireccion(idSacado.toString());
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTime(event.target.value);
    };

    const handleObservacionesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const observacionesChange = event.target.value;
        setObservaciones(observacionesChange);
    };

    const handleFrecuenciaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const frecuenciaChange = event.target.value;
        if (isFrecuencia(frecuenciaChange)) {
            setFrecuencia(frecuenciaChange);
        }

        if (frecuenciaChange === "Ninguna") {
            setOtroSelected(false);
        }
    };

    const handleFacturacionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facturaChange = event.target.value;
        setEstadoFacturacion(facturaChange);
        console.log(estadoFacturacion);
    };

    const handleTipoServicio = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tipo = event.target.value;
        setTipoServicio(tipo);
    };
    const handleResponsableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const responsableChange = +event.target.value;
        setResponsableId(responsableChange);
    };
    const handleDireccionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = +event.target.value;
        setDireccion_id(cambio);
    };

    const handleOrdenCompra = (event: React.ChangeEvent<HTMLInputElement>) => {
        const oCChange = event.target.value;
        setOrdeDeCompra(oCChange);
    };

    const handleStartDateFromChild = (date: Date) => {
        setStartDate(date);
    };

    const handleNumDeServiciosFromChild = (num: number) => {
        setNumDeServicios(num);
    };

    const handleSelectedDayFromChild = (day: any) => {
        setSelectedDays(day);
        console.log(day);
    };
    const handleDateChnageFromChild = (fechas: Date[]) => {
        set_fechas_recomendadas(fechas);
    };

    const handleCloseFromChild = (trigger: boolean) => {
        console.log(trigger);
        setPeriodModalOpen(trigger);
    };

    useEffect(() => {
        setFrecuencia("Ninguna");
        const otroAlternativeElement = document.getElementById("otroAlternative");
        if (otroAlternativeElement) {
            otroAlternativeElement.focus();
        }
    }, [otroSelected]);
    useEffect(() => {
        setFrecuencia(frecuencia);
        console.log(frecuencia);
    }, [frecuencia]);

    useEffect(() => {
        setPeriodModalOpen(periodModalOpen);
    }, [periodModalOpen]);

    useEffect(() => {
        if (frecuencia !== "Ninguna") {
            setPeriodModalOpen(true);
        } else {
            setPeriodModalOpen(false);
        }
    }, [frecuencia]);

    useEffect(() => {
        setStartDate(selectedDate);
    }, [selectedDate]);

    const handleSeletedDateChange = (date: Date | null, frecuencia?: Enums<"FrecuenciaServicio">) => {
        setSelectedDate(date);
    };

    const addServicioPeriodically = async (
        cantidadServicios: number | null,
        date: Date | null,
        frecuencia: Enums<"FrecuenciaServicio">,
        fechas: Date[]
    ) => {
        if (!cantidadServicios) {
            window.alert("Por favor defina la cantidad de servicios a crear");
            return;
        }
        if (!date) {
            window.alert("Por favor defina la fecha de inicio de creación de servicios");
            return;
        }
        if (cantidadServicios <= 0) {
            window.alert("Por favor defina la cantidad de servicios a crear");
        }
        if (!date) return;

        if (frecuencia !== "Ninguna") {
            let folioGuardados = []; // Declare an empty array to store the folios
            let idsDelServicio = [];

            let grupoId = await createGrupoDeServicios();

            for (let i = 0; i < cantidadServicios; i++) {
                const folioGuardado = await addServicio(fechas[i], grupoId ?? null); // Store the result in folioGuardado
                await folioGuardados.push(folioGuardado); // Add folioGuardado to the array
                if (folioGuardado) {
                    let idDelServicio = await getServicioId(folioGuardado);
                    await idsDelServicio.push(idDelServicio);
                    await createGrupoDeServicios(idsDelServicio as any[], grupoId);
                }

                date = fechas[i];
                console.log("pasada num:", i);

                if (i === cantidadServicios - 1) {
                    console.log(folioGuardados);
                    navigate(`/Servicios/${folioGuardados[0]}`);
                }
            }
        } else if (frecuencia === "Ninguna") {
            const folioGuardado = await addServicio(date);
            navigate(`/Servicios/${folioGuardado}`);
        }
    };

  const createSuggestedDates = (
    cantidadServicios: number | null,
    startDate: Date | null,
    frecuencia: Enums<"FrecuenciaServicio">,
    selectedDay: number // 0: Sunday, 1: Monday, ...
) => {
    if (!cantidadServicios || cantidadServicios <= 0) {
        window.alert("Por favor defina la cantidad de servicios a crear");
        return;
    }
    if (!startDate) {
        window.alert("Por favor defina la fecha de inicio de creación de servicios");
        return;
    }

    const getNextWeekday = (base: Date, targetDay: number): Date => {
        const date = new Date(base);
        const day = date.getDay();
        const diff = (targetDay + 7 - day) % 7;
        date.setDate(date.getDate() + diff);
        return date;
    };

    // use calendar math instead of "days"
    const addFrequency = (date: Date, step: number): Date => {
        const d = new Date(date);

        switch (frecuencia) {
            case "Anual":
                d.setFullYear(d.getFullYear() + step);
                break;
            case "Semestral": // every 6 months
                d.setMonth(d.getMonth() + step * 6);
                break;
            case "Trimestral": // every 3 months
                d.setMonth(d.getMonth() + step * 3);
                break;
            case "Bimestral": // every 2 months
                d.setMonth(d.getMonth() + step * 2);
                break;
            case "Mensual":
                d.setMonth(d.getMonth() + step);
                break;
            case "Quincenal":
                d.setDate(d.getDate() + step * 14);
                break;
            case "Semanal":
                d.setDate(d.getDate() + step * 7);
                break;
            default:
                break;
        }
        return d;
    };

    let currentDate = getNextWeekday(startDate, selectedDay);
    const generatedDates: Date[] = [];

    for (let i = 0; i < cantidadServicios; i++) {
        const nextDate = addFrequency(currentDate, i);
        const adjustedDate = getNextWeekday(nextDate, selectedDay);
        generatedDates.push(adjustedDate);
    }

    console.log(generatedDates);
    set_fechas_recomendadas(generatedDates);
};


    const handleTagClicks = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const target = event.target;

        if (tagRef.current && target instanceof Node && tagRef.current.contains(target)) {
            setPeriodModalOpen(prev => !prev);
            setDateTag(false);
            const targetElement = target as HTMLElement;
            const parentWithId = targetElement.closest("#dateTag");

            if (parentWithId) {
                console.log("Date tag clicked");
                setDateTag(true);
            }
        }
    };

    return (
        <CreateContainer>
            <Titulo>Servicios</Titulo>
            <CreateFormContainer className="createForm">
                <FormHeader>Para registrar un nuevo servicio, complete el siguiente formulario.</FormHeader>
                <div className="detailsContainer createService">
                    <CreateServicioForm className="oli">
                        <FormatoInputs width={90} marginleft={"0"}>
                            <FormLabels>Nombre del Cliente</FormLabels>
                            <StyledSelect value={clienteId} onChange={handleClientClick}>
                                <option>Elegir al cliente...</option>
                                {clientes
                                    .slice()
                                    .sort((a, b) => {
                                        const nameA = `${a.nombre} ${a.apellidos}`.toUpperCase();
                                        const nameB = `${b.nombre} ${b.apellidos}`.toUpperCase();
                                        return nameA.localeCompare(nameB);
                                    })
                                    .map(cliente => (
                                        <option value={cliente.id} key={cliente.id}>
                                            {cliente.nombre} {cliente.apellidos}
                                        </option>
                                    ))}
                            </StyledSelect>
                        </FormatoInputs>
                        <FormatoInputs className="dateInput" marginleft={"0"} width={90}>
                            <FechaInput>
                                <FormLabels>Fecha</FormLabels>
                                <div className="dateInputContainer">
                                    <DateInput
                                        placeholderText="aa-mm-dd"
                                        selected={selectedDate}
                                        onChange={date => handleSeletedDateChange(date, frecuencia)}
                                        dateFormat="YYY/MM/dd"
                                    />
                                </div>
                            </FechaInput>
                            <TimeInput marginTopTablet="0">
                                <FormLabels>Horario</FormLabels>
                                <Horario
                                    style={{ width: "10rem", margin: 0 }}
                                    type="time"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    step="9000" // Optional: Use a step of 15 minutes (900 seconds)
                                />
                            </TimeInput>
                        </FormatoInputs>

                        <FormatoInputs width={90} screen_width={screenWidth} marginleft={"0"}>
                            <FormLabels>Observaciones del Servicio</FormLabels>
                            <input
                                className="textInputs"
                                onChange={handleObservacionesChange}
                                value={observaciones2}
                                type="text"
                            />
                        </FormatoInputs>
                        <FormatoInputs pos={Position.RELATIVE} width={90} screen_width={screenWidth} marginleft={"0"}>
                            <FormLabels>Frecuencia recomendada:</FormLabels>

                            <select
                                ref={frecuenciaInputRef}
                                value={frecuencia}
                                onChange={handleFrecuenciaChange}
                                className="textInputs arrowChange"
                            >
                                <option>Elegir la frecuencia del servicio...</option>
                                {frecuencias.map(frecuencia => (
                                    <option key={frecuencia} value={frecuencia}>
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

                            {frecuencia !== "Ninguna" && (
                                <>
                                    <div ref={tagRef} onClick={handleTagClicks} className="tagsContainer">
                                        {startDate && (
                                            <PeriodicidadTag className="periodTag">
                                                <p>{startDate?.toISOString().split("T")[0]}</p>
                                            </PeriodicidadTag>
                                        )}

                                        {(selectedDays || selectedDays === 0) && (
                                            <PeriodicidadTag className="periodTag">
                                                <p>{dayLetters[selectedDays as number]}</p>
                                            </PeriodicidadTag>
                                        )}
                                        {numDeServicios && (
                                            <PeriodicidadTag className="periodTag">
                                                <p>{numDeServicios}</p>
                                            </PeriodicidadTag>
                                        )}

                                        <PeriodicidadTag id="dateTag" style={{ width: "10rem" }} className="periodTag">
                                            <p style={{ margin: 0 }}>Fechas recomendadas</p>
                                        </PeriodicidadTag>
                                    </div>
                                </>
                            )}

                            {periodModalOpen && (
                                <>
                                    <PeriodicidadModal
                                        dateTag={dateTag}
                                        fechas_recomendadas={fechas_recomendadas}
                                        dateGenerator={() =>
                                            createSuggestedDates(
                                                numDeServicios,
                                                startDate,
                                                frecuencia,
                                                selectedDays!
                                            )
                                        }
                                        ModalCloser={handleCloseFromChild}
                                        selectedDaySend={handleSelectedDayFromChild}
                                        startDateSend={handleStartDateFromChild}
                                        numDeServiciosSend={handleNumDeServiciosFromChild}
                                        datesSender={handleDateChnageFromChild}
                                        startDateProp={selectedDate ?? null}
                                        onClose={periodModalOpen}
                                    ></PeriodicidadModal>
                                </>
                            )}
                        </FormatoInputs>

                        <FormatoInputs width={90} marginleft={"0"}>
                            <FormLabels>Dirección:</FormLabels>
                            <select
                                value={direccion_id ?? undefined}
                                onChange={handleDireccionChange}
                                className="textInputs arrowChange"
                            >
                                <option>Elige la dirección</option>
                                {dirección.map(direccion => (
                                    <option key={direccion.id} value={direccion.id}>
                                        {direccion.calle} {direccion.ciudad} {direccion.colonia} {direccion.numero_ext}{" "}
                                        {direccion.codigo_postal}
                                    </option>
                                ))}
                            </select>
                        </FormatoInputs>

                        <FormatoInputs style={{ width: "19.815rem" }} marginleft={"0"}>
                            <FormLabels>Tipo de Folio:</FormLabels>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <input
                                    onChange={handleFacturacionChange}
                                    type="radio"
                                    className="checked"
                                    id="facturado"
                                    name="choice"
                                    value="Facturado"
                                />{" "}
                                Facturado
                                <input
                                    onChange={handleFacturacionChange}
                                    type="radio"
                                    className="checked"
                                    id="noFacturado"
                                    name="choice"
                                    value="No facturado"
                                />{" "}
                                No Facturado
                            </div>
                        </FormatoInputs>
                        <FormatoInputs width={90} marginleft={"0"}>
                            <FormLabels>Tipo de Servicio:</FormLabels>
                            <select
                                value={tipoServicio}
                                onChange={handleTipoServicio}
                                className="textInputs arrowChange"
                            >
                                <option value="">Elegir el tipo de servicio...</option>
                                <option value="Residencial">Residencial</option>
                                <option value="Industrial">Industrial</option>
                                <option value="Comercial">Comercial</option>
                                <option value="Gubernamental">Gubernamental</option>
                                <option value="Hotelería">Hotelería</option>
                                <option value="Escolar">Escolar</option>
                            </select>
                        </FormatoInputs>
                        {tipoServicio !== "Residencial" && (
                            <FormatoInputs width={90} marginleft={"0"}>
                                <FormLabels>Responsable:</FormLabels>
                                <select
                                    value={responsableId ?? undefined}
                                    onChange={handleResponsableChange}
                                    className="textInputs arrowChange"
                                >
                                    <option>Elige al Responsable...</option>
                                    {responsables.map(responsable => (
                                        <option key={responsable.id} value={responsable.id}>
                                            {responsable.nombre}
                                        </option>
                                    ))}
                                </select>
                            </FormatoInputs>
                        )}
                        <FormatoInputs width={90} marginleft={"0"}>
                            <FormLabels>Orden de compra</FormLabels>
                            <input
                                className="textInputs"
                                onChange={handleOrdenCompra}
                                value={ordenDeCommpra}
                                type="text"
                            />
                        </FormatoInputs>
                        <div
                            className="buttonRegistrar"
                            style={{ width: "100%", display: "flex", justifyContent: "center" }}
                        >
                            <SearchButtonLink
                                type="button"
                                onClick={() => {
                                    addServicioPeriodically(numDeServicios, startDate, frecuencia, fechas_recomendadas);
                                }}
                            >
                                Registrar
                            </SearchButtonLink>
                        </div>
                    </CreateServicioForm>
                </div>
            </CreateFormContainer>
        </CreateContainer>
    );
};

export default CreateServiceForm;
