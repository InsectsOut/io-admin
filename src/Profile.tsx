import { useState } from "react";
import styled from "styled-components";
import { supabase } from "./utils/ClientSupabase";
import ProfileEditForm from "./ProfileEditForm";
import { useEffect } from "react";
import { Tables } from "./supabase/Database";
import Empleados from "./Empleados";

type ProfileProps = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    avatarUrl?: string;
    organizacion: string;
  };
};

type EmpleadosType = Tables<"Empleados">;


// Styled Components
const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 40px auto;
  color: black;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const Email = styled.p`
  color: #4b5563;
  margin: 0;
  font-size: 14px;
`;

const Role = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  margin-top: 12px;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const Button = styled.button<{ variant?: "default" | "destructive" }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;

  background: ${({ variant }) =>
    variant === "destructive" ? "#dc2626" : "#2563eb"};
  color: white;

  &:hover {
    background: ${({ variant }) =>
      variant === "destructive" ? "#b91c1c" : "#1d4ed8"};
  }
`;

export default function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [empleados, setEmpleados] = useState<Empleados[]>([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState(user.organizacion);

  const fetchEmpleados = async () => {
    setLoadingEmpleados(true);
    const { data, error } = await supabase
      .from("Empleados")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) setEmpleados(data);
    setLoadingEmpleados(false);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Handle organization change
  const handleOrgChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrg = e.target.value;
    setSelectedOrg(newOrg);

    // Optionally update the employee's org in Supabase
    const empleado = empleados[0]; // assuming 1:1 user -> empleado
    if (empleado) {
      await supabase
        .from("Empleados")
        .update({ organizacion: newOrg })
        .eq("id", empleado.id);
    }
  };

  // Determine if user is superadmin
  const isSuperAdmin =
    empleados.length > 0 && empleados[0].tipo_rol === "superadmin";

  return (
    <Card>
      <CardContent>
        <Avatar>
          {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : (user.name?.[0] || "U")}
        </Avatar>

        {!isEditing ? (
          <>
            <Name>{user.name || "User"}</Name>
            <Email>{user.email}</Email>
            <Role>Role: {user.role || "Employee"}</Role>

            {/* Show organization selector only if superadmin */}
            {isSuperAdmin && (
              <Select value={selectedOrg} onChange={handleOrgChange}>
                <option value="IOPLEON">IOPLEON</option>
                <option value="IOPQRO">IOPQRO</option>
                <option value="IOPSLP">IOPSLP</option>
                <option value="IOPSTESTING">IOPSTESTING</option>
              </Select>
            )}

            <ButtonRow>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              <Button variant="destructive" onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}>
                Logout
              </Button>
            </ButtonRow>
          </>
        ) : (
          <ProfileEditForm user={user} onCancel={() => setIsEditing(false)} />
        )}
      </CardContent>
    </Card>
  );
}
