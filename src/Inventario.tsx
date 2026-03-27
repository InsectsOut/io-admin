import styled from "styled-components";
import {
    FaPlus,
    FaTools,
    FaSignOutAlt,
    FaClipboardList,
    FaUserCog,
    FaWarehouse,
    FaLaptop,
    FaCar,
    FaExclamationTriangle,
    FaCheckCircle,
} from "react-icons/fa";
import { useState } from "react";
import Inventario_Menu from "./Invetarios_Views";
import useBodyClick from "./UseBodyClick";
import { Database, Enums, Tables } from "./supabase/Database";
import { FaPrescriptionBottle } from "react-icons/fa";
import { ModalButton, ModalContent, ModalForm, ModalOverlay } from "./rehusableComponents/CreateInventariosModal";
import { CardInputs } from "./rehusableComponents/CardInputs";
import { StyledSelect } from "./rehusableComponents/StyledSelect";
import { supabase } from "./utils/ClientSupabase";
import ProductosMenu from "./Prductos";

const WrapperContainer = styled.div`
    width: calc(100% - 2rem); /* Ajusta el ancho para que no ocupe todo el espacio */
    height: calc(100% - 6.2rem);
    display: flex;
    border: 1rem solid #e0e6ed; /* Agrega un borde */
    border-radius: 0.5rem; /* Agrega un radio a las esquinas */
`;

const InventarioMainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    font-family: "Open Sans";
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
`;
const LeftMenu = styled.div`
    background-color: #f7f9fb;
    height: 100%;
    width: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const MenuButtons = styled.div`
    border-radius: 0.215379rem;
    background: white;
    width: 85%;
    margin-top: 2rem;
    color: black;
    height: 5rem;
    cursor: pointer;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-around;
    &:hover {
        background: #6b8aac;
        color: white;
    }
`;

export const DashbboardButton = styled.div`
  position: relative;
  width: 22%;
  min-width: 180px;
  height: 9rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, #f9fbfd, #e5ecf4);
  box-shadow: 0 6px 20px rgba(14, 78, 126, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(14, 78, 126, 0.1);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;

  p {
    font-size: 1.1rem;
    font-weight: 600;
    color: #0e4e7e;
    margin: 0;
    text-align: center;
    transition: color 0.3s ease;
  }

  svg {
    font-size: 2rem;
    color: #0e4e7e;
    transition: transform 0.3s ease, color 0.3s ease;
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(120deg, rgba(14, 78, 126, 0.1), transparent 60%);
    transform: rotate(25deg);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(145deg, #0e4e7e, #1d6fa5);
    box-shadow: 0 10px 24px rgba(14, 78, 126, 0.25);
    transform: translateY(-2px);
    
    p {
      color: #fff;
    }
    svg {
      color: #fff;
      transform: scale(1.1);
    }
    &::before {
      opacity: 0.2;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(14, 78, 126, 0.2);
  }
`;


const MainContent = styled.div`
    width: 85%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: black;
    overflow: scroll;
    .title {
        color: #0d4e80;
    }
    .dashboardMenu {
        width: 100%;

        display: flex;
        justify-content: space-around;
    }
    .bottomContent {
        margin-top: 2rem;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
    }
`;
const AlertasContainer = styled.div`
    width: 45%;
    border-radius: 0.5rem;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
    height: 90%;
    padding: 1rem;
    background-color: #f7f9fb; /* Fondo claro */
    h2 {
        color: #0d4e80; /* Título en azul */
        margin-bottom: 1rem;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #333; /* Texto oscuro */
    }
    .icon {
        font-size: 1.5rem;
        color: rgb(14, 78, 126); /* Íconos en azul */
    }
`;

const StyledLabel = styled.label`
    min-width: 150px;
    font-weight: 600;
    color: #0d4e80;
    font-size: 0.9rem;
    text-align: left;
`;

const FormRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.75rem;
`;

interface inventarioProps {
    organizacion?: string;
}
export enum InventarioFlag {
    tecnicos = "tecnicos",
    principal = "principal",
    equipo = "equipo",
    vehiculos = "vehiculos",
    menu_Principal = "menu_principal",
}

const Inventario: React.FC<inventarioProps> = props => {
    const [inventarioMenu, setInventarioMenu] = useState<boolean>(false);
    const [inventarioFlag, setInventarioFlag] = useState<Enums<"TipoInventario">>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleMenuClick = (flag: Enums<"TipoInventario">) => {
        setInventarioMenu(true);
        console.log(inventarioFlag);
        setInventarioFlag(flag);
    };

     const clearParams = () => {
        const url = new URL(window.location.href);
                            url.search = ""; // this removes all search params
                            window.history.replaceState(null, "", url.toString());

    }

    return (
        <WrapperContainer>
            <InventarioMainContainer>
                <LeftMenu>
                    {/* <MenuButtons>
                        <FaPlus style={{ fontSize: "2rem", color: "rgb(14, 78, 126)" }} />
                        <p>Agregar Entrada</p>
                    </MenuButtons>
                    <MenuButtons>
                        <FaTools style={{ fontSize: "2rem", color: "rgb(14, 78, 126)" }} />
                        <p>Entregar a técnico</p>
                    </MenuButtons>
                    <MenuButtons>
                        <FaSignOutAlt style={{ fontSize: "2rem", color: "rgb(14, 78, 126)" }} />
                        <p>Registrar salida</p>
                    </MenuButtons> */}
                    {/* <MenuButtons>
                        <FaClipboardList style={{ fontSize: "2rem", color: "rgb(14, 78, 126)" }} />
                        <p>Crear Inventario de técnico</p>
                    </MenuButtons> */}
                    <MenuButtons
                        onClick={() => {
                            setIsModalOpen(prev => !prev);
                            setInventarioMenu(false)
                        }}
                    >
                        <FaPrescriptionBottle style={{ fontSize: "2rem", color: "rgb(14, 78, 126)" }} />
                        <p>Artículos</p>
                    </MenuButtons>
                </LeftMenu>

                <MainContent>
                    <div
                    style={{width:"100%", display:"flex", justifyContent:"flex-start", marginLeft:"2rem"}}
                    >
                    <DashbboardButton
                        style={{ height: "3rem", margin: "1rem 0", fontSize: "1rem", fontWeight: 600 }}
                        onClick={() => {
                            clearParams();
                            setInventarioMenu(false);
                            setIsModalOpen(false);
                        }}
                    >
                        Menú Principal
                    </DashbboardButton>
                    </div>
                    {!inventarioMenu && !isModalOpen && (
                        <>
                            <h1 className="title">Inventario</h1>
                            <div className="dashboardMenu">
                                <DashbboardButton onClick={() => handleMenuClick("empleado")}>
                                    <FaUserCog style={{ fontSize: "3rem", color: "rgb(14, 78, 126)" }} />
                                    <p>Inventarios de técnicos</p>
                                </DashbboardButton>
                                <DashbboardButton onClick={() => handleMenuClick("principal")}>
                                    <FaWarehouse style={{ fontSize: "3rem", color: "rgb(14, 78, 126)" }} />
                                    <p>Inventario Principal</p>
                                </DashbboardButton>
                                <DashbboardButton onClick={() => handleMenuClick("equipo")}>
                                    <FaLaptop style={{ fontSize: "3rem", color: "rgb(14, 78, 126)" }} />
                                    <p>Inventario de Equipo</p>
                                </DashbboardButton>
                                <DashbboardButton onClick={() => handleMenuClick("vehiculo")}>
                                    <FaCar style={{ fontSize: "3rem", color: "rgb(14, 78, 126)" }} />
                                    <p>Inventario de Vehículos</p>
                                </DashbboardButton>
                            </div>
                            <div className="bottomContent">
                                <AlertasContainer>
                                    <h2>Alertas</h2>
                                    <ul>
                                        <li>
                                            <FaExclamationTriangle className="icon" />
                                            Insecticida A está por agotarse.
                                        </li>
                                        <li>
                                            <FaExclamationTriangle className="icon" />
                                            El vehículo X está en servicio.
                                        </li>
                                        <li>
                                            <FaExclamationTriangle className="icon" />
                                            Insecticida B tiene bajo stock.
                                        </li>
                                    </ul>
                                </AlertasContainer>
                                <AlertasContainer>
                                    <h2>Consumos recientes</h2>
                                    <ul>
                                        <li>
                                            <FaCheckCircle className="icon" />
                                            Se consumieron 5 litros de Insecticida A.
                                        </li>
                                        <li>
                                            <FaCheckCircle className="icon" />
                                            Se utilizaron 3 litros de Insecticida B.
                                        </li>
                                        <li>
                                            <FaCheckCircle className="icon" />
                                            Se entregaron 2 litros de Insecticida C a un técnico.
                                        </li>
                                    </ul>
                                </AlertasContainer>
                            </div>
                        </>
                    )}
                    {inventarioMenu && (
                        <Inventario_Menu
                            organizacion={props.organizacion ? props.organizacion : ""}
                            flag={inventarioFlag!}
                        />
                    )}
                    {isModalOpen && (
                        <ProductosMenu organizacion={props.organizacion!}></ProductosMenu>
                    )}
                </MainContent>
            </InventarioMainContainer>
        </WrapperContainer>
    );
};

export default Inventario;
