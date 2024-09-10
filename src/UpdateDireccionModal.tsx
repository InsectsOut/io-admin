import styled from "styled-components"
import { RegistroModal } from "./ModalComponents"
import { Database, Tables } from "./database-types";
import { useParams } from 'react-router-dom';
import { DetailsTitle } from "./ServiciosCard";
import { InputsContainer } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import { supabase } from './utils/ClientSupabase';
import { useEffect, useState } from "react";
import { ResCardInputs } from "./DireccionCard";
type Direccion = Tables<"Direcciones">


const ModalOverlay = styled(RegistroModal) /*style*/ `
height:100vh;
.modalContainer{
width:40%;
height:28rem;
background:white;
max-height:28.699rem;
padding-bottom:1rem;
margin:unset;
display:inline-flex;
flex-direction:column;
padding:2rem 2rem 4rem 2rem;
border-radius:0.718rem;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.6);
background: #F4F4F4;
align-items:center;
overflow:hidden;
position:relative;
}
#title{
margin-bottom:2rem;
}
.textInputs{
    color:#838383;
display:flex;
flex-direction:column;
align-items:flex-start;
border: solid black .25px;
gap:2rem;
width:90%;
border-radius:5px;
padding: 0 10px 0 10px;
background:white;

}
.addButton{
width:45%;
align-self: flex-end;
margin-right:24px;
border-radius: 8px;
border: 1px solid #0D4E80;
padding: 0.6em 1.2em;
font-size: 1em;
font-weight: 500;
font-family: inherit;
background-color: #1a1a1a;
cursor: pointer;
transition: background-color 0.25s;
color:inherit;
background:none;
color: black;
}
.addButton:hover{
background-color:#0D4E80;
color:white;
}

.closeButton{
position: absolute;
width:2rem;
height: 2rem;
display:flex;
justify-content:center;
align-items:center;
border-radius:50%;
background:red;
right:5%;
top:5%;
background: #C1716E;
font-weight: bold;
font-size: 105%;
cursor: pointer;
}
.closeButton:hover{
transform:scale(1.05);
}
.buttonsContaneiner{
display:flex;
}

`
interface UpdateDirProps {
    direccionId: number | null;
    closeModal: () => void
    fetchNewDir: () => void
    renderStat: string

}
const DirerccionModal: React.FC<UpdateDirProps> = (props) => {

    const { id } = useParams()
    const [calle, setCalle] = useState<string>("")
    const [numeExt, setNumExt] = useState<string | null>("")
    const [numInt, setNumInt] = useState<string | null>("")
    const [piso, setPiso] = useState<string | null>()
    const [colonia, setColonia] = useState<string>("")
    const [zipCode, setZipCode] = useState<string>("")
    const [estado, setEstado] = useState<string>("")
    const [ciudad, setCiudad] = useState<string>("")
    const [cancelarButton, setCancelarButton] = useState<boolean>(true)
    const [direccion, setDireccion] = useState<Direccion[]>()
    const [renderStatus, setRenderStatus] = useState<string>("")

    const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setCalle(cambio)

    }

    const handleIntNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setNumInt(cambio)
    }

    const handleExtNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setNumExt(cambio)

    }

    const handleFloorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setPiso(cambio)
    }

    const handleColoniaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setColonia(cambio)
    }
    const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setZipCode(cambio)

    }
    const handleEstadoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setEstado(cambio)
    }

    const handleCiudadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCiudad(event.target.value);
    }

    const FetchDireccion = async () => {
        try {
            let query = supabase
                .from("Direcciones")
                .select('*') // Specify the relationship name
                .filter("id", "eq", props.direccionId)
            const { data: direcciones, error } = await query
            if (direcciones && direcciones.length > 0) {
                const [respuesta] = direcciones
                setDireccion(direcciones)
                setCalle(respuesta?.calle)
                setColonia(respuesta?.colonia)
                setEstado(respuesta?.estado)
                setNumExt(respuesta?.numero_ext)
                setNumInt(respuesta?.numero_int)
                setPiso(respuesta?.piso)
                setZipCode(respuesta?.codigo_postal)
                setCiudad(respuesta?.ciudad)
                console.table(direcciones);
            }
            else {
                console.log("No se encuentra nada", direcciones)
                console.log(error)
            }
        }
        catch (err) {
            console.log("Error cargando al responsable", err)
        }

    }

    const update = async () => {
       
            try {
                const { data, error } = await supabase
                    .from("Direcciones")
                    .update([
                        {
                            calle: calle,
                            ciudad: ciudad,
                            codigo_postal: zipCode,
                            colonia: colonia,
                            estado: estado,
                            numero_ext: numeExt,
                            numero_int: numInt,
                            piso: piso,
                        },
                    ] as any)
                    .filter("id", "eq", props.direccionId)
                    .select()
                if (error) {
                    console.error("Error inserting data:", error.message);
                } else {
                    console.log("Data inserted successfully:", data);
                    FetchDireccion()
                }
            } catch (err) {
                console.error(err);
            }
        
    }

    const deleteDireccion = async () => {
        try {
          let query = supabase
            .from("Direcciones")
            .delete()
            .filter("id", "eq", props.direccionId)
    
          const { error, data: direccion } = await query
    
          if (error) {
            console.log("There was an error ", error)
          }
        }
        catch (err) {
    
        }
      }

    useEffect(() => {
        FetchDireccion()
    }, [])

    return (
        <>

            <ModalOverlay>
                <div style={{height:`${props.renderStat  === "DELETE" ? "fit-content" : ""}`}} className="modalContainer">

                    <DetallesTitulo id="title">
                        {props.renderStat === "UPDATE"
                            ? "Dirección del cliente"
                            : props.renderStat === "DELETE"
                                ? "¿Está seguro de Eliminar esta dirección permanentemente?"
                                : ""}
                    </DetallesTitulo>
                    {props.renderStat === "UPDATE" &&
                        <div style={{
                            overflowY: "scroll", display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "wrap", justifyContent: "center"
                        }}>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Calle</DetailsTitle>
                                <ResCardInputs
                                    value={calle}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="Ingrese la calle"
                                    onChange={handleStreetChange}
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Número exterior</DetailsTitle>
                                <ResCardInputs
                                    value={numeExt}
                                    onChange={handleExtNumChange}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="Ingrese número exterior"
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Número interior</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleIntNumChange}
                                    value={numInt}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="Ingrese número interior"
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Piso</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleFloorChange}
                                    value={piso}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="Ingrese el piso"
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Colonia</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleColoniaChange}
                                    value={colonia}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="Ingrese la colonia"
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Estado</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleEstadoChange}
                                    value={estado}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="Ingrese el estado"
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Ciudad</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleCiudadChange}
                                    value={ciudad}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="ingrese la ciudad"
                                >
                                </ResCardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "45%" }}>
                                <DetailsTitle>Código postal</DetailsTitle>
                                <ResCardInputs
                                    onChange={handleZipChange}
                                    value={zipCode}
                                    id="textInputs"
                                    className="textInputs"
                                    placeholder="ingrese el código postal"
                                >
                                </ResCardInputs>
                            </InputsContainer>


                            <div id="" onClick={() => { update().then(() => { props.closeModal(); props.fetchNewDir() }); }} className="addButton">Actualizar Dirección</div>



                        </div>
                    }
                    <div onClick={() => { props.closeModal() }} className="closeButton">X</div>
                    {props.renderStat === "DELETE" &&
                        <div id="" style ={{alignSelf:"center"}} onClick={() => { deleteDireccion().then(() => { props.closeModal(); props.fetchNewDir() }); }} className="addButton">Eliminar</div>
                    }

                </div>
            </ModalOverlay>

        </>
    )
}

export default DirerccionModal