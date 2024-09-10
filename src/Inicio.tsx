import styled, { keyframes } from 'styled-components';
import { BsPersonSquare } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa";
import pump from './assets/pumpicon.png'
import { FaRegCalendarAlt } from "react-icons/fa";
import logoGrande from "./assets/logoGrande.png"
import { Link, useLocation } from 'react-router-dom';
import { FaSprayCan } from "react-icons/fa";




const shineAnimation = keyframes /*style*/`
    0% {
        background-position: -200%;
    }
    100% {
        background-position: 200%;
    }
`;

const DashboardContainer = styled.div /*style*/`
    display: flex;
    justify-content: space-evenly;
    margin-top:2rem;
    height: auto;
    width:100%;
    flex-wrap:wrap;
    gap: 3rem;

  @media (min-width: 300px) and (max-width: 644px) {
    flex-direction:column;
    flex-wrap:nowrap;
    justify-content:unset;
    gap:2rem;
    align-items:center;
  }

  @media (min-width: 645px) and (max-width: 768px) {
   
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

    
  }
    
`;

const Option = styled.div /*style*/`
    text-align: center;
    padding: 20px;
    width: 10vw;
    max-height: 10vw;
    border-radius: 10px;
    cursor: pointer;
    animation: ${shineAnimation} 1s linear infinite;
    -webkit-mask-image: linear-gradient(45deg,#000 25%,rgba(0,0,0,.2) 50%,#000 75%);
    mask-image: linear-gradient(45deg,#000 25%,rgba(0,0,0,.2) 50%,#000 75%);
    -webkit-mask-size: 800%;
    mask-size: 800%;
    -webkit-mask-position: 0;
    mask-position: 0;
    color:white;

    &:hover {
        transition: background-color 0.3s;
        transform: scale(1.2);
        transition: mask-position 2s ease,-webkit-mask-position 2s ease;
    -webkit-mask-position: 120%;
    mask-position: 120%;
    opacity: 1;
       
    }

 
`;

const OptionContainer = styled(Option) /*style*/`
height: fit-content ;
background: #0D4E80;
border-radius: 20px;


&.calendario {
  background-color:rgba(214,43,51);
@media (min-width: 300px) and (max-width: 644px) {
flex-direction:column;
flex-wrap:nowrap;
justify-content:unset;
gap:2rem;
align-items:center;
  
  }
  }

    @media (min-width: 300px) and (max-width: 644px) {
   flex-direction:column;
   flex-wrap:nowrap;
   justify-content:unset;
   gap:2rem;
    align-items:center;
  }


    &.clientes{
    background-color:#A01F27;

    @media (min-width: 300px) and (max-width: 644px) {
   flex-direction:column;
   flex-wrap:nowrap;
   justify-content:unset;
   gap:2rem;
    align-items:center;
  }

    }
    &.empleados{
      @media (min-width: 300px) and (max-width: 644px) {
   flex-direction:column;
   flex-wrap:nowrap;
   justify-content:unset;
   gap:2rem;
    align-items:center;
  }
    background-color:#3D6B27;
    
    }

    @media (min-width: 300px) and (max-width: 644px) {
   display:flex;
   flex-direction:column;
  }

  @media (min-width: 645px) and (max-width: 768px) {
   
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

    
  }
    

`;

const Clientes = styled(Option) /*style*/`
    background-color: #d62b33; /* Principal Color */
    height: fit-content ;
`;

const Empleados = styled(Option) /*style*/`
    background-color: #0e4e7f; /* Secondary Color */
    height: fit-content ;
`;

export const PumpIcon = styled.img /*style*/ `
width:70px;
height:auto;
filter: invert(100%);
object-fit:cover;
transform:scale(2);
position:relative;
right: .5rem;

@media (min-width: 300px) and (max-width: 644px) {
 width:50px;
 position:relative;
left:.01rem;

bottom:.5rem;
  }

  @media (min-width: 645px) and (max-width: 768px) {
   
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

    
  }



`

const InsectImage = styled.img /*style*/ `
width:45%;
height: auto;
object-fit:cover;
`
const ImgCont = styled.div /*style*/ `
position: relative;
display:inline-flex;
height: auto;
align-items:center;
border:  black .02rem;
box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.75);
-webkit-box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.75);
-moz-box-shadow: 0px 0px 11px 2px rgba(0,0,0,0.75);


@media (min-width: 300px) and (max-width: 900px) {
   display:flex;
   flex-direction:column;
   height:auto;
   

   
}
  }

  @media (min-width: 645px) and (max-width: 768px) {
  
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

    
  }
`

const InfoText = styled.div /*style*/ `
width:50%;
color:black;
text-align:left;
text-align:justify;
font-weight:lighter;
padding:2rem;


& p{
font-size:2vw;
}

@media (min-width: 300px) and (max-width: 644px) {
padding:0;
width: 70% ;
  & p{
font-size:5vw;
margin:0;
position:relative;
bottom: 1rem;

}

}
  }

  @media (min-width: 645px) and (max-width: 768px) {
    & p{
  font-size:3vw !important;
}
   
    
  }


  @media (min-width: 769px) and (max-width: 900px) {
    
    
  }

`

const OptionsCardsCont = styled.div /*style*/ `
display:flex;
flex-basis:100%;
justify-content:space-evenly;
gap:1rem;

@media (min-width: 300px) and (max-width: 644px) {
  flex-basis:initial;
  flex-direction:row;
  justify-content:center;
  & h2{
  display:none;
  }
  }

  @media (min-width: 645px) and (max-width: 768px) {
   
    
  }


  @media (min-width: 769px) and (max-width: 900px) {

    
  }
`




const Dashboard = () => {
  return (
    <>
      <DashboardContainer>
        <OptionsCardsCont>
          <Link to="/Servicios">
            <OptionContainer className='servicios'>
              <FaSprayCan size={70} />
              <h2>Servicios</h2>
            </OptionContainer>
          </Link>
          <Link to="/Clientes ">
            <OptionContainer className='clientes'>
              <FaHandshake size={70}></FaHandshake>
              <h2>Clientes</h2>
            </OptionContainer>
          </Link>
          <Link to="/empleados ">
          <OptionContainer className='empleados'>
            <BsPersonSquare size={70}></BsPersonSquare>
            <h2>Empleados</h2>
          </OptionContainer>
          </Link>
          <Link to="/calendar ">
          <OptionContainer className='calendario'>
            <FaRegCalendarAlt size={70}></FaRegCalendarAlt>
            <h2>Calendario</h2>
          </OptionContainer>
          </Link>
        </OptionsCardsCont>
        <ImgCont>
          <InsectImage src={logoGrande} />
          <InfoText>
            <p >
              Hola! esta herramienta nos ayudara a agilizar la operación de Insects Out,
              esta misma fue hecha a la medida de la empresa, por lo cual
              encontraran que se ajusta de manera fácil al ritmo de trabajo que se
              tiene, todo esto para aligerar la carga de trabajo y brindar un mejor servicio
              y atenció a los clientes.
            </p>
          </InfoText>
        </ImgCont>
      </DashboardContainer>

    </>
  );
};

export default Dashboard;
