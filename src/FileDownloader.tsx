import styled from "styled-components"
import { FaFileDownload } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



const DownloaderContainer = styled.div /*style*/ `
width:95%;
max-width:85%;
background:white;
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
`
const FileName = styled.p /*style*/ `
margin:0;
width:100%;
margin-left:.5rem;

`
type styledDownloaderProps = {
    file_url: string;
    file_name:string;

}

const FileDownloader: React.FC<styledDownloaderProps> = (props) => {
    
    const downloadFile = (url:string) =>{
        window.location.href = url;
    }
    return (
        <>
            <DownloaderContainer >
                <FileName>{props.file_name}</FileName>
                <div className="iconsContainer">
                <FaEdit size={25} style={{ color: 'black' , cursor:"pointer"}}></FaEdit>
                < FaFileDownload onClick={()=>{downloadFile(props.file_url)}} size={23}  style={{ color: 'black' , cursor:"pointer"}}></FaFileDownload>
                </div>
            </DownloaderContainer>
        </>
    )
}

export default FileDownloader
