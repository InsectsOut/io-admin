import styled from "styled-components";

const ConfirmationModal = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgb(0, 0, 0, 0.7);
    top: 0;
    right: 0%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    position: relative;
    width: 50%;
    max-width: 50%;
    height: auto;
    background: #f4f4f4;
    box-shadow: 0px 4.59475px 4.59475px rgba(0, 0, 0, 0.25);
    border-radius: 0.718rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.75rem;
    gap: 1.5rem;
    color: white;
    text-align: center;
    justify-content: center;
`;

const CloseButton = styled.div`
    width: 9.46px;
    height: 9.46px;
    color: #727272;
    position: absolute;
    top: 20px;
    right: 20px;
    font-weight: bolder;
    &:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
`;

const Titulo = styled.h1`
    font-style: normal;
    color: black;
    font-weight: 700;
    font-size: 1.436rem;
    line-height: 1.875rem;
    text-align: center;
    margin: 0;
`;

const Mensaje = styled.p`
    height: auto;
    margin: 0;
    font-style: normal;
    font-weight: 500;
    font-size: 0.9375rem;
    line-height: 1.25rem;
    text-align: center;
    color: #838383;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    width: 100%;
`;

const Button = styled.button<{ variant?: "confirm" | "cancel" }>`
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: fit-content;
    min-height: 2.25rem;
    height: 2.25rem;
    padding: 0 1rem;
    background: ${props => (props.variant === "cancel" ? "#999" : props.theme.secondaryColor)};
    border-radius: 0.359rem;
    font-style: normal;
    font-weight: 700;
    font-size: 1.005rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        filter: brightness(0.85);
        transform: scale(1.05);
    }
`;

interface ConfirmationModalProps {
    isOpen: boolean;
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
    onCancel: () => void;
    btnConfirmText?: string;
    btnCancelText?: string;
}

const ConfirmModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    titulo,
    mensaje,
    onConfirm,
    onCancel,
    btnConfirmText = "Confirmar",
    btnCancelText = "Cancelar",
}) => {
    if (!isOpen) return null;

    return (
        <ConfirmationModal>
            <ModalContent>
                <CloseButton onClick={onCancel}>X</CloseButton>
                <Titulo>{titulo}</Titulo>
                <Mensaje>{mensaje}</Mensaje>
                <ButtonContainer>
                    <Button variant="cancel" onClick={onCancel}>
                        {btnCancelText}
                    </Button>
                    <Button variant="confirm" onClick={onConfirm}>
                        {btnConfirmText}
                    </Button>
                </ButtonContainer>
            </ModalContent>
        </ConfirmationModal>
    );
};

export default ConfirmModal;

