import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Tables } from "../src/supabase/Database";
type Direcciones = Tables<"Direcciones">;
import { supabase } from "./utils/ClientSupabase";
import { useNavigate } from "react-router-dom";
import useBodyClick from "./UseBodyClick";

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 30px;
    width: 35%;
    border-radius: 12px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
    max-width: 90%;
    max-height: 80%;
    overflow: auto;
    color: #333;
    position: relative;
    gap: 1.5rem;

    h2 {
        margin: 0 0 15px 0;
        font-size: 1.5rem;
        color: #2c3e50;
    }

    p {
        width: 100%;
        margin: 0;
        text-align: left;
        font-size: 1rem;
        color: #555;
    }
    .folioCont {
        display: flex;
        gap: 0.5rem;
    }
`;

const CloseButton = styled.button`
    all: unset;
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    font-size: 20px;
    color: #fff;
    background: #e74c3c;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;

    &:hover {
        background: #c0392b;
    }
`;

const P = styled.p`
    color: #3788d8 !important;
    width: 100%;
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventTitle: string;
    eventStartTime: string;
    eventEndTime?: string;
    eventDescription?: string;
    eventFolio?: number;
    eventFrecuencia?: string;
    eventDireccion?: number;
    eventTipoServicio?: string;
    eventTipoFolio?: string;
    eventResponsable?: number;
    eventRealizado?: boolean;
    eventCancelado?: boolean;
    eventAplicadorResponsable?: number;
    eventTipoPlaga?: number | null;
    eventUbicacion?: string | null;
    sendRef: (ref: HTMLDivElement | null) => void;
}

const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    eventTitle,
    eventStartTime,
    eventEndTime,
    eventDescription,
    eventFolio,
    eventFrecuencia,
    eventDireccion,
    eventTipoServicio,
    eventTipoFolio,
    eventResponsable,
    eventRealizado,
    eventCancelado,
    eventAplicadorResponsable,
    eventTipoPlaga,
    eventUbicacion,
    sendRef,
}) => {
    const [direccion, setDireccion] = useState<Direcciones[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const fetchDireccion = async (direccion_id: number) => {
        try {
            let query = await supabase.from("Direcciones").select(`*`).filter("id", "eq", direccion_id);
            const { data, error } = query;
            if (error) {
                console.log(error);
            }
            if (data) {
                setDireccion(data);
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (eventDireccion) {
            fetchDireccion(eventDireccion);
        }
    }, [eventDireccion]);

    return (
        <>
            <Backdrop>
                <ModalContent
                    ref={(el: HTMLDivElement) => {
                        modalRef.current = el;
                        sendRef?.(el);
                    }}
                >
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                    <h2>{eventTitle}</h2>
                    <p>
                        <strong>Horario de Servicio:</strong> {eventStartTime}
                    </p>
                    {eventEndTime && (
                        <p>
                            <strong>End Time:</strong> {eventEndTime}
                        </p>
                    )}
                    {eventDescription && (
                        <p>
                            <strong>Observaciones:</strong> {eventDescription}
                        </p>
                    )}
                    {eventFolio && (
                        <div style={{ width: "100%" }} className="folioCont">
                            <p style={{ maxWidth: "fit-content" }}>
                                <strong>Folio: </strong>
                            </p>
                            <P onClick={() => navigate(`/Servicios/${eventFolio}`)}>
                                {" "}
                                {eventFolio < 0 ? `FT-${eventFolio * -1}` : eventFolio}
                            </P>
                        </div>
                    )}
                    {eventFrecuencia && (
                        <p>
                            <strong>Frecuencia Recomendada:</strong> {eventFrecuencia}
                        </p>
                    )}
                    {eventDireccion && (
                        <p>
                            <strong>Direccion:</strong> {direccion[0]?.calle} {direccion[0]?.ciudad}{" "}
                            {direccion[0]?.colonia} {direccion[0]?.numero_ext} {direccion[0]?.codigo_postal}
                        </p>
                    )}
                    {eventTipoServicio && (
                        <p>
                            <strong>Tipo de Servicio:</strong> {eventTipoServicio}
                        </p>
                    )}
                    {eventTipoFolio && (
                        <p>
                            <strong>Tipo de Folio:</strong> {eventTipoFolio}
                        </p>
                    )}
                    {eventRealizado !== undefined && (
                        <p>
                            <strong>Realizado:</strong> {eventRealizado ? "Sí" : "No"}
                        </p>
                    )}
                    <p>
                        <strong>Aplicador Responsable:</strong> {eventAplicadorResponsable}
                    </p>
                    {eventTipoPlaga && (
                        <p>
                            <strong>Tipo de Plaga ID:</strong> {eventTipoPlaga}
                        </p>
                    )}
                </ModalContent>
            </Backdrop>
        </>
    );
};

export default EventModal;
