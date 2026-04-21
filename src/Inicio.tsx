import styled, { keyframes } from "styled-components";
import { BsPersonSquare } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa";
import pump from "./assets/pumpicon.png";
import { FaRegCalendarAlt } from "react-icons/fa";
import logoGrande from "./assets/logoGrande.png";
import { Link, useLocation } from "react-router-dom";
import { FaSprayCan, FaWarehouse, FaClipboardList } from "react-icons/fa";

const shineAnimation = keyframes /*style*/ `
    0% {
        background-position: -200%;
    }
    100% {
        background-position: 200%;
    }
`;

const DashboardContainer = styled.div /*style*/ `
    display: flex;
    justify-content: space-evenly;
    margin-top: 2rem;
    height: auto;
    width: 100%;
    flex-wrap: wrap;
    gap: 3rem;

    .dashboard-content {
        display: flex;
        height: 100%;
        flex-direction: column;
        gap: 4rem;
        justify-content: space-between;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        gap: 2rem;
        align-items: center;

        .dashboard-content {
            display: flex;
            height: 100%;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            overflow-y: hidden;
            justify-content: space-between;
        }
    }
`;

const Option = styled.div /*style*/ `
    text-align: center;
    padding: 20px;
    width: 10vw;
    min-width: 120px;
    min-height: 120px;
    border-radius: 10px;
    cursor: pointer;
    animation: ${shineAnimation} 1s linear infinite;
    -webkit-mask-image: linear-gradient(45deg, #000 25%, rgba(0, 0, 0, 0.2) 50%, #000 75%);
    mask-image: linear-gradient(45deg, #000 25%, rgba(0, 0, 0, 0.2) 50%, #000 75%);
    -webkit-mask-size: 800%;
    mask-size: 800%;
    -webkit-mask-position: 0;
    mask-position: 0;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
        transition: background-color 0.3s;
        transform: scale(1.2);
        transition:
            mask-position 2s ease,
            -webkit-mask-position 2s ease;
        -webkit-mask-position: 120%;
        mask-position: 120%;
        opacity: 1;
    }

    @media (max-width: 768px) {
        width: auto;
        min-width: 100px;
        min-height: 100px;
        padding: 1rem;
    }
`;

const OptionContainer = styled(Option) /*style*/ `
    height: fit-content;
    background: #0d4e80;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    min-width: 120px;
    min-height: 120px;

    &.calendario {
        background-color: rgba(214, 43, 51);
    }
    &.bitacoras {
        background-color: rgba(9, 38, 87);
    }
    &.clientes {
        background-color: #a01f27;
    }
    &.empleados {
        background-color: #3d6b27;
    }
    &.inventario {
        background-color: hsl(102.08955223880596, 37.43016759776537%, 35.09803921568627%);
    }

    @media (max-width: 768px) {
        min-width: 100px;
        min-height: 100px;
        padding: 1rem;
    }
`;

const Clientes = styled(Option) /*style*/ `
    background-color: #d62b33; /* Principal Color */
    height: fit-content;
`;

const Empleados = styled(Option) /*style*/ `
    background-color: #0e4e7f; /* Secondary Color */
    height: fit-content;
`;

export const PumpIcon = styled.img /*style*/ `
    width: 70px;
    height: auto;
    filter: invert(100%);
    object-fit: cover;
    transform: scale(2);
    position: relative;
    right: 0.5rem;

    @media (max-width: 768px) {
        width: 60px;
        position: relative;
        left: 0.01rem;
        bottom: 0.5rem;
    }
`;

const InsectImage = styled.img /*style*/ `
    width: 45%;
    height: auto;
    object-fit: cover;

    @media (max-width: 768px) {
        width: 80%;
        max-width: 200px;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
        width: 60%;
    }
`;
const ImgCont = styled.div /*style*/ `
    position: relative;
    display: inline-flex;
    height: auto;
    align-items: center;
    border: black 0.02rem;
    box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 11px 2px rgba(0, 0, 0, 0.75);
    max-width: 100%;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        order: 2;
        width: 100%;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        order: 2;
        width: 100%;
        margin-top: 2rem;
        box-shadow: none;
    }
`;

const InfoText = styled.div /*style*/ `
    width: 50%;
    color: black;
    text-align: left;
    text-align: justify;
    font-weight: lighter;
    padding: 2rem;

    & p {
        font-size: 2vw;
    }

    @media (max-width: 768px) {
        display: none;
    }
    @media (max-width: 1024px) {
        display: none;
    }

    @media (min-width: 645px) and (max-width: 768px) {
        display: none;
        background: red;
        & p {
            font-size: 3vw !important;
        }
    }
`;

const OptionsCardsCont = styled.div /*style*/ `
    display: flex;
    flex-basis: 100%;
    justify-content: space-evenly;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-basis: initial;
        flex-direction: row;
        justify-content: center;
        & h2 {
            display: none;
        }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
        flex-basis: initial;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        max-height: 400px;
        box-sizing: border-box;
        gap: 2rem;
        & h2 {
        }
        font-size: 0.7rem;
    }
`;

const Dashboard = () => {
    return (
        <>
            <DashboardContainer>
                <div className="dashboard-content">
                    <OptionsCardsCont>
                        <Link to="/Servicios">
                            <OptionContainer className="servicios">
                                <FaSprayCan size={70} />
                                <h2>Servicios</h2>
                            </OptionContainer>
                        </Link>
                        <Link to="/Clientes ">
                            <OptionContainer className="clientes">
                                <FaHandshake size={70}></FaHandshake>
                                <h2>Clientes</h2>
                            </OptionContainer>
                        </Link>
                        <Link to="/empleados ">
                            <OptionContainer className="empleados">
                                <BsPersonSquare size={70}></BsPersonSquare>
                                <h2>Empleados</h2>
                            </OptionContainer>
                        </Link>
                        <Link to="/calendar ">
                            <OptionContainer className="calendario">
                                <FaRegCalendarAlt size={70}></FaRegCalendarAlt>
                                <h2>Calendario</h2>
                            </OptionContainer>
                        </Link>
                        <Link to="/bitacoras ">
                            <OptionContainer className="bitacoras">
                                <FaClipboardList size={80}></FaClipboardList>
                                <h2>Bitacoras</h2>
                            </OptionContainer>
                        </Link>
                        <Link to="/inventario ">
                            <OptionContainer className="inventario">
                                <FaWarehouse size={80}></FaWarehouse>
                                <h2>Inventario</h2>
                            </OptionContainer>
                        </Link>
                    </OptionsCardsCont>
                    <ImgCont>
                        <InsectImage loading="lazy" src={logoGrande} />
                        <InfoText>
                            <p>
                                Hola, Esta herramienta nos ayudará a agilizar la operación de Insects Out. Ha sido
                                desarrollada a la medida de la empresa, por lo que encontrarán que se ajusta fácilmente
                                al ritmo de trabajo que manejamos. Todo esto con el objetivo de aligerar la carga
                                laboral y brindar un mejor servicio y atención a nuestros clientes.
                            </p>
                        </InfoText>
                    </ImgCont>
                </div>
            </DashboardContainer>
        </>
    );
};

export default Dashboard;
