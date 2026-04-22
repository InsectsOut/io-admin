import styled from "styled-components";

export const CreateButton = styled.div`
    display: flex;
    color: white !important;
    align-items: center;
    justify-content: center;
    width: 9.625rem;
    min-height: 2.25rem;
    height: 2.25rem;
    background: ${({ theme }) => theme.primaryColor};
    border-radius: 0.359rem;
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 55%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);

    @media (max-width: 1100px) {
        width: 75%;
    }

    @media (max-width: 900px) {
        width: 92%;
        padding: 1.25rem;
    }
`;

export const ModalForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ModalInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
`;

export const ModalButton = styled.button<{ margin?: string; disableFunction?: boolean }>`
    /* background: #0d4e80; */
    background: ${props => (props.disableFunction ? "#a0a0a0" : props.theme.primaryColor)};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin: ${props => props.margin ?? "1rem"};
`;
