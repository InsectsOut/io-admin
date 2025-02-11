
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Tables } from "../src/supabase/Database";
import { Titulo } from "./Servicios";
import { MdFileUpload } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { ReturnButton } from "./ServiciosCard";
import { CardContainer } from "./rehusableComponents/CardContainer";
import { DetailsTitle } from "./ServiciosCard";
import { CardInputs } from './rehusableComponents/CardInputs';
import { InputsContainer } from "./ServiciosCard";
import { DetallesTitulo } from "./ServiciosCard";
import ResponsableCard from "./ResponsableCard";
import { StyledButton } from "./ServiciosCard";
import { supabase } from "./utils/ClientSupabase";
import FileUpload from "./Uploader";
import FileDownloader from "./FileDownloader";
import { DateInput } from "./CreateServiceForm";

type Empleado = Tables<"Empleados">
type DocsEmpleado = Tables<"DocumentosEmpleados">;
type Empleado_Con_Docs = DocsEmpleado & {
    Empleado: Empleado | null
}
type StyledButtonProps = {
    width?: string
    height?: string
    color?: string
    background?: string
    justify?: string
    gap?: number


}

export const ButtonComponents = styled.div<StyledButtonProps>`
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
gap: ${props => (props.gap ? `${props.gap}rem` : 0)};
justify-content:${props => (props.justify)};
&:hover{
cursor:pointer;
}
p{
margin:0;
}
`
const ClientCardContainer = styled(CardContainer)`
height:30.625rem;

`
export const BodyContainer = styled.div`
display:flex;
gap:2.94rem;
.selectTag{
display:flex;
gap:.25rem;
}
.genInfo{}
.workInfo{}
.infoButtons{
width:25%;
background:#0D4E80;
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

const FileContainer = styled.div`
display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  overflow: scroll;
  max-height: 21rem;
`

const EmpleadosCard = () => {
    const [nombre, setNombre] = useState<string>("")
    const [telefono, setTelefono] = useState<string>("")
    const { id } = useParams<string >()
    const [, setResponsable] = useState<string>("")
    const [isClicked, setClicked] = useState<boolean>(false);
    const [responsableExists] = useState<boolean | null>(false)
    const [updater, setUpdater] = useState(false)
    const [infoTab, setInfoTab] = useState<string>("general")
    const [uploaderOpen, setUploaderOpen] = useState(false)
    const [valueFromChildre, setValueFromChildren] = useState<string>("")
    const [file_title, setFile_Title] = useState<string>(valueFromChildre)
    const [, setEmpleados] = useState<Empleado_Con_Docs[]>([])
    const [docs, setDocs] = useState([] as DocsEmpleado[])
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
    const [mostrarCapacitaciones, setMostrarCapacitaciones] = useState<boolean>(false)
    const [fileUrl, setFileUrl] = useState<string>("")
    const [firmaSelected,setFirmaSelected] = useState<boolean>(false)
    const [FirmaUrl,setFirmaUrl] = useState<string>("")

    const handleMostrarCapacitaciones = () => {
        setMostrarCapacitaciones(prev => !prev)
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
        const cambio = event.target.value.replace(/\s/g, '')
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

    const handleNumCuentaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = +event.target.value
        setNumCuenta(cambio)
    }

    const handleNoLicencia = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true);

        const cambio = +event.target.value;
        setNumlicencia(isNaN(cambio) ? numLicencia : cambio);
    };

    const handleIneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setIneNumber(cambio)
    }

    const setInfoTag = (event: React.MouseEvent<HTMLDivElement>, tag: string) => {
        setInfoTab(tag);
    }

    const openUploader = (firmaSelected:boolean) => {
        setFirmaSelected(firmaSelected)
        setUploaderOpen(prev => !prev);
    }


    const fetchDocumentUrl = async (docPath: string) => {
        console.log(docPath)
        try {
            const { data, error } = await supabase
                .storage
                .from('documentos_empleados')
                .createSignedUrl(docPath, 3600); // 3600 seconds = 1 hour

            if (error) {
                console.error('Failed to create signed URL:', error.message);
                return;
            }

            if (data?.signedUrl) {
                console.log('Signed Document URL:', data.signedUrl);
                let url = data?.signedUrl
                console.log(url)
                setFileUrl(url)

            } else {
                console.error('No signed Document URL returned.');

            }
        } catch (err) {
            console.error('Error fetching Document:', err);
        }
    };

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, file_title: string, capacitacion: boolean) => {
        const file = event.target.files?.[0];
        const now = new Date()
        const date_name = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        const file_name = date_name + `_${file_title}`;

        if (file) {
            console.log('File selected:', file);
            console.log(await supabase.auth.getUser())
            const query = supabase
            let url = ""
            let trimNombre = nombre.trim().replace(/\s+/g, '_');
            const { data, error } = await query
                .storage
                .from('documentos_empleados')
                .upload(`Documentos/${trimNombre}/${file_name}`, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if(!firmaSelected){
            try {

                const query = supabase.from("DocumentosEmpleados")
                const { error } = await query
                
                    .insert([
                        {

                            nombre: file_title,
                            url: data?.path,
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
        }
            if(firmaSelected){
                console.log("firma selected")
                console.log("path", data?.path);
            try {

                const query = supabase.from("Empleados")
                const { error } = await query
                
                    .update([
                        {
                            Firma: data?.path,
                        },
                    ] as any)
                .eq("id", Number(id))
                .select();

                if (error) {
                    console.log(error)
                }
                setUploaderOpen(false)
                fetchEmpleados(id);
             //   await setFirmaSelected(false)

            }
        
            catch (err) {
                console.log(err)
            }
        }
            if (error) {
                console.log(error);
            }
            return;


        }
        console.log('No file selected');
    }

    const fetchEmpleados = async (id: any) => {
        try {
            const query = supabase
            const { data, error } = await query
                .from("Empleados")
                .select(`*`)
                .eq("id", id)

            if (!error) {
                const { data: docsDat, error: docsError } = await query
                    .from("DocumentosEmpleados")
                    .select(`*`)
                    .eq("id_empleado", id)
                if (!docsError) {
                    setEmpleados(docsDat as any)
                }
                console.log(data)

                if (data) {
                    const dobString = data[0]?.fecha_nacimiento
                    if (dobString) {
                        const [year, month, day] = dobString.split("-").map(Number);
                        const formattedDob = new Date(year, month - 1, day);
                        setFechaDeNacimiento(formattedDob)
                        console.log("Formatted Date of Birth:", formattedDob);
                    } else {
                        console.log("Fecha de nacimiento no disponible.");
                    }
                    setNombre(data[0]?.nombre ?? "")
                    setTelefono(data[0]?.telefono as any)
                    setPuesto(data[0]?.puesto as string)
                    setEmpleadoStatus(data[0]?.activo as boolean)
                   
                    setIneNumber(data[0]?.ine as string)
                    setCurp(data[0]?.curp as string)
                    setImss(data[0]?.imss as string)
                    //@ts-ignore
                    setNumCuenta(data[0]?.cuenta_bancaria as any)
                    setNumlicencia(data[0]?.licencia_de_conducir as number)
                    setVigenciaDeConducirStart(data[0]?.vigencia_conducir_start as Date | any)
                    setVigenciaDeConducirEnd(data[0]?.vigencia_conducir_end as Date | any)
                    setFirmaUrl(data[0]?.Firma ?? "")
                }
            }
            console.log(error)
        }

        catch (err) {
            console.log(err)
        }
    }
    const fetchDocs = async (id: any) => {
        try {
            const query = supabase
            const { data, error } = await query
                .from("DocumentosEmpleados")
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
            const query = supabase
            const { error } = await query
                .from("Empleados")
                .update([
                    {
                        nombre,
                        activo: empladoStatus,
                        fecha_nacimiento,
                        puesto,
                        telefono,

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
            const query = supabase
            const { error } = await query
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
        const cambio = event.target.value
        setPuesto(cambio)
    }
    const handleEstatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClicked(true)
        const cambio = event.target.value
        setEmpleadoStatusString(cambio)
        if (cambio === "true") {
            setEmpleadoStatus(true)
        }
        else if (cambio === "false") {
            setEmpleadoStatus(false)
        }

    }

    const triggerFromChild = () => {
        fetchDocs(id)
    };



    useEffect(() => {
        fetchEmpleados(id)
    },
        [])
    useEffect(() => {
        fetchDocs(id)


    }, [])

    useEffect(() => {
        if (fileUrl) {
            // Trigger the download only when fileUrl changes
            window.open(fileUrl, "_blank"); // Opens the URL in a new tab
        }
    }, [fileUrl]);
    
    useEffect(() => {
        if (fileUrl) {
            // Trigger the download only when fileUrl changes
            window.open(fileUrl, "_blank"); // Opens the URL in a new tab
        }
    }, []);
    
    useEffect(() => {
        if (fileUrl) {
            // Trigger the download only when fileUrl changes
            window.open(fileUrl, "_blank"); // Opens the URL in a new tab
        }
    }, []);
    

    



    return (
        <>
            <Titulo>Empleados</Titulo>
            <BodyContainer id="bodyContainer">
                <ClientCardContainer 

                style={{ position: "relative" }}>
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
                                            value={nombre} />
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
                                    value={telefono} />
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%", background: "none" }}>
                                <DetailsTitle>
                                    Fecha de nacimiento</DetailsTitle>
                                <div style={{ width: "20.003rem", background: "white", border: " 0.071793rem solid #727272", borderRadius: "0.215379rem", }}>
                                    <DateInput wrapperClassName="datepicker"
                                        dateFormat="YYYY-MM-dd"
                                        onChange={(date) => { handleFechaDeNacimeintoChange(date); }}
                                        selected={fecha_nacimiento} />
                                </div>
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Puesto
                                </DetailsTitle>
                                <CardInputs style={inputWidthStyle}
                                    className="textInputs"
                                    type="text"
                                    value={puesto}
                                    onChange={handlPuestoChange} />
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
                                            value={ineNumber} />
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
                                    value={curp} />
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Alta del IMSS                        </DetailsTitle>
                                <CardInputs style={inputWidthStyle}
                                    className="textInputs"
                                    type='text'
                                    onChange={handleImssChange}
                                    value={imss} />
                            </InputsContainer>
                            <InputsContainer>
                                <DetailsTitle>
                                    Cuenta bancaria                        </DetailsTitle>
                                <CardInputs style={inputWidthStyle}
                                    className="textInputs"
                                    type='number'
                                    onChange={handleNumCuentaChange}
                                    value={numCuenta} />
                            </InputsContainer>
                            <InputsContainer style={{ width: "100%" }}>
                                <div className="licencias">
                                    <div className="licenciasInputsFormat1">
                                        <DetailsTitle >
                                            No licencia
                                        </DetailsTitle>
                                        <CardInputs style={{ width: "100%" }}
                                            className="textInputs"
                                            type="text"
                                            onChange={handleNoLicencia}
                                            value={numLicencia} />
                                    </div>
                                    <div className="licenciasInputsFormat2">
                                        <DetailsTitle>
                                            Vigencia
                                        </DetailsTitle>
                                        <div className="dateInputFormat">
                                            <div style={{ width: "45%", background: "white", border: " 0.071793rem solid #727272", borderRadius: "0.215379rem", height: "2.638rem", margin: 0, display: "flex", alignItems: "center" }}>
                                                <DateInput
                                                    //@ts-ignore //@ts-ignore
                                                    wid="6.91rem"
                                                    height="2.638rem"
                                                    wrapperClassName="datepicker"
                                                    dateFormat="YYYY-MM-dd"
                                                    onChange={(date) => { handleVigenciaDeConducirStart(date); }}
                                                    selected={vigencia_conducir_start} />
                                            </div>
                                            <div style={{ width: "45%", background: "white", border: " 0.071793rem solid #727272", borderRadius: "0.215379rem", height: "2.638rem", margin: 0 }}>
                                                <DateInput wrapperClassName="datepicker"
                                                    dateFormat="YYYY-MM-dd"
                                                    onChange={(date) => { handleVigenciaDeConducirEnd(date); }}
                                                    selected={vigencia_conducir_end}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </InputsContainer>

                        </>
                    }
                    {infoTab === "docs" &&
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
                                    onClick={() => {openUploader(false)}}
                                >
                                    <p>{uploaderOpen ? "Ver archivos" : "Subir un archivo"}</p>
                                    <MdFileUpload />
                                </ButtonComponents>
                                <ButtonComponents
                                    background="white"
                                    width="30%"
                                    height="3rem"
                                    color="#0D4E80"
                                    justify="space-between"
                                    onClick={handleMostrarCapacitaciones}
                                >
                                    <p>{mostrarCapacitaciones ? "Documentos" : "Capacitaciones"}</p>
                                </ButtonComponents>
                            </div>
                            {uploaderOpen &&
                                <FileUpload
                                firmaSelected={firmaSelected}
                                onChange={async (e) => {
                                    await uploadImage(e, file_title, esCapacitacion);
                                    fetchDocs(id);
                                }}
                                    onValueChange={handleValueChange}
                                    onDocTypeChange={handleDocTypeChange}
                                />
                            }
                            <FileContainer >

                                {!uploaderOpen  && !mostrarCapacitaciones &&
                                <FileDownloader
                                    onclick={() => { fetchDocumentUrl(FirmaUrl) }}
                                    file_id={0}
                                    triggerFunction={triggerFromChild}
                                    file_url={fileUrl}
                                    file_name={"Firma"}
                                    openUploader={() =>{openUploader(true)}}
                                />
                            }
                                {docs.filter((docs) => docs.es_capacitacion === mostrarCapacitaciones)
                                    .map((docs) => (
                                        !uploaderOpen && (
                                            <FileDownloader
                                                onclick={() => { fetchDocumentUrl(docs?.url ?? "") }}
                                                file_id={docs.id}
                                                triggerFunction={triggerFromChild}
                                                key={docs.id}
                                                file_url={fileUrl}
                                                file_name={docs.nombre as string}
                                            />
                                        )
                                    ))}
                            </FileContainer>
                        </InputsContainer>
                    }
                </ClientCardContainer>
                {responsableExists && (
                    <ResponsableCard updaterPass={updater}
                        onValueChange={handleChildValue}
                        onStateChange={handleChildStateChange}
                    />
                )}

            </BodyContainer>
            <ReturnButton
             onClick={() => window.history.back()}
            >Regresar</ReturnButton>
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
