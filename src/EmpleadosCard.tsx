
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Tables } from "./database-types";
import { Titulo } from "./Servicios";
import { MdFileUpload } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { CardContainer, ReturnButton } from "./ServiciosCard";
import { DetailsTitle } from "./ServiciosCard";
import { CardInputs } from "./ServiciosCard";
import { InputsContainer } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import ResponsableCard from "./ResponsableCard";
import { StyledButton } from "./ServiciosCard";
import { supabase } from "./utils/ClientSupabase";
import FileUpload from "./Uploader";
import FileDownloader from "./FileDownloader";
import { DateInput } from "./CreateServiceForm";
import { useNavigate } from 'react-router-dom'


type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">
type Empleado = Tables<"Empleados">
type DocsEmpleado = Tables<"Documentos_empleados">;

type Empleado_Con_Docs = DocsEmpleado & {
    Empleado: Empleado | null
}
type StyledButtonProps = {
    width?: string
    height?: string
    color?: string
    background?: string
    justify?: string

}


const ButtonComponents = styled.div<StyledButtonProps>/*style*/`
width:${props => (props.width)};
background:${props => (props.background)};
height:${props => (props.height)};
color: ${props => (props.color)};
border-radius: 0.25rem;
cursor:pointer;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
font-size:1rem;
display:flex;
align-items:center;
padding-left:.5rem;
padding-right:.5rem;
justify-content:${props => (props.justify)};
p{
margin:0;
}
`
const ClientCardContainer = styled(CardContainer) /*style*/ `
height:30.625rem;

`
export const BodyContainer = styled.div /*style*/ `
display:flex;
gap:2.94rem;
.selectTag{
display:flex;
gap:.25rem;
;
}
.genInfo{}
.workInfo{}
.infoButtons{
width:25%;
background:#0D4E80;
height:% ;
border-radius: 0.25rem;
cursor:pointer;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
font-size:1rem;
p{
margin:0;

}
}
.licencias{
display:flex;
width:100%;
gap:1rem;
align-items:flex-end;
}
.licenciasInputsFormat1{
display:flex;
flex-direction:column;
width:35%;
gap:.25rem;
}
.licenciasInputsFormat2{
display:flex;
flex-direction:column;
width:65%;
gap:.25rem;
}
.dateInputFormat{
display:flex;
flex-direction:row;
gap:.5rem;
width:100%;
align-items:center;
}
.dateInputs {
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: left;
  padding-left: .5rem;
  color: #838383;
  width: 100%;
  height: 2.5125rem; 
  background: #FFFFFF;
  border: 0.071793rem solid #727272; 
  border-radius: 0.215379rem;
  /* Make the calendar icon black */
  &::-webkit-calendar-picker-indicator {
    filter: invert(1); /* Ensures the icon is black */
  }
}
.inputFormat{
color:black;
}
.docsInfoContainer{

width:100%;
gap:1rem;
height:90%;
}
.datepicker{
width:6.91rem;
height:2.638rem;
}
.uploaderContainer{
display:flex;
gap:.5rem;

}
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
    const { id } = useParams<string>()
    const [responsable, setResponsable] = useState<string>("")
    const [isClicked, setClicked] = useState<boolean>(false);
    const [responsableExists, setResponsableExists] = useState<boolean | null>(false)
    const [updater, setUpdater] = useState(false)
    const [infoTab, setInfoTab] = useState<string>("general")
    const [uploaderOpen, setUploaderOpen] = useState(false)
    const [valueFromChildre, setValueFromChildren] = useState<string>("")
    const [file_title, setFile_Title] = useState<string>(valueFromChildre)
    const [empleados, setEmpleados] = useState<Empleado_Con_Docs[]>([])
    const [docs, setDocs] = useState<DocsEmpleado[]>([])
    const [empladoStatus, setEmpleadoStatus] = useState<boolean>(true)
    const [empladoStatusString, setEmpleadoStatusString] = useState<string>("")
    const [fecha_nacimiento, setFechaDeNacimiento] = useState<Date | null>()
    const [ineNumber, setIneNumber] = useState<string>("")
    const [curp, setCurp] = useState<string>("")
    const [imss, setImss] = useState<string>("")
    const [puesto, setPuesto] = useState<string>("")
    const [numLicencia, setNumlicencia] = useState<number | null>()
    const [vigencia_conducir_start, setVigenciaDeConducirStart] = useState<Date | null>()
    const [vigencia_conducir_end, setVigenciaDeConducirEnd] = useState<Date | null>()
    const [numCuenta, setNumCuenta] = useState<number | null>()
    const [esCapacitacion, setEsCapacitacion] = useState<boolean>(false);
    const [mostrarCapacitaciones,setMostrarCapacitaciones] = useState<boolean>(false)
    const navigate = useNavigate()


    const handleMostrarCapacitaciones = () =>{
        setMostrarCapacitaciones(prev =>!prev)
    }
    const handleDocTypeChange = (isCapacitacion: boolean) => {
        setEsCapacitacion(isCapacitacion);
    };

    const handleValueChange = (newValue: string) => { setValueFromChildren(newValue); setFile_Title(newValue) };

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

    const handleTelefonoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setTelefono(cambio)
    }
    const handleCurpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setCurp(cambio)
    }
    const handleImssChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setImss(cambio)
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setEmail(cambio)
    }
    const handleNumCuentaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = +event.target.value
        setNumCuenta(cambio)
    }
    const handleNoLicencia = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = +event.target.value
        setNumlicencia(cambio)
    }
    const handleIneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setIneNumber(cambio)
    }
    const setInfoTag = (event: React.MouseEvent<HTMLDivElement>, tag: string) => {
        setInfoTab(tag);
    }
    const openUploader = (event: React.MouseEvent<HTMLDivElement>) => {
        setUploaderOpen(prev => !prev);
    }
    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, file_title: string, capacitacion: boolean) => {
        const file = event.target.files?.[0];
        let now = new Date()
        let date_name = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        let file_name = date_name + file_title;

        if (file) {
            console.log('File selected:', file);
            console.log(await supabase.auth.getUser())
            let query = supabase
            let url = ""
            const { data, error } = await query
                .storage
                .from('documentos_empleados')
                .upload(`Documentos/${file_name}`, file, {
                    cacheControl: '3600',
                    upsert: false
                })
            console.log(data)
            url = "https://stnrrgqnedpadgelrkbx.supabase.co/storage/v1/object/public/documentos_empleados/" + data?.path
            try {

                let query = supabase.from("Documentos_empleados")
                const { data, error } = await query

                    .insert([
                        {

                            nombre: file_title,
                            url: url,
                            id_empleado: id,
                            es_capacitacion: capacitacion

                        },
                    ] as any)

                    .select();

                if (error) {
                    console.log(error)
                }
                setUploaderOpen(false)

            }
            catch (err) {
                console.log(err)
            }
            if (error) {
                console.log(error);
            }


        } else {
            console.log('No file selected');
        }
    }

    const fetchEmpleados = async (id: any) => {
        try {
            let query = supabase
            const { data, error } = await query
                .from("Empleados")
                .select(`*`)
                .eq("id", id)

            if (!error) {
                const { data: docsDat, error:docsError } = await query
                .from("Documentos_empleados")
                .select(`*`)
                .eq("id_empleado", id)
                if (!docsError){
                    setEmpleados(docsDat as any)
                }
                console.log(data)
               
                setNombre(data[0]?.nombre ?? "")
                setTelefono(data[0]?.telefono as any)
                setPuesto(data[0]?.puesto as string)
                setEmpleadoStatus(data[0]?.activo as boolean)
                setFechaDeNacimiento(data[0]?.fecha_nacimiento as Date | any)
                setIneNumber(data[0]?.ine as string)
                setCurp(data[0]?.curp as string)
                setImss(data[0]?.imss as string)
                //@ts-ignore
                setNumCuenta(data[0]?.cuenta_bancaria as any)
                setNumlicencia(data[0]?.licencia_de_conducir as number)
                setVigenciaDeConducirStart(data[0]?.vigencia_conducir_start as Date | any)
                setVigenciaDeConducirEnd(data[0]?.vigencia_conducir_end as Date | any)
            }
            console.log(error)
        }

        catch (err) {
            console.log(err)
        }
    }
    const fetchDocs = async (id: any) => {
        try {
            let query = supabase
            const { data, error } = await query
                .from("Documentos_empleados")
                .select(`*`)
                .eq("id_empleado", id)

            if (!error) {
                console.log(data)
                setDocs(data)

            }
            console.log(error)
        }

        catch (err) {
            console.log(err)
        }
    }

    const updateGeneralEmployeeData = async () => {
        try {
            let query = supabase
            const { data, error } = await query
                .from("Empleados")
                .update([
                    {
                        nombre: nombre,
                        activo: empladoStatus,
                        fecha_nacimiento: fecha_nacimiento,
                        puesto: puesto,
                        telefono: telefono,

                    },
                ] as Empleado | any)
                .filter("id", "eq", `${id}`)
                .select();
                location.reload()


            if (error) {
                console.log(error)
            }
        }


        catch (err) {
            console.error("Error trying to run ", err)
        }
    }
    const updateWorkEmployeeData = async () => {
        try {
            let query = supabase
            const { data, error } = await query
                .from("Empleados")
                .update([
                    {
                        ine: ineNumber,
                        curp: curp,
                        imss: imss,
                        licencia_de_conducir: numLicencia,
                        vigencia_conducir_start: vigencia_conducir_start,
                        vigencia_conducir_end: vigencia_conducir_end,
                        cuenta_bancaria: numCuenta


                    },
                ] as Empleado | any)
                .filter("id", "eq", `${id}`)
                .select();
                location.reload()

            if (error) {
                console.log(error)
            }
        }


        catch (err) {
            console.error("Error trying to run ", err)
        }
    }

    const updaterFunction = async () => {
        updateGeneralEmployeeData()
        if (infoTab === "general") {
            console.log("geni")
            updateGeneralEmployeeData()
        }
        if (infoTab === "trabajo") {
            console.log("siendi")
            updateWorkEmployeeData()
        }
    }

    const handleFechaDeNacimeintoChange = (date: Date | null) => {
        setClicked(true)
        console.log(date)
        setFechaDeNacimiento(date)
    }
    const handleVigenciaDeConducirStart = (date: Date | null) => {
        setClicked(true)
        console.log(date)
        setVigenciaDeConducirStart(date)
    }
    const handleVigenciaDeConducirEnd = (date: Date | null) => {
        setClicked(true)
        console.log(date)
        setVigenciaDeConducirEnd(date)
    }
    const handlPuestoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        let cambio = event.target.value
        setPuesto(cambio)
    }
    const handleEstatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        let cambio = event.target.value
        setEmpleadoStatusString(cambio)
        if (cambio === "true") {
            setEmpleadoStatus(true)
        }
        else if (cambio === "false") {
            setEmpleadoStatus(false)
        }

    }


    useEffect(() => {
        fetchEmpleados(id)
    },
        [])
    useEffect(() => {
        fetchDocs(id)
    },[])
    // TODO QUE LOS DOCUMENTOS SE LLAMEN DE UN LUGAR DIFERENTE PARA NO INTERFERIR
    // CON EL FLUJO 
   




    return (
        <>
            <Titulo>Empleados</Titulo>
            <BodyContainer id="bodyContainer">
                <ClientCardContainer style={{ position: "relative" }}>
                    <DetallesTitulo>Información del Empleado</DetallesTitulo>

                    <div className="selectTag">
                        <div className="genInfo infoButtons"
                            onClick={(e) => { setInfoTag(e, "general") }}
                            style={{ background: infoTab === "general" ? "white" : "#0D4E80", color: infoTab === "general" ? "#0D4E80" : "white" }}
                        ><p>General</p></div>
                        <div className="workInfo infoButtons"
                            onClick={(e) => { setInfoTag(e, "trabajo") }}
                            style={{ background: infoTab === "trabajo" ? "white" : "#0D4E80", color: infoTab === "trabajo" ? "#0D4E80" : "white" }}
                        ><p>Trabajo</p></div>
                        <div className="workInfo infoButtons"
                            onClick={(e) => { setInfoTag(e, "docs"); fetchDocs(id) }}
                            style={{ background: infoTab === "docs" ? "white" : "#0D4E80", color: infoTab === "docs" ? "#0D4E80" : "white" }}
                        ><p>Docs</p></div>
                    </div>
                    {infoTab === "general" &&
                        <>
                            <InputsContainer>
                                <div style={{ display: "inline-flex", width: "26.124rem" }}>
                                    <div
                                        style={{ width: "23.456rem" }}
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

                                </div>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Teléfono
                                </DetailsTitle>
                                <NumberInputs style={inputWidthStyle} id="textInputs" className="textInputs"
                                    type="string"
                                    onChange={handleTelefonoChange}
                                    value={telefono}
                                >
                                </NumberInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%", background: "none" }}>
                                <DetailsTitle>
                                    Fecha de nacimiento</DetailsTitle>
                                <div style={{ width: "20.003rem", background: "white", border: " 0.071793rem solid #727272", borderRadius: "0.215379rem", }}>
                                    <DateInput

                                        wrapperClassName="datepicker"
                                        dateFormat="YYYY-MM-dd"
                                        onChange={(date) => { handleFechaDeNacimeintoChange(date); }}
                                        selected={fecha_nacimiento}
                                    >
                                    </DateInput>
                                </div>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Puesto
                                </DetailsTitle>
                                <CardInputs
                                    style={inputWidthStyle}
                                    className="textInputs"
                                    type="text"
                                    value={puesto}
                                    onChange={handlPuestoChange}
                                >
                                </CardInputs>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Estatus
                                </DetailsTitle>
                                <select
                                    style={inputWidthStyle}
                                    className="textInputs"
                                    value={empladoStatusString}
                                    onChange={(e) => { handleEstatusChange(e) }}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Dado de baja</option>
                                </select>
                            </InputsContainer>
                        </>
                    }
                    {infoTab === "trabajo" &&
                        <>
                            <InputsContainer>
                                <div style={{ display: "inline-flex", width: "26.124rem" }}>
                                    <div
                                        style={{ width: "23.456rem" }}
                                    >
                                        <DetailsTitle>INE</DetailsTitle>
                                        <CardInputs style={{ ...inputWidthStyle, width: "85%" }}
                                            id="textInputs"
                                            className="textInputs"
                                            onChange={handleIneChange}
                                            value={ineNumber}
                                        >
                                        </CardInputs>
                                    </div>

                                </div>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    CURP
                                </DetailsTitle>
                                <NumberInputs style={inputWidthStyle} id="textInputs" className="textInputs"
                                    type="text"
                                    onChange={handleCurpChange}
                                    value={curp}
                                >
                                </NumberInputs>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Alta del IMSS                        </DetailsTitle>
                                <CardInputs
                                    style={inputWidthStyle}
                                    className="textInputs"
                                    type='text'
                                    onChange={handleImssChange}
                                    value={imss}
                                >
                                </CardInputs>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Cuenta bancaria                        </DetailsTitle>
                                <CardInputs
                                    style={inputWidthStyle}
                                    className="textInputs"
                                    type='number'
                                    onChange={handleNumCuentaChange}
                                    value={numCuenta}
                                >
                                </CardInputs>
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <div className="licencias">
                                    <div className="licenciasInputsFormat1">
                                        <DetailsTitle >
                                            No licencia
                                        </DetailsTitle>
                                        <CardInputs
                                            style={{ width: "100%" }}
                                            className="textInputs"
                                            type="text"
                                            onChange={handleNoLicencia}
                                            value={numLicencia}
                                        >
                                        </CardInputs>
                                    </div>
                                    <div className="licenciasInputsFormat2">
                                        <DetailsTitle>
                                            Vigencia
                                        </DetailsTitle>
                                        <div className="dateInputFormat">
                                            <div style={{ width: "45%", background: "white", border: " 0.071793rem solid #727272", borderRadius: "0.215379rem", height: "2.638rem", margin: 0, display: "flex", alignItems: "center" }}>
                                                <DateInput
                                                    //@ts-ignore
                                                    wid="6.91rem"
                                                    height="2.638rem"
                                                    wrapperClassName="datepicker"
                                                    dateFormat="YYYY-MM-dd"
                                                    onChange={(date) => { handleVigenciaDeConducirStart(date); }}
                                                    selected={vigencia_conducir_start}

                                                >
                                                </DateInput>
                                            </div>
                                            <div style={{ width: "45%", background: "white", border: " 0.071793rem solid #727272", borderRadius: "0.215379rem", height: "2.638rem", margin: 0 }}>
                                                <DateInput

                                                    wrapperClassName="datepicker"
                                                    dateFormat="YYYY-MM-dd"
                                                    onChange={(date) => { handleVigenciaDeConducirEnd(date); }}
                                                    selected={vigencia_conducir_end}
                                                >
                                                </DateInput>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </InputsContainer>

                        </>
                    }
                    {infoTab === "docs" &&
                        <>
                            <InputsContainer
                                className="docsInfoContainer"
                                style={{ positio: "relative" }}
                            >
                                <div className="uploaderContainer">
                                    <ButtonComponents
                                        background="white"
                                        width="55%"
                                        height="3rem"
                                        color="#0D4E80"
                                        justify="space-between"
                                        onClick={(e: any) => { openUploader(e) }}
                                    ><p>{!uploaderOpen ? "Subir un archivo" : "Ver archivos"}</p><MdFileUpload /></ButtonComponents>
                                    <ButtonComponents
                                        background="white"
                                        width="30%"
                                        height="3rem"
                                        color="#0D4E80"
                                        justify="space-between"
                                        onClick={handleMostrarCapacitaciones}
                                    ><p>{!mostrarCapacitaciones ? "Capacitaciones" : "Documentos"}</p></ButtonComponents>
                                </div>
                                {uploaderOpen &&
                                    <FileUpload
                                    onChange={async (e) => {
                                        await uploadImage(e, file_title, esCapacitacion);
                                        fetchDocs(id);
                                      }}
                                        onValueChange={handleValueChange}
                                        onDocTypeChange={handleDocTypeChange}
                                    ></FileUpload>
                                }
                                {docs
                                 //@ts-ignore
                                    .filter((docs) => docs.es_capacitacion === mostrarCapacitaciones)  // Filter employees where es_capacitacion is true
                                    .map((docs) => (
                                        !uploaderOpen && (
                                            <FileDownloader
                                                file_id={docs.id}
                                                key={docs.id}  // Add a unique key prop
                                                file_url={docs.url as string}  // Access file URL
                                                file_name={docs.nombre as string}  // Access file name
                                            />
                                        )
                                    ))}

                            </InputsContainer>



                        </>
                    }
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

            </BodyContainer>
            <ReturnButton>Regresar</ReturnButton>
            <StyledButton
                disabled={!isClicked}
                clicado={isClicked}
                onClick={() => {
                    updateOrInsert();
                    updaterFunction()
                        .then(() => {
                            location.reload();
                        })
                        .catch((error) => {
                            console.error('Error during update:', error);
                        });
                }}
            >
                Guardar Cambios
            </StyledButton>
        </>
    )
}


export default EmpleadosCard
