import { useEffect, useState } from "react"
import { PestControlData } from "./RegistroData"
import styled from "styled-components"
import { Database, Tables } from "../src/supabase/Database"
import { supabase } from "./utils/ClientSupabase"
import Modal from "./ModalComponents"
import { useNavigate } from "react-router-dom"

type RegistroAplicacion = Tables<"RegistroAplicacion">
type Servicios = Tables<"Servicios">

const RegistroContainer = styled.div<{ clicado?: boolean, alturaregitro: number }> /*style*/ `
width:53%;
height: ${props => (props.clicado ? `${(props.alturaregitro * 3.5) + 5}rem` : '5%')};
max-height:60vh;
background:#F4F4F4;
border-radius: 0.7179rem;
margin-top:2rem;
transition: all 0.3s ease-in-out;
box-shadow: ${props => (props.clicado ? "0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25)" : "none")};
.topContent{
width:100%;
background:#0D4E80;
border-radius:1rem;
content:"";
height:2.429rem;
display:flex;
align-items:center;
justify-content:center;
:hover{
cursor: pointer;
}
p{
margin:0;
}
}
.bottomContent{
:hover{
color:#2395FF
}
transition: all 0.3s ease-in-out;
overflow-y:scroll;
height: ${props => (props.alturaregitro * 3.5) + 1}rem;
max-height: 50vh;

ul{
transition: all 0s ease-in-out;

height: ${props => (props.clicado ? "auto" : "0")};
box-shadow: ${props => (props.clicado ? "0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25)" : "none")};


}
li{

 transition: all 0.1s ease-in-out;
width:${props => (props.clicado ? "100%" : "0")};
font-size:${props => (props.clicado ? "100%" : "0")};

}
}
.listElement{
transition: all 0.1s ease-in-out;
display:flex;
font-size:${props => (props.clicado ? "100%" : "0")};
justify-content:space-evenly;
color: ${props => (props.clicado ? "black" : "none")};
box-shadow: ${props => (props.clicado ? "0px 0.1rem 0.1rem rgba(0, 0, 0, 0.25)" : "none")};
width:100%;
:hover{
cursor: pointer;
}
}
p{
text-align:left;
}

.listElement p {
flex-grow:1;
}

@media (max-width: 900px) {
    .topContent{
    display:none;
    }
    .bottomContent{
    overflow-x:hidden;
    }
width:100%;
height:53vh;    
}
 `

interface registrosProps {
    servicioId: number
    openModal: () => void
    title?:string | null
}
  
const GrupoServiciosCard: React.FC<registrosProps> = (props) => {
    const [clicked, setClicked] = useState<boolean>(false)
    const [servicios_del_grupo, set_servicios_del_grupo] = useState<number[] | null>([])
    const [modalOpen, setOpen] = useState<boolean>(false)
    const [registroId, setRegistroId] = useState<number>()
    const [servicio_Id, setServicioId] = useState<number>(props?.servicioId ?? -1)
    const [servicios,setServicios] = useState<Servicios[]>([])
    const navigate = useNavigate()

    const fetchRegistros = async () => {
        if (servicio_Id == undefined) {
            return
        }
        try {
            const { data, error } = await supabase
                .from("Servicios")
                .select(`grupo_de_servicios,GruposDeServicios!inner("servicios_id")`)
                .filter("id", "eq", servicio_Id)
            if (data) {
               console.log(data[0]?.GruposDeServicios?.servicios_id)
                let servicios = data[0]?.GruposDeServicios?.servicios_id
                set_servicios_del_grupo(servicios ?? [])
                return servicios
            }

            if (error) {
                console.error("Error fetching RegistroAplicacion:", error.message);

            }
        }

        catch (err) {
            console.log(err)
        }
    }

    const fetchServiciosInfo = async (servicios_grupo:number[]) => {
        try {
            const {data,error} = await supabase
            .from("Servicios")
            .select("*")
            .in("id", servicios_grupo as number[]);

            if (data){
            console.log(data)
            setServicios(data)
            }
            if (error){
                console.log(error)
            }
        }

       

        catch(err){
            console.error(err)
        }
    }
 

    const handleSetRegistro = (number: number) => {
        setRegistroId(number)
    }

    useEffect(() => {
        if (props?.servicioId !== null) {
            
            fetchRegistros().then((registros)=>{fetchServiciosInfo(registros ?? [])})
        }
        setServicioId(props?.servicioId)
    }, [props])

    // useEffect(() => {
    //     fetchServiciosInfo()
    // }, [])

    useEffect(()=>{
        set_servicios_del_grupo(servicios_del_grupo)
    },[servicios_del_grupo])


    return (
        <>


            <RegistroContainer
                clicado={clicked}
               // alturaregitro={registros.length}
                className="registrosContainer"
            >
                <div className="topContent"
                    onClick={() => { fetchRegistros(); setClicked(prevState => !prevState); }}
                >
                    <p>{props.title ? props.title : "Registros"}</p>
                </div>
                <div className="bottomContent">


                    {servicios
                    ?.sort((a, b) => a.id - b.id)
                    ?.map((data, index) => (
                            <div
                                style={{ width: "100%" }}
                                key={index}
                                className="listElement"
                                onClick={() => {
                                    navigate(`/Servicios/${data?.folio}`)
                                    location.reload()
                                }}
                            >
                                <p style={{ marginLeft: "1rem", width: "20%" }}>Folio:</p>
                                <p style={{ width: "39.5%", textAlign: "left" }}>{data?.folio < 0 ? `FT-${data?.folio * -1}` : data?.folio}</p>
                                <p style={{ width: "39.5%", textAlign: "left" }}>{data?.fecha_servicio}</p>
                                <p style={{ width: "39.5%", textAlign: "left" }}>{data?.realizado ? "Realizado" : "No realizado"}</p>
                                
                            </div>
                        ))}


                </div>
            </RegistroContainer>
        </>
    )
}

export default GrupoServiciosCard