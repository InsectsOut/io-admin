import { supabase } from "./utils/ClientSupabase";
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Tables } from "../src/supabase/Database";
import { Titulo } from "./Servicios";
import { useParams } from 'react-router-dom';
import { servicioOptions } from "./tipo_servicios";
import { CardContainer, ReturnButton } from "./ServiciosCard";
import { DetailsTitle } from "./ServiciosCard";
import { CardInputs } from "./ServiciosCard";
import { InputsContainer } from "./ServiciosCard";
import { mainStyle } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import ResponsableCard from "./ResponsableCard";
import { StyledButton } from "./ServiciosCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import DireccionCard from "./DireccionCard";

type Cliente = Tables<"Clientes">

const ClientCardContainer = styled(CardContainer) /*style*/`
height:fit-content;
padding-bottom:2rem;
`
export const BodyContainer = styled.div`
display:flex;
gap:2.94rem;
`
const NumberInputs = styled(CardInputs)`
&::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
  appearance: none;
    margin: 0;
    opacity:.5;
    cursor: pointer;
    &::-webkit-inner-spin-button:hover,
  &::-webkit-outer-spin-button:hover {
    background-color: #ddd;
  }
}
`

const inputWidthStyle = {
    width: "19.815rem"
}

export const AddResponsableCard = styled.div`
  width: 24.625rem; 
  height: 5.875rem; 
  background: #FFFFFF;
  border: 0.125rem solid #727272; 
  border-radius: 0.7179rem; 
  display:flex;
  justify-content:center;
  align-items:center;
  :hover{
  cursor: pointer;
  }
`

const TextoAddCard = styled.h1 /*style*/`
  height:min-content;
  margin:unset;
 
  font-style: normal;
  font-weight: 500;
  font-size: 1.125rem; /* 18px converted to rem */
  line-height: 1.438rem; /* 23px converted to rem */
  display: flex;
  align-items: center;
  text-align: center;
  color: #727272;
`;

const ClientesCard = () => {
    const [cliente, setCliente] = useState<Cliente[] | null>([])
    const [nombre, setNombre] = useState<string>("")
    const [telefono, setTelefono] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [apellido, setApellido] = useState<any>("")
    const { id } = useParams()
    const [tipoCliente, setTipoCliente] = useState<string>("")
    const [responsable, setResponsable] = useState<string>("")
    const [isClicked, setClicked] = useState<boolean>(false);
    const [responsableExists, setResponsableExists] = useState<boolean | null>(false)
    const [, setResponsableId] = useState<number | null>()
    const [updater, setUpdater] = useState(false)


    const insertResponsable = async (elCliente:Cliente[]) => {
        const  nombreCompleto = `${elCliente?.[0]?.nombre} ${elCliente?.[0]?.apellidos} `
   
        if (elCliente[0].responsable_id){
            return
        }
        if (!elCliente[0].responsable_id){
            if(elCliente){
            
            try {
                const { data, error } = await supabase
                    .from("Responsables")
                    .insert([{
                        cliente_id:id,
                        email: elCliente[0]?.email ,
                        nombre: nombreCompleto,
                        puesto: "",
                        telefono: elCliente[0]?.telefono

                    },
                    ] as any
                    )
                    .select()
                if (error) {
                    console.log("Error while trying to update ", error)
                }
                else {
                    console.log("data updated succesfully ", data)
                    const { data:response, error:err } = await supabase
                    .from("Clientes")
                    .update([{
                        responsable_id:data?.[0]?.id
                    }
                    ,
                    ] as any
                    )
                    .filter("id", "eq", `${id}`)
                    .select()
                }

            }
            catch (err) {
                console.log("Error while fetching", err)
            }
        }
        else {
            return
        }
        }

        else {
            return
        }
 
    }

    const handleChildStateChange = () => {
        setClicked(true)
    }

    const handleChildValue = (nuevoValor: string) => {
        setResponsable(nuevoValor)
    }

    const updateOrInsert = () => {
        setUpdater(true)
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setNombre(cambio)
    }
    const handleApellidoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setApellido(cambio)
    }

    const handleTelefonoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setTelefono(cambio)
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setEmail(cambio)
    }

    const fetchClientes = async () => {
        try {
            let query = supabase
                .from("Clientes")
                .select("*")
                .filter("id", "eq", `${id}`)
            const { data: cliente } = await query
            
          
            if (cliente) {
                const { nombre, apellidos, telefono, email, tipo_cliente, responsable_id } = cliente[0];

                
                setCliente(cliente);
                setNombre(nombre);
                setApellido(apellidos);
                setTelefono(telefono);
                setEmail(email);
                setTipoCliente(tipo_cliente || "");
                setResponsableId(responsable_id);
                
                if (responsable_id) {
                    setResponsableExists(true)
                    return;
                }
               
                if (!responsable_id){
                    setResponsableExists(false)
                    insertResponsable(cliente);
                    return
                }

            }
        }
        catch (error) {
            console.log("Error consiguiendo los datos del cliente")
        }
    }

    useEffect(() => {
        fetchClientes()
    }, []);
    // useEffect(() => {
    //     fetchClientes().then(() => {
    //         insertResponsable();
    //     });
    // }, []);
    const handleTipoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setTipoCliente(cambio)

    }

    const updateCliente = async () => {
        try {
            const { data, error } = await supabase
                .from("Clientes")
                .update(
                    [
                        {
                            nombre: nombre,
                            apellidos: apellido,
                            telefono: telefono,
                            email: email,
                            tipo_cliente: tipoCliente,


                        },
                    ] as any
                )
                .filter("id", "eq", `${id}`)
            if (error) {
                console.error("Error updating data:", error.message);
            } else {
                console.log("Data updated successfully:", data);
            }
            updateOrInsert()
        }
        catch (err) {
            console.log("Error making the update request")
        }
    }

    return (
        <>
            <Titulo>Clientes</Titulo>
            <BodyContainer id="bodyContainer">
                <ClientCardContainer>
                    <DetallesTitulo>Información del cliente</DetallesTitulo>
                    <InputsContainer>
                        <div style={{ display: "inline-flex", width: "26.124rem" }}>
                            <div
                                style={{ width: tipoCliente !=="Residencial" ? "20.44rem" : "11.728rem" }}
                            >
                                <DetailsTitle>Nombre</DetailsTitle>
                                <CardInputs style={{ ...inputWidthStyle, width: tipoCliente ==="Residencial"? "85%": "19.815rem" }}
                                    id="textInputs"
                                    className="textInputs"
                                    onChange={handleNameChange}
                                    value={nombre}
                                >
                                </CardInputs>
                            </div>
                            {tipoCliente === "Residencial" &&
                            <div
                                style={{ width: "11.728rem" }}>
                                <DetailsTitle>Apellido</DetailsTitle>
                                <CardInputs style={{ ...inputWidthStyle, width: "85%" }}
                                    id="textInputs"
                                    className="textInputs"
                                    onChange={handleApellidoChange}
                                    value={apellido}
                                >
                                </CardInputs>
                            </div>
                            }
                        </div>
                    </InputsContainer>
                    <InputsContainer>
                        <DetailsTitle>
                            Teléfono
                        </DetailsTitle>
                        <NumberInputs style={inputWidthStyle} id="textInputs" className="textInputs"
                            type="tel"
                            onChange={handleTelefonoChange}
                            value={telefono}
                        >
                        </NumberInputs>
                    </InputsContainer>
                    <InputsContainer>
                        <DetailsTitle>
                            E-mail
                        </DetailsTitle>
                        <CardInputs
                            style={inputWidthStyle}
                            className="textInputs"
                            type="text"
                            onChange={handleEmailChange}
                            value={email}
                        >
                        </CardInputs>
                    </InputsContainer>
                    <InputsContainer>
                        <DetailsTitle>
                            Tipo de Cliente
                        </DetailsTitle>
                        <select
                            value={tipoCliente}
                            style={mainStyle}
                            onChange={handleTipoChange}
                        >
                            {servicioOptions?.map((options) => (
                                <option key={options.id} value={options.value}>{options.value}</option>
                            ))}

                        </select>
                    </InputsContainer>
                    {tipoCliente !== "Residencial" &&
                    <InputsContainer>
                        <DetailsTitle>
                            Responsable
                        </DetailsTitle>
                        <CardInputs
                            style={inputWidthStyle}
                            className="textInputs"
                            type="text"
                            readOnly
                            value={responsable}
                        >
                        </CardInputs>
                    </InputsContainer>
                    }
                </ClientCardContainer>
                {responsableExists && tipoCliente !== "Residencial" && (
                    <>
                        <ResponsableCard
                            updaterPass={updater}
                            onValueChange={handleChildValue}
                            onStateChange={handleChildStateChange}
                        ></ResponsableCard>

                    </>
                )}
                {!responsableExists && tipoCliente !== "Residencial" &&(
                    <AddResponsableCard style={{ alignSelf: "center" }}
                        onClick={() => { setResponsableExists(true) }}
                    >
                        <div>
                            <IoIosAddCircleOutline size={30} style={{ color: "black" }} />
                            <TextoAddCard>Añadir responsable</TextoAddCard>
                        </div>
                    </AddResponsableCard>
                )}
                <DireccionCard></DireccionCard>
            </BodyContainer>
            <ReturnButton>Regresar</ReturnButton>
            <StyledButton disabled={!isClicked} clicado={isClicked} onClick={() => { updateOrInsert(); updateCliente(); }}>
                Guardar Cambios
            </StyledButton>
        </>
    )
}


export default ClientesCard