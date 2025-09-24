import { useState } from "react";
import styled from "styled-components";
import { supabase } from "./utils/ClientSupabase";

type ProfileEditFormProps = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  onCancel: () => void;
};

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: "default" | "outline" }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  ${({ variant }) =>
    variant === "outline"
      ? `
        background: transparent;
        border: 1px solid #d1d5db;
        color: #374151;

        &:hover {
          background: #f3f4f6;
        }
      `
      : `
        background: #2563eb;
        border: none;
        color: white;

        &:hover {
          background: #1d4ed8;
        }
      `}
`;
export default function ProfileEditForm({ user, onCancel }: ProfileEditFormProps) {
  const [name, setName] = useState(user.name || "");

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);

    if (!error) {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Input
        value={name}
        onChange={(e:any) => setName(e.target.value)}
        placeholder="Your name"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
