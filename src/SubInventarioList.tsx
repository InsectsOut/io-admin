// ✅ SubInventarioList.tsx
import { SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { supabase } from './utils/ClientSupabase';
import { FaPlus } from 'react-icons/fa';
import { CreateButton } from './Servicios';

interface SubInventarioListProps {
  title: string;
  icon: React.ReactNode;
  subinventarios: string[];
  onSelect: (id: string) => void;
  onAdd: (newName: string) => void;
}

const SectionContainer = styled.div`
  width: 95%;
  background-color: #F7F9FB;
  border-radius: 0.5rem;
  box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  margin: 1rem auto;
  font-family: 'Open Sans';
`;

const SectionTitle = styled.h2`
  color: #0D4E80;
  margin-bottom: 1rem;
`;

const EntryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EntryItem = styled.li`
  background: white;
  margin-bottom: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.1);
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #E0E6ED;
  }
`;

const EntryText = styled.span`
  font-size: 1rem;
`;

const EntryIcon = styled.span`
  font-size: 1.5rem;
  color: rgb(14, 78, 126);
`;

const AddForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;
const CreateButt = styled.div`
    
    display: flex;
    color: white !important;
    align-items: center;
    justify-content: center;
    width: 9.625rem;
    min-height: 2.25rem;
    height: 2.25rem;
    background: #0D4E80;
    border-radius: 0.359rem;
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
`;
const AddButton = styled.button`
  background: #0D4E80;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
`;

const SubInventarioList: React.FC<SubInventarioListProps> = ({ title, icon, subinventarios, onSelect, onAdd }) => {
  const [newName, setNewName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
    }
  };

  const createInventario = async (name: string) => {
    const { data, error } = await supabase
      .from('inventarios')
        .insert([{ name }])
      }  

  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <EntryList>
        {subinventarios.map((name) => (
          <EntryItem key={name} onClick={() => onSelect(name)}>
            <EntryText>{name}</EntryText>
            <EntryIcon>{icon}</EntryIcon>
          </EntryItem>
        ))}
      </EntryList>
      <AddForm onSubmit={handleSubmit}>
        <CreateButt
         value={newName}
         onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewName(e.target.value)}
        >
            Nuevo Inventario
        </CreateButt>
      </AddForm>
    </SectionContainer>
  );
};

export default SubInventarioList;
