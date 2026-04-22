import styled from "styled-components";
import { ServiciosContainer } from "./Servicios";
import { Titulo } from "./Servicios";
import { useEffect, useState } from "react";
import { StyledDatePicker } from "./Servicios";
import { useNavigate } from "react-router-dom";
import { useToast } from "./rehusableComponents/Toast";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { supabase } from "./utils/ClientSupabase";
import { Tables } from "./supabase/Database";

type AreaGubernamental = Tables<"AreaGubernamental">;

interface WarningModalProps {
    message: string;
    onClose: () => void;
    visible: boolean;
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    /* background: rgba(44, 62, 80, 0.45); */
    background: rgb(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const ModalContainer = styled.div`
    background: #f3f3f3;
    box-shadow: 0px 4px 9.8px rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
    width: 28rem;
    min-height: 12rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
`;

const ModalTitle = styled.div`
    font-size: 1.25rem;
    font-weight: 700;
    color: #a01f27;
    margin-bottom: 1rem;
`;

const ModalMessage = styled.div`
    font-size: 1rem;
    color: #474747;
    text-align: center;
    margin-bottom: 2rem;
`;

const CloseButton = styled.button`
    background: ${({ theme }) => theme.primaryColor};
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.75rem 2rem;
    cursor: pointer;
    &:hover {
        background-color: #2980b9;
        transform: scale(1.05);
    }
`;

export const WarningModal: React.FC<WarningModalProps> = ({ message, onClose, visible }) => {
    if (!visible) return null;
    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalTitle>Advertencia</ModalTitle>
                <ModalMessage>{message}</ModalMessage>
                <CloseButton onClick={onClose}>Cerrar</CloseButton>
            </ModalContainer>
        </ModalOverlay>
    );
};

const SearchButtonLink = styled.button`
    width: 4.5rem;
    height: 2.188rem;
    background: ${({ theme }) => theme.primaryColor};
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
`;
const CreateFormContainer = styled.div`
    background: red;
    width: 60.3125%;
    background: red;
    display: flex;
    flex-direction: column;
    background: #f3f3f3;
    min-height: 83vh;
    position: relative;
    height: fit-content;
    box-shadow: 0px 4px 9.8px rgba(0, 0, 0, 0.25);
`;

const CreateContainer = styled(ServiciosContainer)`
    .createForm {
        align-self: center;
    }
`;

const FormHeader = styled.div`
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

const CreateServicioForm = styled.form`
    display: flex;
    gap: 2rem;
    flex-direction: column;
    color: #474747;
    height: 20vh;
    .formatoInputs {
        display: flex;
        flex-direction: column;
    }
    .dateInput {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }
`;

export const FormatoInputs = styled.div`
    text-align: left;
    margin-left: 6.25rem;
    display: flex;
    flex-direction: column;
    width: 12.698rem;

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

export const DateInput = styled(StyledDatePicker)`
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    text-align: left;
    padding-left: 0.5rem;
    color: #838383;
    width: 12.635625rem;
    height: 2.5125rem;
    background: #ffffff;
    border: 0.071793rem solid #727272;
    border-radius: 0.215379rem;
`;
export const Horario = styled.input`
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
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
`;
export const TimeInput = styled.div`
    display: flex;
    flex-direction: column;
`;
export const FechaInput = styled.div`
    display: flex;
    flex-direction: column;
`;

interface createClienteProps {
    user_id?: string;
    organizacion?: string;
}

const CreateClientForm: React.FC<createClienteProps> = props => {
    const [_fetchError, _] = useState("");
    const [email, setEmail] = useState("");
    const [tipoCliente, setTipoCliente] = useState("");
    const [telefono, setTelefono] = useState("");
    const [_servicioFolio, SetServicioFolio] = useState<number | null>(null);
    const [nombre, setNombre] = useState<string>("");
    const [apellido, setApellido] = useState<string>("");
    const [areaGubernamental, setAreaGubernamental] = useState<AreaGubernamental[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [areaGubernamentalId, setAreaGubernamentalId] = useState<number | null>(-1);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const addCliente = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("Clientes")
                .insert([
                    {
                        email: email,
                        telefono: telefono,
                        tipo_cliente: tipoCliente,
                        nombre: nombre,
                        apellidos: apellido,
                        user_id: props.user_id,
                        organizacion: props.organizacion,
                        gob_id: areaGubernamentalId && areaGubernamentalId !== -1 ? areaGubernamentalId : null,
                    },
                ] as any)
                .select();

            if (error) {
                console.error("Error inserting data:", error.message);
                showToast("Error al crear el cliente: " + error.message, "error");
                setIsLoading(false);
            } else {
                console.log("Data inserted successfully:", data);
                showToast("Cliente creado correctamente", "success");
                let clienteId = data?.[0]?.id;
                if (clienteId) {
                    navigate(`/Clientes/${clienteId}`);
                }
                console.log("hola");
                SetServicioFolio(clienteId);
            }
        } catch (err) {
            console.error("Error adding servicio:", err);
            setIsLoading(false);
        }
    };

    const handleAreaGubernamentalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const areaId = parseInt(event.target.value, 10);
        setAreaGubernamentalId(areaId);
    };

    const fetchAreasGubernamentales = async () => {
        try {
            // Use the prop if available, otherwise fallback to "IOPSLP"
            const organizacion = props.organizacion ?? "";

            // Fetch rows from Supabase where organizacion matches
            const { data, error } = await supabase
                .from("AreaGubernamental")
                .select("*")
                .eq("organizacion", organizacion);

            if (error) {
                console.error("Error fetching áreas gubernamentales:", error);
                setModalVisible(true);
            }

            if (!data || data.length === 0) {
                console.warn(`No se encontraron áreas gubernamentales para: ${organizacion}`);
                setAreaGubernamental([]); // make sure state is cleared
                setModalVisible(true);
            } else {
                setAreaGubernamental(data);
            }
        } catch (err) {
            console.error("Unexpected error fetching áreas gubernamentales:", err);
        }
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emailChange = event.target.value;
        setEmail(emailChange);
    };

    const handleTipoCliente = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tipo = event.target.value;
        setTipoCliente(tipo);
        if (tipo === "Gubernamental") {
            await fetchAreasGubernamentales();
        }
    };

    const handleTelefonoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const telefonoCambio = event.target.value.replace(/\s/g, ""); // Remove spaces
        setTelefono(telefonoCambio);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setNombre(cambio);
    };
    const handleApellidosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setApellido(cambio);
    };

    return (
        <CreateContainer id="createContainer">
            <WarningModal
                message="No se encontraron áreas gubernamentales, añada una en el módulo de Configuración."
                onClose={() => setModalVisible(false)}
                visible={modalVisible}
            />
            <Titulo>Clientes</Titulo>
            <CreateFormContainer className="createForm">
                <FormHeader>Para registrar un nuevo cliente, complete el siguiente formulario.</FormHeader>
                <CreateServicioForm id="createClientForm">
                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels>Tipo de Cliente:</FormLabels>
                        <select
                            id="tipoSelect"
                            value={tipoCliente}
                            onChange={handleTipoCliente}
                            className="textInputs arrowChange"
                        >
                            <option value="" disabled selected hidden>
                                Elegir el tipo de servicio...
                            </option>
                            <option>--Elige el tipo del cliente--</option>
                            <option value="Residencial">Residencial</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Gubernamental">Gubernamental</option>
                            <option value="Hotelería">Hotelería</option>
                            <option value="Escolar">Escolar</option>
                        </select>
                    </FormatoInputs>
                    {tipoCliente === "Gubernamental" && areaGubernamental.length > 0 && (
                        <FormatoInputs style={{ width: "19.815rem" }}>
                            <FormLabels>Anexo:</FormLabels>
                            <select
                                id="tipoSelect"
                                value={areaGubernamentalId ?? -1}
                                onChange={handleAreaGubernamentalChange}
                                className="textInputs arrowChange"
                            >
                                <option value="" disabled selected hidden>
                                    Elegir el tipo de servicio...
                                </option>
                                <option value={-1} disabled>
                                    --Elige el tipo del área gubernamental--
                                </option>
                                {areaGubernamental.map(area => (
                                    <option key={area.id} value={area.id}>
                                        {area.nombreAreaGob}
                                    </option>
                                ))}
                            </select>
                        </FormatoInputs>
                    )}
                    <FormatoInputs style={{ flexDirection: "row", width: "75%", gap: "2rem" }}>
                        <div style={{ width: "45%" }}>
                            <FormLabels>
                                {(() => {
                                    const tipoSelect = document.getElementById(
                                        "tipoSelect"
                                    ) as HTMLSelectElement | null;
                                    if (tipoSelect) {
                                        if (tipoSelect.value === "Gubernamental") {
                                            return "Sub dependencia";
                                        } else if (tipoSelect.value !== "Residencial") {
                                            return "Nombre de la empresa";
                                        } else {
                                            return "Nombre del Cliente";
                                        }
                                    }
                                    return "Nombre del Cliente";
                                })()}
                            </FormLabels>
                            <CardInputs
                                value={nombre}
                                onChange={handleNameChange}
                                id="textInputs"
                                className="textInputs"
                            />
                        </div>

                        <div style={{ width: "45%" }}>
                            {(() => {
                                const tipoSelect = document.getElementById("tipoSelect") as HTMLSelectElement | null;
                                return tipoSelect && tipoSelect.value === "Residencial" ? (
                                    <>
                                        <FormLabels>Apellidos</FormLabels>
                                        <CardInputs
                                            value={apellido}
                                            onChange={handleApellidosChange}
                                            id="textInputs"
                                            className="textInputs"
                                        />
                                    </>
                                ) : null;
                            })()}
                        </div>
                    </FormatoInputs>
                    <FormatoInputs style={{ flexDirection: "row", width: "75%", gap: "2rem" }}>
                        <div style={{ width: "45%" }}>
                            <FormLabels>E-mail de contacto</FormLabels>
                            <CardInputs
                                className="textInputs"
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                            ></CardInputs>
                        </div>
                        <div style={{ width: "45%" }}>
                            <FormLabels>Teléfono</FormLabels>
                            <CardInputs
                                className="textInputs"
                                type="text"
                                value={telefono}
                                onChange={handleTelefonoChange}
                            ></CardInputs>
                        </div>
                    </FormatoInputs>

                    {/* <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Responsable:</FormLabels>
                        <select value={responsableId} onChange={handleResponsableChange}className="textInputs arrowChange"
                        >
                            <option disabled selected hidden>Elige al Responsable...</option>
                            {responsables.map((responsable) =>
                                <option key={responsable.id} value={responsable.id}>{responsable.nombre}</option>

                            )}
                        </select>
                    </FormatoInputs> */}

                    <div
                        className="buttonRegistrar"
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "right",
                            position: "absolute",
                            bottom: "0",
                            right: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <SearchButtonLink type="button" onClick={addCliente} disabled={isLoading}>
                            {isLoading ? "Registrando..." : "Registrar"}
                        </SearchButtonLink>
                    </div>
                </CreateServicioForm>
            </CreateFormContainer>
        </CreateContainer>
    );
};

export default CreateClientForm;
