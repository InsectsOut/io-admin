import styled from "styled-components";

export const CreateButton = styled.div`
    display: flex;
    color: white !important;
    align-items: center;
    justify-content: center;
    width: 9.625rem;
    min-height: 2.25rem;
    height: 2.25rem;
    background: #0d4e80;
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
    width: 30%;
    box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
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

export const ModalButton = styled.button`
    background: #0d4e80;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 1rem;
`;
