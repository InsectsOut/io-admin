import styled from "styled-components";
import { ServiciosContainer } from "./Servicios";
import { Titulo } from "./Servicios";
import { useState } from "react";
import { StyledDatePicker } from "./Servicios";
import { useNavigate } from 'react-router-dom'
import { CardInputs } from "./ServiciosCard";
import { supabase } from "./utils/ClientSupabase";

const SearchButtonLink = styled.button`
width: 4.5rem;
height: 2.188rem;
background: #0D4E80;
border-radius: .375rem;
 
font-style: normal;
font-weight: 400;
font-size: 0.875rem;
line-height: 0px;
display: flex;
justify-content:center;
align-items:center;
color:white;
&:hover {
    background-color: #2980b9; 
    transform: scale(1.05); 
    cursor:pointer;
    color:white;
  }
`
const CreateFormContainer = styled.div`
background:red;
width: 60.3125%;
background:red;
display:flex;
flex-direction:column;
background: #F3F3F3;
min-height:83vh;
position: relative;
height:fit-content ;
box-shadow: 0px 4px 9.8px rgba(0, 0, 0, 0.25);
`

const CreateContainer = styled(ServiciosContainer)`
.createForm{
  align-self:center;
}
`

const FormHeader = styled.div`
width:100%;
height:6.25rem ;
background:#6B8AAC;
color:#FFFFFF;
 
font-style: normal;
font-weight: 500;
font-size: 1.25rem;
line-height: 1.625rem;
border-radius: 5px 5px 0px 0px;
display:flex;
justify-content:center;
align-items:center;
margin-bottom:2rem;
`

const CreateServicioForm = styled.form`
display:flex;
gap:2rem;
flex-direction:column;
color:#474747;
height:20vh;
.formatoInputs{
display:flex;
flex-direction:column;
}
.dateInput{
  display: flex;
  flex-direction:row;
  gap:2rem;
}
`

export const FormatoInputs = styled.div`
    text-align:left;
    margin-left:6.25rem;
   display:flex;
   flex-direction:column;
   width:12.698rem;
   
   .textInputs {
    all:unset;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
    display:flex;
    align-items:center;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    text-align:left;
    padding-left:.5rem;
    color: #838383;
    width: 100%;
    height: 2.5125rem; 
    background: #FFFFFF;
    border: 0.071793rem solid #727272; 
    border-radius: 0.215379rem; 
   }
   .arrowChange{
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 100%;
    background-position-y: .5rem;
   }
    .checked {
    background: linear-gradient(180deg, #FFFFFF 0%, #C7C7C7 100%);
    border: 1px solid #838383;
    width:1rem;
    height:1rem;
    &:checked {
        border-color: #E2E2E2;
        cursor: pointer;
    }
    }
`
const FormLabels = styled.label`
 
font-style: normal;
font-weight: 700;
font-size: 1.077rem;
line-height: 1.375rem;
color: #474747;
`

export const DateInput = styled(StyledDatePicker)`
 
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:left;
padding-left:.5rem;
color: #838383;
width: 12.635625rem;
height: 2.5125rem; 
background: #FFFFFF;
border: 0.071793rem solid #727272; 
border-radius: 0.215379rem; 
`
export const Horario = styled.input`
 
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
text-align:center;
padding-left:1rem;
color: #838383;
width:6.063rem;
height: 2.5125rem; 
background: #FFFFFF;
border: 0.071793rem solid #727272; 
border-radius: 0.215379rem; 
margin-top: .25rem;
&::-webkit-calendar-picker-indicator{
  filter: invert(100%);
}
`
export const TimeInput = styled.div`
display:flex;
flex-direction:column;

`
export const FechaInput = styled.div`
display:flex;
flex-direction:column;
`

const CreateClientForm = () => {
    const [_fetchError, _] = useState("");
    const [email, setEmail] = useState("")
    const [tipoCliente, setTipoCliente] = useState("")
    const [telefono, setTelefono] = useState("")
    const [_servicioFolio, SetServicioFolio] = useState<number | null>(null)
    const [nombre, setNombre] = useState<string>("")
    const [apellido, setApellido] = useState<string>("")
    const navigate = useNavigate()

    const addCliente = async () => {
        try {
            const { data, error } = await supabase
                .from("Clientes")
                .insert([
                    {

                        email: email,
                        telefono: telefono,
                        tipo_cliente: tipoCliente,
                        nombre: nombre,
                        apellidos: apellido
                    },
                ] as any)
                .select();

            if (error) {
                console.error("Error inserting data:", error.message);
            } else {
                console.log("Data inserted successfully:", data);

                let clienteId = data?.[0]?.id
                if (clienteId) {

                    navigate(`/Clientes/${clienteId}`)

                }
                console.log("hola")
                SetServicioFolio(clienteId)
            }
        } catch (err) {
            console.error("Error adding servicio:", err);
        }
    };


    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emailChange = event.target.value
        setEmail(emailChange)
    }

    const handleTipoCliente = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tipo = event.target.value
        setTipoCliente(tipo)
    }

    const handleTelefonoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const telefonoCambio = event.target.value
        setTelefono(telefonoCambio)

    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setNombre(cambio)

    }
    const handleApellidosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setApellido(cambio)
    }

    return (
        <CreateContainer id="createContainer">
            <Titulo>Clientes</Titulo>
            <CreateFormContainer className="createForm"><FormHeader>Para registrar un nuevo cliente, complete el siguiente formulario.</FormHeader>
                <CreateServicioForm id="createClientForm">
                    <FormatoInputs style={{ flexDirection: "row", width: "75%", gap: "2rem" }}>
                        <div style={{ width: "45%" }} >
                            <FormLabels >Nombre del Cliente</FormLabels>
                            <CardInputs
                                value={nombre}
                                onChange={handleNameChange}
                                id="textInputs"
                                className="textInputs" />
                        </div>
                        <div style={{ width: "45%" }} >
                            <FormLabels >Apellidos</FormLabels>
                            <CardInputs
                                value={apellido}
                                onChange={handleApellidosChange}
                                id="textInputs"
                                className="textInputs"
                            />
                        </div>

                    </FormatoInputs>
                    <FormatoInputs style={{ flexDirection: "row", width: "75%", gap: "2rem" }}>

                        <div style={{ width: "45%" }}>
                            <FormLabels >E-mail de contacto</FormLabels>
                            <CardInputs
                                className="textInputs"
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                            ></CardInputs>
                        </div>
                        <div style={{ width: "45%" }}>
                            <FormLabels >Teléfono</FormLabels>
                            <CardInputs
                                className="textInputs"
                                type="text"
                                value={telefono}
                                onChange={handleTelefonoChange}
                            ></CardInputs>
                        </div>
                    </FormatoInputs>

                    <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Tipo de Cliente:</FormLabels>
                        <select value={tipoCliente} onChange={handleTipoCliente} className="textInputs arrowChange"
                        >
                            <option value="" disabled selected hidden>Elegir el tipo de servicio...</option>
                            <option value="Residencial" >Residencial</option>
                            <option value="Industrial" >Industrial</option>
                            <option value="Comercial" >Comercial</option>
                            <option value="Gubernamental" >Gubernamental</option>
                            <option value="Hotelería" >Hotelería</option>
                            <option value="Escolar" >Escolar</option>
                        </select>
                    </FormatoInputs>
                    {/* <FormatoInputs style={{ width: "19.815rem" }}>
                        <FormLabels >Responsable:</FormLabels>
                        <select value={responsableId} onChange={handleResponsableChange}className="textInputs arrowChange"
                        >
                            <option disabled selected hidden>Elige al Responsable...</option>
                            {responsables.map((responsable) =>
                                <option key={responsable.id} value={responsable.id}>{responsable.nombre}</option>

                            )}
                        </select>
                    </FormatoInputs> */}

                    <div className="buttonRegistrar" style={{ width: "100%", display: "flex", justifyContent: "right", position: "absolute", bottom: "0", right: "1rem", marginBottom: "1rem" }}>
                        <SearchButtonLink type="button" onClick={addCliente}>Registrar</SearchButtonLink>
                    </div>
                </CreateServicioForm>
            </CreateFormContainer>
        </CreateContainer>
    )
}

export default CreateClientForm