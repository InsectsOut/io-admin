import styled from "styled-components";

type StyledInputProps = {
    largo?: string;
};

export const CardInputs = styled.input<StyledInputProps> /*style*/ `
    width: ${props => (props.largo ? props.largo : "19.815rem")};
    height: 2.513rem;
    box-sizing: border-box;
    max-height: 2.513rem;
    color: #838383;
    display: flex;
    border: 0.072rem solid rgb(114, 114, 114);
    border-radius: 0.215rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    background: white;
    font-family: "Open Sans", sans-serif;
    &::placeholder {
        text-align: center;
    }
`;
