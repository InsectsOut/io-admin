import { supabase } from "./utils/ClientSupabase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Tables } from "../src/supabase/Database";
import { Titulo } from "./Servicios";
import { useBrandTheme } from "./utils/ThemeContext";
import { useParams } from "react-router-dom";
import { servicioOptions } from "./tipo_servicios";
import { ReturnButton } from "./ServiciosCard";
import { CardContainer } from "./rehusableComponents/CardContainer";
import { DetailsTitle } from "./ServiciosCard";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { InputsContainer } from "./ServiciosCard";
import { mainStyle } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import ResponsableCard from "./ResponsableCard";
import { StyledButton } from "./ServiciosCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import DireccionCard from "./DireccionCard";
import { useToast } from "./rehusableComponents/Toast";

type Cliente = Tables<"Clientes">;
interface serviciosProps {
    organizacion?: string;
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    box-sizing: border-box;
`;

const ModalContent = styled.div`
    background: #fff;
    border-radius: 0.75rem;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
`;

const ClientCardContainer = styled(CardContainer) /*style*/ `
    height: fit-content;
    padding-bottom: 2rem;
`;
export const BodyContainer = styled.div`
    display: flex;
    gap: 2.94rem;
    .responsableSection {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
`;
const NumberInputs = styled(CardInputs)`
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
        opacity: 0.5;
        cursor: pointer;
        &::-webkit-inner-spin-button:hover,
        &::-webkit-outer-spin-button:hover {
            background-color: #ddd;
        }
    }
`;

const inputWidthStyle = {
    width: "19.815rem",
};

export const AddResponsableCard = styled.div`
    width: 24.625rem;
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

const TextoAddCard = styled.h1 /*style*/ `
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

const ClientesCard: React.FC<serviciosProps> = props => {
    const { showToast } = useToast();
    const { theme } = useBrandTheme();
    const [cliente, setCliente] = useState<Cliente[] | null>([]);
    const [nombre, setNombre] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [apellido, setApellido] = useState<any>("");
    const { id } = useParams();
    const [tipoCliente, setTipoCliente] = useState<string>("");
    const [responsable, setResponsable] = useState<string>("");
    const [isClicked, setClicked] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);
    const [responsableExists, setResponsableExists] = useState<boolean | null>(false);
    const [, setResponsableId] = useState<number | null>();
    const [updater, setUpdater] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newResponsableFlag, setNewResponsableFlag] = useState(false);
    const [responsableJustCreated, setResponsableJustCreated] = useState(false);
    const [direccionUpdatedFlag, setDireccionUpdatedFlag] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [infoTab, setInfoTab] = useState<string>("general");

    const insertResponsable = async (elCliente: Cliente[]) => {
        const nombreCompleto = `${elCliente?.[0]?.nombre} ${elCliente?.[0]?.apellidos} `;

        if (elCliente[0].responsable_id) {
            return;
        }
        if (!elCliente[0].responsable_id) {
            if (elCliente) {
                try {
                    const { data, error } = await supabase
                        .from("Responsables")
                        .insert([
                            {
                                cliente_id: id,
                                email: elCliente[0]?.email,
                                nombre: nombreCompleto,
                                puesto: "",
                                telefono: elCliente[0]?.telefono,
                            },
                        ] as any)
                        .select();
                    if (error) {
                        console.log("Error while trying to update ", error);
                    } else {
                        console.log("data updated succesfully ", data);
                        const { data: response, error: err } = await supabase
                            .from("Clientes")
                            .update([
                                {
                                    responsable_id: data?.[0]?.id,
                                },
                            ] as any)
                            .filter("id", "eq", `${id}`)
                            .select();
                    }
                } catch (err) {
                    console.log("Error while fetching", err);
                }
            } else {
                return;
            }
        } else {
            return;
        }
    };

    const handleChildStateChange = () => {
        if (!showModal) setClicked(true);
    };

    const handleChildValue = (nuevoValor: string) => {
        setResponsable(nuevoValor);
    };

    const updateOrInsert = () => {
        setUpdater(true);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true);
        const cambio = event.target.value;
        setNombre(cambio);
    };
    const handleApellidoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true);
        const cambio = event.target.value;
        setApellido(cambio);
    };

    const handleTelefonoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true);
        const cambio = event.target.value.replace(/\s/g, "");
        setTelefono(cambio);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true);
        const cambio = event.target.value;
        setEmail(cambio);
    };

    const fetchClientes = async () => {
        try {
            let query = supabase
                .from("Clientes")
                .select("*")
                .filter("id", "eq", `${id}`)
                .filter("organizacion", "eq", props.organizacion);
            const { data: cliente } = await query;

            if (cliente) {
                const { nombre, apellidos, telefono, email, tipo_cliente, responsable_id } = cliente[0];

                setCliente(cliente);
                setNombre(nombre);
                setApellido(apellidos);
                setTelefono(telefono);
                setEmail(email);
                setTipoCliente(tipo_cliente || "");
                setResponsableId(responsable_id);

                if (responsable_id) {
                    setResponsableExists(true);
                    return;
                }

                if (!responsable_id) {
                    setResponsableExists(false);
                    insertResponsable(cliente);
                    return;
                }
            }
        } catch (error) {
            console.log("Error consiguiendo los datos del cliente");
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const handleTipoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true);
        const cambio = event.target.value;
        setTipoCliente(cambio);
    };

    const updateCliente = async () => {
        try {
            const { data, error } = await supabase
                .from("Clientes")
                .update([
                    {
                        nombre: nombre,
                        apellidos: apellido,
                        telefono: telefono,
                        email: email,
                        tipo_cliente: tipoCliente,
                    },
                ] as any)
                .filter("id", "eq", `${id}`);
            if (error) {
                console.error("Error updating data:", error.message);
                showToast("Error al guardar el cliente: " + error.message, "error");
                return false;
            } else {
                console.log("Data updated successfully:", data);
            }
            updateOrInsert();
            return true;
        } catch (err) {
            console.log("Error making the update request");
            return false;
        }
    };

    const justCreatedHandler = () => {
        setResponsableJustCreated(prev => !prev);
    };

    const selectTab = (currentTab: string) => {
        return (
            <div className="selectTag">
                <div
                    className="genInfo infoButtons"
                    onClick={() => setInfoTab("general")}
                    style={{
                        background: currentTab === "general" ? "white" : theme.primaryColor,
                        color: currentTab === "general" ? theme.primaryColor : "white",
                    }}
                >
                    <p>General</p>
                </div>
                <div
                    className="workInfo infoButtons"
                    onClick={() => setInfoTab("responsable")}
                    style={{
                        background: currentTab === "responsable" ? "white" : theme.primaryColor,
                        color: currentTab === "responsable" ? theme.primaryColor : "white",
                    }}
                >
                    <p>Responsable</p>
                </div>
                <div
                    className="workInfo infoButtons"
                    onClick={() => setInfoTab("direccion")}
                    style={{
                        background: currentTab === "direccion" ? "white" : theme.primaryColor,
                        color: currentTab === "direccion" ? theme.primaryColor : "white",
                    }}
                >
                    <p>Dirección</p>
                </div>
            </div>
        );
    };

    return (
        <>
            {showModal && (
                <>
                    <ModalOverlay>
                        <ModalContent>
                            <ResponsableCard
                                updaterPass={updater}
                                onValueChange={handleChildValue}
                                onStateChange={handleChildStateChange}
                                newResponsableFlag={newResponsableFlag}
                                modalCloser={() => setShowModal(false)}
                                justCreated={() => justCreatedHandler()}
                            ></ResponsableCard>
                        </ModalContent>
                    </ModalOverlay>
                </>
            )}
            <Titulo>Clientes</Titulo>
            <BodyContainer id="bodyContainer">
                <ClientCardContainer>
                    <DetallesTitulo>Información del cliente</DetallesTitulo>
                    {selectTab(infoTab)}
                    {(screenWidth > 900 || infoTab === "general") && (
                        <>
                            <InputsContainer>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        width: screenWidth <= 900 ? "100%" : "26.124rem",
                                        flexDirection: screenWidth <= 900 ? "column" : "row",
                                        gap: screenWidth <= 900 ? "0.75rem" : undefined,
                                    }}
                                >
                                    <div
                                        style={{
                                            width:
                                                screenWidth <= 900
                                                    ? "100%"
                                                    : tipoCliente !== "Residencial"
                                                      ? "20.44rem"
                                                      : "11.728rem",
                                        }}
                                    >
                                        <DetailsTitle>Nombre</DetailsTitle>
                                        <CardInputs
                                            style={{
                                                width:
                                                    screenWidth <= 900
                                                        ? "100%"
                                                        : tipoCliente === "Residencial"
                                                          ? "85%"
                                                          : "19.815rem",
                                            }}
                                            id="textInputs"
                                            className="textInputs"
                                            onChange={handleNameChange}
                                            value={nombre}
                                        ></CardInputs>
                                    </div>
                                    {tipoCliente === "Residencial" && (
                                        <div style={{ width: screenWidth <= 900 ? "100%" : "11.728rem" }}>
                                            <DetailsTitle>Apellido</DetailsTitle>
                                            <CardInputs
                                                style={{ width: screenWidth <= 900 ? "100%" : "85%" }}
                                                id="textInputs"
                                                className="textInputs"
                                                onChange={handleApellidoChange}
                                                value={apellido}
                                            ></CardInputs>
                                        </div>
                                    )}
                                </div>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>Teléfono</DetailsTitle>
                                <NumberInputs
                                    style={{ width: screenWidth <= 900 ? "100%" : "19.815rem" }}
                                    id="textInputs"
                                    className="textInputs"
                                    type="tel"
                                    onChange={handleTelefonoChange}
                                    value={telefono}
                                ></NumberInputs>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>E-mail</DetailsTitle>
                                <CardInputs
                                    style={{ width: screenWidth <= 900 ? "100%" : "19.815rem" }}
                                    className="textInputs"
                                    type="text"
                                    onChange={handleEmailChange}
                                    value={email}
                                ></CardInputs>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>Tipo de Cliente</DetailsTitle>
                                <select
                                    value={tipoCliente}
                                    style={{
                                        ...mainStyle,
                                        width: screenWidth <= 900 ? "100%" : "85%",
                                        boxSizing: "border-box",
                                    }}
                                    onChange={handleTipoChange}
                                >
                                    {servicioOptions?.map(options => (
                                        <option key={options.id} value={options.value}>
                                            {options.value}
                                        </option>
                                    ))}
                                </select>
                            </InputsContainer>
                        </>
                    )}
                    {screenWidth <= 900 && (
                        <div
                            style={{
                                display: infoTab === "responsable" ? "flex" : "none",
                                flexDirection: "column",
                                gap: "1rem",
                                flex: 1,
                                width: "100%",
                            }}
                        >
                            {tipoCliente !== "Residencial" && (
                                <button
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        padding: "0.45rem 0.9rem",
                                        border: `0.125rem solid ${theme.primaryColor}`,
                                        borderRadius: "0.359rem",
                                        color: theme.primaryColor,
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        background: "none",
                                        fontFamily: "inherit",
                                    }}
                                    onClick={() => {
                                        setShowModal(true);
                                        setNewResponsableFlag(true);
                                    }}
                                >
                                    <IoIosAddCircleOutline size={18} />
                                    Añadir responsable
                                </button>
                            )}
                            {responsableExists && tipoCliente !== "Residencial" && (
                                <ResponsableCard
                                    updaterPass={updater}
                                    onValueChange={handleChildValue}
                                    onStateChange={handleChildStateChange}
                                    justCreatedFlag={responsableJustCreated}
                                    justUpdated={direccionUpdatedFlag}
                                ></ResponsableCard>
                            )}
                        </div>
                    )}
                    {screenWidth <= 900 && (
                        <div
                            style={{
                                display: infoTab === "direccion" ? "flex" : "none",
                                flexDirection: "column",
                                gap: "1rem",
                                flex: 1,
                                width: "100%",
                            }}
                        >
                            <DireccionCard
                                justCreatedResponsable={responsableJustCreated}
                                justUpdatedSender={async () => {
                                    await setDireccionUpdatedFlag(prev => !prev);
                                }}
                            ></DireccionCard>
                        </div>
                    )}
                </ClientCardContainer>
                {screenWidth > 900 && (
                    <div className="responsableSection">
                        {responsableExists && tipoCliente !== "Residencial" && (
                            <>
                                <ResponsableCard
                                    updaterPass={updater}
                                    onValueChange={handleChildValue}
                                    onStateChange={handleChildStateChange}
                                    justCreatedFlag={responsableJustCreated}
                                    justUpdated={direccionUpdatedFlag}
                                ></ResponsableCard>
                            </>
                        )}
                        {tipoCliente !== "Residencial" && (
                            <AddResponsableCard
                                style={{ alignSelf: "center" }}
                                onClick={() => {
                                    setShowModal(true);
                                    setNewResponsableFlag(true);
                                }}
                            >
                                <div>
                                    <IoIosAddCircleOutline size={30} style={{ color: "black" }} />
                                    <TextoAddCard>Añadir responsable</TextoAddCard>
                                </div>
                            </AddResponsableCard>
                        )}
                    </div>
                )}
                {screenWidth > 900 && (
                    <DireccionCard
                        justCreatedResponsable={responsableJustCreated}
                        justUpdatedSender={async () => {
                            await setDireccionUpdatedFlag(prev => !prev);
                        }}
                    ></DireccionCard>
                )}
            </BodyContainer>
            <ReturnButton onClick={() => window.history.back()}>Regresar</ReturnButton>
            <StyledButton
                disabled={!isClicked || isSaving}
                clicado={isClicked}
                onClick={async () => {
                    if (isSaving) return;
                    setIsSaving(true);
                    const success = await updateCliente();
                    if (success) {
                        showToast("Cliente guardado correctamente", "success");
                        await fetchClientes();
                        setClicked(false);
                        setUpdater(false);
                    }
                    setIsSaving(false);
                }}
            >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
            </StyledButton>
        </>
    );
};

export default ClientesCard;
