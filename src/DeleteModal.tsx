import styled from "styled-components";


const DeleteModal = styled.div /*style*/ `
position:absolute;
width:100vw;
height:inherit;
z-index:999 ;
background: rgb(0, 0, 0, 0.7);

top:0;
display:flex;
justify-content:center;
align-items:center;

.doubleInput{
display:flex;
flex-direction:column;
gap:.5rem;
}
`

const ModalContent = styled.div /*style*/ `
position:relative;
width: 30.78%;
height:20%;
background: #F4F4F4;
min-width: fit-content;
box-shadow: 0px 4.59475px 4.59475px rgba(0, 0, 0, 0.25);
border-radius: 0.718rem;
display:flex;
flex-direction:column;
align-items:center;
padding-top:1.75rem;
gap:1rem;
`
const CloseButton = styled.div /*style*/ `
width: 9.46px;
height:9.46px;
color:#727272;
position: absolute;
top:20px;
right:20px;
font-weight:bolder;
&:hover{
cursor: pointer;
transform:scale(1.2)
}
`
const Titulo = styled.h1 /*style*/ `
 
font-style: normal;
color:black;
font-weight: 700;
font-size: 1.436rem;
line-height: 1.875rem;
display: flex;
text-align:center;
margin-bottom:.5rem;
`

const ServicioInfo = styled.div /*style*/ `
width:100%;
padding-right:1rem;
padding-left:1rem;
display:flex;
justify-content:center;
gap:1.5rem;
margin-bottom:.5rem;

.fecha{
display: flex;

}
.nombre{
display: flex;


}
.folio{
display: flex;


}

`



const SubTitles = styled.p /*style*/ `

height: 1.25rem;
margin:unset;
 
font-style: normal;
font-weight: 500;
font-size: 0.9375rem; 
line-height: 1.25rem;
display: flex;
flex-direction:row;
align-items: center;
color: #838383;
`

const DeleteButton = styled.button /*style*/ `
all:unset;
display:flex;
align-items:center;
justify-content:center;
width: 8.625rem;
min-width: fit-content;
min-height:  2.25rem;
height: 2.25rem;
background: #0D4E80;
border-radius: 0.359rem;
padding: 0 1rem 0 1rem;
 
font-style: normal;
font-weight: 700;
font-size: 1.005rem;
&:hover{
cursor: pointer;
background-color: #2980b9; 
transform: scale(1.05); 
color:white;
}
`
interface cardProps {
    closeModal?: () => void,
    folio?: string,
    nombre?: string,
    fecha?: string,
    apellido?: string,
    del: () => void,
    titulo?: string,
    btnText?: string,
    puesto?: string
}
const DelModal: React.FC<cardProps> = ({ closeModal, folio, nombre, fecha, apellido, del, titulo, btnText, puesto}) => {

    return (
        <DeleteModal>
            <ModalContent>
                <CloseButton
                    onClick={closeModal}
                >X</CloseButton>
                <Titulo>{titulo}</Titulo>
                {window.location.pathname === "/empleados" &&(
                <ServicioInfo>
                    <div className="nombre">
                        <SubTitles>Nombre: {nombre}</SubTitles>
                    </div>
                    <div className="fecha">
                        <SubTitles>Puesto: {puesto}</SubTitles>
                    </div>
                </ServicioInfo>
                )}
                {window.location.pathname === "/Clientes" &&(
                <ServicioInfo>
                    <div className="folio">
                        <SubTitles>Folio: {folio}</SubTitles>
                    </div>
                    <div className="nombre">
                        <SubTitles>Nombre: {nombre} {apellido}</SubTitles>
                    </div>
                    <div className="fecha">
                        <SubTitles>Fecha: {fecha}</SubTitles>
                    </div>
                </ServicioInfo>
                )}
                {window.location.pathname === "/Servicios" &&(
                <ServicioInfo>
                    <div className="folio">
                        <SubTitles>Folio: {folio}</SubTitles>
                    </div>
                    <div className="nombre">
                        <SubTitles>Nombre: {nombre} {apellido}</SubTitles>
                    </div>
                    <div className="fecha">
                        <SubTitles>Fecha: {fecha}</SubTitles>
                    </div>
                </ServicioInfo>
                )}
                <DeleteButton
                    onClick={del}
                >{btnText}</DeleteButton>
            </ModalContent>
        </DeleteModal>

    )
}

export default DelModal