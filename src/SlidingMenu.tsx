import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHandshake } from "react-icons/fa";
import pump from "./assets/pumpicon.png";
import logoGrande from "./assets/logoGrande.png";
import { FaRegCalendarAlt } from "react-icons/fa";
import { PumpIcon } from "./Inicio";
import { GrLogout } from "react-icons/gr";
import { FaSprayCan, FaWarehouse, FaClipboardList, FaUserCircle, FaCog } from "react-icons/fa";
import { supabase } from "./utils/ClientSupabase";
import { BsPersonSquare } from "react-icons/bs";
import { useEffect, useState } from "react";

const MenuContainer = styled.div<{ open: boolean }> /*style*/ `
    z-index: 99;
    height: 100vh;
    width: ${props => (props.open ? "16%" : "0")};
    min-width: ${props => (props.open ? "180px" : "0")};
    position: fixed;
    top: 0;
    right: 0;
    transition: 0.3s ease;
    background: ${({ theme }) => theme.primaryColor};
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    @media (max-width: 900px) {
        width: ${props => (props.open ? "55%" : "0")};
        min-width: unset;
    }
    .servicios-button-container {
        display: flex;
    }
    .servicios-button {
        width: 100%;
        border-radius: 0;
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 3rem;
        background: none;
    }
`;

const Pump = styled(PumpIcon) /*style*/ `
    width: 30px;
    height: auto;
    filter: invert(100%);
    object-fit: cover;

    @media (min-width: 300px) and (max-width: 644px) {
        width: 20px;
        position: relative;
        left: 0.01rem;

        bottom: 0.5rem;
    }
`;

interface menuProps {
    isOpen: boolean;
    closing?: (event: React.MouseEvent) => void; // Function that expects an event
}

const SlidingMenu: React.FC<menuProps> = ({ isOpen, closing }) => {
    const navigate = useNavigate();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;
            const { data } = await supabase.from("Empleados").select("tipo_rol").eq("user_id", userId).maybeSingle();
            setIsSuperAdmin(data?.tipo_rol === "superadmin");
        };
        if (isOpen) checkRole();
    }, [isOpen]);

    const handleNavigate = (route: string) => {
        if (route === "log_out") {
            handleLogOut();
            return;
        }
        navigate(route);
    };
    const handleLogOut = async () => {
        localStorage.clear();
        await supabase.auth.signOut();
    };

    //TODO HACER LOS BOTONES UN MAP
    return (
        <MenuContainer open={isOpen}>
            {isOpen && (
                <>
                    <div className="servicios-button-container">
                        <button
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/Servicios");
                                closing?.(event);
                            }}
                        >
                            {" "}
                            <FaSprayCan size={40} />
                            Servicios
                        </button>
                    </div>
                    <div className="servicios-button-container">
                        <button
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/Clientes");
                                closing?.(event);
                            }}
                        >
                            <FaHandshake size={40} />
                            Clientes
                        </button>
                    </div>
                    <div className="servicios-button-container">
                        <button
                            style={{ fontSize: ".9rem" }}
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/calendar");
                                closing?.(event);
                            }}
                        >
                            <FaRegCalendarAlt size={40} />
                            Calendario
                        </button>
                    </div>
                    <div className="servicios-button-container">
                        <button
                            style={{ fontSize: ".9rem" }}
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/empleados");
                                closing?.(event);
                            }}
                        >
                            <BsPersonSquare size={40} />
                            Empleados
                        </button>
                    </div>
                    <div className="servicios-button-container">
                        <button
                            style={{ fontSize: ".9rem" }}
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/inventario");
                                closing?.(event);
                            }}
                        >
                            <FaWarehouse size={40} />
                            Inventario
                        </button>
                    </div>
                    <div className="servicios-button-container">
                        <button
                            style={{ fontSize: ".9rem" }}
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/bitacoras");
                                closing?.(event);
                            }}
                        >
                            <FaClipboardList size={40} />
                            Bitácoras
                        </button>
                    </div>
                    <div className="servicios-button-container">
                        <button
                            style={{ fontSize: ".9rem" }}
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("/perfil");
                                closing?.(event);
                            }}
                        >
                            <FaUserCircle size={40} />
                            Perfil
                        </button>
                    </div>
                    {isSuperAdmin && (
                        <div className="servicios-button-container">
                            <button
                                style={{ fontSize: ".9rem" }}
                                className="servicios-button"
                                onClick={(event: React.MouseEvent) => {
                                    handleNavigate("/configuracion");
                                    closing?.(event);
                                }}
                            >
                                <FaCog size={40} />
                                Configuración
                            </button>
                        </div>
                    )}
                    <div className="servicios-button-container">
                        <button
                            style={{ fontSize: ".9rem" }}
                            className="servicios-button"
                            onClick={(event: React.MouseEvent) => {
                                handleNavigate("log_out");
                                closing?.(event);
                            }}
                        >
                            <GrLogout size={40} />
                            Cerrar sesión
                        </button>
                    </div>
                </>
            )}
        </MenuContainer>
    );
};

export default SlidingMenu;
