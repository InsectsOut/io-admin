// Inside PaginationComponent.tsx
import styled from 'styled-components';
import { MdOutlineLastPage } from "react-icons/md";
import { MdFirstPage } from "react-icons/md";

//falta cambiar la pagina a 1 cuando vaya a buscar algo mas 
const NumPaginas = styled.div /*style*/`
width: 10.25rem;
height: 1.732rem;
display:flex;
justify-content:right;
gap:1rem;
@media (max-width: 820px) {
  width:100%;
  justify-content:space-between;
  margin-bottom:1rem;
  background:#F3F3F3;
  border: 1px solid #F3F3F3;
  border-radius:.5rem;
}
`

const PageButt = styled.button /*style*/`
all:unset;
display:flex;
justify-content:center;
align-items:center;
width: 1.8825rem;
height: 1.732rem;
border-radius:.261rem;
background:none;
border: 0.836735px solid #838383;
border-radius: 4.18367px;
:hover{
cursor: pointer;
}
@media (max-width: 820px) {
  justify-content:space-between;
  margin-bottom:1rem;
  background:none;
  border:none;
  height: 1.732rem;
max-height: 1.732rem;
}
`

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const goToPage = (page: number) => {
    onPageChange(page);
  };



  return (
    <NumPaginas>
      <PageButt disabled={currentPage === 1} onClick={() => { goToPage(currentPage - 1); }}><MdFirstPage style={{ color: "#838383" }} size={25} /></PageButt>
      <span style={{ color: '#838383' }}>{currentPage} / {totalPages}</span>
      <PageButt disabled={currentPage === totalPages || totalPages === 0} onClick={() => { goToPage(currentPage + 1); }}><MdOutlineLastPage style={{ color: "#838383" }} size={25} /></PageButt>
      {/* Additional logic for displaying and navigating to specific pages */}
    </NumPaginas>
  );
};

export default PaginationComponent;
