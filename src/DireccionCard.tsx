import styled from "styled-components";
import { Tables } from "../src/supabase/Database";
import { useParams } from "react-router-dom";
import { DetailsTitle } from "./ServiciosCard";
import { CardContainer } from "./rehusableComponents/CardContainer";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { InputsContainer } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import { supabase } from "./utils/ClientSupabase";
import { useEffect, useState } from "react";
import DirerccionModal from "./UpdateDireccionModal";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { useToast } from "./rehusableComponents/Toast";
type Cliente = Tables<"Clientes">;
type Direccion = Tables<"Direcciones">;

interface ResponsableCardProps {
    onValueChange?: (nuevoValor: string) => void;
    updaterPass?: boolean;
    onStateChange?: () => void;
    justCreatedResponsable?: boolean;
    justUpdatedSender?: () => void;
}

type Responsables = Tables<"Responsables">;

const DireccionesCardContainer = styled(CardContainer) /*style*/ `
    height: fit-content;
    max-height: 28.699rem;
    padding-bottom: 1rem;
    margin: unset;
    width: 30%;
    @media (max-width: 900px) {
        width: 100%;
        max-height: none;
        box-sizing: border-box;
        background: transparent;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        .addButton {
            width: 100%;
            margin-right: 0;
        }
        &.direccionesRegistros {
            width: 100%;
            box-sizing: border-box;
            background: red;
        }
        .direccionesRegistrosContainer {
            overflow-y: visible;
        }
    }

    .direccionesRegistros {
        @media (max-width: 900px) {
            width: 100%;
            box-sizing: border-box;
        }
        cursor: pointer;
        color: #838383;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border: solid black 0.25px;
        gap: 2rem;
        width: 90%;
        border-radius: 5px;
        padding: 0 10px 0 10px;
        background: white;
        box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
        position: relative;

        p {
            text-align: left;
            margin: 8px;
            padding: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 85%; // You can set a specific width if needed
            display: block;
        }
    }

    .direccionesRegistrosContainer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
        width: 100%;
    }

    .direccionesOpen {
        width: 100%;
        background: #0d4e80;
        border-radius: 0.718rem;
        margin-right: 24px;
        cursor: pointer;
        box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
        font-weight: bolder;
    }
    .addButton {
        @media (max-width: 900px) {
            width: 100%;
            margin-right: 0;
            box-sizing: border-box;
        }
        width: 45%;
        align-self: flex-end;
        margin-right: 24px;
        border-radius: 8px;
        border: 1px solid #0d4e80;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: background-color 0.25s;
        color: inherit;
        background: none;
        color: black;
    }
    .addButton:hover {
        background-color: #0d4e80;
        color: white;
    }
    .closeButton {
        position: absolute;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: red;
        right: 5%;
        top: 20%;
        background: #c1716e;
        font-weight: bold;
        font-size: 90%;
        cursor: pointer;
        color: white;
    }
    .closeButton:hover {
        transform: scale(1.05);
    }
`;

export const ResCardInputs = styled(CardInputs) /*style*/ `
    &.textInputs {
        width: 80%;
    }
`;

const DireccionCard: React.FC<ResponsableCardProps> = props => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [calle, setCalle] = useState<string>("");
    const [numeExt, setNumExt] = useState<string | null>("");
    const [numInt, setNumInt] = useState<string | null>("");
    const [piso, setPiso] = useState<string | null>();
    const [colonia, setColonia] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [dirección, setDirección] = useState<Direccion[]>([]);
    const [direccionFormOpen, setDireccionFormOpen] = useState<boolean>(false);
    const [direccionesRegistro, setDireccionesRegistro] = useState<boolean>(false);
    const [heightStatus, setHeightStatus] = useState<boolean>(true);
    const [ciudad, setCiudad] = useState<string>("");
    const [cancelarButton, setCancelarButton] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [direccionId, setDireccionId] = useState<number | null>(null);
    const [deleteRenderStatus, setDeleteRenderStatus] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [responsabledeDireccion, setResponsableDeDireccion] = useState<Responsables[]>([]);
    const [responsableId, setResponsableId] = useState<number | null>(null);
    const [apodo, setApodo] = useState<string>("");
    const [resPonsableDireccionUodatedFlag, setResponsableDireccionUpdatedFlag] = useState<boolean>(false);

    const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setCalle(cambio);
    };

    const handleOpenModa = () => {
        setModalOpen(prev => !prev);
    };

    const handleIntNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setNumInt(cambio);
    };

    const handleExtNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setNumExt(cambio);
    };

    const handleFloorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setPiso(cambio);
    };

    const handleColoniaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setColonia(cambio);
    };
    const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setZipCode(cambio);
    };
    const handleEstadoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value;
        setEstado(cambio);
    };

    const handleDeleteModalOpen = () => {
        setDeleteRenderStatus("DELETE");
    };

    const handleUpdateModalOpen = () => {
        setDeleteRenderStatus("UPDATE");
    };

    const handleFormRender = () => {
        setDireccionFormOpen(prev => !prev);
        const element = document.querySelector(".addButton") as HTMLElement;
        if (element) {
            element.style.display = "none";
        }
        setDireccionesRegistro(false);
        setCalle("");
        setColonia("");
        setEstado("");
        setNumExt("");
        setNumInt("");
        setPiso("");
        setZipCode("");
        setCiudad("");
    };
    const handleRegisterRender = async () => {
        if (direccionFormOpen) {
            await upsertDireccion();
            console.log("se hubiera creado");
        }
        setDireccionFormOpen(false);
        setDireccionesRegistro(prev => !prev);
        const element = document.querySelector(".addButton") as HTMLElement;
        if (element) {
            element.style.display = "initial";
        }
    };

    const handleHeightStatusChangeFalse = () => {
        setHeightStatus(false);
    };
    const handleHeightStatusChangeTrue = () => {
        setHeightStatus(true);
    };
    const handleCiudadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCiudad(event.target.value);
    };

    const handleCancelarChange = () => {
        if (
            calle == "" &&
            ciudad == "" &&
            zipCode == "" &&
            colonia == "" &&
            estado == "" &&
            numeExt == "" &&
            numInt == "" &&
            piso == "" &&
            url == ""
        ) {
            setCancelarButton(true);
        } else {
            setCancelarButton(false);
        }
    };
    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let cambio = event.target.value;
        setUrl(cambio);
    };

    const FetchDireccion = async () => {
        try {
            let query = supabase
                .from("Direcciones")
                .select("*") // Specify the relationship name
                .order("id")
                .filter("cliente_id", "eq", `${id}`);
            const { data: direcciones, error } = await query;
            if (direcciones && direcciones.length > 0) {
                setDirección(direcciones);
            } else {
            }
        } catch (err) {
            console.log("Error cargando al responsable", err);
        }
    };

    const fetcResponsableDeDireccion = async () => {
        try {
            let query = supabase
                .from("Responsables")
                .select("*") // Specify the relationship name
                .eq("cliente_id", id)
                .order("id");
            const { data, error } = await query;
            if (data && data.length > 0) {
                setResponsableDeDireccion(data);
            }
        } catch (err) {
            console.log("Error cargando al responsable de dirección", err);
        }
    };

    useEffect(() => {
        FetchDireccion();
        //fetcResponsableDeDireccion()
    }, []);

    useEffect(() => {
        if (dirección?.length > 0) {
            setDireccionesRegistro(true);
            setDireccionFormOpen(false);
        }
    }, [dirección]);

    useEffect(() => {
        handleCancelarChange();
        console.log(cancelarButton);
    }, [calle, ciudad, zipCode, colonia, estado, numInt, numeExt, piso]);

    useEffect(() => {
        fetcResponsableDeDireccion();
    }, [props.justCreatedResponsable]);

    const upsertDireccion = async () => {
        if (direccionFormOpen && !cancelarButton) {
            try {
                const { data, error } = await supabase.from("Direcciones").insert([
                    {
                        calle: calle,
                        ciudad: ciudad,
                        codigo_postal: zipCode,
                        colonia: colonia,
                        estado: estado,
                        numero_ext: numeExt,
                        numero_int: numInt,
                        piso: piso,
                        cliente_id: id,
                        ubicacion: url,
                        responsable_de_direccion: responsableId,
                        apodo_direccion: apodo,
                    },
                ] as any);
                if (error) {
                    console.error("Error inserting data:", error.message);
                    showToast("Error al crear la dirección: " + error.message, "error");
                } else {
                    console.log("Data inserted successfully:", data);
                    showToast("Dirección creada correctamente", "success");
                    FetchDireccion();
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log("Nada que agregar");
        }
    };
    // useEffect(() => {
    //     if (resPonsableDireccionUodatedFlag) {
    //       props.justUpdatedSender()
    //       console.log("ciclado?")
    //     }
    // }),[]

    return (
        <>
            {modalOpen && (
                <DirerccionModal
                    direccionId={direccionId}
                    closeModal={handleOpenModa}
                    fetchNewDir={() => {
                        FetchDireccion();
                        props.justUpdatedSender();
                    }}
                    renderStat={deleteRenderStatus}
                ></DirerccionModal>
            )}
            <DireccionesCardContainer style={{ height: `${heightStatus ? "fit-content" : "30.022rem"}` }}>
                <div
                    className="direccionesOpen"
                    onClick={() => {
                        handleRegisterRender();
                        handleHeightStatusChangeTrue();
                        props.justUpdatedSender();
                    }}
                >
                    <p>
                        {cancelarButton && direccionFormOpen
                            ? "Cancelar"
                            : direccionFormOpen
                              ? "Guardar Dirección"
                              : "Direcciónes del cliente"}
                    </p>
                </div>
                {direccionFormOpen && !direccionesRegistro && (
                    <>
                        <DetallesTitulo>Dirección del cliente</DetallesTitulo>
                        <div
                            style={{
                                overflowY: "scroll",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                height: "20.5rem",
                            }}
                        >
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Calle</DetailsTitle>
                                <ResCardInputs
                                    value={calle}
                                    id="CalleInput"
                                    name="calleDireccion"
                                    className="textInputs"
                                    placeholder="Ingrese la calle"
                                    onChange={handleStreetChange}
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Número exterior</DetailsTitle>
                                <ResCardInputs
                                    value={numeExt}
                                    onChange={handleExtNumChange}
                                    id="NumeroExteriorInput"
                                    name="numExtDireccion"
                                    className="textInputs"
                                    placeholder="Ingrese número exterior"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Número interior</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleIntNumChange}
                                    value={numInt}
                                    id="NumeroInteriorInput"
                                    name="numIntDireccion"
                                    className="textInputs"
                                    placeholder="Ingrese número interior"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Piso</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleFloorChange}
                                    value={piso}
                                    id="PisoInput"
                                    name="pisoDireccion"
                                    className="textInputs"
                                    placeholder="Ingrese el piso"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Colonia</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleColoniaChange}
                                    value={colonia}
                                    id="ColoniaInput"
                                    name="coloniaDireccion"
                                    className="textInputs"
                                    placeholder="Ingrese la colonia"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Estado</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleEstadoChange}
                                    value={estado}
                                    id="EstadoInput"
                                    name="estadoDireccion"
                                    className="textInputs"
                                    placeholder="Ingrese el estado"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Ciudad</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleCiudadChange}
                                    value={ciudad}
                                    id="CiudadInput"
                                    name="ciudadDireccion"
                                    className="textInputs"
                                    placeholder="ingrese la ciudad"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Código postal</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleZipChange}
                                    value={zipCode}
                                    id="CodigoPostalInput"
                                    name="zipCodeDireccion"
                                    className="textInputs"
                                    placeholder="ingrese el código postal"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Google maps URL</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleUrlChange}
                                    value={url}
                                    id="GoogleMapsUrlInput"
                                    name="urlDireccion"
                                    className="textInputs"
                                    placeholder="ingrese la url de la dirección"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Apodo</DetailsTitle>
                                <ResCardInputs
                                    onChange={e => setApodo(e.target.value)}
                                    value={apodo}
                                    id="ApodoInput"
                                    name="apodoDireccion"
                                    className="textInputs"
                                    placeholder="ingrese un apodo para la dirección"
                                ></ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <DetailsTitle>Responsable de dirección</DetailsTitle>
                                <StyledSelect
                                    value={responsableId}
                                    onChange={e => setResponsableId(parseInt(e.target.value))}
                                    style={{ width: "80%", boxSizing: "unset", textAlign: "center" }}
                                    width={"80%"}
                                >
                                    <option value="">Seleccione al responsable de esta dirección</option>
                                    {responsabledeDireccion?.map(responsable => (
                                        <option key={responsable?.id} value={responsable?.id}>
                                            {responsable?.nombre}
                                        </option>
                                    ))}
                                </StyledSelect>
                            </InputsContainer>
                        </div>
                    </>
                )}
                {direccionesRegistro && !direccionFormOpen && (
                    <div className="direccionesRegistrosContainer">
                        {dirección?.map(dir => (
                            <div className="direccionesRegistros" key={dir?.id}>
                                <p
                                    onClick={() => {
                                        setDireccionId(dir?.id);
                                        handleUpdateModalOpen();
                                        handleOpenModa();
                                    }}
                                >
                                    {dir?.calle} {dir?.colonia} {dir?.estado}
                                </p>
                                <div
                                    onClick={() => {
                                        setDireccionId(dir?.id);
                                        handleDeleteModalOpen();
                                        handleOpenModa();
                                    }}
                                    className="closeButton"
                                >
                                    X
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div
                    id=""
                    onClick={() => {
                        handleFormRender();
                        handleHeightStatusChangeFalse();
                    }}
                    className="addButton"
                >
                    Agregar Dirección
                </div>
            </DireccionesCardContainer>
        </>
    );
};

export default DireccionCard;
