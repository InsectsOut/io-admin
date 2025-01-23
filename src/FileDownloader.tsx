import styled from "styled-components"
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdFileUpload } from "react-icons/md";

import { supabase } from "./utils/ClientSupabase";


type DownloaderProps = {
    editable?: boolean

}

const DownloaderContainer = styled.div<DownloaderProps> /*style*/  `
width:95%;
max-width:85%;
background:${props => (props.editable ? "rgb(211,211,211)" : "white")};
color:black;
display:flex;
align-items:center;
height:2rem;
justify-content:space-between;
padding-right:1rem;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
border-radius: 0.25rem;
.iconsContainer{
display:flex;
width:5rem;
justify-content:flex-end;
gap:1rem;
align-items:center;
}
position:relative;
.editorInput{
 background: white;
 border-radius: 0.25rem;
 margin-left:.5rem;
color:black;
 font-size:1rem;

}
`
const FileName = styled.p /*style*/ `
margin:0;
width:100%;
margin-left:.5rem;

`

const EditorContainer = styled.div /*style*/ `
background:red;
position:absolute;
width:100%;
`
type styledDownloaderProps = {
    file_url: string;
    file_name: string;
    file_id: number
    triggerFunction: () => void;
    onclick?: () => void
    openUploader?: () => void


}

const FileDownloader: React.FC<styledDownloaderProps> = (props) => {
    const [editorOpen, setEditorOpen] = useState<boolean>(false)
    const [fileNombre, setFileNombre] = useState<string>("")

    const openEditor = () => {
        setEditorOpen(prev => !prev)
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let cambio = event.target.value;
        setFileNombre(cambio);
    }

    const downloadFile = (url: string) => {
        // if (!editorOpen) {
        //     window.open(url, "_blank"); // Opens the URL in a new tab
        // }
    }

    const editFileName = async () => {
        try {

            let query = supabase
            const { data, error } = await query
                .from("Documentos_empleados")
                .update([
                    {
                        nombre: fileNombre,

                    },
                ] as any)
                .filter("id", "eq", props.file_id)
                .select()
            openEditor();
            if (error) {
                window.alert(`Error al actualizar el dato error`)
                console.log(error)
            }

            //location.reload()
        }

        catch (err) {
            console.error(err)
        }
    }
    return (
        <>
            <DownloaderContainer
                editable={editorOpen}
            >

                {/* {editorOpen && 
                <EditorContainer>
                    <p>Editor de documentos</p>
                    <input
                    placeholder="Nombre del Archivo"
                    />
                </EditorContainer>
            } */}
                {editorOpen &&
                    <>
                        <input
                            className="editorInput"
                            type="text"
                            placeholder={props.file_name}
                            onChange={handleNameChange}
                            onBlur={async () => {
                                try {
                                    await editFileName();
                                    props.triggerFunction();
                                } catch (error) {
                                    // Handle the error
                                    console.error('Error:', error);
                                }
                            }}
                        />
                    </>
                }
                {!editorOpen &&
                    <FileName>{props.file_name}</FileName>
                }
                <div className="iconsContainer">
                    {props.file_name!=="Firma" &&
                    <FaEdit size={25} style={{ color: 'black', cursor: "pointer" }}
                        onClick={openEditor}
                    ></FaEdit>
                }
                 {props.file_name==="Firma" &&
                    <MdFileUpload size={25} style={{ color: 'black', cursor: "pointer" }}
                        onClick={props.openUploader}
                    ></MdFileUpload>
                 }
                    <FaFileDownload
                        onClick={() => {
                            Promise.resolve(props.onclick?.()) // Wrap in Promise to allow `.then()`
                                .then(() => {
                                    downloadFile(props.file_url);
                                });
                        }}
                        size={23}
                        style={{ color: 'black', cursor: "pointer" }}
                    />
                </div>
            </DownloaderContainer>
        </>
    )
}

export default FileDownloader
