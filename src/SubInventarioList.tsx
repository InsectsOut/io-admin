// ✅ SubInventarioList.tsx
import { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "./utils/ClientSupabase";
import { FaPlus } from "react-icons/fa";
import { Tables } from "./supabase/Database";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { CardInputs } from "./rehusableComponents/CardInputs";
import useBodyClick from "./UseBodyClick";
import { Enums } from "./supabase/Database";
import DelModal from "./DeleteModal";
import { EntryRow } from "./SubInventarioDetalle";
import { useRef } from "react";
import { useToast } from "./rehusableComponents/Toast";

import {
    CreateButton,
    ModalButton,
    ModalContent,
    ModalForm,
    ModalOverlay,
} from "./rehusableComponents/CreateInventariosModal";
interface SubInventarioListProps {
    title: string;
    icon: React.ReactNode;
    subinventarios: string[];
    onSelect: (id: number, nombre?: string) => void;
    onAdd: (newName: string) => void;
    flag: Enums<"TipoInventario">;
    organizacion: string;
}

type Inventarios = Tables<"Inventario">;
type Empleados = Tables<"Empleados">;

const SectionContainer = styled.div`
    width: 95%;
    background-color: #f7f9fb;
    border-radius: 0.5rem;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
    padding: 1.5rem;
    margin: 1rem auto;
    font-family: "Open Sans";
    @media (max-width: 900px) {
        width: 100%;
        margin: 0;
        border-radius: 0;
        padding: 1rem 0.75rem;
        box-sizing: border-box;
    }
`;

const SectionTitle = styled.h2`
    color: ${({ theme }) => theme.primaryColor};
    margin-bottom: 1rem;
`;

const EntryList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const EntryItem = styled.li`
    background: white;
    margin-bottom: 0.75rem;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.1);
    color: #333;
    cursor: pointer;
    &:hover {
        background-color: #e0e6ed;
    }
    .iconsContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }
    @media (max-width: 900px) {
        padding: 1rem 0.75rem;
        min-height: 3.5rem;
        .iconsContainer {
            gap: 1.25rem;
        }
    }
`;

const EntryText = styled.span`
    font-size: 1rem;
`;

const EntryIcon = styled.span`
    font-size: 1.5rem;
    color: rgb(14, 78, 126);
    @media (max-width: 900px) {
        font-size: 1.75rem;
        min-width: 2.75rem;
        min-height: 2.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const SubInventarioList: React.FC<SubInventarioListProps> = ({ title, icon, onSelect, onAdd, flag, organizacion }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tecnicoId, setTecnicoId] = useState<number | null>(null);
    const [empleados, setEmpleados] = useState<Empleados[]>([]);
    const [inventarios, setInventarios] = useState<Inventarios[]>([]);
    const [inventarioNombre, setInventarioNombre] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const deleteRef = useRef<HTMLButtonElement>(null);
    const [inventarioId, setInventarioId] = useState<number>();
    const [equipoType, setEquipoType] = useState<Enums<"TipoEquipoOptions">>("Equipos de control");
    const { showToast } = useToast();

    const equipoTypeObject: Enums<"TipoEquipoOptions">[] = ["Equipos de control", "Computo", "Otros"];

    const createInventario = async () => {
        try {
            const { data, error } = await supabase.from("Inventario").insert([
                {
                    tecnico_id: tecnicoId,
                    organizacion: organizacion,
                    tipo_inventario: flag,
                    inv_nombre: inventarioNombre,
                    tipo_de_equipo: flag === "equipo" ? equipoType : null,
                },
            ] as Inventarios[]);

            if (error) {
                console.error("Error creando inventario:", error);
                showToast("Error al crear el inventario", "error");
            } else {
                console.log("Inventario creado:", data);
                showToast("Inventario creado correctamente", "success");
                fetchInventarios();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    };

    const fetchEmpleados = async () => {
        if (flag === "empleado") {
            try {
                const { data, error } = await supabase.from("Empleados").select("*").eq("organizacion", organizacion);
                if (error) {
                    console.error("Error fetching empleados:", error);
                }
                if (data) {
                    console.log("Empleados fetched:", data);
                    setEmpleados(data);
                }
            } catch (error) {
                console.error("Error fetching empleados:", error);
            }
        }
    };

    const handleInventarioNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInventarioNombre(e.target.value);
    };
    const fetchInventarios = async () => {
        try {
            const { data, error } = await supabase
                .from("Inventario")
                .select("*")
                .eq("organizacion", organizacion)
                .eq("tipo_inventario", flag!);

            if (error) {
                console.error("Error fetching inventarios:", error);
            } else {
                console.log("Inventarios fetched:", data);
                setInventarios(data);
            }
        } catch (error) {
            console.error("Error fetching inventarios:", error);
        }
    };

    const handleEmpleadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let camabios = +e.target.value;
        setTecnicoId(camabios);
    };

    const pushToQueryParams = (tecnicoNombre: string, inventarioId: number, invNombre: string) => {
        const url = new URL(window.location.href);
        if (flag === "empleado") {
            url.searchParams.set("tecnico", tecnicoNombre);
        }
        url.searchParams.set("inventarioId", inventarioId.toString());
        url.searchParams.set("invNombre", invNombre);
        url.searchParams.set("flag", flag);
        window.history.replaceState(null, "", url.toString());
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);
    useEffect(() => {
        fetchInventarios();
    }, []);

    const deleteInventario = async (inventarioId: number) => {
        try {
            const { error, data } = await supabase.from("Inventario").delete().eq("id", inventarioId);
            if (error) {
                console.error("Error trying to delete the inventory", error);
                showToast("Error al eliminar el inventario", "error");
            } else {
                console.log("Deleted inventory", data);
                showToast("Inventario eliminado correctamente", "success");
                fetchInventarios();
                setDeleteModalOpen(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <SectionContainer>
            <SectionTitle>{title}</SectionTitle>
            <EntryList>
                {inventarios.map(inv => (
                    <EntryItem
                        key={inv.id}
                        onClick={() => {
                            const nombre =
                                flag === "empleado"
                                    ? (empleados.find(emp => emp.id === inv.tecnico_id)?.nombre ?? "Técnico")
                                    : (inv.inv_nombre ?? "");
                            onSelect(inv.id, nombre);
                            pushToQueryParams(
                                empleados.find(emp => emp.id === inv.tecnico_id)?.nombre || "Técnico Desconocido",
                                inv.id,
                                inv.inv_nombre || ""
                            );
                        }}
                    >
                        {flag === "empleado" && (
                            <EntryText>{empleados.find(emp => emp.id === inv.tecnico_id)?.nombre}</EntryText>
                        )}
                        {flag === "principal" && (
                            <>
                                <EntryRow>
                                    <EntryText>{inv.inv_nombre || "Inventario Principal"}</EntryText>
                                </EntryRow>
                            </>
                        )}
                        {flag === "vehiculo" && <EntryText>{inv.inv_nombre || "Inventario vehícular"}</EntryText>}
                        {flag === "equipo" && <EntryText>{inv.inv_nombre || "Inventario de equipo"}</EntryText>}
                        <div className="iconsContainer">
                            <button
                                ref={deleteRef}
                                onClick={async e => {
                                    e.stopPropagation();

                                    const url = new URL(window.location.href);
                                    url.searchParams.set("flag", flag);
                                    url.searchParams.set("invNombre", inv.inv_nombre ?? "");
                                    await window.history.replaceState(null, "", url.toString());

                                    setDeleteModalOpen(true);

                                    setInventarioId(inv?.id);
                                }}
                                id="borrarServicio"
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "105%",
                                    minWidth: "2.75rem",
                                    minHeight: "2.75rem",
                                }}
                            >
                                X
                            </button>

                            <EntryIcon>{icon}</EntryIcon>
                        </div>
                    </EntryItem>
                ))}
            </EntryList>
            {deleteModalOpen && (
                <DelModal
                    closeModal={() => {
                        setDeleteModalOpen(false);
                    }}
                    btnText="Eliminar inventario"
                    titulo="¿Seguro quiere eliminar el inventario?"
                    del={() => {
                        deleteInventario(inventarioId ?? -1);
                    }}
                    principal={["menu"]}
                    invNombre={new URL(window.location.href).searchParams.get("invNombre")!}
                ></DelModal>
            )}
            <CreateButton onClick={() => setIsModalOpen(true)}>Nuevo Inventario</CreateButton>
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h2>Crear Nuevo Inventario</h2>
                        <ModalForm>
                            {flag === "empleado" && (
                                <StyledSelect value={tecnicoId ? tecnicoId : ""} onChange={handleEmpleadoChange}>
                                    <option value={""} disabled>
                                        Selecciona un técnico
                                    </option>
                                    {empleados.map(empleado => (
                                        <option key={empleado.id} value={empleado.id}>
                                            {empleado.nombre}
                                        </option>
                                    ))}
                                </StyledSelect>
                            )}
                            {flag === "equipo" && (
                                <StyledSelect
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setEquipoType(e.target.value as Enums<"TipoEquipoOptions">)
                                    }
                                >
                                    <option value={""} disabled>
                                        Selecciona el tipo de equipo
                                    </option>
                                    {equipoTypeObject.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </StyledSelect>
                            )}
                            <CardInputs
                                largo="100%"
                                placeholder="Nombre del inventario"
                                onChange={handleInventarioNombreChange}
                                value={inventarioNombre}
                                type="text"
                                required={true}
                                name="inventarioNombre"
                                id="inventarioNombre"
                                autoComplete="off"
                                autoFocus={true}
                            ></CardInputs>
                            <ModalButton onClick={() => createInventario()} type="button">
                                Crear
                            </ModalButton>
                        </ModalForm>
                        <ModalButton onClick={() => setIsModalOpen(false)}>Cerrar</ModalButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </SectionContainer>
    );
};

export default SubInventarioList;
