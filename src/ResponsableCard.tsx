
import styled from "styled-components"
import { Database, Tables } from "./database-types";
import { Titulo } from "./Servicios";
import { createClient } from "@supabase/supabase-js";
import { useParams } from 'react-router-dom';
import { CardContainer, ReturnButton } from "./ServiciosCard";
import { DetailsTitle } from "./ServiciosCard";
import { CardInputs } from "./ServiciosCard";
import { InputsContainer } from "./ServiciosCard";
import { mainStyle } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import { StyledButton } from './FormComponents';
import { supabase } from './utils/ClientSupabase';
import { useEffect, useState } from "react";
type Cliente = Tables<"Clientes">
type Responsable = Tables<"Responsables">
type Servicio = Tables<"Servicios">

type ClientesConResponsables = Cliente & {
    Responsables: Responsable | null
};

const SaveButton = styled.button /*style*/ `
all:unset;
  background-color: #0D4E80;
  display:flex;
  justify-content:center;
  align-items: center;
  padding:0;
  font-weight:bold;
  width:9.62rem;
  height:2.226rem;
  margin-bottom: .5rem; 
  margin-right: 1rem; 
  font-size:.8rem;
  border-radius:.359rem;
  &:hover{
cursor: pointer;
background-color: #2980b9;
transform: scale(1.05);
}

`

interface ResponsableCardProps {
    onValueChange: (nuevoValor: string) => void;
    updaterPass: boolean;
    onStateChange: () => void;
}


const ResponsableCardContainer = styled(CardContainer) /*style*/ `
height: 25.563rem;
margin:unset;
`
const inputWidthStyle = {
    width: "80%"
}

const ResCardInputs = styled(CardInputs) /*style*/ `

&.textInputs{
width:80%;
}
`

const ResponsableCard: React.FC<ResponsableCardProps> = ({ onValueChange, updaterPass, onStateChange }) => {
    const { id } = useParams()
    const [responsable, setResponsable] = useState<ClientesConResponsables[]>([])
    const [nombre, setNombre] = useState("")
    const [telefono, setTelefono] = useState<string>("")
    const [emai, setEmail] = useState("")
    const [puesto, setPuesto] = useState("")
    const [responsableId, setResponsable_id] = useState<number | null>(null)
    const [nuevoResponsableID, setNuevoResponsableID] = useState<number | null>(null)
    const [guardar, setGuardar] = useState(false)



    const fetchResponsable = async () => {
        try {
            let query = supabase
                .from("Clientes")
                .select(`*, Responsables!Clientes_responsable_id_fkey(*)`) // Specify the relationship name
                .filter("id", "eq", `${id}`)
            const { data: responsables, error } = await query
            if (responsables && responsables.length > 0) {
                setResponsable(responsables)
                setNombre(responsables[0]?.Responsables?.nombre ?? "")
                setTelefono(responsables[0]?.Responsables?.telefono ?? "")
                setEmail(responsables[0]?.Responsables?.email ?? "")
                setPuesto(responsables[0]?.Responsables?.puesto ?? "")
                onValueChange(responsables[0]?.Responsables?.nombre ?? "")
                // setResponsable_id(responsable?.[0]?.Responsables?.id ?? null)
                setResponsable_id(() => responsables[0]?.Responsables?.id ?? null)
                console.log(responsableId)

                console.log(responsables)
            }
            else {
                console.log("No se encuentra nada", responsables)
                console.log(error)
            }
        }
        catch (err) {
            console.log("Error cargando al responsable", err)
        }

    }

    useEffect(() => {
        fetchResponsable()
    }, [])

    const upsertResponsable = async () => {
        if (responsableId) {
            try {
                const { data, error } = await supabase
                    .from("Responsables")
                    .update([{
                        cliente_id: id,
                        email: emai,
                        nombre: nombre,
                        puesto: puesto,
                        telefono: telefono

                    },
                    ] as any
                    )
                    .filter("id", "eq", `${responsableId}`)
                    .select()
                if (error) {
                    console.log("Error while trying to update ", error)
                }
                else {
                    console.log("data updated succesfully ", data)
                }

            }
            catch (err) {
                console.log("Error while fetching", err)
            }

        }
        else {
            try {
                const { data, error } = await supabase
                    .from("Responsables")
                    .insert([{
                        cliente_id: id,
                        email: emai,
                        nombre: nombre,
                        puesto: puesto,
                        telefono: telefono

                    },
                    ] as any
                    )
                    .select()
                setNuevoResponsableID(() => data?.[0]?.id ?? null)
                if (data?.[0]?.id) {
                    console.log("El id del desponsable ", nuevoResponsableID)
                    try {
                        const { data: cliente, error } = await supabase
                            .from("Clientes")
                            .update([{
                                responsable_id: data?.[0]?.id
                            },
                            ] as any
                            )
                            .filter("id", "eq", `${id}`)
                            .select()
                        if (error) {
                            console.log("Error while trying to update ", error)
                        }
                        else {
                            console.log("Client data updated succesfully ", data)


                        }

                    }
                    catch (err) {
                        console.log("Error while fetching", err)
                    }
                }
                if (error) {
                    console.log("Error while trying to update ", error)
                }
                else {
                    console.log("data updated succesfully ", data)

                }

            }
            catch (err) {
                console.log("Error while fetching", err)
            }

        }

    }



    useEffect(() => {
        if (updaterPass === true) {
            let flag = 1
            while (flag === 1) {
                upsertResponsable().then(() => location.reload());
                flag++
            }
        }
    }, [updaterPass])

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setNombre(cambio)
        onStateChange()
    }

    const handleTelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setTelefono(cambio)
        onStateChange()

    }

    const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setEmail(cambio)
        onStateChange()

    }

    const handlePuestoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setPuesto(cambio)
        onStateChange()
    }



    return (
        <>
            <ResponsableCardContainer

            >
                <DetallesTitulo>Información del Responsable</DetallesTitulo>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>Nombre</DetailsTitle>
                    <ResCardInputs
                        value={nombre}
                        id="textInputs"
                        className="textInputs"
                        placeholder="Nombre del Responsable"
                        onChange={handleNameChange}
                    >
                    </ResCardInputs>
                </InputsContainer>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>Teléfono</DetailsTitle>
                    <ResCardInputs
                        value={telefono}
                        onChange={handleTelChange}
                        id="textInputs"
                        className="textInputs"
                        placeholder="Teléfono del Responsable"
                    >
                    </ResCardInputs>
                </InputsContainer>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>E-mail</DetailsTitle>
                    <ResCardInputs
                        onChange={handleMailChange}
                        value={emai}
                        id="textInputs"
                        className="textInputs"
                        placeholder="email del responsable"
                    >
                    </ResCardInputs>
                </InputsContainer>
                <InputsContainer style={{ width: "100%" }}>
                    <DetailsTitle>Puesto</DetailsTitle>
                    <ResCardInputs
                        onChange={handlePuestoChange}
                        value={puesto}
                        id="textInputs"
                        className="textInputs"
                        placeholder="Puesto del Responsable"
                    >
                    </ResCardInputs>
                </InputsContainer>


            </ResponsableCardContainer>
        </>
    )
}

export default ResponsableCard