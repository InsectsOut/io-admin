import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Tables } from "./supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import { useToast } from "./rehusableComponents/Toast";
import { ClientList, ClientName, EstatusForma, SearchBar, StyledDatePicker, MobileCard, MobileCardTitle, MobileCardField } from "./Servicios";
import PaginationComponent from "./PaginationComponent";
import {
    FiltrosContainer,
    FiltrosLeft,
    FiltrosLista,
    FiltrosRight,
    ModalContainer,
    ModalContentTop,
    ModalContentBottom,
} from "./Servicios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { servicioOptions } from "./tipo_servicios";

interface serviciosProps {
    organizacion?: string;
}

type Servicio = Tables<"Servicios">;
type Cliente = Tables<"Clientes">;

type ServicioConCliente = Servicio & {
    Clientes: Cliente | null;
};

type Empleado = Tables<"Empleados">;

type TipoBitacora = "ECEXTT" | "ECINT" | "VOLADORES";

type BitacoraRow = {
    id: number;
    direccion_id: number;
    tipo: TipoBitacora;
    estado: "borrador" | "activa" | "archivada";
};

type RevisionRow = {
    id: number;
    servicio_id: number;
    bitacora_id: number | null;
    estado: "en_captura" | "parcial" | "cerrada";
};

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1.5rem;
    box-sizing: border-box;
    @media (max-width: 900px) {
        padding: 1rem;
    }
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Title = styled.h1`
    margin: 0;
    color: ${({ theme }) => theme.primaryColor};
`;

const BackLink = styled(Link)`
    all: unset;
    cursor: pointer;
    color: ${({ theme }) => theme.primaryColor};
    border: 1px solid ${({ theme }) => theme.primaryColor};
    border-radius: 0.4rem;
    padding: 0.45rem 0.75rem;
    font-weight: 600;
`;

const TopControls = styled.div`
    margin-top: 1rem;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const SearchInput = styled(SearchBar)`
    width: min(28rem, 100%);
    min-height: 2.2rem;
    border-radius: 0.4rem;
    border: 1px solid #d8d8d8;
    padding: 0 0.7rem;
    margin: 0;
`;



// ---- Contenedor de lista ----
const BitacorasListContainer = styled.div`
    margin-top: 1rem;
    width: 100%;
    background: white;
    border: 1px solid #ececec;
    border-radius: 0.5rem;
    overflow: hidden;
`;

// ---- Fila de lista (desktop / tablet) ----
const BitacoraListRow = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    min-height: 4rem;
    padding: 0.35rem 0;
    background: white;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f9fbff;
    }
`;

const FolioCell = styled.div`
    flex: 0 0 38%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 1rem;
    gap: 0.15rem;
    overflow: hidden;

    .folio-title {
        font-weight: 700;
        color: ${({ theme }) => theme.primaryColor};
        font-size: 0.95rem;
    }
    .folio-client {
        color: #606060;
        font-size: 0.84rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 900px) {
        flex: 0 0 44%;
    }
`;

const FechaCell = styled.div`
    flex: 0 0 13%;
    color: #727272;
    font-size: 0.85rem;
    padding: 0 0.5rem;

    @media (max-width: 900px) {
        display: none;
    }
`;

const TypesCell = styled.div`
    flex: 1;
    display: flex;
    gap: 0.4rem;
    padding: 0 0.6rem 0 0.3rem;
    align-items: stretch;
`;

const TypeBadgeInline = styled.div`
    flex: 1;
    min-width: 0;
    border: 1px solid #e5e5e5;
    border-radius: 0.35rem;
    padding: 0.35rem 0.3rem;
    text-align: center;
    font-size: 0.78rem;
    background: #fafafa;
    color: #4b4b4b;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    line-height: 1.25;

    strong {
        color: #2a5f8c;
        font-size: 0.9rem;
        font-weight: 700;
    }
`;

const TypeStatusText = styled.span`
    color: #5a5a5a;
    font-size: 0.72rem;
    line-height: 1.2;
`;

const EstacionesCell = styled.div`
    flex: 0 0 7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;

    @media (max-width: 900px) {
        flex: 0 0 5.5rem;
    }
`;

const EstacionesLink = styled(Link)`
    all: unset;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 700;
    color: ${({ theme }) => theme.primaryColor};
    border: 1px solid ${({ theme }) => theme.primaryColor};
    border-radius: 0.35rem;
    padding: 0.3rem 0.55rem;
    text-align: center;
    white-space: nowrap;

    &:hover {
        background: #eaf3fb;
    }
`;

// ---- Tarjeta móvil (<=600px) ----
const TypesRow = styled.div`
    margin-top: 0.6rem;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.45rem;
`;

const TypeBadge = styled.div`
    border: 1px solid #e5e5e5;
    border-radius: 0.35rem;
    padding: 0.45rem;
    text-align: center;
    font-size: 0.78rem;
    background: #fafafa;
    color: #4b4b4b;
    line-height: 1.25;

    strong {
        color: #2a5f8c;
        font-size: 1.05rem;
    }
`;

const BadgeStatus = styled.p`
    margin: 0.35rem 0 0;
    color: #4b4b4b;
`;

const BadgeActionButton = styled.button`
    all: unset;
    margin-top: 0.25rem;
    width: 100%;
    min-height: 1.75rem;
    border-radius: 0.35rem;
    text-align: center;
    font-size: 0.73rem;
    font-weight: 700;
    border: 1px solid ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.primaryColor};
    background: #edf4fb;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.55;
    }
`;

export const Bitacoras: React.FC<serviciosProps> = props => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [servicios, setServicios] = useState<ServicioConCliente[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [bitacoras, setBitacoras] = useState<BitacoraRow[]>([]);
    const [revisiones, setRevisiones] = useState<RevisionRow[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [textModal, setTextModal] = useState("");
    const [isRotated, setIsRotated] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [clientId, setClientId] = useState<number | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [text, setText] = useState<string>("");
    const [startDate, setStartDate] = useState<null | Date>(null);
    const [endDate, setEndDate] = useState<null | Date>(null);
    const today = new Date();
    const [selectedOptions, setSelectedOptions] = useState<string>("");
    const [estatus, setEstatus] = useState<boolean | null>(null);
    const estatusRefRealizado = useRef<HTMLInputElement>(null);
    const estatusRefNorealizado = useRef<HTMLInputElement>(null);
    const [tipoServicio, setTipoServicio] = useState<string>("");
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [tecnicoId, setTecnicoId] = useState<number | null>(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const tipos: TipoBitacora[] = ["ECEXTT", "ECINT", "VOLADORES"];

    const tipoAbreviado: Record<TipoBitacora, string> = {
        ECEXTT: "EXT",
        ECINT: "INT",
        VOLADORES: "VOL",
    };

    const fetchServicios = async (folioBuscado?: string) => {
        try {
            const url = new URL(window.location.href);
            const params = url.searchParams;

            const clienteParam = params.get("cliente");
            const tipoServicioParam = params.get("tipo_servicio");
            const tecnicoIdParam = params.get("tecnico_id");
            const realizadoParam = params.get("realizado");
            const startDateParam = params.get("startDate");
            const endDateParam = params.get("endDate");
            const currentPageParam = params.get("currentPage");
            const busquedaParam = params.get("busqueda");

            const clienteId = clienteParam ? Number(clienteParam) : null;
            const tecnicoId = tecnicoIdParam ? Number(tecnicoIdParam) : null;
            const estatus = realizadoParam === "true" ? true : realizadoParam === "false" ? false : undefined;

            setLoading(true);
            let query = supabase

                .from("Servicios")
                .select("*, Clientes!inner(*)", { count: "exact" })
                .eq("organizacion", props.organizacion ?? "")
                .order("fecha_servicio", { ascending: false })
                .range(
                    ((Number(currentPageParam) || 1) - 1) * itemsPerPage,
                    (Number(currentPageParam) || 1) * itemsPerPage - 1
                );

            if (folioBuscado && !Number.isNaN(Number(folioBuscado))) {
                query = query.eq("folio", Number(folioBuscado));
            }

            if (clienteId) {
                query = query.eq("Clientes.id", clienteId);
            }

            if (tipoServicioParam) {
                query = query.eq("tipo_servicio", tipoServicioParam);
            }

            if (tecnicoId) {
                query = query.eq("tecnico_id", tecnicoId);
            }

            if (estatus !== undefined) {
                query = query.eq("realizado", estatus);
            }

            if (startDateParam && endDateParam) {
                const formattedStartDate = new Date(startDateParam).toISOString().split("T")[0];
                const formattedEndDate = new Date(endDateParam).toISOString().split("T")[0];
                query = query.gte("fecha_servicio", formattedStartDate).lte("fecha_servicio", formattedEndDate);
            }

            const { data, error, count } = await query;
            const totalPages = count && Math.ceil(count / itemsPerPage);
            setTotalPages(totalPages || 0);
            if (error) throw error;
            setServicios(data ?? []);
            console.log("Servicios cargados", data);
        } catch (err: any) {
            showToast("No se pudo cargar la lista de servicios para bitacoras", "error");
            console.log("Error al cargar servicios para bitacoras", err?.message ?? err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientes = async () => {
        try {
            const { data, error } = await supabase
                .from("Clientes")
                .select("*")
                .eq("organizacion", props.organizacion ?? "");
            if (error) throw error;
            return data ?? [];
        } catch (err: any) {
            console.log("Error cargando clientes", err?.message ?? err);
            return [];
        }
    };

    const fetchBitacoras = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from("Bitacoras")
                .select("id, direccion_id, tipo, estado")
                .eq("organizacion", props.organizacion ?? "")
                .eq("estado", "activa");

            if (error) throw error;
            setBitacoras((data ?? []) as BitacoraRow[]);
        } catch (err: any) {
            console.log("Error cargando bitacoras", err?.message ?? err);
        }
    };

    const fetchRevisiones = async (serviciosData: ServicioConCliente[], bitacorasData: BitacoraRow[]) => {
        try {
            if (serviciosData.length === 0 || bitacorasData.length === 0) {
                setRevisiones([]);
                return;
            }

            const servicioIds = serviciosData.map(s => s.id);
            const bitacoraIds = bitacorasData.map(b => b.id);

            const { data, error } = await (supabase as any)
                .from("RevisionesBitacora")
                .select("id, servicio_id, bitacora_id, estado")
                .in("servicio_id", servicioIds)
                .in("bitacora_id", bitacoraIds);

            if (error) throw error;
            setRevisiones((data ?? []) as RevisionRow[]);
        } catch (err: any) {
            console.log("Error cargando revisiones", err?.message ?? err);
        }
    };

    const getBitacoraPorServicioTipo = (servicio: ServicioConCliente, tipo: TipoBitacora) => {
        return bitacoras.find(b => b.direccion_id === servicio.direccion_id && b.tipo === tipo);
    };

    const getRevisionEstado = (servicioId: number, bitacoraId: number | undefined) => {
        if (!bitacoraId) return null;
        const revision = revisiones.find(r => r.servicio_id === servicioId && r.bitacora_id === bitacoraId);
        return revision?.estado ?? null;
    };

    const refreshBitacoraData = async (serviciosData?: ServicioConCliente[]) => {
        const serviciosBase = serviciosData ?? servicios;
        await fetchBitacoras();
        const { data } = await (supabase as any)
            .from("Bitacoras")
            .select("id, direccion_id, tipo, estado")
            .eq("organizacion", props.organizacion ?? "")
            .eq("estado", "activa");
        const bitacorasActuales = (data ?? []) as BitacoraRow[];
        setBitacoras(bitacorasActuales);
        await fetchRevisiones(serviciosBase, bitacorasActuales);
    };

    const crearBitacora = async (servicio: ServicioConCliente, tipo: TipoBitacora) => {
        if (!servicio.direccion_id || !servicio.cliente_id) {
            showToast("El servicio no tiene direccion o cliente asociado", "error");
            return;
        }

        try {
            setSubmitting(true);
            const { error } = await (supabase as any).from("Bitacoras").insert([
                {
                    organizacion: props.organizacion ?? "",
                    cliente_id: servicio.cliente_id,
                    direccion_id: servicio.direccion_id,
                    tipo,
                    nombre: `${tipoAbreviado[tipo]} - Direccion ${servicio.direccion_id}`,
                    estado: "activa",
                    version: 1,
                },
            ]);

            if (error) {
                showToast(error.message.includes("duplicate") ? "La bitacora ya existe" : error.message, "error");
                return;
            }

            showToast(`Bitacora ${tipoAbreviado[tipo]} creada`, "success");
            await refreshBitacoraData();
        } catch (err: any) {
            showToast("No se pudo crear la bitacora", "error");
            console.log("Error creando bitacora", err?.message ?? err);
        } finally {
            setSubmitting(false);
        }
    };

    const iniciarRevision = async (servicio: ServicioConCliente, tipo: TipoBitacora) => {
        const bitacora = getBitacoraPorServicioTipo(servicio, tipo);
        if (!bitacora) {
            showToast("Primero crea la bitacora de ese tipo", "error");
            return;
        }

        try {
            setSubmitting(true);
            const { error } = await (supabase as any).from("RevisionesBitacora").upsert(
                [
                    {
                        bitacora_id: bitacora.id,
                        servicio_id: servicio.id,
                        direccion_id: servicio.direccion_id,
                        estado: "en_captura",
                        no_hay_bitacora_disponible: false,
                        folio: servicio.folio,
                        fecha_servicio: servicio.fecha_servicio,
                    },
                ],
                { onConflict: "servicio_id,bitacora_id" }
            );

            if (error) {
                showToast("No se pudo iniciar la revision", "error");
                console.log("Error iniciando revision", error);
                return;
            }

            showToast(`Revision ${tipoAbreviado[tipo]} en captura`, "success");
            await refreshBitacoraData();
            navigate(`/bitacoras/servicio/${servicio.id}/tipo/${tipo}`);
        } catch (err: any) {
            showToast("No se pudo iniciar la revision", "error");
            console.log("Error iniciando revision", err?.message ?? err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const folioDesdeUrl = new URLSearchParams(window.location.search).get("folio") ?? "";
        if (folioDesdeUrl) {
            setBusqueda(folioDesdeUrl);
        }
        const run = async () => {
            await fetchServicios(folioDesdeUrl);
        };
        run();
    }, [currentPage]);

    useEffect(() => {
        if (clientes.length === 0) {
            const run = async () => {
                const clientesData = await fetchClientes();
                setClientes(clientesData);
            };
            run();
        }
         const fetchTecnicos = async () => {
            try {
                const { data, error } = await supabase
                    .from("Empleados")
                    .select("*")
                    .eq("organizacion", props.organizacion ?? "");

                if (error) {
                    setClientes([]);
                    console.log("Error consiguiendo los datos del cliente", error);
                }
                if (data) {
                    setEmpleados(data);
                }
            } catch (err) {
                console.log("Ocurrió un error al realizar la operacó", err);
            }
        };
        fetchTecnicos()
    }, []);

    useEffect(() => {
        refreshBitacoraData();
    }, [servicios.length]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const serviciosFiltrados = useMemo(() => {
        if (!busqueda.trim()) return servicios;
        const texto = busqueda.toLowerCase().trim();
        return servicios.filter(servicio => {
            const folioText = `${servicio.folio}`.toLowerCase();
            const clienteText = `${servicio?.Clientes?.nombre ?? ""} ${servicio?.Clientes?.apellidos ?? ""}`
                .toLowerCase()
                .trim();
            return folioText.includes(texto) || clienteText.includes(texto);
        });
    }, [servicios, busqueda]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const url = new URL(window.location.href);
        const params = url.searchParams;
        params.set("currentPage", page.toString());
        url.search = params.toString();
        window.history.pushState({}, "", url.toString());
    };

    const handleFiltrosClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = event.currentTarget as HTMLLIElement;
        const { top, left, height } = target.getBoundingClientRect();
        console.log(target.id);

        const newPosition = {
            top: top + height + window.scrollY,
            left: left + window.scrollX,
        };

        // If the modal is currently visible and the same element is clicked, hide the modal
        if (modalVisible && modalPosition.top === newPosition.top && modalPosition.left === newPosition.left) {
            setModalVisible(false);
        } else if (
            modalVisible &&
            modalPosition.top === newPosition.top &&
            modalPosition.left === newPosition.left - 100
        ) {
            setModalVisible(false);
        } else {
            // Otherwise, show the modal at the new position
            if (window.innerWidth <= 900 && target.id === "estatusFilter") {
                newPosition.left -= 100;
                console.log(newPosition.left);
                setModalPosition(newPosition);
                setModalVisible(true);
            } else {
                setModalPosition(newPosition);
                setModalVisible(true);
            }
        }
    };

    const handleRotation = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = event.currentTarget as HTMLLIElement;
        const innerText = target.id.trim();
        setTextModal(innerText);
        setIsRotated(prev => !prev);
    };

    const handleClientClick = (clienteId: number) => {
        setClientId(clienteId);
    };

    const getClientNameStyle = (clienteId: number) => ({
        backgroundColor: clientId === clienteId ? "#d3c7e9" : "white",
        cursor: "pointer", // Optional: add a pointer cursor for better UX
    });

    const clearQueryParameter = (toClear: string) => {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        params.delete(toClear); // Remove the specific param

        url.search = params.toString();
        window.history.replaceState({}, "", url.toString());
        fetchServicios();
        setModalVisible(false);
        setIsRotated(false);
    };

    const handleClearSelection = () => {
        document.querySelectorAll<HTMLInputElement>('div.optionsContainer input[type="radio"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        // setSelectedOptions("")
        // setEstatus(null)
    };

    const handleSetText = async (paramsList: string[], valuesList: string[]) => {
        if (paramsList.length !== valuesList.length) {
            console.error("Parameter and value arrays must be of the same length.");
            return;
        }

        const text = textModal;
        const url = new URL(window.location.href);
        const params = url.searchParams;
        params.set("currentPage", "1"); // Reset to first page on filter change

        // Set each parameter
        paramsList.forEach((param, index) => {
            params.set(param, valuesList[index]);
        });

        url.search = params.toString();
        window.history.pushState({}, "", url.toString());

        if (textModal && text) {
            setText(text);
            fetchServicios();
            setModalVisible(false);
            setIsRotated(false);
        }
    };

    const normalizeDate = (date: Date | null): Date | null => {
        if (!date) return null;
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0); // Set time to local midnight
        return normalized;
    };

    const handleModalCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (value === "Realizado") {
            setEstatus(true);
        } else if (value === "Norealizado") {
            setEstatus(false);
        }
        setSelectedOptions(value);
    };

    const handlePageSetter = async () => {
        //await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second
        setCurrentPage(1);
    };

    const handleTipoServicio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTipoServicio(value);
    };
    const handleTecnicoClick = (tecnicoId: number) => {
        setTecnicoId(tecnicoId);
    };

    const getTecnicoId = (tecniId: number) => ({
        backgroundColor: tecnicoId === tecniId ? "#d3c7e9" : "white",
        cursor: "pointer", // Optional: add a pointer cursor for better UX
    });

      const clearSelectionTecnico = () => {
        setTecnicoId(null);
    };

    return (
        <PageContainer>
            <HeaderRow>
                <Title>Bitacoras</Title>
                <BackLink to="/Servicios">Volver a servicios</BackLink>
            </HeaderRow>

            <TopControls>
                <SearchInput
                    placeholder="Buscar por folio o cliente"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
            </TopControls>
            <FiltrosContainer style={{ marginLeft: "0" }}>
                <FiltrosLeft>
                    <FiltrosLista
                        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            handleFiltrosClick(event);
                            handleRotation(event);
                        }}
                        minWidth="5rem"
                        id="Cliente"
                    >
                        Cliente
                    </FiltrosLista>
                    <FiltrosLista
                        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            handleFiltrosClick(event);
                            handleRotation(event);
                        }}
                        minWidth="5rem"
                        id="Fecha"
                    >
                        Fecha
                    </FiltrosLista>
                    <FiltrosLista
                        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            handleFiltrosClick(event);
                            handleRotation(event);
                        }}
                        minWidth="5rem"
                        id="Estatus"
                    >
                        Estatus
                    </FiltrosLista>
                    <FiltrosLista
                        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            handleFiltrosClick(event);
                            handleRotation(event);
                        }}
                        minWidth="5rem"
                        id="TipoDeServicio"
                    >
                        Tipo de Servicio
                    </FiltrosLista>
                    <FiltrosLista
                        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            handleFiltrosClick(event);
                            handleRotation(event);
                        }}
                        minWidth="5rem"
                        id="Tecnico"
                    >
                        Técnico
                    </FiltrosLista>
                </FiltrosLeft>
                {modalVisible && (
                    <>
                        <ModalContainer
                            open={modalVisible}
                            style={{ top: modalPosition.top, left: modalPosition.left }}
                            ref={modalRef}
                        >
                            <ModalContentTop open={modalVisible} className={isRotated ? "rotated" : ""}>
                                {textModal === "Cliente" && (
                                    <>
                                        {clientes.length > 0 && (
                                            <ClientList>
                                                {clientes
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
                                    </>
                                )}

                                {textModal === "Fecha" && (
                                    <div>
                                        <p style={{ color: "#727272", marginBottom: "0" }}>Selecciona una fecha</p>
                                        <div className="dateFilterInputs">
                                            <div className="dateTexts">
                                                <StyledDatePicker
                                                    selected={startDate || today}
                                                    onChange={date => setStartDate(normalizeDate(date))}
                                                    dateFormat="yyyy/MM/dd"
                                                />
                                                <p>Inicial</p>
                                            </div>
                                            <div className="dateTexts">
                                                <StyledDatePicker
                                                    selected={endDate || today}
                                                    onChange={date => setEndDate(normalizeDate(date))}
                                                    dateFormat="yyyy/MM/dd"
                                                />
                                                <p>Final</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {textModal === "Estatus" && (
                                    <EstatusForma>
                                        <div className="optionsContainer" id="realizadoContainer">
                                            <input
                                                ref={estatusRefRealizado}
                                                type="radio"
                                                className="checked"
                                                id="realizado"
                                                name="choice"
                                                value="Realizado"
                                                onChange={handleModalCheck}
                                                checked={estatus as boolean}
                                            />
                                            <label id="realizado2" htmlFor="realizado">
                                                Realizado
                                            </label>
                                        </div>
                                        <div className="optionsContainer" id="noRealizadoContainer">
                                            <input
                                                ref={estatusRefNorealizado}
                                                type="radio"
                                                className="checked"
                                                id="no-realizado"
                                                name="choice"
                                                value="Norealizado"
                                                onChange={handleModalCheck}
                                                checked={!estatus && estatus !== (null as any)}
                                            />
                                            <label id="noRealizado2" htmlFor="no-realizado">
                                                No realizado{" "}
                                            </label>
                                        </div>
                                    </EstatusForma>
                                )}
                                {textModal === "TipoDeServicio" && (
                                    <EstatusForma>
                                        {servicioOptions.map(tipo => (
                                            <div key={tipo.id} className="optionsContainer" id="realizadoContainer">
                                                <input
                                                    type="radio"
                                                    className="checked"
                                                    id={tipo.id.toLocaleString()}
                                                    name="choice"
                                                    value={tipo.value}
                                                    onChange={handleTipoServicio}
                                                    checked={tipoServicio === tipo.value}
                                                />
                                                <label id="realizado2" htmlFor={tipo.id.toLocaleString()}>
                                                    {tipo.label}
                                                </label>
                                            </div>
                                        ))}
                                    </EstatusForma>
                                )}
                                {textModal === "Tecnico" && empleados && (
                                    <ClientList>
                                        {empleados
                                            .slice()
                                            .sort((a, b) => {
                                                const nameA = `${a.nombre}`.toUpperCase();
                                                const nameB = `${b.nombre}`.toUpperCase();
                                                return nameA.localeCompare(nameB);
                                            })
                                            .map(empleado => (
                                                <ClientName
                                                    key={empleado.id}
                                                    onClick={() => handleTecnicoClick(empleado.id)}
                                                    style={getTecnicoId(empleado.id)}
                                                >
                                                    {empleado.nombre}
                                                </ClientName>
                                            ))}
                                    </ClientList>
                                )}
                            </ModalContentTop>
                            <ModalContentBottom open={modalVisible}>
                                <div className="filtroActionButtons">
                                    {textModal === "Cliente" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    clearQueryParameter("cliente");
                                                    setClientId(null);
                                                    handleClearSelection();
                                                }}
                                                className="actionButtonsStyles"
                                                id="limpiar"
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                type="button"
                                                className="actionButtonsStyles"
                                                id="aplicar"
                                                onClick={async () => {
                                                    await setCurrentPage(1);

                                                    await handleSetText(["cliente"], [clientId?.toString() ?? ""]).then(
                                                        async () => {
                                                            // filterServicios()
                                                            setIsRotated(false);
                                                        }
                                                    );
                                                }}
                                            >
                                                Aplicar
                                            </button>
                                        </>
                                    )}
                                    {textModal === "Fecha" && (
                                        <>
                                            <button
                                                onClick={async () => {
                                                    await setStartDate(new Date());
                                                    await setEndDate(new Date());
                                                    await handleSetText(
                                                        ["startDate", "endDate"],
                                                        [
                                                            new Date()?.toISOString().split("T")[0] ?? "",
                                                            new Date()?.toISOString().split("T")[0] ?? "",
                                                        ]
                                                    );
                                                    await clearQueryParameter("startDate");
                                                    await clearQueryParameter("endDate");
                                                }}
                                                className="actionButtonsStyles"
                                                id="limpiar"
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                type="button"
                                                className="actionButtonsStyles"
                                                id="aplicar"
                                                onClick={async () => {
                                                    handleSetText(
                                                        ["startDate", "endDate"],
                                                        [
                                                            startDate?.toISOString().split("T")[0] ?? "",
                                                            endDate?.toISOString().split("T")[0] ?? "",
                                                        ]
                                                    ).then(() => {
                                                        setIsRotated(false);
                                                    });
                                                }}
                                            >
                                                Aplicar
                                            </button>
                                        </>
                                    )}
                                    {textModal === "Estatus" && (
                                        <div className="filtroActionButtons">
                                            <button
                                                className="actionButtonsStyles"
                                                id="limpiar"
                                                onClick={() => {
                                                    clearQueryParameter("realizado");
                                                    handleClearSelection();
                                                }}
                                            >
                                                Limpiar
                                            </button>
                                            <button
                                                style={{ color: "white" }}
                                                className="actionButtonsStyles"
                                                id="aplicar"
                                                onClick={() => {
                                                    handleSetText(["realizado"], [estatus?.toString() ?? ""]).then(
                                                        () => {
                                                            //filterServicios()
                                                            handlePageSetter();
                                                            //setIsRotated4(false);
                                                        }
                                                    );
                                                }}
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {textModal === "TipoDeServicio" && (
                                    <div className="filtroActionButtons">
                                        <button
                                            className="actionButtonsStyles"
                                            id="limpiar"
                                            onClick={() => {
                                                clearQueryParameter("tipo_servicio");
                                                handleClearSelection();
                                            }}
                                        >
                                            Limpiar
                                        </button>
                                        <button
                                            className="actionButtonsStyles"
                                            id="aplicar"
                                            onClick={() => {
                                                handleSetText(["tipo_servicio"], [tipoServicio]).then(() => {
                                                    // filterServicios()
                                                    handlePageSetter();
                                                    // setIsRotated2(false);
                                                });
                                            }}
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                )}
                                {textModal === "Tecnico" && 
                                 <div className="filtroActionButtons">
                                                <button
                                                    className="actionButtonsStyles"
                                                    id="limpiar"
                                                    onClick={() => {
                                                        clearQueryParameter("tecnico_id");
                                                        clearSelectionTecnico();
                                                    }}
                                                >
                                                    Limpiar
                                                </button>
                                                <button
                                                    style={{ color: "white" }}
                                                    className="actionButtonsStyles"
                                                    id="aplicar"
                                                    onClick={() => {
                                                        handleSetText(
                                                            ["tecnico_id"],
                                                            [tecnicoId?.toString() ?? ""]
                                                        ).then(() => {
                                                            //filterServicios()
                                                            handlePageSetter();
                                                           // setIsRotated5(false);
                                                        });
                                                    }}
                                                >
                                                    Aplicar
                                                </button>
                                            </div>
                                }
                            </ModalContentBottom>
                        </ModalContainer>
                    </>
                )}
                <FiltrosRight>
                    <PaginationComponent
                        currentPage={
                            new URLSearchParams(window.location.search).get("currentPage")
                                ? Number(new URLSearchParams(window.location.search).get("currentPage"))
                                : currentPage
                        }
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    ></PaginationComponent>
                </FiltrosRight>
            </FiltrosContainer>


            {loading && <p style={{ color: "#606060", fontSize: "0.92rem", margin: "1rem 0" }}>Cargando servicios...</p>}

            {!loading && servicios.length === 0 && <p style={{ color: "#606060", fontSize: "0.92rem", margin: "1rem 0" }}>No hay servicios para mostrar con ese filtro.</p>}

            <BitacorasListContainer>
                {serviciosFiltrados.map(servicio => {
                    const folioText =
                        servicio.folio < 0 ? `FT-${servicio.folio * -1}` : `${servicio.folio}`;
                    const clienteNombre = `${
                        servicio?.Clientes?.nombre ?? ""
                    } ${servicio?.Clientes?.apellidos ?? ""}`.trim();

                    const tiposBadges = tipos.map(tipo => {
                        const bitacora = getBitacoraPorServicioTipo(servicio, tipo);
                        const estadoRevision = getRevisionEstado(servicio.id, bitacora?.id);
                        const tieneBitacora = Boolean(bitacora);
                        const statusText = tieneBitacora
                            ? estadoRevision ?? "Lista"
                            : "Sin bitácora";
                        return { tipo, tieneBitacora, estadoRevision, statusText };
                    });

                    if (screenWidth <= 600) {
                        return (
                            <MobileCard key={servicio.id}>
                                <MobileCardTitle>Folio {folioText}</MobileCardTitle>
                                <MobileCardField>
                                    <strong>Cliente:</strong> {clienteNombre}
                                </MobileCardField>
                                <MobileCardField>
                                    <strong>Fecha:</strong> {servicio.fecha_servicio}
                                </MobileCardField>
                                <TypesRow>
                                    {tiposBadges.map(({ tipo, tieneBitacora, estadoRevision, statusText }) => (
                                        <TypeBadge key={`${servicio.id}-${tipo}`}>
                                            <strong>{tipoAbreviado[tipo]}</strong>
                                            <BadgeStatus>{statusText}</BadgeStatus>
                                            <BadgeActionButton
                                                disabled={submitting}
                                                onClick={() =>
                                                    tieneBitacora
                                                        ? iniciarRevision(servicio, tipo)
                                                        : crearBitacora(servicio, tipo)
                                                }
                                            >
                                                {!tieneBitacora
                                                    ? "Crear"
                                                    : estadoRevision
                                                    ? "Continuar"
                                                    : "Iniciar"}
                                            </BadgeActionButton>
                                        </TypeBadge>
                                    ))}
                                </TypesRow>
                                {servicio.direccion_id && (
                                    <div style={{ marginTop: "0.6rem" }}>
                                        <EstacionesLink
                                            to={`/bitacoras/direccion/${servicio.direccion_id}`}
                                            style={{ display: "block", textAlign: "center" }}
                                        >
                                            Configurar estaciones
                                        </EstacionesLink>
                                    </div>
                                )}
                            </MobileCard>
                        );
                    }

                    return (
                        <BitacoraListRow key={servicio.id}>
                            <FolioCell>
                                <span className="folio-title">Folio {folioText}</span>
                                <span className="folio-client">{clienteNombre}</span>
                            </FolioCell>
                            <FechaCell>{servicio.fecha_servicio}</FechaCell>
                            <TypesCell>
                                {tiposBadges.map(({ tipo, tieneBitacora, estadoRevision, statusText }) => (
                                    <TypeBadgeInline key={`${servicio.id}-${tipo}`}>
                                        <strong>{tipoAbreviado[tipo]}</strong>
                                        <TypeStatusText>{statusText}</TypeStatusText>
                                        <BadgeActionButton
                                            disabled={submitting}
                                            onClick={() =>
                                                tieneBitacora
                                                    ? iniciarRevision(servicio, tipo)
                                                    : crearBitacora(servicio, tipo)
                                            }
                                        >
                                            {!tieneBitacora
                                                ? "Crear"
                                                : estadoRevision
                                                ? "Continuar"
                                                : "Iniciar"}
                                        </BadgeActionButton>
                                    </TypeBadgeInline>
                                ))}
                            </TypesCell>
                            <EstacionesCell>
                                {servicio.direccion_id ? (
                                    <EstacionesLink to={`/bitacoras/direccion/${servicio.direccion_id}`}>
                                        Estaciones
                                    </EstacionesLink>
                                ) : null}
                            </EstacionesCell>
                        </BitacoraListRow>
                    );
                })}
            </BitacorasListContainer>
        </PageContainer>
    );
};

export default Bitacoras;
