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
    flag?: string;
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
                    inv_principal: InventarioFlag.principal === flag,
                    inv_empleado: InventarioFlag.tecnicos === flag,
                    inv_equipo: InventarioFlag.equipo === flag,
                    inv_vehiculo: InventarioFlag.vehiculos === flag,
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
        if (flag === InventarioFlag.tecnicos) {
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
                .eq("inv_principal", InventarioFlag.principal === flag)
                .eq("inv_empleado", InventarioFlag.tecnicos === flag)
                .eq("inv_equipo", InventarioFlag.equipo === flag)
                .eq("inv_vehiculo", InventarioFlag.vehiculos === flag);

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

    const pushToQueryParams = (tecnicoNombre: string, inventarioId: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("tecnico", tecnicoNombre);
        url.searchParams.set("inventarioId", inventarioId.toString());
        window.history.replaceState(null, "", url.toString());
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);
    useEffect(() => {
        fetchInventarios();
    }, []);

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
                                inv.id
                            );
                        }}
                    >
                        {flag === InventarioFlag.tecnicos && (
                            <EntryText>{empleados.find(emp => emp.id === inv.tecnico_id)?.nombre}</EntryText>
                        )}
                        {flag === InventarioFlag.principal && (
                            <EntryText>{inv.inv_nombre || "Inventario Principal"}</EntryText>
                        )}
                        {flag === InventarioFlag.vehiculos && (
                            <EntryText>{inv.inv_nombre || "Inventario vehícular"}</EntryText>
                        )}
                        {flag === InventarioFlag.equipo && (
                            <EntryText>{inv.inv_nombre || "Inventario de equipo"}</EntryText>
                        )}
                        <EntryIcon>{icon}</EntryIcon>
                    </EntryItem>
                ))}
            </EntryList>
            <CreateButton onClick={() => setIsModalOpen(true)}>Nuevo Inventario</CreateButton>
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h2>Crear Nuevo Inventario</h2>
                        <ModalForm>
                            {flag === InventarioFlag.tecnicos && (
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
