import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { supabase } from "./utils/ClientSupabase";
import { useToast } from "./rehusableComponents/Toast";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { StyledInput, StyledButton } from "./FormComponents";
import { downloadBitacoraExcel } from "./utils/ExcelGenerator";

type TipoBitacora = "ECEXTT" | "ECINT" | "VOLADORES";

type ServicioData = {
    id: number;
    folio: number;
    fecha_servicio: string;
    direccion_id: number;
    cliente_id: number;
};

type BitacoraData = {
    id: number;
    tipo: TipoBitacora;
};

type RevisionData = {
    id: number;
    estado: "en_captura" | "parcial" | "cerrada";
};

type Estacion = {
    id: number;
    codigo_estacion: string;
    area: string | null;
    zona: string | null;
};

type Captura = {
    id?: number;
    revisada: boolean;
    consumo_porcentaje: number | null;
    goma_cambiada: boolean | null;
    observacion: string;
};

type Plaga = {
    id: number;
    plaga: string | null;
};

type ClaveBitacora = {
    id: number;
    clave: string;
    concepto: string;
    titulo: string;
    tipo: TipoBitacora | null;
};

type Hallazgo = {
    id?: number;
    plaga_id: number | null;
    cantidad: number;
    comentario: string | null;
};

type ClaveEstacion = {
    id?: number;
    clave_id: number;
};

type RolEmpleado = "tecnico" | "administrador" | "superadmin" | null;

interface BitacoraServicioProps {
    organizacion?: string;
}

const Wrap = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 1.2rem 1.4rem;
    color: #333;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Title = styled.h1`
    margin: 0;
    color: ${({ theme }) => theme.primaryColor};
`;

const ReturnLink = styled(Link)`
    all: unset;
    cursor: pointer;
    color: ${({ theme }) => theme.primaryColor};
    border: 1px solid ${({ theme }) => theme.primaryColor};
    border-radius: 0.35rem;
    padding: 0.4rem 0.7rem;
    font-weight: 700;
`;

const Card = styled.div`
    margin-top: 0.9rem;
    border: 1px solid #e8e8e8;
    border-radius: 0.6rem;
    background: #fff;
    padding: 0.9rem;
`;

const Row = styled.div`
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0.55rem;
`;

const Label = styled.label`
    font-weight: 700;
    color: #4f4f4f;
`;

const Textarea = styled.textarea`
    width: 100%;
    min-height: 4rem;
    border: 1px solid #d4d4d4;
    border-radius: 0.35rem;
    padding: 0.45rem;
    box-sizing: border-box;
    resize: vertical;
`;

const Actions = styled.div`
    margin-top: 1rem;
    display: flex;
    gap: 0.6rem;
`;

const Button = styled.button`
    all: unset;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.primaryColor};
    background: #eaf3fb;
    border-radius: 0.4rem;
    padding: 0.45rem 0.9rem;
    font-weight: 700;

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
`;

const EstadoTag = styled.span`
    display: inline-block;
    border-radius: 0.35rem;
    background: #f2f2f2;
    color: #555;
    padding: 0.2rem 0.45rem;
    font-size: 0.82rem;
    font-weight: 700;
`;

const SubsectionTitle = styled.h3`
    margin: 0.75rem 0 0.5rem 0;
    color: ${({ theme }) => theme.primaryColor};
    font-size: 0.95rem;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.4rem;
`;

const HallazgoText = styled.span`
    flex: 1;
    color: #333;
`;

const DeleteButton = styled.button`
    all: unset;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 700;

    &:hover {
        background: #fdd;
    }
`;

const InputRow = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    flex-wrap: wrap;
`;

const PlagasSection = styled.div`
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #fafafa;
    border-radius: 0.4rem;
    border-left: 3px solid #1976d2;
`;

const PlagasForm = styled.div`
    display: grid;
    grid-template-columns: minmax(18rem, 22rem) 5.5rem auto;
    column-gap: 0.75rem;
    row-gap: 0.5rem;
    align-items: flex-end;
    margin-bottom: 0.75rem;

    @media (max-width: 900px) {
        grid-template-columns: minmax(14rem, 20rem) 5rem auto;
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const PlagasListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const HallazgoItemStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.7rem;
    background: #fff;
    border-left: 3px solid #4caf50;
    border-radius: 0.3rem;
    font-size: 0.9rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HallazgoInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;

    strong {
        color: #1a1a1a;
    }

    small {
        color: #666;
        font-size: 0.8rem;
    }
`;

const ClavesSection = styled.div`
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #fafafa;
    border-radius: 0.4rem;
    border-left: 3px solid #ff9800;
`;

const ClavesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.8rem;
    margin-top: 0.5rem;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const EmptyClaves = styled.p`
    margin: 0.5rem 0 0;
    color: #666;
    font-size: 0.85rem;
`;

const ClaveItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #fff;
    border-radius: 0.3rem;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #1976d2;
        background: #f0f7ff;
    }

    input {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    label {
        flex: 1;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin: 0;

        strong {
            color: #1976d2;
            font-size: 0.85rem;
        }

        small {
            color: #666;
            font-size: 0.75rem;
        }
    }
`;

const ClaveCode = styled.span`
    display: inline-block;
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 0.8rem;
`;

const SmallButton = styled.button`
    all: unset;
    display: inline-flex;
    width: fit-content;
    min-width: 4.5rem;
    height: 2.2rem;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    margin-left: 0.75rem;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.primaryColor};
    background: #eaf3fb;
    border-radius: 0.3rem;
    padding: 0 0.7rem;
    font-weight: 700;
    font-size: 0.8rem;

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background: #d5e8f7;
    }
`;

const tipToLabel: Record<TipoBitacora, string> = {
    ECEXTT: "Exterior",
    ECINT: "Interior",
    VOLADORES: "Voladores",
};

const BitacoraServicio: React.FC<BitacoraServicioProps> = ({ organizacion }) => {
    const { showToast } = useToast();
    const { servicioId, tipo } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);
    const [servicio, setServicio] = useState<ServicioData | null>(null);
    const [bitacora, setBitacora] = useState<BitacoraData | null>(null);
    const [revision, setRevision] = useState<RevisionData | null>(null);
    const [estaciones, setEstaciones] = useState<Estacion[]>([]);
    const [capturas, setCapturas] = useState<Record<number, Captura>>({});
    const [hallazgos, setHallazgos] = useState<Record<number, Hallazgo[]>>({});
    const [clavesEstacion, setClavesEstacion] = useState<Record<number, ClaveEstacion[]>>({});
    const [plagas, setPlagas] = useState<Plaga[]>([]);
    const [claves, setClaves] = useState<ClaveBitacora[]>([]);
    const [rolEmpleado, setRolEmpleado] = useState<RolEmpleado>(null);
    const [hallazgoTemporal, setHallazgoTemporal] = useState<
        Record<number, { plaga_id: number | null; cantidad: number }>
    >({});

    const tipoBitacora = useMemo(() => {
        if (tipo === "ECEXTT" || tipo === "ECINT" || tipo === "VOLADORES") return tipo;
        return null;
    }, [tipo]);

    const folioText = servicio?.folio && servicio.folio < 0 ? `FT-${servicio.folio * -1}` : servicio?.folio;

    const descargarExcel = async () => {
        if (!servicio) return;
        try {
            setDownloadingExcel(true);
            await downloadBitacoraExcel(servicio.id, organizacion ?? "");
            showToast("Excel de bitácora descargado", "success");
        } catch (error) {
            console.error("Error descargando Excel de bitácora", error);
            showToast("No se pudo generar el Excel de la bitácora", "error");
        } finally {
            setDownloadingExcel(false);
        }
    };

    const crearRevisionSiNoExiste = async (servicioData: ServicioData, bitacoraData: BitacoraData) => {
        const { data: existente, error: e1 } = await (supabase as any)
            .from("RevisionesBitacora")
            .select("id, estado")
            .eq("servicio_id", servicioData.id)
            .eq("bitacora_id", bitacoraData.id)
            .maybeSingle();

        if (e1) throw e1;
        if (existente) return existente as RevisionData;

        const { data: creada, error: e2 } = await (supabase as any)
            .from("RevisionesBitacora")
            .insert([
                {
                    bitacora_id: bitacoraData.id,
                    servicio_id: servicioData.id,
                    direccion_id: servicioData.direccion_id,
                    estado: "en_captura",
                    no_hay_bitacora_disponible: false,
                    folio: servicioData.folio,
                    fecha_servicio: servicioData.fecha_servicio,
                },
            ])
            .select("id, estado")
            .single();

        if (e2) throw e2;
        return creada as RevisionData;
    };

    const load = async () => {
        if (!servicioId || !tipoBitacora) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data: servicioData, error: errServicio } = await (supabase as any)
                .from("Servicios")
                .select("id, folio, fecha_servicio, direccion_id, cliente_id")
                .eq("id", Number(servicioId))
                .eq("organizacion", organizacion ?? "")
                .single();

            if (errServicio) throw errServicio;
            setServicio(servicioData as ServicioData);

            const userId = localStorage.getItem("user_id") ?? "";
            if (userId) {
                const { data: empleadoData } = await (supabase as any)
                    .from("Empleados")
                    .select("tipo_rol")
                    .eq("user_id", userId)
                    .eq("organizacion", organizacion ?? "")
                    .maybeSingle();
                setRolEmpleado((empleadoData?.tipo_rol as RolEmpleado) ?? null);
            }

            // Cargar plagas disponibles
            const { data: plagasData, error: errPlagas } = await (supabase as any).from("Plagas").select("id, plaga");

            if (errPlagas) throw errPlagas;
            setPlagas((plagasData ?? []) as Plaga[]);

            // Cargar claves disponibles
            const { data: clavesData, error: errClaves } = await (supabase as any)
                .from("ClavesBitacora")
                .select("id, clave, concepto, titulo, tipo")
                .eq("organizacion", organizacion ?? "")
                .eq("activo", true);

            if (errClaves) throw errClaves;

            // Filtrar claves por tipo: mostrar las que son NULL (genéricas) o que coincidan con el tipo actual
            const clavesFiltradas = ((clavesData ?? []) as any[]).filter(
                c => c.tipo === null || c.tipo === tipoBitacora
            );
            setClaves(clavesFiltradas as ClaveBitacora[]);

            const { data: bitacoraData, error: errBitacora } = await (supabase as any)
                .from("Bitacoras")
                .select("id, tipo")
                .eq("organizacion", organizacion ?? "")
                .eq("direccion_id", servicioData.direccion_id)
                .eq("tipo", tipoBitacora)
                .eq("estado", "activa")
                .maybeSingle();

            if (errBitacora) throw errBitacora;

            if (!bitacoraData) {
                setBitacora(null);
                setRevision(null);
                setEstaciones([]);
                setCapturas({});
                setHallazgos({});
                setClavesEstacion({});
                return;
            }

            setBitacora(bitacoraData as BitacoraData);

            const revisionData = await crearRevisionSiNoExiste(
                servicioData as ServicioData,
                bitacoraData as BitacoraData
            );
            setRevision(revisionData);

            const { data: estacionesData, error: errEstaciones } = await (supabase as any)
                .from("EstacionesBitacora")
                .select("id, codigo_estacion, area, zona")
                .eq("direccion_id", servicioData.direccion_id)
                .eq("tipo", tipoBitacora)
                .eq("activa", true)
                .order("orden", { ascending: true })
                .order("codigo_estacion", { ascending: true });

            if (errEstaciones) throw errEstaciones;
            const estacionesRows = (estacionesData ?? []) as Estacion[];
            setEstaciones(estacionesRows);

            const { data: capturesData, error: errCapturas } = await (supabase as any)
                .from("RevisionEstacionesBitacora")
                .select("id, estacion_id, revisada, consumo_porcentaje, goma_cambiada, observacion")
                .eq("revision_id", revisionData.id);

            if (errCapturas) throw errCapturas;

            const capturaMap: Record<number, Captura> = {};
            estacionesRows.forEach(est => {
                const found = (capturesData ?? []).find((c: any) => c.estacion_id === est.id);
                capturaMap[est.id] = {
                    id: found?.id,
                    revisada: found?.revisada ?? false,
                    consumo_porcentaje: found?.consumo_porcentaje ?? null,
                    goma_cambiada: found?.goma_cambiada ?? null,
                    observacion: found?.observacion ?? "",
                };
            });
            setCapturas(capturaMap);

            // Cargar hallazgos (plagas encontradas)
            const { data: hallazgosData, error: errHallazgos } = await (supabase as any)
                .from("HallazgosBitacora")
                .select("id, revision_estacion_id, plaga_id, cantidad, comentario")
                .in("revision_estacion_id", capturesData?.map((c: any) => c.id) ?? []);

            if (errHallazgos) throw errHallazgos;

            const hallazgosMap: Record<number, Hallazgo[]> = {};
            estacionesRows.forEach(est => {
                hallazgosMap[est.id] = [];
            });
            (hallazgosData ?? []).forEach((h: any) => {
                const revEst = (capturesData ?? []).find((c: any) => c.id === h.revision_estacion_id);
                if (revEst && hallazgosMap[revEst.estacion_id]) {
                    hallazgosMap[revEst.estacion_id].push({
                        id: h.id,
                        plaga_id: h.plaga_id,
                        cantidad: h.cantidad,
                        comentario: h.comentario,
                    });
                }
            });
            setHallazgos(hallazgosMap);

            // Cargar claves marcadas
            const { data: clavesEstacionData, error: errClavesEst } = await (supabase as any)
                .from("RevisionEstacionesClaves")
                .select("id, revision_estacion_id, clave_id")
                .in("revision_estacion_id", capturesData?.map((c: any) => c.id) ?? []);

            if (errClavesEst) throw errClavesEst;

            const clavesEstacionMap: Record<number, ClaveEstacion[]> = {};
            estacionesRows.forEach(est => {
                clavesEstacionMap[est.id] = [];
            });
            (clavesEstacionData ?? []).forEach((ce: any) => {
                const revEst = (capturesData ?? []).find((c: any) => c.id === ce.revision_estacion_id);
                if (revEst && clavesEstacionMap[revEst.estacion_id]) {
                    clavesEstacionMap[revEst.estacion_id].push({
                        id: ce.id,
                        clave_id: ce.clave_id,
                    });
                }
            });
            setClavesEstacion(clavesEstacionMap);
        } catch (err: any) {
            showToast("No se pudo cargar la captura de bitacora", "error");
            console.log("Error cargando BitacoraServicio", err?.message ?? err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [servicioId, tipoBitacora, organizacion]);

    const updateCaptureField = (estacionId: number, field: keyof Captura, value: any) => {
        setCapturas(prev => ({
            ...prev,
            [estacionId]: {
                ...prev[estacionId],
                [field]: value,
            },
        }));
    };

    const agregarHallazgo = (estacionId: number) => {
        const temp = hallazgoTemporal[estacionId];
        if (!temp || temp.plaga_id === null || temp.cantidad <= 0) {
            showToast("Selecciona plaga y cantidad válida", "error");
            return;
        }

        const nuevoHallazgo: Hallazgo = {
            plaga_id: temp.plaga_id,
            cantidad: temp.cantidad,
            comentario: null,
        };

        setHallazgos(prev => ({
            ...prev,
            [estacionId]: [...(prev[estacionId] ?? []), nuevoHallazgo],
        }));

        setHallazgoTemporal(prev => ({
            ...prev,
            [estacionId]: { plaga_id: null, cantidad: 0 },
        }));

        showToast("Hallazgo agregado", "success");
    };

    const eliminarHallazgo = (estacionId: number, index: number) => {
        setHallazgos(prev => ({
            ...prev,
            [estacionId]: (prev[estacionId] ?? []).filter((_, i) => i !== index),
        }));
    };

    const toggleClave = (estacionId: number, claveId: number) => {
        setClavesEstacion(prev => {
            const estacionClaves = prev[estacionId] ?? [];
            const existe = estacionClaves.find(c => c.clave_id === claveId);

            if (existe) {
                return {
                    ...prev,
                    [estacionId]: estacionClaves.filter(c => c.clave_id !== claveId),
                };
            } else {
                return {
                    ...prev,
                    [estacionId]: [...estacionClaves, { clave_id: claveId }],
                };
            }
        });
    };

    const isClaveActive = (estacionId: number, claveId: number) => {
        return (clavesEstacion[estacionId] ?? []).some(c => c.clave_id === claveId);
    };

    const guardarCaptura = async (cerrar = false) => {
        if (!revision || estaciones.length === 0) {
            showToast("No hay estaciones para guardar", "error");
            return;
        }

        try {
            setSaving(true);
            const rows = estaciones.map(est => {
                const cap = capturas[est.id] ?? {
                    revisada: false,
                    consumo_porcentaje: null,
                    goma_cambiada: null,
                    observacion: "",
                };

                return {
                    revision_id: revision.id,
                    estacion_id: est.id,
                    revisada: cap.revisada,
                    estado: cap.revisada ? "revisada" : "no_revisada",
                    consumo_porcentaje: tipoBitacora === "ECEXTT" ? cap.consumo_porcentaje : null,
                    goma_cambiada: tipoBitacora === "ECEXTT" ? null : cap.goma_cambiada,
                    observacion: cap.observacion || null,
                };
            });

            const { data: savedCapturas, error } = await (supabase as any)
                .from("RevisionEstacionesBitacora")
                .upsert(rows, { onConflict: "revision_id,estacion_id" })
                .select("id, estacion_id");

            if (error) throw error;

            // Guardar hallazgos (plagas encontradas)
            for (const est of estaciones) {
                const estacionHallazgos = hallazgos[est.id] ?? [];
                const savedCaptura = (savedCapturas ?? []).find((c: any) => c.estacion_id === est.id);

                if (savedCaptura) {
                    // Eliminar hallazgos eliminados
                    const hallazgosAGuardar = estacionHallazgos.filter(h => h.id);
                    const hallazgosNuevos = estacionHallazgos.filter(h => !h.id);

                    // Insertar nuevos
                    if (hallazgosNuevos.length > 0) {
                        const { error: errHallazgos } = await (supabase as any).from("HallazgosBitacora").insert(
                            hallazgosNuevos.map(h => ({
                                revision_estacion_id: savedCaptura.id,
                                plaga_id: h.plaga_id,
                                cantidad: h.cantidad,
                                comentario: h.comentario || null,
                            }))
                        );

                        if (errHallazgos) throw errHallazgos;
                    }
                }
            }

            // Guardar claves marcadas
            for (const est of estaciones) {
                const estacionClaves = clavesEstacion[est.id] ?? [];
                const savedCaptura = (savedCapturas ?? []).find((c: any) => c.estacion_id === est.id);

                if (savedCaptura) {
                    // Eliminar claves antiguas
                    const { error: errDelete } = await (supabase as any)
                        .from("RevisionEstacionesClaves")
                        .delete()
                        .eq("revision_estacion_id", savedCaptura.id);

                    if (errDelete) throw errDelete;

                    // Insertar nuevas
                    if (estacionClaves.length > 0) {
                        const { error: errClaves } = await (supabase as any).from("RevisionEstacionesClaves").insert(
                            estacionClaves.map(c => ({
                                revision_estacion_id: savedCaptura.id,
                                clave_id: c.clave_id,
                            }))
                        );

                        if (errClaves) throw errClaves;
                    }
                }
            }

            const revisadas = rows.filter(r => r.revisada).length;
            const estadoRevision = cerrar ? "cerrada" : revisadas > 0 ? "parcial" : "en_captura";

            const { error: errRevision } = await (supabase as any)
                .from("RevisionesBitacora")
                .update({ estado: estadoRevision })
                .eq("id", revision.id);

            if (errRevision) throw errRevision;

            setRevision(prev => (prev ? { ...prev, estado: estadoRevision } : prev));
            showToast(cerrar ? "Revision cerrada" : "Captura guardada", "success");
        } catch (err: any) {
            showToast("No se pudo guardar la captura", "error");
            console.log("Error guardando captura", err?.message ?? err);
        } finally {
            setSaving(false);
        }
    };

    if (!tipoBitacora) {
        return (
            <Wrap>
                <Title>Tipo de bitacora invalido</Title>
                <ReturnLink to="/bitacoras">Volver</ReturnLink>
            </Wrap>
        );
    }

    return (
        <Wrap>
            <Header>
                <Title>
                    Captura {tipToLabel[tipoBitacora]} - Folio {folioText ?? ""}
                </Title>
                <ReturnLink to={`/bitacoras${servicio?.folio ? `?folio=${servicio.folio}` : ""}`}>Volver</ReturnLink>
            </Header>

            <Card>
                {loading && <p>Cargando captura...</p>}

                {!loading && !bitacora && (
                    <p>No hay bitacora activa para esta direccion y tipo. Primero crea la bitacora desde el listado.</p>
                )}

                {!loading && bitacora && (
                    <>
                        <Row>
                            <Label>Estado de revision:</Label>
                            <EstadoTag>{revision?.estado ?? "en_captura"}</EstadoTag>
                        </Row>

                        {estaciones.length === 0 && (
                            <p style={{ marginTop: "0.75rem", color: "#606060" }}>
                                Esta dirección no tiene estaciones configuradas.{" "}
                                <Link
                                    to={`/bitacoras/direccion/${servicio?.direccion_id}`}
                                    style={{ color: "inherit", fontWeight: 700 }}
                                >
                                    Ir a configurar estaciones
                                </Link>
                            </p>
                        )}

                        {estaciones.map(est => {
                            const cap = capturas[est.id] ?? {
                                revisada: false,
                                consumo_porcentaje: null,
                                goma_cambiada: null,
                                observacion: "",
                            };
                            const estacionHallazgos = hallazgos[est.id] ?? [];
                            const temp = hallazgoTemporal[est.id] ?? { plaga_id: null, cantidad: 0 };

                            return (
                                <Card key={est.id}>
                                    <strong>{est.codigo_estacion}</strong>
                                    <p style={{ margin: "0.25rem 0", color: "#666" }}>
                                        {est.area ?? "Sin area"} {est.zona ? `| ${est.zona}` : ""}
                                    </p>

                                    <Row>
                                        <input
                                            type="checkbox"
                                            checked={cap.revisada}
                                            onChange={e => updateCaptureField(est.id, "revisada", e.target.checked)}
                                        />
                                        <Label>Revisada</Label>
                                    </Row>

                                    {tipoBitacora === "ECEXTT" ? (
                                        <Row>
                                            <Label>Consumo (%)</Label>
                                            <StyledSelect
                                                value={cap.consumo_porcentaje ?? ""}
                                                onChange={e => {
                                                    const v = e.target.value;
                                                    updateCaptureField(
                                                        est.id,
                                                        "consumo_porcentaje",
                                                        v === "" ? null : +v
                                                    );
                                                }}
                                                width="150px"
                                            >
                                                <option value="">Sin dato</option>
                                                <option value="0">0</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="75">75</option>
                                                <option value="100">100</option>
                                            </StyledSelect>
                                        </Row>
                                    ) : (
                                        <Row>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(cap.goma_cambiada)}
                                                onChange={e =>
                                                    updateCaptureField(est.id, "goma_cambiada", e.target.checked)
                                                }
                                            />
                                            <Label>Goma cambiada</Label>
                                        </Row>
                                    )}

                                    {/* SECCIÓN DE INCIDENCIAS DE PLAGAS */}
                                    <SubsectionTitle>Incidencias de Plagas</SubsectionTitle>
                                    <PlagasSection>
                                        <PlagasForm>
                                            <StyledSelect
                                                value={temp.plaga_id ?? ""}
                                                onChange={e => {
                                                    setHallazgoTemporal(prev => ({
                                                        ...prev,
                                                        [est.id]: {
                                                            ...prev[est.id],
                                                            plaga_id: e.target.value ? +e.target.value : null,
                                                        },
                                                    }));
                                                }}
                                            >
                                                <option value="">-- Selecciona plaga --</option>
                                                {plagas.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.plaga}
                                                    </option>
                                                ))}
                                            </StyledSelect>
                                            <StyledInput
                                                type="number"
                                                min="1"
                                                value={temp.cantidad}
                                                onChange={e => {
                                                    setHallazgoTemporal(prev => ({
                                                        ...prev,
                                                        [est.id]: {
                                                            ...prev[est.id],
                                                            cantidad: +e.target.value,
                                                        },
                                                    }));
                                                }}
                                                placeholder="Cant."
                                                style={{ textAlign: "center" }}
                                            />
                                            <SmallButton onClick={() => agregarHallazgo(est.id)}>Agregar</SmallButton>
                                        </PlagasForm>

                                        {estacionHallazgos.length > 0 && (
                                            <PlagasListContainer>
                                                {estacionHallazgos.map((hallazgo, idx) => {
                                                    const plagaNombre =
                                                        plagas.find(p => p.id === hallazgo.plaga_id)?.plaga ||
                                                        "Desconocida";
                                                    return (
                                                        <HallazgoItemStyled key={idx}>
                                                            <HallazgoInfo>
                                                                <strong>{plagaNombre}</strong>
                                                                <small>
                                                                    {hallazgo.cantidad} unidad
                                                                    {hallazgo.cantidad > 1 ? "es" : ""}
                                                                </small>
                                                            </HallazgoInfo>
                                                            <DeleteButton onClick={() => eliminarHallazgo(est.id, idx)}>
                                                                Eliminar
                                                            </DeleteButton>
                                                        </HallazgoItemStyled>
                                                    );
                                                })}
                                            </PlagasListContainer>
                                        )}
                                    </PlagasSection>

                                    {/* SECCIÓN DE CÓDIGOS CLAVE: aparece debajo de plagas, por cada estación */}
                                    <>
                                        <SubsectionTitle>Códigos CLAVE de esta estación</SubsectionTitle>
                                        <ClavesSection>
                                            {claves.length === 0 ? (
                                                <EmptyClaves>
                                                    No hay códigos CLAVE configurados para esta organización y tipo de
                                                    bitácora.
                                                </EmptyClaves>
                                            ) : (
                                                <ClavesGrid>
                                                    {claves.map(clave => (
                                                        <ClaveItem key={clave.id}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isClaveActive(est.id, clave.id)}
                                                                onChange={() => toggleClave(est.id, clave.id)}
                                                            />
                                                            <label>
                                                                <strong>{clave.clave}</strong>
                                                                <small title={clave.concepto}>{clave.concepto}</small>
                                                            </label>
                                                        </ClaveItem>
                                                    ))}
                                                </ClavesGrid>
                                            )}
                                        </ClavesSection>
                                    </>

                                    <Row>
                                        <Label>Observacion</Label>
                                    </Row>
                                    <Textarea
                                        value={cap.observacion}
                                        onChange={e => updateCaptureField(est.id, "observacion", e.target.value)}
                                        placeholder="Escribe observaciones de esta estacion"
                                    />
                                </Card>
                            );
                        })}

                        <Actions>
                            {estaciones.length > 0 && (
                                <>
                                    <Button disabled={saving} onClick={() => guardarCaptura(false)}>
                                        Guardar
                                    </Button>
                                    <Button disabled={saving} onClick={() => guardarCaptura(true)}>
                                        Cerrar revision
                                    </Button>
                                </>
                            )}
                            <Button disabled={saving || downloadingExcel || !servicio} onClick={descargarExcel}>
                                {downloadingExcel ? "Generando Excel..." : "Descargar bitácora Excel"}
                            </Button>
                        </Actions>
                    </>
                )}
            </Card>
        </Wrap>
    );
};

export default BitacoraServicio;

