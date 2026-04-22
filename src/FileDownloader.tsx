import styled from "styled-components";
import { FaFileDownload } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";
import { supabase } from "./utils/ClientSupabase";
import DelModal from "./DeleteModal";
import { useBrandTheme } from "./utils/ThemeContext";

type DownloaderProps = {
    editable?: boolean;
};

const DownloaderContainer = styled.div<DownloaderProps>`
    width: 100%;
    box-sizing: border-box;
    background: ${props => (props.editable ? "#eef3fc" : "white")};
    color: #1a1a1a;
    display: flex;
    align-items: center;
    min-height: 2.75rem;
    justify-content: space-between;
    padding-right: 0.75rem;
    border-radius: 0.4rem;
    border-left: 4px solid ${({ theme }) => theme.primaryColor};
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    gap: 0.5rem;
    .fileIconWrapper {
        display: flex;
        align-items: center;
        padding: 0 0.5rem;
        color: ${({ theme }) => theme.primaryColor};
        flex-shrink: 0;
    }
    .iconsContainer {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-shrink: 0;
    }
    .editorInput {
        flex: 1;
        background: white;
        border: 1px solid ${({ theme }) => theme.primaryColor};
        border-radius: 0.25rem;
        padding: 0.2rem 0.5rem;
        color: black;
        font-size: 0.95rem;
        outline: none;
    }
`;

const FileName = styled.p`
    margin: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.95rem;
`;

type styledDownloaderProps = {
    file_url: string;
    file_name: string;
    file_id: number;
    triggerFunction: () => void;
    onclick?: () => void;
    openUploader?: () => void;
    onDelete?: () => void;
    onReplace?: (file: File) => Promise<void>;
};

const FileDownloader: React.FC<styledDownloaderProps> = props => {
    const { theme } = useBrandTheme();
    const [editorOpen, setEditorOpen] = useState<boolean>(false);
    const [fileNombre, setFileNombre] = useState<string>("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const replaceInputRef = useRef<HTMLInputElement>(null);

    const openEditor = () => {
        setEditorOpen(prev => !prev);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileNombre(event.target.value);
    };

    const editFileName = async () => {
        if (!fileNombre.trim()) {
            openEditor();
            return;
        }
        try {
            const { error } = await supabase
                .from("DocumentosEmpleados")
                .update({ nombre: fileNombre } as any)
                .filter("id", "eq", props.file_id)
                .select();
            openEditor();
            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !props.onReplace) return;
        await props.onReplace(file);
        e.target.value = "";
    };

    return (
        <>
            {deleteConfirmOpen && props.onDelete && (
                <DelModal
                    titulo="¿Seguro que quieres eliminar este documento?"
                    btnText="Eliminar"
                    nombre={props.file_name}
                    closeModal={() => setDeleteConfirmOpen(false)}
                    del={() => {
                        props.onDelete!();
                        setDeleteConfirmOpen(false);
                    }}
                />
            )}
            <input ref={replaceInputRef} type="file" style={{ display: "none" }} onChange={handleReplaceFileChange} />
            <DownloaderContainer editable={editorOpen}>
                <div className="fileIconWrapper">
                    <BsFileEarmarkText size={18} />
                </div>
                {editorOpen ? (
                    <input
                        className="editorInput"
                        type="text"
                        placeholder={props.file_name}
                        autoFocus
                        onChange={handleNameChange}
                        onBlur={async () => {
                            await editFileName();
                            props.triggerFunction();
                        }}
                        onKeyDown={async e => {
                            if (e.key === "Enter") {
                                await editFileName();
                                props.triggerFunction();
                            }
                            if (e.key === "Escape") {
                                openEditor();
                            }
                        }}
                    />
                ) : (
                    <FileName>{props.file_name}</FileName>
                )}
                <div className="iconsContainer">
                    {props.file_name === "Firma" ? (
                        <MdFileUpload
                            size={22}
                            style={{ color: theme.primaryColor, cursor: "pointer" }}
                            onClick={props.openUploader}
                        />
                    ) : (
                        <FaEdit
                            size={19}
                            style={{ color: theme.primaryColor, cursor: "pointer" }}
                            onClick={openEditor}
                        />
                    )}
                    {props.file_name !== "Firma" && props.onReplace && (
                        <FaExchangeAlt
                            size={17}
                            title="Reemplazar archivo"
                            style={{ color: theme.primaryColor, cursor: "pointer" }}
                            onClick={() => replaceInputRef.current?.click()}
                        />
                    )}
                    <FaFileDownload
                        size={19}
                        style={{ color: theme.primaryColor, cursor: "pointer" }}
                        onClick={() => {
                            props.onclick?.();
                        }}
                    />
                    {props.file_name !== "Firma" && props.onDelete && (
                        <RiDeleteBin6Line
                            size={20}
                            style={{ color: "#c1716e", cursor: "pointer" }}
                            onClick={() => setDeleteConfirmOpen(true)}
                        />
                    )}
                </div>
            </DownloaderContainer>
        </>
    );
};

export default FileDownloader;
