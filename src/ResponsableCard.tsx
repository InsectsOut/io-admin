import styled from "styled-components";
import { Tables } from "../src/supabase/Database";
import { useParams } from "react-router-dom";
import { CardContainer } from "./rehusableComponents/CardContainer";
import { DetailsTitle } from "./ServiciosCard";
import { InputsContainer } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import { supabase } from "./utils/ClientSupabase";
import { useEffect, useState } from "react";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { FaEdit } from "react-icons/fa";

type Cliente = Tables<"Clientes">;
type Responsable = Tables<"Responsables">;
type Servicio = Tables<"Servicios">;

type ClientesConResponsables = Cliente & {
    Responsables: Responsable | null;
};
type Responsables = Tables<"Responsables">;
type Direccion = Tables<"Direcciones">;

const SaveButton = styled.button /*style*/ `
    all: unset;
    background-color: #0d4e80;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    font-weight: bold;
    box-sizing: border-box;

    width: 95%;
    height: 2.226rem;
    margin-bottom: 0.5rem;
    margin-right: 12px;
    font-size: 0.8rem;
    border-radius: 0.359rem;
    &:hover {
        cursor: pointer;
        background-color: #2980b9;
        transform: scale(1.05);
    }
`;

interface ResponsableCardProps {
    onValueChange: (nuevoValor: string) => void;
    updaterPass?: boolean;
    onStateChange: () => void;
    newResponsableFlag?: boolean;
    modalCloser?: () => void;
    justCreated?: () => void;
    justCreatedFlag?: boolean;
    justUpdated?:boolean;
}

const ResponsableCardContainer = styled(CardContainer) /*style*/ `
    height: fit-content;
    padding-bottom: 2rem;
    margin: unset;
     padding-right: 1.5rem;
    .bottomActionButtons{
    display:flex;
    justify-content:space-around;
    }
`;
const inputWidthStyle = {
    width: "80%",
};

const ResCardInputs = styled(CardInputs) /*style*/ `
    &.textInputs {
        width: 80%;
    }
`;
const ResponsableCard: React.FC<ResponsableCardProps> = ({
    onValueChange,
    onStateChange,
    newResponsableFlag,
    modalCloser,
    updaterPass,
    justCreated,
    justCreatedFlag,
    justUpdated,
}) => {
    const { id } = useParams();
    const [responsable, setResponsable] = useState<Responsable[]>([]);
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState<string>("");
    const [emai, setEmail] = useState("");
    const [puesto, setPuesto] = useState("");
    const [responsableId, setResponsable_id] = useState<number | null>(null);
    const [nuevoResponsableID, setNuevoResponsableID] = useState<number | null>(null);
    const [guardar, setGuardar] = useState(false);
    const [selectedResponsable, setSelectedResponsable] = useState<Responsable | null>(null);
    const [toggleEditName, setToggleEditName] = useState(false);
    const [direccion, setDireccion] = useState<Direccion[]>();
    const [direccionId, setDireccionId] = useState<number | null>(null);

    const fetchDireccion = async (responsableId: number) => {
        try {
            let query = supabase
                .from("Direcciones")
                .select(`*`)
                .filter("cliente_id", "eq", `${id}`)
                .eq("responsable_de_direccion", responsableId);
            const { data: direccion, error } = await query;
            if (direccion) {
                setDireccion(direccion);
                setDireccionId(direccion?.[0]?.id ?? null);
            } else {
                setDireccion([] as any);
            }
        } catch (err) {
            console.log("Error cargando la dirección del responsable", err);
        }
    };

    const fetchResponsable = async () => {
       
        try {
            let query = supabase
                .from("Responsables")
                .select(`*`)
                .filter("cliente_id", "eq", `${id}`)
                .order("created_at", { ascending: false });
            const { data: responsables, error } = await query;
            if (responsables && responsables.length > 0) {
                setResponsable(responsables);
                if (!newResponsableFlag) {
                    await setSelectedResponsable(responsables[0]);
                    await setResponsable_id(responsables[0].id);
                }
            } else {
                console.log("No se encuentra nada", responsables);
                console.log(error);
            }
        } catch (err) {
            console.log("Error cargando al responsable", err);
        }
    };

    useEffect(() => {
        fetchResponsable();
    }, [justCreatedFlag]);

    useEffect(() => {
        handleResponsableChange(selectedResponsable);
    }, [selectedResponsable]);

    const upsertResponsable = async () => {
        if (responsableId) {
            try {
                const { data, error } = await supabase
                    .from("Responsables")
                    .update([
                        {
                            cliente_id: id,
                            email: emai,
                            nombre: nombre,
                            puesto: puesto,
                            telefono: telefono,
                        },
                    ] as any)
                    .filter("id", "eq", `${responsableId}`)
                    .select();
                if (error) {
                    console.log("Error while trying to update ", error);
                } else {
                    console.log("data updated succesfully ", data);
                    //setResponsable_id(() => );
                }
            } catch (err) {
                console.log("Error while fetching", err);
            }
        } else {
            try {
                const { data, error } = await supabase
                    .from("Responsables")
                    .insert([
                        {
                            cliente_id: id,
                            email: emai,
                            nombre: nombre,
                            puesto: puesto,
                            telefono: telefono,
                        },
                    ] as any)
                    .select();
                setNuevoResponsableID(() => data?.[0]?.id ?? null);

                if (error) {
                    console.log("Error while trying to update ", error);
                } else {
                    console.log("data updated succesfully ", data);
                }
            } catch (err) {
                console.log("Error while fetching", err);
            }
        }
    };

    useEffect(() => {
        if (updaterPass) {
            upsertResponsable();
        }
    }, [updaterPass]);

    useEffect(() => {
        if (selectedResponsable?.id) {
            fetchDireccion(selectedResponsable?.id);
        } else {
            return;
        }
    }, [selectedResponsable?.id]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setNombre(cambio);
        onStateChange();
    };

    const handleTelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value.replace(/\s/g, "");
        setTelefono(cambio);
        onStateChange();
    };

    const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setEmail(cambio);
        onStateChange();
    };

    const handlePuestoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setPuesto(cambio);
        onStateChange();
    };

    const handleResponsableChange = (responsable: Responsables | null) => {
        setEmail(responsable?.email ?? "");
        setNombre(responsable?.nombre ?? "");
        setPuesto(responsable?.puesto ?? "");
        setTelefono(responsable?.telefono ?? "");
    };

//     useEffect(() =>{
// setJustUpdatedFlag(() => justUpdated ?? false);
//     },[justUpdated])

     useEffect(() => {
        const runner = async () => {
 if (selectedResponsable?.id) {
            await fetchDireccion(selectedResponsable?.id);
        } else {
            return;
        }
        }
       runner()
    }, [justUpdated]);

    return (
        <>
            <ResponsableCardContainer>
                
                <DetallesTitulo>
                    {newResponsableFlag ? "Añadir Responsable" : "Información del Responsable"}
                </DetallesTitulo>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>Responsable de dirección</DetailsTitle>
                    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "0.5rem" }}>
                        {toggleEditName || newResponsableFlag ? (
                            <ResCardInputs
                                value={nombre}
                                onChange={handleNameChange}
                                id="textInputs"
                                className="textInputs"
                                placeholder="Nombre del Responsable"
                                largo="80%"
                            ></ResCardInputs>
                        ) : (
                            !newResponsableFlag && (
                                <StyledSelect
                                    value={responsableId}
                                    onChange={e => {
                                        setResponsable_id(parseInt(e.target.value));
                                        setSelectedResponsable(
                                            responsable.find(r => r.id === parseInt(e.target.value)) ?? null
                                        );
                                    }}
                                    width="80%"
                                    style={{ boxSizing: "border-box", width: "83%" }}
                                >
                                    <option value="">Seleccione al responsable</option>
                                    {responsable?.map(responsable => (
                                        <option key={responsable?.id} value={responsable?.id}>
                                            {responsable?.nombre}
                                        </option>
                                    ))}
                                </StyledSelect>
                            )
                        )}
                        {!newResponsableFlag && nombre !== "" && (
                            <FaEdit
                                onClick={() => (nombre !== "" ? setToggleEditName(!toggleEditName) : null)}
                                style={{
                                    cursor: "pointer",
                                    color: toggleEditName ? "#0d4e80" : "#ccc",
                                    transition: "color 0.3s",
                                }}
                            ></FaEdit>
                        )}
                    </div>
                </InputsContainer>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>Teléfono</DetailsTitle>
                    <ResCardInputs
                        value={telefono}
                        onChange={handleTelChange}
                        id="TelefonoResponsable"
                        name="TelResponsable"
                        className="textInputs"
                        placeholder="Teléfono del Responsable"
                    ></ResCardInputs>
                </InputsContainer>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>E-mail</DetailsTitle>
                    <ResCardInputs
                        onChange={handleMailChange}
                        value={emai}
                        id="postResponsable"
                        name="postResponsable"
                        className="textInputs"
                        placeholder="Correo del Responsable"
                    ></ResCardInputs>
                </InputsContainer>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>Puesto</DetailsTitle>
                    <ResCardInputs
                        onChange={handlePuestoChange}
                        value={puesto}
                        id="PuestoResponsable"
                        name="puestoResponsable"
                        className="textInputs"
                        placeholder="Puesto del Responsable"
                    ></ResCardInputs>
                </InputsContainer>
                {!newResponsableFlag && (
                    <InputsContainer style={{ width: "100%" }}>
                        <DetailsTitle>Ubicación del responsable</DetailsTitle>
                        <StyledSelect
                            value={direccionId ?? ""}
                            onChange={e => setDireccionId(parseInt(e.target.value))}
                            width="80%"
                            style={{ boxSizing: "border-box", width: "83%" }}
                        >
                            <option value="">Seleccione al responsable</option>
                            {direccion?.map(dir => (
                                <option key={dir?.id} value={dir?.id}>
                                    {dir?.apodo_direccion ?? dir?.calle + dir?.colonia }
                                </option>
                            ))}
                        </StyledSelect>
                    </InputsContainer>
                )}
                {newResponsableFlag && (
                    <div
                    className="bottomActionButtons"
                    >
                    <SaveButton
                        onClick={async () => {
                            await upsertResponsable();
                            await fetchResponsable();
                            await modalCloser?.();
                            await justCreated?.();
                        }}
                    >
                        Guardar Responsable
                    </SaveButton>
                    <SaveButton
                        onClick={async () => {
                            await modalCloser?.();
                        }}
                    >
                       Cerrar
                    </SaveButton>
                    </div>
                )}
            </ResponsableCardContainer>
        </>
    );
};

export default ResponsableCard;
