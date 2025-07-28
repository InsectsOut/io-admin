// ✅ SubInventarioList.tsx
import { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "./utils/ClientSupabase";
import { FaPlus } from "react-icons/fa";
import { Tables } from "./supabase/Database";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { co } from "@fullcalendar/core/internal-common";
import { set } from "ts-pattern/dist/patterns";
import { CardInputs } from "./rehusableComponents/CardInputs";
import useBodyClick from "./UseBodyClick";
import { Enums } from "./supabase/Database";
import DelModal from "./DeleteModal";
import { EntryRow } from "./SubInventarioDetalle";
import { useRef } from "react";

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
    onSelect: (id: number) => void;
    onAdd: (newName: string) => void;
    flag: Enums<"TipoInventario">;
    organizacion: string;
}

enum InventarioFlag {
    tecnicos = "tecnicos",
    principal = "principal",
    equipo = "equipo",
    vehiculos = "vehiculos",
    menu_Principal = "menu_principal",
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
`;

const SectionTitle = styled.h2`
    color: #0d4e80;
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
`;

const EntryText = styled.span`
    font-size: 1rem;
`;

const EntryIcon = styled.span`
    font-size: 1.5rem;
    color: rgb(14, 78, 126);
`;

const SubInventarioList: React.FC<SubInventarioListProps> = ({
    title,
    icon,
    subinventarios,
    onSelect,
    onAdd,
    flag,
    organizacion,
}) => {
    const [newName, setNewName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tecnicoId, setTecnicoId] = useState<number | null>(null);
    const [empleados, setEmpleados] = useState<Empleados[]>([]);
    const [inventarios, setInventarios] = useState<Inventarios[]>([]);
    const [inventarioNombre, setInventarioNombre] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const deleteRef = useRef<HTMLButtonElement>(null);
    const [inventarioId, setInventarioId] = useState<number>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onAdd(newName.trim());
            setNewName("");
        }
    };

    const createInventario = async () => {
        try {
            const { data, error } = await supabase.from("Inventario").insert([
                {
                    tecnico_id: tecnicoId,
                    organizacion: organizacion,
                    tipo_inventario: flag,
                    inv_nombre: inventarioNombre,
                },
            ] as Inventarios[]);

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                console.log("Inventario creado:", data);
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
            } else {
                console.log("Deleted inventory", data);
                fetchInventarios();
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
                            onSelect(inv.id);
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
                                style={{ fontWeight: "bold", fontSize: "105%" }}
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
                    invNombre={ new URL(window.location.href).searchParams.get("invNombre")! }
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
