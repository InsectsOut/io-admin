// ✅ SubInventarioDetalle.tsx
import { SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

interface SubInventarioDetalleProps {
  name: string;
  items: string[];
  onAddItem: (item: string) => void;
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
  box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.1);
  color: #333;
`;

const EntryText = styled.span`
  font-size: 1rem;
`;

const AddForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;
const AddInput = styled.input`
  padding: 0.5rem;
  flex: 1;
`;
const AddButton = styled.button`
  background: #0D4E80;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
`;

const SubInventarioDetalle: React.FC<SubInventarioDetalleProps> = ({ name, items, onAddItem }) => {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem("");
    }
  };

  return (
    <SectionContainer>
      <SectionTitle>Contenido de {name}</SectionTitle>
      <EntryList>
        {items.map((item, index) => (
          <EntryItem key={index}>
            <EntryText>{item}</EntryText>
          </EntryItem>
        ))}
      </EntryList>
      <AddForm onSubmit={handleSubmit}>
        <AddInput
          placeholder="Nuevo ítem..."
          value={newItem}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewItem(e.target.value)}
        />
        <AddButton type="submit">
          <FaPlus />
        </AddButton>
      </AddForm>
    </SectionContainer>
  );
};

export default SubInventarioDetalle;
