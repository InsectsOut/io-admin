import styled from "styled-components";

export const StyledSelect = styled.select /*style*/ `
    all: unset;
    appearance: revert; /* 👈 brings back the arrow */

    background: #ffffff;
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
