import { useEffect, useState } from "react"
import { PestControlData } from "./RegistroData"
import styled from "styled-components"
import { Database, Tables } from "./database-types"
import { supabase } from "./utils/ClientSupabase"
import Modal from "./ModalComponents"

type RegistroAplicacion = Tables<"RegistroAplicacion">

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
transform:scale(1.05);
}
}
p{
text-align:left;
}

.listElement p {
flex-grow:1;
}
 `

interface registrosProps {
    servicioId: number
    openModal: () => void
    sendDataParent: any
}

const RegistrosCard: React.FC<registrosProps> = (props) => {
    const [clicked, setClicked] = useState<boolean>(false)
    const [registros, setRegistros] = useState<RegistroAplicacion[]>([])
    const [modalOpen, setOpen] = useState<boolean>(false)
    const [registroId, setRegistroId] = useState<number>()
    const [servicio_Id, setServicioId] = useState<number>(props?.servicioId ?? -1)

    const fetchRegistros = async () => {
        if (servicio_Id == undefined) {
            return
        }
        try {
            const { data, error } = await supabase
                .from("RegistroAplicacion")
                .select("*")
                // .eq("servicio_id",servicioId)
                .filter("servicio_id", "eq", servicio_Id)
            if (data) {
                setRegistros(data)
            }

            if (error) {
                console.error("Error fetching RegistroAplicacion:", error.message);

            }
        }

        catch (err) {
            console.log(err)
        }
    }

    const handleSetRegistro = (number: number) => {
        setRegistroId(number)
    }

    useEffect(() => {
        if (props?.servicioId !== null) {
            fetchRegistros()
        }
        setServicioId(props?.servicioId)
    }, [props])

    useEffect(() => {
        if (registros.length > 0) {
            setClicked(true)
        }
    }, [registros])

    const handleClick = (number: number) => {
        props.sendDataParent(number);
    }

    return (
        <>


            <RegistroContainer
                clicado={clicked}
                alturaregitro={registros.length}
                className="registrosContainer"
            >
                <div className="topContent"
                    onClick={() => { fetchRegistros(); setClicked(prevState => !prevState); }}
                >
                    <p>Registros</p>
                </div>
                <div className="bottomContent">


                    {registros
                        ?.sort((a, b) => a.id - b.id)
                        .map((data, index) => (
                            <div
                                style={{ width: "100%" }}
                                key={index}
                                className="listElement"
                                onClick={() => {
                                    setRegistroId(data?.id);
                                    handleClick(data?.id);
                                    props.openModal();
                                }}
                            >
                                <p style={{ marginLeft: "1rem", width: "20%" }}>{index + 1}</p>
                                <p style={{ width: "39.5%", textAlign: "left" }}>{data?.area_aplicacion}</p>
                                <p style={{ width: "39.5%", textAlign: "left" }}>{data?.tipo_aplicacion}</p>
                            </div>
                        ))}


                </div>
            </RegistroContainer>
        </>
    )
}

export default RegistrosCard