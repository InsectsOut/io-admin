import styled from 'styled-components';
import { FaPlus, FaTools, FaSignOutAlt, FaClipboardList, FaUserCog, FaWarehouse, FaLaptop, FaCar, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import Inventario_Menu from './Invetarios_Views';
import useBodyClick from './UseBodyClick';

const WrapperContainer = styled.div`
width: calc(100% - 2rem); /* Ajusta el ancho para que no ocupe todo el espacio */
height: calc(100% - 6.2rem);
display: flex;
border: 1rem solid  #E0E6ED; /* Agrega un borde */
border-radius: 0.5rem; /* Agrega un radio a las esquinas */
`

const InventarioMainContainer = styled.div`
width: 100%;
height: 100%;
display: flex;
font-family: 'Open Sans';
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
`
const LeftMenu = styled.div`
background-color: #F7F9FB;
height: 100%;
width: 15%;
display: flex;
flex-direction: column;
align-items: center;
`
const MenuButtons = styled.div`
border-radius:0.215379rem;
background: white;
width: 85%;
margin-top: 2rem;
color: black;
height: 5rem;
cursor: pointer;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
display: flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
&:hover{
    background: #6B8AAC;
    color: white;
}
`

const DashbboardButton = styled.div`
border-radius:0.215379rem; 
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
width: 20%;
height: 10rem;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: 0.5rem;
cursor: pointer;
&:hover{
    background: #6B8AAC;
    color: white;
}
`

const MainContent = styled.div`
width: 85%;
height: 100%;
display: flex;
flex-direction: column;
color: black;
.title{
   color: #0D4E80;
}
.dashboardMenu{
    width: 100%;
 
    display: flex;
    justify-content: space-around;
}
.bottomContent{
    margin-top: 2rem;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;

}
`
const AlertasContainer = styled.div`
width: 45%;
border-radius: 0.5rem; 
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
height: 90%;
padding: 1rem;
background-color: #F7F9FB; /* Fondo claro */
h2 {
    color: #0D4E80; /* Título en azul */
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
`

interface inventarioProps {
    organizacion?: string;
}
enum InventarioFlag {
    tecnicos = "tecnicos",
    principal = "principal",
    equipo = "equipo",
    vehiculos = "vehiculos",
    menu_Principal = "menu_principal"
}



const Inventario: React.FC<inventarioProps> = (props) => {
    const [inventarioMenu, setInventarioMenu] = useState<boolean>(false);
    const [inventarioFlag, setInventarioFlag] = useState<InventarioFlag>();

    const handleMenuClick = (flag: InventarioFlag) => {
        setInventarioMenu(true);
        console.log(inventarioFlag);
        setInventarioFlag(flag);
    }
    
  
    // const handleBackToMenu = () => {
    //     setInventarioMenu(false);
    //     setInventarioFlag(inventarioFlag.menu_Principal);
    // }
    return (
        <WrapperContainer>
            <InventarioMainContainer>
                <LeftMenu>
                    <MenuButtons>
                        <FaPlus style={{ fontSize: '2rem', color: 'rgb(14, 78, 126)' }} />
                        <p>Agregar Entrada</p>
                    </MenuButtons>
                    <MenuButtons>
                        <FaTools style={{ fontSize: '2rem', color: 'rgb(14, 78, 126)' }} />
                        <p>Entregar a técnico</p>
                    </MenuButtons>
                    <MenuButtons>
                        <FaSignOutAlt style={{ fontSize: '2rem', color: 'rgb(14, 78, 126)' }} />
                        <p>Registrar salida</p>
                    </MenuButtons>
                    <MenuButtons>
                        <FaClipboardList style={{ fontSize: '2rem', color: 'rgb(14, 78, 126)' }} />
                        <p>Crear Inventario de técnico</p>
                    </MenuButtons>
                </LeftMenu>

                <MainContent>
                    <button
                     onClick={() => setInventarioMenu(false)}
                    >regresar</button>
                    {!inventarioMenu &&
                        <><h1 className='title'>Inventario</h1><div className='dashboardMenu'>
                            <DashbboardButton
                                onClick={() => handleMenuClick(InventarioFlag.tecnicos)}
                            >
                                <FaUserCog style={{ fontSize: '3rem', color: 'rgb(14, 78, 126)' }} />
                                <p>Inventarios de técnicos</p>
                            </DashbboardButton>
                            <DashbboardButton
                             onClick={() => handleMenuClick(InventarioFlag.principal)}
                            >
                                <FaWarehouse style={{ fontSize: '3rem', color: 'rgb(14, 78, 126)' }} />
                                <p>Inventario Principal</p>
                            </DashbboardButton>
                            <DashbboardButton
                             onClick={() => handleMenuClick(InventarioFlag.equipo)}
                            >
                                <FaLaptop style={{ fontSize: '3rem', color: 'rgb(14, 78, 126)' }} />
                                <p>Inventario de Equipo</p>
                            </DashbboardButton>
                            <DashbboardButton
                             onClick={() => handleMenuClick(InventarioFlag.vehiculos)}
                            >
                                <FaCar style={{ fontSize: '3rem', color: 'rgb(14, 78, 126)' }} />
                                <p>Inventario de Vehículos</p>
                            </DashbboardButton>
                        </div><div className='bottomContent'>
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
                            </div></>
                    }
                    {
                        inventarioMenu &&
                        <Inventario_Menu
                        organizacion={props.organizacion ? props.organizacion : ""} 
                            flag={inventarioFlag}
                        />
                    }
                </MainContent>
            </InventarioMainContainer>
        </WrapperContainer>
    );
};

export default Inventario;