
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Database, Tables } from "./database-types";
import { Titulo } from "./Servicios";
import { createClient } from "@supabase/supabase-js";
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
import { supabase } from "./utils/ClientSupabase";

type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">

const ClientCardContainer = styled(CardContainer) /*style*/ `
height:30.625rem;

`
export const BodyContainer = styled.div /*style*/ `
display:flex;
gap:2.94rem;
`
const NumberInputs = styled(CardInputs) /*style*/ `
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
`

const inputWidthStyle = {
    width: "19.815rem"
}

export const AddResponsableCard = styled.div /*style*/ `
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




const EmpleadosCard = () => {

    interface TipoCliente {
        tipo_cliente: string;
    }

    const [cliente, setCliente] = useState<Cliente[] | null>([])
    const [nombre, setNombre] = useState<string>("")
    const [telefono, setTelefono] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [apellido, setApellido] = useState<any>("")
    const { id } = useParams()
    const [tipoCliente, setTipoCliente] = useState<string>("")
    const [tiposCliente, setTiposCliente] = useState<TipoCliente[]>([])
    const [responsable, setResponsable] = useState<string>("")
    const [isClicked, setClicked] = useState<boolean>(false);
    const [responsableExists, setResponsableExists] = useState<boolean | null>(false)
    const [responsableId, setResponsableId] = useState<number | null>()
    const [updater, setUpdater] = useState(false)


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
            const { data: cliente, error } = await query
            if (cliente) {
                setCliente(cliente)
                setNombre(cliente[0]?.nombre)
                setApellido(cliente[0]?.apellidos)
                setTelefono(cliente[0]?.telefono)
                setEmail(cliente[0]?.email)
                setTipoCliente(cliente[0]?.tipo_cliente || "")
                setResponsableId(cliente[0]?.responsable_id)
                if (cliente[0]?.responsable_id) {
                    setResponsableExists(true)
                }

            }
        }
        catch (error) {
            console.log("Error consiguiendo los datos del cliente")
        }
    }

    useEffect(() => {
        fetchClientes()
    }, [])
    const handleTipoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setTipoCliente(cambio)

    }

    const appearResponsableCard = () => {

        setResponsableExists(true)
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
                    <DetallesTitulo>Información del Empleado</DetallesTitulo>
                    <InputsContainer>
                        <div style={{ display: "inline-flex", width: "26.124rem" }}>
                            <div
                                style={{ width: "11.728rem" }}
                            >
                                <DetailsTitle>Nombre</DetailsTitle>
                                <CardInputs style={{ ...inputWidthStyle, width: "85%" }}
                                    id="textInputs"
                                    className="textInputs"
                                    onChange={handleNameChange}
                                    value={nombre}
                                >
                                </CardInputs>
                            </div>
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
                            type="email"
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
                    <InputsContainer>
                        <DetailsTitle>
                            Responsable
                        </DetailsTitle>
                        <CardInputs
                            style={inputWidthStyle}
                            className="textInputs"
                            type="email"
                            readOnly
                            value={responsable}
                        >
                        </CardInputs>
                    </InputsContainer>
                </ClientCardContainer>
                {responsableExists && (
                    <>
                        <ResponsableCard
                            updaterPass={updater}
                            onValueChange={handleChildValue}
                            onStateChange={handleChildStateChange}
                        ></ResponsableCard>

                    </>
                )}
                {!responsableExists && (
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


export default EmpleadosCard