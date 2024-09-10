import styled from 'styled-components';

export const StyledForm = styled.form /*style*/`
 
  width:90%;
  border-radius: 5px;
  position:relative;
  top: -1.5rem;
  display:flex;
  flex-direction: column;
  gap:1rem;
  align-items:center;
`

export const StyledLabel = styled.label /*style*/`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;

`

export const StyledInput = styled.input /*style*/`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align:center;
  background-color:white;
  font-weight:lighter;
  color:black;
  
`

export const StyledButton = styled.button /*style*/`
  color: white;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width:100%;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
  }
`

export const StyledAlert = styled.div /*style*/`
  padding: 10px;
  background-color: #f44336;
  color: white;
  margin-top: 10px;
  border-radius: 5px;
`