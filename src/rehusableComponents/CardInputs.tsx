import styled from "styled-components";

 export enum TextAlign {
  Start = 'start',
  End = 'end',
  Left = 'left',
  Right = 'right',
  Center = 'center',
  Justify = 'justify',
  MatchParent = 'match-parent'
}

 type StyledInputProps = {
    largo: string
    textAlign:TextAlign

} 


export const CardInputs = styled.input<{largo:string,  textAlign: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
}> /*style*/`
width:${props => (props.largo ? props.largo : "19.815rem")};
height:2.513rem;
box-sizing: border-box;
max-height:2.513rem;
color:#838383;
display:flex;
border: 0.072rem solid rgb(114, 114, 114);
border-radius:0.215rem;
padding-left:.5rem;
padding-right:.5rem;
background:white;
font-family:"Open Sans", sans-serif;
text-align:${props =>(props.textAlign ? props.textAlign : TextAlign.Left)};
&::placeholder {
    text-align:center

  }
`