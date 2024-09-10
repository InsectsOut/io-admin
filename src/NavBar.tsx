import styled from 'styled-components'
import './App.css'
import icon from './assets/logoOjo.png'
import { FaHome } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";
import SlidingMenu from './SlidingMenu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';



/* Rectangle 2 */



const NavContainer = styled.div /*style*/`
    width: 100vw;
    height: 8%;
    display: flex;
    background: #F3F3F3;
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.25);
    justify-content: flex-start;
    align-items: center;

    &.iconosContainer {
        justify-content: flex-end;
    }

    @media (min-width: 300px) and (max-width: 644px) {
   
    
  }

  @media (min-width: 645px) and (max-width: 768px) {
   
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

    
  }
`;


const Logo = styled.img /*style*/ `
width:6.15%;
height: 100%;
aspect-ratio: 1/1;
margin-left:1rem;
position:relative;
top:.2rem;
object-fit:contain;
transform: scale(1.2);

@media (min-width: 300px) and (max-width: 644px) {
  width:11%;

  

  
  }

  @media (min-width: 645px) and (max-width: 768px) {
    
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

   display: none;
  }
  @media (min-width: 1200px)  {
    width:auto;
height: 100%;
aspect-ratio: 1/1;
margin-left:1rem;
position:relative;
top:.2rem;
object-fit:cover;
transform: scale(1);
  
  }

  
`
const LogoImageContainer =styled.div /*style*/ `
width:60%;
height:100%;
display:flex;
justify-content:left;

`

const IconsContainer = styled.ul  /*style*/ `
display:flex;
list-style: none;
align-items:center;
justify-content:flex-end;
width:100%;
gap:1rem;


padding-right: 1rem;

`

const Li = styled.li /*style*/`

&:hover {
  cursor:pointer;
  transform:scale(1.2);
  }`
/* Inicio */


function NavBar() {
const[modalOpen,setModalOpena] = useState(false)
const [home,setHome] = useState(false)
const navigate = useNavigate()

const openModal = () => {
  setModalOpena((prev) => !prev)
}

const navegar = () =>{
  if (home){
    navigate("/inicio")
    setHome((prev) => !prev)
  }
}

useEffect(()=>{
navegar()
},[home])

return (
  <>
    {window.location.pathname !== "/" && (
      <>
        <NavContainer>
          <Logo src={icon} />
          <IconsContainer className="iconosContainer">
            <Li onClick={() => { setHome(true); }}>
              <FaHome size={30} color="#0E4E7E" />
            </Li>
            <Li>
              <MdAccountCircle size={30} color="#0E4E7E" />
            </Li>
            <Li onClick={openModal}>
              <IoMenuSharp size={30} color="#0E4E7E" />
            </Li>
          </IconsContainer>
        </NavContainer>
        <SlidingMenu isOpen={modalOpen} />
      </>
    )}
  </>
);
}
export default NavBar
