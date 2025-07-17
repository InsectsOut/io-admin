import styled from "styled-components";
import { colors } from "react-select/dist/declarations/src/theme";
import { useEffect, useState } from "react";
import { CardInputs } from "./rehusableComponents/CardInputs";

type styledInputButton = {
    background: string;
};
// Container for the file upload section
const UploadContainer = styled.div /*style*/ `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed #727272;
    border-radius: 8px;
    padding: 20px;
    background-color: #fafafa;
    width: 66%;
    color: #333;
    font-family: Arial, sans-serif;
    position: absolute;
    left: 11%;
    bottom: 5%;
`;

// Title for the section
const Title = styled.h3 /*style*/ `
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
`;

// Message for the file upload instructions
const Message = styled.p /*style*/ `
    font-size: 14px;
    color: #555;
    margin-bottom: 15px;
    text-align: center;
`;

// File input styled to look clean
const FileInput = styled.input /*style*/ `
    display: none;
`;

// Custom label that acts as the clickable button
const FileLabel = styled.label<styledInputButton> /*style*/ `
    background-color: ${props => (props.background ? "gray" : "#4CAF50")};
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => (props.background ? "gray" : "#45a049")};
    }
`;

type UploadProps = {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onValueChange: (value: string) => void;
    onDocTypeChange: (isCapacitacion: boolean) => void; // New prop for the parent callback
    firmaSelected: boolean;
};

const FileUpload: React.FC<UploadProps> = props => {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [nameValue, setNameValue] = useState<string>("");
    const [es_capacitacion, setEs_capacitacion] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setNameValue(newValue);

        props.onValueChange(newValue);
        if (newValue !== "") {
            setDisabled(false);
        }
        if (newValue === "") {
            setDisabled(true);
        }
    };

    const handleDocTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        const valBool = valor === "capacitacion" ? true : false;
        console.log(valor);

        if (valor === "capacitacion") {
            setEs_capacitacion(true);
        } else if (valor === "documento") {
            setEs_capacitacion(false);
        }
        props.onDocTypeChange(valBool);
        console.log(valBool);
    };

    useEffect(() => {
        if (props.firmaSelected) {
            setDisabled(false);
        }
    }, []);

    // Pass the value to the parent component };
    return (
        <UploadContainer style={{ bottom: props.firmaSelected ? "30%" : "5%" }}>
            <Title>{!props.firmaSelected ? "Subir archivo" : "Subir Firma"}</Title>
            {!props.firmaSelected && (
                <>
                    <CardInputs
                        style={{
                            background: "none",
                            width: "85%",
                            color: "black",
                            marginBottom: "1rem",
                        }}
                        type="text"
                        placeholder="Nombra el archivo antes de subirlo"
                        value={nameValue}
                        onChange={handleChange}
                    ></CardInputs>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            background: "none",
                            color: "black",
                            width: "85%",
                        }}
                    >
                        <label style={{ marginBottom: "8px" }}>
                            <CardInputs
                                type="radio"
                                value="capacitacion"
                                name="option"
                                onChange={handleDocTypeChange}
                                style={{
                                    marginRight: "8px",
                                    width: "16px", // Adjust size here
                                    height: "16px", // Adjust size here

                                    // Remove default styling if needed
                                    borderRadius: "50%", // Make it a circle if it's not by default
                                    border: "2px solid black", // Border style for the circle
                                }}
                            />
                            Capacitación
                        </label>
                        <label>
                            <CardInputs
                                type="radio"
                                value="documento"
                                name="option"
                                onChange={handleDocTypeChange}
                                style={{
                                    marginRight: "8px",
                                    width: "16px", // Adjust size here
                                    height: "16px", // Adjust size here  // Remove default styling if needed
                                    borderRadius: "50%", // Make it a circle if it's not by default
                                    border: "2px solid black", // Border style for the circle
                                }}
                            />
                            Documento
                        </label>
                    </div>
                </>
            )}

            <Message>Selecciona o arrastra un archivo</Message>
            <FileInput disabled={disabled} onChange={props.onChange} type="file" id="file-upload" />
            <FileLabel background={disabled} htmlFor="file-upload">
                Elegir archivo
            </FileLabel>
        </UploadContainer>
    );
};

export default FileUpload;
