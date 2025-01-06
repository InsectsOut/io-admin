import styled from "styled-components"

export const CardContainer = styled.div /*style*/`
width: 24.625rem;
min-height:fit-content;
height: 80vh;
background: #F4F4F4;
box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
border-radius: 0.718rem;
margin-left:5.875rem;
padding-left:1.5rem;
padding-top:.75rem;
display:flex;
flex-direction:column;
gap:1rem;
@media (max-width: 900px) {
    margin-left:0;
    width:90%;
    height:fit-content;
    min-height:80vh;
    border-radius: 0.718rem 0.718rem 0 0;
   padding: .75rem 1rem .25rem 1rem;
    input {
    }

  }
`