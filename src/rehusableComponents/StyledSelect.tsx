import styled from "styled-components";

type StyledSelectProps = {
  width?: string

}

export const StyledSelect = styled.select<StyledSelectProps> /*style*/`
  all: unset;
  appearance: revert; /* 👈 brings back the arrow */

  background: #FFFFFF;
  color: #474747;
  height: 2.513rem;
  border: 0.072rem solid #727272;
  border-radius: 0.215rem;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  font-size: 0.9rem;
  width:${props =>(props.width ? props.width : "100%")};
  
  /* Optional: Style for options if needed */
  option {
    background: #FFFFFF;
    color: #474747;
    height: 2.513rem;
    border: 0.072rem solid #727272;
    border-radius: 0.215rem;
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
    font-size: 0.9rem;

    /* Optional: Style for options if needed */
    option {
        background: #ffffff;
        color: #474747;
    }
    @media (max-width: 900px) {
        width: 100%;
    }
`;
