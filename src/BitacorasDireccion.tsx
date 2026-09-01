import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { supabase } from "./utils/ClientSupabase";
import { useToast } from "./rehusableComponents/Toast";

type TipoBitacora = "ECEXTT" | "ECINT" | "VOLADORES";
type RolEmpleado = "tecnico" | "administrador" | "superadmin" | null;

type DireccionInfo = {
    id: number;
    calle: string;
    numero_ext: string;
    colonia: string;
    ciudad: string;
    apodo_direccion: string | null;
    Clientes: { nombre: string; apellidos: string | null } | null;
};

type Estacion = {
    id: number;
    codigo_estacion: string;
    tipo: TipoBitacora;
    area: string | null;
    zona: string | null;
    descripcion: string | null;
};

interface Props {
    organizacion?: string;
}

// ---- Layout ----
const Wrap = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 1.2rem 1.4rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
`;

const TitleBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const Title = styled.h1`
    margin: 0;
    color: ${({ theme }) => theme.primaryColor};
`;

const Subtitle = styled.p`
    margin: 0;
    color: #606060;
    font-size: 0.92rem;
`;

const ReturnLink = styled(Link)`
    all: unset;
    cursor: pointer;
    color: ${({ theme }) => theme.primaryColor};
    border: 1px solid ${({ theme }) => theme.primaryColor};
    border-radius: 0.35rem;
    padding: 0.4rem 0.7rem;
    font-weight: 700;
    white-space: nowrap;
`;

const SectionCard = styled.div`
    margin-top: 1.1rem;
    border: 1px solid #e8e8e8;
    border-radius: 0.6rem;
    background: #fff;
    padding: 0.9rem;
`;

const SectionTitle = styled.h3`
    margin: 0 0 0.7rem;
    color: ${({ theme }) => theme.primaryColor};
    font-size: 1rem;
`;

const EmptyText = styled.p`
    margin: 0.25rem 0;
    color: #888;
    font-size: 0.88rem;
`;

const StationList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
`;

const StationRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.55rem 0.7rem;
    border: 1px solid #efefef;
    border-radius: 0.4rem;
    background: #fafafa;
`;

const StationInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
    min-width: 0;
    text-align: left;
`;

const StationCode = styled.span`
    font-weight: 700;
    color: #2a5f8c;
    font-size: 0.95rem;
`;

const StationMeta = styled.span`
    color: #666;
    font-size: 0.83rem;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.6rem;
    margin-top: 0.55rem;
`;

const FormRow = styled.div`
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0.55rem;
`;

const Label = styled.label`
    font-weight: 700;
    color: #4f4f4f;
    font-size: 0.88rem;
`;

const Input = styled.input`
    min-height: 2rem;
    border: 1px solid #d4d4d4;
    border-radius: 0.35rem;
    padding: 0 0.5rem;
    box-sizing: border-box;
    width: 100%;
`;

const Select = styled.select`
    min-height: 2rem;
    border: 1px solid #d4d4d4;
    border-radius: 0.35rem;
    background: #fff;
    color: #474747;
    padding: 0 0.4rem;

    option {
        color: #474747;
        background: #fff;
    }
`;

const Textarea = styled.textarea`
    width: 100%;
    min-height: 3.5rem;
    border: 1px solid #d4d4d4;
    border-radius: 0.35rem;
    padding: 0.45rem;
    box-sizing: border-box;
    resize: vertical;
    margin-top: 0.4rem;
`;

const StationEditor = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(10rem, 1fr));
    gap: 0.55rem;
    margin-top: 0.45rem;

    @media (max-width: 42rem) {
        grid-template-columns: 1fr;
    }
`;

const StationField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    &:last-child {
        grid-column: 1 / -1;
    }
`;

const StationFieldLabel = styled(Label)`
    font-size: 0.78rem;
`;

const StationTextarea = styled(Textarea)`
    margin-top: 0;
    min-height: 3rem;
`;

const StationActions = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 0.45rem;
    flex-wrap: wrap;
`;

const Actions = styled.div`
    margin-top: 0.8rem;
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
    font-size: 0.88rem;

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
`;

const EditButton = styled(Button)`
    color: #2a5f8c;
    border-color: #2a5f8c;
    background: #f1f7fc;
`;

const CancelButton = styled.button`
    all: unset;
    cursor: pointer;
    border: 1px solid #999;
    color: #666;
    background: #fff;
    border-radius: 0.4rem;
    padding: 0.45rem 0.75rem;
    font-weight: 700;
    font-size: 0.82rem;

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
`;

const DangerButton = styled.button`
    all: unset;
    cursor: pointer;
    border: 1px solid #d9534f;
    color: #d9534f;
    background: #fff5f5;
    border-radius: 0.4rem;
    padding: 0.3rem 0.65rem;
    font-weight: 700;
    font-size: 0.8rem;
    white-space: nowrap;

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
`;

// ---- Constantes ----
const TIPOS: TipoBitacora[] = ["ECEXTT", "ECINT", "VOLADORES"];

const PREFIJO: Record<TipoBitacora, string> = {
    ECEXTT: "EXT",
    ECINT: "INT",
    VOLADORES: "VOL",
};

const TIPO_LABEL: Record<TipoBitacora, string> = {
    ECEXTT: "Exterior (EXT)",
    ECINT: "Interior (INT)",
    VOLADORES: "Voladores (VOL)",
};

// ---- Componente ----
const BitacorasDireccion: React.FC<Props> = ({ organizacion }) => {
    const { showToast } = useToast();
    const { direccionId } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [direccion, setDireccion] = useState<DireccionInfo | null>(null);
    const [estaciones, setEstaciones] = useState<Estacion[]>([]);
    const [rolEmpleado, setRolEmpleado] = useState<RolEmpleado>(null);
    const [nuevoTipo, setNuevoTipo] = useState<TipoBitacora>("ECEXTT");
    const [nuevaEstacion, setNuevaEstacion] = useState({ codigo: "", area: "", zona: "", descripcion: "" });
    const [editingStationId, setEditingStationId] = useState<number | null>(null);
    const [stationDraft, setStationDraft] = useState({ area: "", zona: "", descripcion: "" });

    const canManage = rolEmpleado === "administrador" || rolEmpleado === "superadmin";

    // Auto-calcula el siguiente código al cambiar tipo
    const siguienteCodigo = useMemo(() => {
        const prefijo = PREFIJO[nuevoTipo];
        const nums = estaciones
            .filter(e => e.tipo === nuevoTipo)
            .map(e => e.codigo_estacion)
            .filter(c => c.startsWith(prefijo + "-"))
            .map(c => Number(c.split("-")[1]))
            .filter(n => !Number.isNaN(n));
        const siguiente = nums.length > 0 ? Math.max(...nums) + 1 : 1;
        return `${prefijo}-${String(siguiente).padStart(2, "0")}`;
    }, [estaciones, nuevoTipo]);

    useEffect(() => {
        setNuevaEstacion(prev => ({ ...prev, codigo: siguienteCodigo }));
    }, [siguienteCodigo]);

    const load = async () => {
        if (!direccionId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);

            const userId = localStorage.getItem("user_id") ?? "";
            if (userId) {
                const { data: empData } = await (supabase as any)
                    .from("Empleados")
                    .select("tipo_rol")
                    .eq("user_id", userId)
                    .eq("organizacion", organizacion ?? "")
                    .maybeSingle();
                setRolEmpleado((empData?.tipo_rol as RolEmpleado) ?? null);
            }

            const { data: dirData, error: errDir } = await (supabase as any)
                .from("Direcciones")
                .select("id, calle, numero_ext, colonia, ciudad, apodo_direccion, Clientes(nombre, apellidos)")
                .eq("id", Number(direccionId))
                .single();
            if (errDir) throw errDir;
            setDireccion(dirData as DireccionInfo);

            const { data: estData, error: errEst } = await (supabase as any)
                .from("EstacionesBitacora")
                .select("id, codigo_estacion, tipo, area, zona, descripcion")
                .eq("direccion_id", Number(direccionId))
                .eq("activa", true)
                .order("tipo", { ascending: true })
                .order("codigo_estacion", { ascending: true });
            if (errEst) throw errEst;
            setEstaciones((estData ?? []) as Estacion[]);
        } catch (err: any) {
            showToast("No se pudo cargar la dirección", "error");
            console.log("Error cargando BitacorasDireccion", err?.message ?? err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [direccionId, organizacion]);

    const crearEstacion = async () => {
        if (!canManage) {
            showToast("Solo admin/superadmin puede agregar estaciones", "error");
            return;
        }
        const codigo = nuevaEstacion.codigo.trim().toUpperCase();
        if (!codigo) {
            showToast("Captura el código de estación", "error");
            return;
        }
        const prefijo = PREFIJO[nuevoTipo];
        if (!codigo.startsWith(prefijo + "-")) {
            showToast(`El código debe iniciar con ${prefijo}-`, "error");
            return;
        }
        try {
            setSaving(true);
            const { error } = await (supabase as any).from("EstacionesBitacora").insert([
                {
                    direccion_id: Number(direccionId),
                    tipo: nuevoTipo,
                    organizacion: organizacion ?? "",
                    codigo_estacion: codigo,
                    area: nuevaEstacion.area.trim() || null,
                    zona: nuevaEstacion.zona.trim() || null,
                    descripcion: nuevaEstacion.descripcion.trim() || null,
                    activa: true,
                },
            ]);
            if (error) {
                showToast(
                    error.message.includes("duplicate") ? "Ya existe una estación con ese código" : error.message,
                    "error"
                );
                return;
            }
            showToast("Estación agregada", "success");
            setNuevaEstacion(prev => ({ ...prev, area: "", zona: "", descripcion: "" }));
            await load();
        } catch (err: any) {
            showToast("No se pudo agregar la estación", "error");
            console.log("Error creando estacion", err?.message ?? err);
        } finally {
            setSaving(false);
        }
    };

    const desactivarEstacion = async (id: number) => {
        if (!canManage) return;
        try {
            setSaving(true);
            const { error } = await (supabase as any).from("EstacionesBitacora").update({ activa: false }).eq("id", id);
            if (error) {
                showToast(error.message, "error");
                return;
            }
            showToast("Estación desactivada", "success");
            setEstaciones(prev => prev.filter(e => e.id !== id));
        } catch (err: any) {
            showToast("No se pudo desactivar la estación", "error");
            console.log("Error desactivando estacion", err?.message ?? err);
        } finally {
            setSaving(false);
        }
    };

    const iniciarEdicionEstacion = (estacion: Estacion) => {
        if (!canManage || saving) return;
        setEditingStationId(estacion.id);
        setStationDraft({
            area: estacion.area ?? "",
            zona: estacion.zona ?? "",
            descripcion: estacion.descripcion ?? "",
        });
    };

    const cancelarEdicionEstacion = () => {
        if (saving) return;
        setEditingStationId(null);
        setStationDraft({ area: "", zona: "", descripcion: "" });
    };

    const guardarEdicionEstacion = async (id: number) => {
        if (!canManage) return;
        const changes = {
            area: stationDraft.area.trim() || null,
            zona: stationDraft.zona.trim() || null,
            descripcion: stationDraft.descripcion.trim() || null,
        };

        try {
            setSaving(true);
            const { error } = await (supabase as any)
                .from("EstacionesBitacora")
                .update(changes)
                .eq("id", id)
                .eq("direccion_id", Number(direccionId));

            if (error) {
                showToast(error.message, "error");
                return;
            }

            setEstaciones(prev => prev.map(estacion => (estacion.id === id ? { ...estacion, ...changes } : estacion)));
            setEditingStationId(null);
            setStationDraft({ area: "", zona: "", descripcion: "" });
            showToast("Datos de estación actualizados", "success");
        } catch (err: any) {
            showToast("No se pudieron actualizar los datos de la estación", "error");
            console.log("Error actualizando estacion", err?.message ?? err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Wrap>
                <p style={{ color: "#606060" }}>Cargando...</p>
            </Wrap>
        );
    }

    const clienteNombre = direccion?.Clientes
        ? `${direccion.Clientes.nombre} ${direccion.Clientes.apellidos ?? ""}`.trim()
        : "Cliente";
    const dirText = direccion
        ? [
              direccion.apodo_direccion ?? `${direccion.calle} ${direccion.numero_ext}`.trim(),
              direccion.colonia,
              direccion.ciudad,
          ]
              .filter(Boolean)
              .join(", ")
        : "";

    return (
        <Wrap>
            <Header>
                <TitleBlock>
                    <Title>Estaciones</Title>
                    <Subtitle>
                        {clienteNombre}
                        {dirText ? ` — ${dirText}` : ""}
                    </Subtitle>
                </TitleBlock>
                <ReturnLink to="/bitacoras">Volver a bitácoras</ReturnLink>
            </Header>

            {TIPOS.map(tipo => {
                const estsTipo = estaciones.filter(e => e.tipo === tipo);
                return (
                    <SectionCard key={tipo}>
                        <SectionTitle>
                            {TIPO_LABEL[tipo]} — {estsTipo.length} estación{estsTipo.length !== 1 ? "es" : ""}
                        </SectionTitle>

                        {estsTipo.length === 0 ? (
                            <EmptyText>Sin estaciones configuradas.</EmptyText>
                        ) : (
                            <StationList>
                                {estsTipo.map(est => {
                                    const isEditing = editingStationId === est.id;

                                    return (
                                        <StationRow key={est.id}>
                                            <StationInfo>
                                                <StationCode>{est.codigo_estacion}</StationCode>
                                                {isEditing ? (
                                                    <StationEditor>
                                                        <StationField>
                                                            <StationFieldLabel htmlFor={`area-${est.id}`}>
                                                                Área
                                                            </StationFieldLabel>
                                                            <Input
                                                                id={`area-${est.id}`}
                                                                value={stationDraft.area}
                                                                onChange={e =>
                                                                    setStationDraft(prev => ({
                                                                        ...prev,
                                                                        area: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Ej: Almacén"
                                                            />
                                                        </StationField>
                                                        <StationField>
                                                            <StationFieldLabel htmlFor={`zona-${est.id}`}>
                                                                Zona
                                                            </StationFieldLabel>
                                                            <Input
                                                                id={`zona-${est.id}`}
                                                                value={stationDraft.zona}
                                                                onChange={e =>
                                                                    setStationDraft(prev => ({
                                                                        ...prev,
                                                                        zona: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Ej: Norte"
                                                            />
                                                        </StationField>
                                                        <StationField>
                                                            <StationFieldLabel htmlFor={`descripcion-${est.id}`}>
                                                                Descripción
                                                            </StationFieldLabel>
                                                            <StationTextarea
                                                                id={`descripcion-${est.id}`}
                                                                value={stationDraft.descripcion}
                                                                onChange={e =>
                                                                    setStationDraft(prev => ({
                                                                        ...prev,
                                                                        descripcion: e.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Detalle opcional de la estación"
                                                            />
                                                        </StationField>
                                                    </StationEditor>
                                                ) : (
                                                    <StationMeta>
                                                        {est.area ?? "Sin área"}
                                                        {est.zona ? ` | ${est.zona}` : ""}
                                                        {est.descripcion ? ` — ${est.descripcion}` : ""}
                                                    </StationMeta>
                                                )}
                                            </StationInfo>
                                            {canManage && (
                                                <StationActions>
                                                    {isEditing ? (
                                                        <>
                                                            <Button
                                                                disabled={saving}
                                                                onClick={() => guardarEdicionEstacion(est.id)}
                                                            >
                                                                Guardar
                                                            </Button>
                                                            <CancelButton
                                                                disabled={saving}
                                                                onClick={cancelarEdicionEstacion}
                                                            >
                                                                Cancelar
                                                            </CancelButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditButton
                                                                disabled={saving}
                                                                onClick={() => iniciarEdicionEstacion(est)}
                                                            >
                                                                Editar
                                                            </EditButton>
                                                            <DangerButton
                                                                disabled={saving}
                                                                onClick={() => desactivarEstacion(est.id)}
                                                            >
                                                                Desactivar
                                                            </DangerButton>
                                                        </>
                                                    )}
                                                </StationActions>
                                            )}
                                        </StationRow>
                                    );
                                })}
                            </StationList>
                        )}
                    </SectionCard>
                );
            })}

            {canManage && (
                <SectionCard>
                    <SectionTitle>Agregar estación</SectionTitle>
                    <FormRow>
                        <Label>Tipo:</Label>
                        <Select value={nuevoTipo} onChange={e => setNuevoTipo(e.target.value as TipoBitacora)}>
                            {TIPOS.map(t => (
                                <option key={t} value={t}>
                                    {TIPO_LABEL[t]}
                                </option>
                            ))}
                        </Select>
                    </FormRow>
                    <FormGrid>
                        <div>
                            <Label>Código</Label>
                            <Input
                                value={nuevaEstacion.codigo}
                                onChange={e => setNuevaEstacion(prev => ({ ...prev, codigo: e.target.value }))}
                                placeholder={`${PREFIJO[nuevoTipo]}-01`}
                            />
                        </div>
                        <div>
                            <Label>Área</Label>
                            <Input
                                value={nuevaEstacion.area}
                                onChange={e => setNuevaEstacion(prev => ({ ...prev, area: e.target.value }))}
                                placeholder="Ej: Almacén"
                            />
                        </div>
                        <div>
                            <Label>Zona</Label>
                            <Input
                                value={nuevaEstacion.zona}
                                onChange={e => setNuevaEstacion(prev => ({ ...prev, zona: e.target.value }))}
                                placeholder="Ej: Norte"
                            />
                        </div>
                    </FormGrid>
                    <Label>Descripción</Label>
                    <Textarea
                        value={nuevaEstacion.descripcion}
                        onChange={e => setNuevaEstacion(prev => ({ ...prev, descripcion: e.target.value }))}
                        placeholder="Detalle opcional de la estación"
                    />
                    <Actions>
                        <Button disabled={saving} onClick={crearEstacion}>
                            Agregar estación
                        </Button>
                    </Actions>
                </SectionCard>
            )}
        </Wrap>
    );
};

export default BitacorasDireccion;

