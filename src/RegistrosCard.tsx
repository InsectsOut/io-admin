import { useEffect, useState } from "react";
import styled from "styled-components";
import { Tables } from "../src/supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import DelModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { set } from "ts-pattern/dist/patterns";

type RegistroAplicacion = Tables<"RegistroAplicacion">;

const RegistroContainer = styled.div<{ clicado?: boolean; alturaregitro: number }> /*style*/ `
    position: "relative";
    width: 100%;
    height: ${props => (props.clicado ? `${props.alturaregitro * 3.5 + 5}rem` : "5%")};
    max-height: 60vh;
    background: #f4f4f4;
    border-radius: 0.7179rem;
    margin-top: 2rem;
    transition: all 0.3s ease-in-out;
    box-shadow: ${props => (props.clicado ? "0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25)" : "none")};
    .topContent {
        width: 100%;
        background: #0d4e80;
        border-radius: 1rem;
        content: "";
        height: 2.429rem;
        display: flex;
        align-items: center;
        justify-content: center;
        :hover {
            cursor: pointer;
        }
        p {
            margin: 0;
        }
    }
    .bottomContent {
        :hover {
            color: #646cff;
        }
        transition: all 0.3s ease-in-out;
        overflow-y: scroll;
        height: ${props => props.alturaregitro * 3.5 + 1}rem;
        max-height: 50vh;

        ul {
            transition: all 0s ease-in-out;

            height: ${props => (props.clicado ? "auto" : "0")};
            box-shadow: ${props => (props.clicado ? "0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25)" : "none")};
        }
        li {
            transition: all 0.1s ease-in-out;
            width: ${props => (props.clicado ? "100%" : "0")};
            font-size: ${props => (props.clicado ? "100%" : "0")};
        }
    }
    .listElement {
        transition: all 0.1s ease-in-out;
        display: flex;
        font-size: ${props => (props.clicado ? "100%" : "0")};
        justify-content: space-evenly;
        color: ${props => (props.clicado ? "black" : "none")};
        box-shadow: ${props => (props.clicado ? "0px 0.1rem 0.1rem rgba(0, 0, 0, 0.25)" : "none")};
        width: 100%;
        :hover {
            cursor: pointer;
        }
    }
    p {
        text-align: left;
    }

    .listElement p {
        flex-grow: 1;
    }

    @media (max-width: 900px) {
        .topContent {
            display: none;
        }
        .bottomContent {
            overflow-x: hidden;
        }
        width: 100%;
        height: 53vh;
    }

    .deleteButton {
        all: unset;
        display: flex;
        font-weight: bolder;
        color: white !important;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: #c1716e;
        border-radius: 10%;
        height: 100%;
        margin-right: 1rem;
        &:hover {
            cursor: pointer;
            transform: scale(1.15);
        }
    }
`;

interface registrosProps {
    servicioId: number;
    openModal: () => void;
    sendDataParent: any;
    title?: string | null;
}

const RegistrosCard: React.FC<registrosProps> = props => {
    const [clicked, setClicked] = useState<boolean>(false);
    const [registros, setRegistros] = useState<RegistroAplicacion[]>([]);
    const [modalOpen, setOpen] = useState<boolean>(false);
    const [registroId, setRegistroId] = useState<number>();
    const [servicio_Id, setServicioId] = useState<number>(props?.servicioId ?? -1);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const { folio } = useParams();

    const getRegistroFromQuery = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const registro = urlParams.get("registro");
        if (registro) {
            return registro;
        }
    };

    const openModal = (e: React.MouseEvent, registroId: number) => {
        e.stopPropagation();

        // Get the current URL and update the params
        const url = new URL(window.location.href);
        url.searchParams.set("registro", registroId.toString());

        // Update the URL without navigation
        window.history.replaceState({}, "", url);

        // Open the modal
        setOpenDeleteModal(true);
    };

    const fetchRegistros = async () => {
        if (props?.servicioId === null || registros.length > 0) {
            return;
        }
        try {
            const { data, error } = await supabase
                .from("RegistroAplicacion")
                .select("*")
                // .eq("servicio_id",servicioId)
                .filter("servicio_id", "eq", props?.servicioId);
            if (data) {
                console.log("fecthed registros:", data);
                setRegistros(data);
                setClicked(true);
                return data;
                
            }

            if (error) {
                console.error("Error fetching RegistroAplicacion:", error.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSetRegistro = (number: number) => {
        setRegistroId(number);
    };

    useEffect(() => {
        const obtenerRegistros = async () => {
            try {
                if (props?.servicioId !== null) {
                    await fetchRegistros();
                   
                }
            } catch (err) {
                console.error("Error al obtener registros:", err);
            }
        };

        obtenerRegistros();
    }, [props?.servicioId]);
    // useEffect(() => {
    //     const obtenerRegistros = async () => {
    //         try {
    //             if (props?.servicioId !== null) {
    //                 await fetchRegistros();
    //                 if (registros.length > 0) {
    //                     setClicked(true);
    //                 }
    //             }
    //         } catch (err) {
    //             console.error("Error al obtener registros:", err);
    //         }
    //     };

    //     obtenerRegistros();
    // }, [props?.servicioId, registros]);

    // useEffect(() => {
    //     console.log("registros loaded",registros);
    //     if (registros.length > 0) {
    //         console.log("Registros updated:", registros);
    //         setClicked(true);

    //     }

    // }, []);

    const handleClick = (number: number) => {
        props.sendDataParent(number);
    };

    const deleteRegistros = async (servicioId: string) => {
        try {
            let query = supabase.from("RegistroAplicacion").delete().eq("id", servicioId);

            const { error, data: registros } = await query;

            if (error) {
                console.log("Error borrando el registro de aplicación ", error);
            }
            if (!error) {
                navigate(`/Servicios/${folio}`);
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <RegistroContainer clicado={clicked} alturaregitro={registros.length} className="registrosContainer">
                <div
                    className="topContent"
                    onClick={() => {
                        fetchRegistros();
                        setClicked(prevState => !prevState);
                    }}
                >
                    <p>{props.title ? props.title : "Registros"}</p>
                </div>
                <div className="bottomContent">
                    {registros
                        ?.sort((a, b) => a.id - b.id)
                        .map((data, index) => (
                            <div
                                style={{ width: "100%", display: "flex", alignItems: "center" }}
                                key={index}
                                className="listElement"
                                onClick={() => {
                                    setRegistroId(data?.id);

                                    // Pass both `data.id` and a specific `upsertFlag` value (e.g., actualizar or añadir)
                                    handleClick(data?.id);

                                    props.openModal();
                                }}
                            >
                                <p style={{ marginLeft: "1rem", width: "1%" }}>{index + 1}</p>
                                <p style={{ width: "25%", textAlign: "left" }}>{data?.area_aplicacion}</p>
                                <p style={{ width: "25%", textAlign: "left" }}>{data?.tipo_aplicacion}</p>
                                <button
                                    onClick={e => {
                                        openModal(e, data?.id);
                                    }}
                                    className="deleteButton"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                </div>
            
                {openDeleteModal && (
                    <DelModal
                        btnText={"Eliminar registro"}
                        titulo={"¿Seguro quiere eliminar el registro?"}
                        closeModal={() => {
                            setOpenDeleteModal(false);
                        }}
                        del={() => {
                            deleteRegistros(getRegistroFromQuery() ?? "");
                        }}
                    ></DelModal>
                )}
            </RegistroContainer>
        </>
    );
};

export default RegistrosCard;
