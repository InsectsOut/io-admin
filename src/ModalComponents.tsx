import styled from "styled-components";
import { FormatoInputs } from "./CreateServiceForm";
import { mainStyle } from "./ServiciosCard";
import { DetailsTitle } from "./ServiciosCard";
import { useEffect, useState } from "react";
import { supabase } from "./utils/ClientSupabase";
import { aplicacionOptions } from "./tipo_servicios";
import { useParams } from 'react-router-dom';


export const RegistroModal = styled.div /*style*/ `
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
.sendButton{
    width: 180.21px;
    background: #0D4E80;
    height: 40.19px;

}
`

export const ModalContent = styled.div /*style*/ `
position:relative;
width: 30.78%;
height:55.625%;
background: #F4F4F4;
box-shadow: 0px 4.59475px 4.59475px rgba(0, 0, 0, 0.25);
border-radius: 0.718rem;
display:flex;
flex-direction:column;
align-items:flex-start;
padding-left:1.25rem;
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
margin-bottom:unset;
`
const HojaInputs = styled.input /*style*/ `
width: 19.815rem;
height:2.513rem;
all:unset;
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

const ModalInputs = styled(FormatoInputs) /*style*/ `
margin-left:unset;
gap:.5rem;


`

const SubTitles = styled.p /*style*/ `
width: 3.4375rem; 
height: 1.25rem;
margin:unset;
 
font-style: normal;
font-weight: 400;
font-size: 0.9375rem; 
line-height: 1.25rem;
display: flex;
align-items: center;

color: #838383;
`
interface cardProps {
    closeModal?: () => void
    plagas?: any[];
    registroApId?: number
    addBtnClicked: boolean
}

const Modal: React.FC<cardProps> = ({ closeModal, plagas, registroApId, addBtnClicked }) => {
    const [tipoPlaga, setTipoPlaga] = useState<number | null>(null)
    const [producto, setProducto] = useState<any[]>()
    const [productoId, setProductoId] = useState<number>(0)
    const [area_aplicacion, setArea_aplicacion] = useState<string>("")
    const [tipo_aplicacion, setTipo_aplicacion] = useState<string>("")
    const [cantidad, setCantidad] = useState<number | undefined>()
    const [unidad, setUnidad] = useState("")
    const [registroId, setRegistroId] = useState<number>(registroApId as number)
    const [servicioId, setServicioId] = useState<number>()
    const { folio } = useParams()
    const [addButtonState, setAddButtonState] = useState<boolean>(addBtnClicked)


    const HandleplagaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = +event?.target.value
        setTipoPlaga(cambio)
    }

    const fetchProducto = async () => {
        try {
            const { data, error } = await supabase
                .from("plaguicidas")
                .select("*")
            if (data) {
                await setProducto(data)
            }
            if (error) {
                throw new Error(error.message)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleProductoIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = +event.target.value
        setProductoId(cambio)
    }

    useEffect(() => {
        fetchProducto()
        fetchServicioId()
    }, [])

    const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = event.target.value
        setArea_aplicacion(cambio)
    }

    const handleTipoAplicacionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = event?.target.value
        setTipo_aplicacion(cambio)
        console.log(cambio)

    }

    const handleCantidadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cambio = +event.target.value
        setCantidad(cambio)
    }

    const handleUnidadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cambio = event.target.value
        setUnidad(cambio)
    }



    const fetchServicioId = async () => {
        try {
            console.log("hola", folio)
            const { data, error } = await supabase
                .from("Servicios")
                .select("id")
                .filter("folio", "eq", folio)

            if (data) {
                const [id] = data
                setServicioId(id?.id)
                //setTipoPlaga(id?.tipo_plaga_id)
            }
        }

        catch (err) {
            console.log("error obteniendo el id del servicio", err)
        }
    }

    const fetchRegistroInfo = async () => {

        if (!registroId) {
            return
        }

        if (addBtnClicked) {

            return
        }

        try {
            const { data, error } = await supabase
                .from("RegistroAplicacion")
                .select("*")
                .order("id", { ascending: false })
                .filter("id", "eq", registroId)

            if (data) {
                console.log(data)
                const [registro] = data
                setCantidad(registro.cantidad ?? 0)
                setArea_aplicacion(registro.area_aplicacion ?? "")
                setProductoId(registro?.producto_id)
                setServicioId(servicioId)
                setTipo_aplicacion(registro?.tipo_aplicacion as string)
                setUnidad(registro?.unidad)
                setRegistroId(registro?.id)
                setTipoPlaga(registro?.tipo_plaga_id)
            }
        }

        catch (err) {
            console.log("error obteniendo el registro del aplcación", err)
        }



    }

    const upsertRegistros = async () => {
        try {
            if (registroId) {
                const { data, error } = await supabase
                    .from("RegistroAplicacion")
                    .update(
                        [{
                            //id:registroId,
                            unidad: unidad,
                            cantidad: cantidad,
                            tipo_aplicacion: tipo_aplicacion,
                            producto_id: productoId,
                            area_aplicacion: area_aplicacion,
                            servicio_id: servicioId,
                            tipo_plaga_id: tipoPlaga
                        }] as any
                    )
                    .filter("id", "eq", registroId)
                if (error) {
                    console.error("Error updating data:", error.message);
                } else {
                    console.log("Data updated successfully:", data);
                }
            }

            else {
                const { data, error } = await supabase
                    .from("RegistroAplicacion")
                    .insert(
                        [{
                            //id:registroId,
                            unidad: unidad,
                            cantidad: cantidad,
                            tipo_aplicacion: tipo_aplicacion,
                            producto_id: productoId,
                            area_aplicacion: area_aplicacion,
                            servicio_id: servicioId,
                            tipo_plaga_id: tipoPlaga
                        }] as any

                    )
                if (error) {
                    console.error("Error inserting data:", error.message);
                } else {
                    console.log("Data inserted successfully:", data);
                }
            }

        } catch (err) {
            console.log(err)
        }

    }


    useEffect(() => {
        console.log("h0alas")
        fetchRegistroInfo()
        console.log("registro id" + registroApId)
        console.log(addButtonState)
    }, [])




    return (
        <RegistroModal>
            <ModalContent>
                <CloseButton
                    onClick={closeModal}
                >X</CloseButton>
                <Titulo>Detalles de aplicación</Titulo>
                <ModalInputs style={{ flexDirection: "row" }}
                >
                    <div
                        className="doubleInput"
                    >
                        <DetailsTitle>Tipo de aplicación</DetailsTitle>
                        <select
                            onChange={handleTipoAplicacionChange}
                            value={tipo_aplicacion}
                            style={mainStyle}
                        >
                            <option hidden >Elegir el tipo de aplicación ...</option>
                            {aplicacionOptions.map((options) => (
                                <option key={options.id} value={options.value}>{options.label}</option>
                            ))}
                        </select>
                    </div>
                    <div
                        className="doubleInput"
                    >
                        <DetailsTitle>Tipo de plaga</DetailsTitle>
                        {/* hacer update del tipo plaga al servicio */}
                        <select className="tipoServicio" value={tipoPlaga?.toString()}
                            style={{ ...mainStyle, width: "10.375rem" }}
                            onChange={HandleplagaChange}
                        >
                            <option hidden> Elegir el tipo de plaga...</option> as any
                            {plagas?.map((plaga) => (
                                <option
                                    value={plaga.id} key={plaga.id} >{plaga.plaga} </option>
                            ))}
                        </select>
                    </div>
                </ModalInputs>
                <ModalInputs style={{ width: "90%" }}>
                    <DetailsTitle>Área de aplicación</DetailsTitle>
                    <HojaInputs
                        style={{ overflowX: "scroll", display: "flex", flexDirection: "column", flexWrap: "wrap" }}
                        className="textInputs"
                        type="text"
                        value={area_aplicacion}
                        onChange={handleAreaChange}
                        placeholder="Especifique el área de aplicación"
                    ></HojaInputs>
                </ModalInputs>
                <ModalInputs >
                    <div style={{ display: "inline-flex", gap: "1rem" }}>
                        <div>
                            <div
                                className="doubleInput"
                            >
                                <DetailsTitle>Producto</DetailsTitle>
                                <select
                                    style={mainStyle}
                                    onChange={handleProductoIdChange}
                                    value={productoId}
                                >
                                    <option>-- Elegir el producto utilizado --</option>
                                    {producto?.map((product) => (

                                        <option key={product.id} value={product.id}>{product.nombre}</option>

                                    ))}
                                </select>
                            </div>

                        </div>
                        <ModalInputs style={{ flexDirection: "row", flexGrow: "1" }}>
                            <div
                                className="doubleInput"
                            >
                                <DetailsTitle>Cantidad</DetailsTitle>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
                                        <HojaInputs
                                            style={{ overflowX: "scroll", display: "flex", flexDirection: "column", flexWrap: "wrap", width: "5.063rem" }}
                                            className="textInputs"
                                            type="number"
                                            min={0}
                                            onChange={handleCantidadChange}
                                            value={cantidad}
                                        ></HojaInputs>
                                        <SubTitles>Número</SubTitles>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
                                        <select
                                            value={unidad}
                                            onChange={handleUnidadChange}
                                            style={{ ...mainStyle, width: "5.063rem" }}
                                        >
                                            <option hidden selected>-Unidad-</option>
                                            <option value={"gramos"} >-- g --</option>
                                            <option value={"mililitros"}>-- ml --</option>
                                        </select>
                                        <SubTitles>g/ml</SubTitles>
                                    </div>
                                </div>
                            </div>
                        </ModalInputs>
                    </div>
                </ModalInputs>

                <button style={{ fontSize: ".9rem" }}
                    className="sendButton"
                    onClick={() => { upsertRegistros().then(() => { window.location.reload() }) }}
                >{registroId ? "Actualizar Registro" : "Añadir Registro"}</button>

            </ModalContent>
        </RegistroModal>

    )
}

export default Modal