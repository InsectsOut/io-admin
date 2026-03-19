import { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Enums, Tables } from "../src/supabase/Database";
import { FormatoInputs } from "./CreateServiceForm";
import { Titulo } from "./Servicios";
import { useParams } from "react-router-dom";
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
import GrupoServiciosCard from "./GrupoServiciosCards";
import DelModal from "./DeleteModal";
import PlaguicidasCard from "./PlaguicidasCard";

type Servicio = Tables<"Servicios">;
type Cliente = Tables<"Clientes">;
type Direcciones = Tables<"Direcciones">;

export const DetallesTitulo = styled.h1`
    font-style: normal;
    font-weight: 700;
    font-size: 1.436rem;
    line-height: 1.875rem;
    display: flex;
    align-items: center;
    color: #000000;
    margin-bottom: unset;
    margin-top: 0;
`;
export const InputsContainer = styled(FormatoInputs)<{ flexDir: string }>`
    flex-direction: ${props => (props.flexDir ? props.flexDir : "column")};
    display: flex;
    justify-content: left;
    margin-left: unset;
    gap: 0.25rem;

    &.invisible {
        div {
            display: none !important;
        }
    }
    @media (max-width: 900px) {
        flex-direction: ${props => (props.flexDir ? props.flexDir : "column")};
    }
`;
const iconStyle = {
    backgroundImage:
        'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
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
    margin: unset;
`;

type StyledButtonProps = {
    clicado?: boolean;
    posy?: string;
    position?: string;
};

interface serviciosProps {
    organizacion?: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
    all: unset;
    background-color: ${props => (props.clicado ? "#0D4E80" : "gray")};
    font-weight: bold;
    width: 9.62rem;
    position: absolute;
    bottom: 0;
    right: 0;
    height: 2.226rem;
    margin-bottom: 0.5rem;
    margin-right: 1rem;
    font-size: 0.8rem;
    border-radius: 0.359rem;
    &:hover {
        cursor: pointer;
        background-color: ${props => (props.clicado ? "#2980b9" : "gray")};
        transform: ${props => (props.clicado ? "scale(1.05)" : "scale(1)")};
    }
`;
export const ReturnButton = styled.button`
    background: none;
    color: #0d4e80;
    font-size: 0.8rem;
    font-weight: normal;
    position: absolute;
    bottom: 0;
    right: 12%;
    margin-bottom: 0.5rem;
    margin-right: 1rem;
    left: 75%;
    width: 9.62rem;
    border-radius: 0.359rem;
    border: 0.075rem solid #0d4e80;
`;

const ServiciosCardContainer = styled.div`
    display: flex;
    flex-direction: column;

    .infoButtonsContainer {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 35%;
        align-items: flex-end;
        box-sizing: border-box;
    }

    .CardContainerDiv {
        display: flex;
        width: 50%;
        box-sizing: border-box;
        justify-content: space-around;
    }

    .cardsSeconddContainer {
        display: flex;
        width: 100%;
        align-items: flex-start;
        justify-content: space-around;
    }

    .folioInputsCont {
        display: flex;
        width: 100%;
        gap: 0.5rem;

        p {
            margin: 0;
            font-size: 85%;
            text-align: center;
        }

        :hover {
            background: white;
            color: #0d4e80;
            cursor: pointer;
            border-radius: 0.215rem;
        }
    }

    .genFolioButt {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #0d4e80;
        border-radius: 0.215rem;
        border: 0.072rem solid rgb(114, 114, 114);
    }

    .responsableCard {
        display: flex;
        width: 50%;
        height: 100%;
        flex-direction: row;
        justify-content: space-around;
        padding-right: 5.875rem;
        box-sizing: border-box;

        @media (max-width: 900px) {
            display: none;
        }
    }
    @media (max-width: 900px) {
        align-items: center;
        overflow: hidden;
    }
`;
const AddResponsableCard = styled.div`
    width: 100%;
    height: 5.875rem;
    background: #ffffff;
    border: 0.125rem solid #727272;
    border-radius: 0.7179rem;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        cursor: pointer;
    }
`;
const TextoAddCard = styled.h1`
    height: min-content;
    margin: unset;

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
    width: 90%;
    height: 90px;
    background: #f4f4f4;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 0.7179rem;
    border-color: black;

    p {
        font-size: "18px";
        color: #727272;
        font-weight: 600;
    }
    p:nth-child(2) {
        color: #2395ff;
        margin: 0;
    }
    :hover p {
        cursor: pointer;
    }
    @media (max-width: 900px) {
        align-items: center;
        position: ${props => `${props.position}`};
        width: 100%;
        right: 0;
    }
`;

const ServiciosCard: React.FC<serviciosProps> = props => {
    const [readOnly, setReadOnly] = useState(true);
    const [nombreEditable, setNombreEditable] = useState(true);
    const [fechaEditable, setFechaEditable] = useState(true);
    const { folio } = useParams();
    const [servicios, setServicios] = useState<ServicioConClientes[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const fechaServicioString = servicios.length > 0 ? servicios[0]?.fecha_servicio : "";
    const [selectedTime, setSelectedTime] = useState<string | null>("null");
    const [clienteId, setClienteId] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<null | Date>(null);
    const [isClicked, setClicked] = useState<boolean>(false);
    const [fechaIsClicked, setFechaClicked] = useState(false);
    const [servicioOptoins, SetServicioOptions] = useState("");
    const [tipoServicio, setTipoServicio] = useState<string>("");
    const [estatus, setSelectedEstatus] = useState<boolean>();
    const [estatusString, setEstatusString] = useState<string>("");
    const [plagas, setPlagas] = useState<any[]>([]);
    const [tipoPlaga, setTipoPlaga] = useState<number | null>(null);
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [empleadoId, setEmpleadoID] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean | null>(false);
    const [plagaSelected, setPlagaSelected] = useState<number[]>([]);
    const [dataFromRegistros, setDataFromRegistros] = useState<number | null>(null);
    const navigate = useNavigate();
    const [addButtonClicked, setAddButtonClicked] = useState(false);
    const [direccion_id, setDireccion_id] = useState<number | null>();
    const [dirección, setDireccion] = useState<Direcciones[]>([]);
    const [infoTab, setInfoTab] = useState<string>("general");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [blobUrl, setBolbUrl] = useState<string>("");
    const [statusFlag, setStatusFlag] = useState<boolean>(false);
    const [confirmation, setConfirmation] = useState<boolean>(false);
    const [folioModalOpen, setFolioModalOpen] = useState<boolean>(false);
    const [precio, setPrecio] = useState<number | null>(null);
    type ServicioConClientes = Servicio & {
        Clientes: Cliente | null;
    };

    enum registroEnums {
        actualizar = "actualizar",
        añadir = "añadir",
    }

    const handleChildData = async (data: number) => {
        setDataFromRegistros(data);
        setAddButtonClicked(false);
    };

    const FetchServicios = async () => {
        try {
            if (!folio) {
                console.log("No matching Folio");
            }
            let query = supabase
                .from("Servicios")
                .select(`*,Clientes!inner(*)`)
                .filter("folio", "eq", `${folio}`)
                .filter("organizacion", "eq", props.organizacion);
            const { data: servicio } = await query;
            if (servicio) {
                setServicios(servicio);
                const initialDateString = servicio[0]?.fecha_servicio;
                const [year, month, day] = initialDateString.split("-").map(Number);

                // Create the date in LOCAL TIME (without any timezone shift)
                const initialDate = new Date(year, month - 1, day);
                setSelectedDate(initialDate);
                const initialEmpleadoId = servicio[0]?.tecnico_id ?? null;
                setEmpleadoID(initialEmpleadoId ?? null);
                const initialTime = servicio[0]?.horario_servicio ?? "00:00";
                setSelectedTime(initialTime);
                const initialTipoPlaga = servicio[0]?.tipo_plaga_id ?? null;
                setTipoPlaga(initialTipoPlaga);
                setSelectedEstatus(servicio[0]?.realizado ?? false);
                setEstatusString(servicio[0]?.realizado ? "Realizado" : "No realizado");
                setClienteId(servicio[0]?.Clientes?.id as number);
                setTipoServicio(servicio[0]?.tipo_servicio as string);
                setDireccion_id(servicio?.[0]?.direccion_id);
                setPrecio(servicio[0]?.precio);
                if (servicio?.[0]?.tipo_plaga_array_id !== null) {
                    setPlagaSelected(() => [...(servicio?.[0]?.tipo_plaga_array_id ?? [])]);
                } else {
                    setPlagaSelected([]);
                }
            }
        } catch (err) {
            console.log("Error fetching servicio");
        }
    };

    const FetchPlagas = async () => {
        try {
            const query = supabase.from("Plagas").select("*");
            const { data: plaga } = await query;
            if (plaga) {
                setPlagas(plaga);
            }
        } catch (err) {
            console.log("Error fetching plagas");
        }
    };
    const FetchEmpleado = async () => {
        try {
            const query = supabase.from("Empleados").select("*").filter("organizacion", "eq", props.organizacion);
            const { data: empleado } = await query;
            if (empleado) {
                setEmpleados(empleado);
            }
        } catch (err) {
            console.log("Error fetching plagas");
        }
    };

    const FetchClientes = async () => {
        try {
            let query = supabase
                .from("Clientes")
                .select("*")
                .filter("organizacion", "eq", props.organizacion ?? "");
            const { data: cliente } = await query;
            if (cliente) {
                setClientes(cliente);
            }
        } catch (err) {
            console.log("Error fetching Clientes");
        }
    };

    const folioPermanenteAlert = async () => {
        let confirmation = window.confirm(
            "El estado del servicio ha cambiado a Realizado. Al guardar los cambios, se generará un folio permanente para este servicio. Esta acción es irreversible."
        );

        return confirmation;
    };

    const updateFolio = async (organizacion: string) => {
        if (folioModalOpen) {
            const { data: folio_perm, error: error_temp } = await supabase.rpc(
                "generate_folio",
                { org_name: organizacion } as any // Pass the organization name here
            );
            try {
                const { data, error } = await supabase
                    .from("Servicios")
                    .update([
                        {
                            folio: servicios[0]?.folio > 0 ? servicios[0]?.folio : folio_perm,
                        },
                    ] as any)
                    .filter("id", "eq", `${servicios[0].id}`);

                if (error) {
                    console.log(error);
                }
                if (!error) {
                    navigate(`/Servicios/${folio_perm}`);
                    location.reload();
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const updateServicios = async (confirmation: boolean, flag: boolean, organizacion: string, estatus: boolean) => {
        if (confirmation && flag && estatus && servicios[0]?.folio < 0) {
            const { data: folio_perm, error: error_temp } = await supabase.rpc(
                "generate_folio",
                { org_name: organizacion } as any // Pass the organization name here
            );

            if (folio_perm) {
                // console.log("Generated Folio:", folio_perm);
            }

            if (error_temp) {
                console.error("Error:", error_temp);
                return;
            }
            try {
                let utcDate = null;
                if (selectedDate) {
                    utcDate = new Date(
                        Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
                    );
                }

                const formattedDate = utcDate?.toISOString().split("T")[0]; // "YYYY-MM-DD"
                const { data, error } = await supabase
                    .from("Servicios")
                    .update([
                        {
                            cliente_id: clienteId,
                            fecha_servicio: formattedDate,
                            horario_servicio: selectedTime,
                            tipo_servicio: tipoServicio,
                            tecnico_id: empleadoId,
                            realizado: estatus,
                            tipo_plaga_id: tipoPlaga,
                            direccion_id: direccion_id,
                            folio: servicios[0]?.folio > 0 ? servicios[0]?.folio : folio_perm,
                            precio: precio,
                        },
                    ] as any)
                    .filter("id", "eq", `${servicios[0].id}`);
                if (error) {
                    console.log("error con estatus realizado");
                    console.error("Error updating data:", error.message);
                } else {
                    if (servicios[0]?.folio > 0) {
                        location.reload();
                        return;
                    }
                    console.log("Data updated successfully:", data);
                    navigate(`/Servicios/${folio_perm}`);
                    location.reload();
                }
            } catch (err) {
                console.log("Error making the update request");
            }
        } else {
            try {
                let utcDate = null;
                if (selectedDate) {
                    utcDate = new Date(
                        Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
                    );
                }

                const formattedDate = utcDate?.toISOString().split("T")[0]; // "YYYY-MM-DD"
                const { data, error } = await supabase
                    .from("Servicios")
                    .update([
                        {
                            cliente_id: clienteId,
                            fecha_servicio: formattedDate,
                            horario_servicio: selectedTime,
                            tipo_servicio: tipoServicio,
                            tecnico_id: empleadoId,
                            realizado: estatus,
                            tipo_plaga_id: tipoPlaga,
                            direccion_id: direccion_id,
                            precio: precio,
                        },
                    ] as any)
                    .filter("id", "eq", `${servicios[0].id}`);
                if (error) {
                    console.log("error con estatus no realizado");
                    console.error("Error updating data:", error.message);
                } else {
                    console.log("Data updated successfully:", data);
                    location.reload();
                }
            } catch (err) {
                console.log("Error making the update request");
            }
        }
    };

    useEffect(() => {
        FetchEmpleado();
        FetchPlagas();
        FetchClientes();
        FetchServicios();
    }, []);
    useEffect(() => {
        if (clienteId) {
            fetchDireccion(clienteId.toString());
        }
    }, [clienteId]);

    const toggleNombreEditable = () => {
        setNombreEditable(!nombreEditable);
    };
    const handleClientClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        const idSacado = +event.target.value;
        setClienteId(idSacado);
    };
    const handleEstatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        const cambio = event.target.value;
        setEstatusString(cambio);

        if (cambio === "Realizado") {
            let confirmation = (await folioPermanenteAlert()).valueOf();
            console.log("la confi: ", (await confirmation).valueOf());
            setStatusFlag((await confirmation).valueOf());
            setConfirmation(confirmation);
            if (!confirmation) {
                setSelectedEstatus(false);
                setStatusFlag(false);
                setConfirmation(confirmation);
            }
            setSelectedEstatus(true);
        } else if (cambio === "No realizado") {
            setSelectedEstatus(false);
            setStatusFlag(false);
        }
    };
    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true);
        setSelectedTime(event.target.value);
    };
    const tipoServicioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        const cambio = event.target.value;
        setTipoServicio(cambio);
    };

    const handleResponsableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        setEmpleadoID(+event.target.value);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleNavigate = () => {
        window.open(`/certificado/${servicios[0]?.id}`);
    };
    const handleNavigateMobile = () => {
        window.open(`/certificado/${servicios[0].id}`);
    };

    const handleDireccionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = +event.target.value;
        setDireccion_id(cambio);
        setClicked(true);
    };

    const handlePrecioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = +event.target.value;
        setPrecio(cambio);
        setClicked(true);
    };

    const fetchDireccion = async (cliente_id: string) => {
        try {
            const { data, error } = await supabase
                .from("Direcciones")
                .select("*")
                .filter("cliente_id", "eq", cliente_id);
            if (data) {
                setDireccion(data);
                //setDireccion_id(data[0]?.id.toString())
            }
            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const setInfoTag = (event: React.MouseEvent<HTMLDivElement>, tag: string) => {
        setInfoTab(tag);
    };

    const hanldeSetData = async (data: number | null) => {
        await setDataFromRegistros(data);
    };

    const handleDateChange = (date: Date | null) => {
        if (!date) return; // Handle null case
        setSelectedDate(date);
    };

    const selectTag = (infoTab: string) => {
        return (
            <div className="selectTag">
                <div
                    className="genInfo infoButtons"
                    onClick={e => {
                        setInfoTag(e, "general");
                    }}
                    style={{
                        background: infoTab === "general" ? "white" : "#0D4E80",
                        color: infoTab === "general" ? "#0D4E80" : "white",
                    }}
                >
                    <p>General</p>
                </div>
                <div
                    className="workInfo infoButtons"
                    onClick={e => {
                        setInfoTag(e, "registros");
                    }}
                    style={{
                        background: infoTab === "registros" ? "white" : "#0D4E80",
                        color: infoTab === "registros" ? "#0D4E80" : "white",
                    }}
                >
                    <p>Registros</p>
                </div>
                <div
                    className="workInfo infoButtons"
                    onClick={e => {
                        setInfoTag(e, "constancia");
                    }}
                    style={{
                        background: infoTab === "constancia" ? "white" : "#0D4E80",
                        color: infoTab === "constancia" ? "#0D4E80" : "white",
                    }}
                >
                    <p>Constancia</p>
                </div>
            </div>
        );
    };

    return (
        <>
            {modalOpen && (
                <Modal
                    registroApId={addButtonClicked ? null : dataFromRegistros}
                    closeModal={closeModal}
                    plagas={plagas}
                    addBtnClicked={addButtonClicked}
                    organizacion={props.organizacion ?? ""}
                ></Modal>
            )}
            {folioModalOpen && (
                <DelModal
                    titulo="Crear folio permanente para el servicio"
                    btnText="Generar folio"
                    closeModal={() => {
                        setFolioModalOpen(false);
                    }}
                    folio={folio}
                    del={() => {
                        updateFolio(props?.organizacion ?? "");
                    }}
                ></DelModal>
            )}
            <ServiciosCardContainer>
                <Titulo>Servicios</Titulo>
                <div className="cardsSeconddContainer">
                    <div className="CardContainerDiv" style={screenWidth > 900 ? { width: "100%" } : { width: "90%" }}>
                        <CardContainer
                        style={screenWidth > 900 ? {marginLeft: "0"} : {marginLeft: "0"}}
                        >
                            <DetallesTitulo>Detalles del Servicio</DetallesTitulo>
                            {selectTag(infoTab)}
                            {(infoTab === "general" ) && (
                                <>
                                    <div className="detailsContainer">
                                        <InputsContainer width={90}>
                                            <DetailsTitle>Folio</DetailsTitle>
                                            <div className="folioInputsCont">
                                                <CardInputs
                                                    largo={servicios[0]?.folio < 0 ? "65%" : "100%"}
                                                    readOnly
                                                    type="text"
                                                    placeholder={
                                                        servicios[0]?.folio < 0
                                                            ? `FT-${servicios[0]?.folio * -1}`
                                                            : servicios[0]?.folio
                                                    }
                                                />
                                                {servicios?.[0]?.folio < 0 && (
                                                    <div
                                                        onClick={() => {
                                                            setFolioModalOpen(true);
                                                        }}
                                                        className="genFolioButt"
                                                        style={{ width: "35%", height: "2.513rem" }}
                                                    >
                                                        <p>Generar folio</p>
                                                    </div>
                                                )}
                                            </div>
                                        </InputsContainer>

                                        <InputsContainer width={90}>
                                            <DetailsTitle>Nombre</DetailsTitle>

                                            <select
                                                value={clienteId}
                                                style={{ ...mainStyle, width: "100%" }}
                                                onChange={handleClientClick}
                                            >
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
                                            </select>
                                        </InputsContainer>

                                        <InputsContainer
                                            style={{ gap: "1rem", alignItems: "center" }}
                                            flexDir={"row"}
                                            width={90}
                                        >
                                            <FechaInput>
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
                                                        onChange={date => {
                                                            handleDateChange(date);
                                                            setClicked(true);
                                                        }}
                                                        dateFormat="YYY/MM/dd"
                                                    />
                                                </div>
                                            </FechaInput>
                                            <TimeInput marginTop={"0"} marginTopTablet={"0"} style={{ width: "100%" }}>
                                                <DetailsTitle>Horario</DetailsTitle>
                                                <Horario
                                                    width={"10rem"}
                                                    style={{
                                                        textAlign: "left",
                                                        marginTop: "0",
                                                        flexGrow: "1",
                                                        padding: "0 2rem 0 .5rem",
                                                        display: "flex",
                                                        justifyContent: "left",
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
                                                        value={direccion_id || ""}
                                                        onChange={handleDireccionChange}
                                                    >
                                                        <option value="">Elige una dirección</option>

                                                        {dirección.map(options => (
                                                            <option value={options.id} key={options.id}>
                                                                {options.calle} {options.numero_ext} {options.colonia}
                                                                {options.ciudad} {options.estado}{" "}
                                                                {options.codigo_postal}
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
                                                <DetailsTitle style={{ width: "100%" }}>Tipo de Servicio</DetailsTitle>
                                                <select
                                                    style={{ ...mainStyle, width: "100%" }}
                                                    value={tipoServicio}
                                                    onChange={tipoServicioChange}
                                                >
                                                    {servicioOptions.map(options => (
                                                        <option value={options.value} key={options.id}>
                                                            {options.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </InputsContainer>

                                        <InputsContainer width={90}>
                                            <DetailsTitle>Aplicador Responsable</DetailsTitle>
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "1rem",
                                                    width: "100%",
                                                }}
                                            >
                                                <select
                                                    value={empleadoId ?? undefined}
                                                    style={{ ...mainStyle, width: "100%" }}
                                                    onChange={e => {
                                                        handleResponsableChange(e);
                                                    }}
                                                >
                                                    {!empleadoId && <option>Elegir al técnico responsable...</option>}
                                                    {empleados.map(empleado => (
                                                        <option value={empleado.id} key={empleado.id}>
                                                            {empleado.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </InputsContainer>

                                        <InputsContainer width={90}>
                                            <DetailsTitle>Estatus</DetailsTitle>
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "1rem",
                                                    width: "100%",
                                                }}
                                            >
                                                <select
                                                    disabled={servicios[0]?.folio > 0 ? true : false}
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
                                <div style={{ position: "relative" }}>
                                    <ButtonComponents
                                        background="white"
                                        height="3rem"
                                        color="#0D4E80"
                                        justify="center"
                                        gap={1}
                                        onClick={() => {
                                            hanldeSetData(null).then(() => {
                                                setModalOpen(true);
                                                setAddButtonClicked(true);
                                            });
                                        }}
                                    >
                                        <p>Añadir registro</p> <IoIosAddCircleOutline size={25} />
                                    </ButtonComponents>

                                    <RegistrosCard
                                        sendDataParent={handleChildData}
                                        openModal={() => {
                                            setModalOpen(true);
                                        }}
                                        servicioId={servicios[0]?.id}
                                    ></RegistrosCard>
                                </div>
                            )}
                            {infoTab === "constancia" && (
                                <div>
                                    <PdfMailButton position="relative">
                                        <p>Registro de aplicación</p>
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: ".25rem",
                                            }}
                                            onClick={handleNavigateMobile}
                                        >
                                            <IoDownloadOutline size={20} color="#2395FF" />
                                            <p>Descargar PDF</p>
                                        </div>
                                    </PdfMailButton>
                                </div>
                            )}
                        </CardContainer>

                        <div className="responsableCard">
                            <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
                                <AddResponsableCard>
                                    <div>
                                        <IoIosAddCircleOutline
                                            size={30}
                                            style={{ color: "black" }}
                                            onClick={() => {
                                                setModalOpen(true);
                                                setAddButtonClicked(true);
                                            }}
                                        />
                                        <TextoAddCard>Añadir registro</TextoAddCard>
                                    </div>
                                </AddResponsableCard>
                                <RegistrosCard
                                    sendDataParent={handleChildData}
                                    openModal={() => {
                                        setModalOpen(true);
                                    }}
                                    servicioId={servicios[0]?.id}
                                ></RegistrosCard>

                                <PlaguicidasCard
                                    openModal={() => {
                                        setModalOpen(true);
                                    }}
                                    servicioId={servicios[0]?.id}
                                    title={"Plaguicidas Utilizados"}
                                ></PlaguicidasCard>

                                {servicios?.[0]?.grupo_de_servicios && (
                                    <>
                                        <GrupoServiciosCard
                                            openModal={() => {
                                                setModalOpen(true);
                                            }}
                                            servicioId={servicios[0]?.id}
                                            title={"Grupo de servicios"}
                                        ></GrupoServiciosCard>
                                    </>
                                )}
                            </div>
                            <div className="infoButtonsContainer">
                                <PdfMailButton posy="4.925">
                                    <p>Registro de aplicación</p>
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: ".25rem",
                                        }}
                                        onClick={handleNavigate}
                                    >
                                        <IoDownloadOutline size={20} color="#2395FF" />
                                        <p>Descargar PDF</p>
                                    </div>
                                </PdfMailButton>
                                <PdfMailButton posy="12.3125">
                                    <p style={{ marginBottom: 0 }}>Precio del Servicio</p>
                                    <div style={{ display: "flex", alignItems: "center", width: "95%" }}>
                                        <span
                                            style={{
                                                color: "#2395FF",
                                                fontSize: "1.2rem",
                                                marginRight: "5px",
                                                marginLeft: ".5rem",
                                            }}
                                        >
                                            $
                                        </span>
                                        <CardInputs
                                            placeholder="Elija un precio"
                                            type="number"
                                            onChange={handlePrecioChange}
                                            style={{
                                                width: "100%",
                                                background: "none",
                                                border: "none",
                                                color: "#2395FF",
                                                fontWeight: "300",
                                                fontSize: "1.2rem",
                                                textAlign: "center",
                                            }}
                                            value={precio}
                                        />
                                    </div>
                                </PdfMailButton>
                            </div>
                        </div>
                    </div>
                </div>
            </ServiciosCardContainer>
            <ReturnButton onClick={() => window.history.back()}>Regresar</ReturnButton>
            <StyledButton
                disabled={!isClicked}
                clicado={isClicked}
                onClick={() => {
                    toggleNombreEditable();
                    updateServicios(confirmation, statusFlag, props.organizacion ?? "", estatus ?? false).then(
                        () => {}
                    );
                }}
            >
                Guardar Cambios
            </StyledButton>
        </>
    );
};

export default ServiciosCard;
