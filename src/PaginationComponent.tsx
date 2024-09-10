// Inside PaginationComponent.tsx
import styled from 'styled-components';
import { MdOutlineLastPage } from "react-icons/md";
import { MdFirstPage } from "react-icons/md";

//falta cambiar la pagina a 1 cuando vaya a buscar algo mas 
const NumPaginas = styled.div`
position: absolute;
width: 10.25rem;
top:51rem;
height: 1.732rem;
display:flex;
justify-content:left;
gap:1rem;
`

const PageButt = styled.button`
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
