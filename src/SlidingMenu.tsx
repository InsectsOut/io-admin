import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { FaHandshake } from "react-icons/fa";
import pump from './assets/pumpicon.png'
import logoGrande from "./assets/logoGrande.png"
import { FaRegCalendarAlt } from "react-icons/fa";
import { PumpIcon } from "./Inicio";
import { GrLogout } from "react-icons/gr";
import { FaSprayCan } from "react-icons/fa";
import { supabase } from "./utils/ClientSupabase";



const MenuContainer = styled.div <{ open: boolean }>/*style*/ `
z-index:99 ;
height:49.711rem;
width:${props => (props.open ? '16%' : '0')}; ;
position:absolute;
right:0;
transition:  0.3s ease; /* Animate the right position */
background: #0D4E80;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
display:flex;
flex-direction:column;
gap:1rem;
.servicios-button-container{
display:flex;
}
.servicios-button{
width:100%;
border-radius:0;
flex-grow:1;
display:flex;
align-items:center;
gap:3rem;
background:none;

}
`

const Pump = styled(PumpIcon) /*style*/ `
width:30px;
height:auto;
filter: invert(100%);
object-fit:cover;

@media (min-width: 300px) and (max-width: 644px) {
 width:20px;
 position:relative;
left:.01rem;

bottom:.5rem;
  }

`

interface menuProps{
    isOpen: boolean
    }

const SlidingMenu: React.FC<menuProps> = ({isOpen}) => {

    const navigate = useNavigate()

    const handleLogOut = async() => {
    localStorage.clear();
    await supabase.auth.signOut()
    }
    return(
    <MenuContainer
    open={isOpen}
    >
        {isOpen && 
        <>
        <div
        className="servicios-button-container"
        >
        <button
         className="servicios-button"
        onClick={() => {navigate("/Servicios")}}
        >  <FaSprayCan size={40}/>Servicios</button>
        </div>
        <div
         className="servicios-button-container"
        >
        <button
        className="servicios-button"
        onClick={() => {navigate("/Clientes")}}
        ><FaHandshake size={40}/>Clientes</button>
        </div>
        <div
         className="servicios-button-container"
        >
        <button
        style={{fontSize:".9rem"}}
        className="servicios-button"
        onClick={() => {handleLogOut()}}
        ><GrLogout size={40}/>Cerrar sesión</button>
        </div>
        <div
         className="servicios-button-container"
        >
        <button
        style={{fontSize:".9rem"}}
        className="servicios-button"
        onClick={() => {navigate("/Clientes")}}
        ><FaRegCalendarAlt size={40}/>Calendario</button>
        </div>
        </>
    }

    </MenuContainer>
    )
}

export default SlidingMenu