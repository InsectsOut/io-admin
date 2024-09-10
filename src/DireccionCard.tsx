import styled from "styled-components"
import { Tables } from "./database-types";
import { useParams } from 'react-router-dom';
import { CardContainer } from "./ServiciosCard";
import { DetailsTitle } from "./ServiciosCard";
import { CardInputs } from "./ServiciosCard";
import { InputsContainer } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import { supabase } from './utils/ClientSupabase';
import { useEffect, useState } from "react";
import DirerccionModal from "./UpdateDireccionModal";
type Cliente = Tables<"Clientes">
type Direccion = Tables<"Direcciones">

// const SaveButton = styled.button /*style*/ `
// all:unset;
//   background-color: #0D4E80;
//   display:flex;
//   justify-content:center;
//   align-items: center;
//   padding:0;
//   font-weight:bold;
//   width:9.62rem;
//   height:2.226rem;
//   margin-bottom: .5rem; 
//   margin-right: 1rem; 
//   font-size:.8rem;
//   border-radius:.359rem;
//   &:hover{
// cursor: pointer;
// background-color: #2980b9;
// transform: scale(1.05);
// }

// `

interface ResponsableCardProps {
    onValueChange?: (nuevoValor: string) => void;
    updaterPass?: boolean;
    onStateChange?: () => void;
}


const ResponsableCardContainer = styled(CardContainer)/*style*/ `
height:fit-content;
max-height:28.699rem;
padding-bottom:1rem;
margin:unset;
width:30%;


.direccionesRegistros{
cursor: pointer;
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
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
position:relative;

p{
text-align:left;
margin:8px ;
padding:0;
overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 85%; // You can set a specific width if needed
    display: block;
}
}

.direccionesRegistrosContainer{
display:flex;
flex-direction:column;
gap:1rem;
overflow-y:scroll;
width:100%;
}

.direccionesOpen{
width:100;
background:#0D4E80;
border-radius: 0.718rem;
margin-right:24px;
cursor:pointer;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
font-weight:bolder;
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
width:1.5rem;
height: 1.5rem;
display:flex;
justify-content:center;
align-items:center;
border-radius:50%;
background:red;
right:5%;
top:20%;
background: #C1716E;
font-weight: bold;
font-size: 90%;
cursor: pointer;
color:white;
}
.closeButton:hover{
transform:scale(1.05);
}
`

export const ResCardInputs = styled(CardInputs) /*style*/ `
&.textInputs{
width:80%;
}
`

const DireccionCard: React.FC<ResponsableCardProps> = () => {
    const { id } = useParams()
    const [calle, setCalle] = useState<string>("")
    const [numeExt, setNumExt] = useState<string | null>("")
    const [numInt, setNumInt] = useState<string | null>("")
    const [piso, setPiso] = useState<string | null>()
    const [colonia, setColonia] = useState<string>("")
    const [zipCode, setZipCode] = useState<string>("")
    const [estado, setEstado] = useState<string>("")
    const [dirección, setDirección] = useState<Direccion[]>([])
    const [direccionFormOpen, setDireccionFormOpen] = useState<boolean>(false)
    const [direccionesRegistro, setDireccionesRegistro] = useState<boolean>(false)
    const [heightStatus, setHeightStatus] = useState<boolean>(true)
    const [ciudad, setCiudad] = useState<string>("")
    const [cancelarButton, setCancelarButton] = useState<boolean>(true)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [direccionId, setDireccionId] = useState<number | null>(null)
    const [deleteRenderStatus, setDeleteRenderStatus] = useState<string>("")


    const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setCalle(cambio)

    }

    const handleOpenModa = () => {
        setModalOpen((prev) => !prev)
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

    const handleDeleteModalOpen = () => {
        setDeleteRenderStatus("DELETE")
    }

    const handleUpdateModalOpen = () => {
        setDeleteRenderStatus("UPDATE")
    }

    const handleFormRender = () => {
        setDireccionFormOpen((prev) => !prev);
        const element = document.querySelector(".addButton") as HTMLElement;
        if (element) {
            element.style.display = "none";
        }
        setDireccionesRegistro(false)
        setCalle("")
        setColonia("")
        setEstado("")
        setNumExt("")
        setNumInt("")
        setPiso("")
        setZipCode("")
        setCiudad("")
    };
    const handleRegisterRender = async () => {
        if (direccionFormOpen) {
            await upsertDireccion()
            console.log("se hubiera creado")
        }
        setDireccionFormOpen(false)
        setDireccionesRegistro((prev) => !prev);
        const element = document.querySelector(".addButton") as HTMLElement;
        if (element) {
            element.style.display = "initial";
        }
    }

    const handleHeightStatusChangeFalse = () => {
        setHeightStatus(false);
    }
    const handleHeightStatusChangeTrue = () => {
        setHeightStatus(true);
    }
    const handleCiudadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCiudad(event.target.value);
    }

    const handleCancelarChange = () => {
        if (calle == "" && ciudad == "" && zipCode == "" && colonia == "" && estado == "" && numeExt == "" && numInt == "" && piso == "") {
            setCancelarButton(true);
        }
        else {
            setCancelarButton(false);
        }
    }

    const FetchDireccion = async () => {
        try {
            let query = supabase
                .from("Direcciones")
                .select('*') // Specify the relationship name
                .order("id")
                .filter("cliente_id", "eq", `${id}`)
            const { data: direcciones, error } = await query
            if (direcciones && direcciones.length > 0) {
                //const [respuesta] = direcciones
                setDirección(direcciones)
                // setCalle(respuesta?.calle)
                // setColonia(respuesta?.colonia)
                // setEstado(respuesta?.estado)
                // setNumExt(respuesta?.numero_ext)
                // setNumInt(respuesta?.numero_int)
                // setPiso(respuesta?.piso)
                // setZipCode(respuesta?.codigo_postal)
                // setCiudad(respuesta?.ciudad)
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


    useEffect(() => {
        FetchDireccion()

    }, [])

    useEffect(() => {
        if (dirección?.length > 0) {
            setDireccionesRegistro(true)
            setDireccionFormOpen(false)
            console.log("hlasd")

        }

    }, [dirección])

    useEffect(() => {
        handleCancelarChange()
        console.log(cancelarButton)
    }, [calle, ciudad, zipCode, colonia, estado, numInt, numeExt, piso])

    const upsertDireccion = async () => {
        if (direccionFormOpen &&  !cancelarButton) {

            try {
                const { data, error } = await supabase
                    .from("Direcciones")
                    .insert([
                        {
                            calle: calle,
                            ciudad: ciudad,
                            codigo_postal: zipCode,
                            colonia: colonia,
                            estado: estado,
                            numero_ext: numeExt,
                            numero_int: numInt,
                            piso: piso,
                            cliente_id: id
                        },
                    ] as any)
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
        else {
            console.log("Nada que agregar")
        }
    }

    return (
        <>
            {modalOpen &&
                <DirerccionModal
                    direccionId={direccionId}
                    closeModal={handleOpenModa}
                    fetchNewDir={FetchDireccion}
                    renderStat={deleteRenderStatus}
                ></DirerccionModal>
            }
            <ResponsableCardContainer
                style={{ height: `${heightStatus ? 'fit-content' : '30.022rem'}` }}
            >
                <div className="direccionesOpen"
                    onClick={() => { handleRegisterRender(); handleHeightStatusChangeTrue() }}
                >
                    <p>
                        {cancelarButton && direccionFormOpen
                            ? "Cancelar"
                            : direccionFormOpen
                                ? "Guardar Dirección"
                                : "Direcciónes del cliente"
                        }
                    </p>
                </div>
                {direccionFormOpen && !direccionesRegistro &&
                    <>
                        <DetallesTitulo>Dirección del cliente</DetallesTitulo>
                        <div style={{ overflowY: "scroll", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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
                            <InputsContainer style={{ width: "100%" }}>
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

                        </div>
                    </>
                }
                {direccionesRegistro && !direccionFormOpen &&


                    <div className="direccionesRegistrosContainer">
                        {dirección?.map((dir) => (
                            <div className="direccionesRegistros" key={dir?.id}>
                                <p onClick={() => { setDireccionId(dir?.id); handleUpdateModalOpen(); handleOpenModa() }}>{dir?.calle} {dir?.colonia} {dir?.estado}</p>
                                <div onClick={() => { setDireccionId(dir?.id); handleDeleteModalOpen(); handleOpenModa() }} className="closeButton">X</div>
                            </div>
                        ))}
                    </div>

                }
                <div id="" onClick={() => { handleFormRender(); handleHeightStatusChangeFalse() }} className="addButton">Agregar Dirección</div>
            </ResponsableCardContainer>
        </>
    )


}

export default DireccionCard
