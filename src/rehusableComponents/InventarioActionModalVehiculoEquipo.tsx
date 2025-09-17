import { FormRow, StyledLabel } from "../SubInventarioDetalle";
import { ModalButton, ModalContent, ModalForm, ModalOverlay } from "./CreateInventariosModal";
import { StyledSelect } from "./StyledSelect";
import { Database, Enums, Tables } from "../supabase/Database";
import { supabase } from "../utils/ClientSupabase";
import { useEffect, useState } from "react";
import { CardInputs } from "./CardInputs";
import { eq } from "@fullcalendar/core/internal-common";
import { TextAlign } from "./CardInputs";
interface Props {
    closeModal: () => void;
    flag: Enums<"TipoInventario">;
    organizacion: string;
}
type Equipo = Tables<"Equipos">;
type TipoDeEquipo = Database["public"]["Enums"]["estaciondecontrol"];

const renderEquipoFields = (equipo: Equipo[]) => {
    const [stock, setStock] = useState<number>(0);
    const [equipoId, setEquipoId] = useState<number | null>();
    const [equipoFuncional, setEquipoFuncional] = useState<boolean>(true);
    const [numSerie, setNumSerie] = useState<string>("");
    const [precioEquipo, setPrecioEquipo] = useState<number>(0);

    const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        setPrecioEquipo(value);
    }


    return (
        <>
            <FormRow>
            <StyledLabel htmlFor="equipoId">Equipo</StyledLabel>
            <StyledSelect name="equipoId" value={equipoId} 
            onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setEquipoId(e.target.value ? parseInt(e.target.value) : null)}>
                <option value="">Selecciona el equipo</option>
                {equipo.map(equipo => (
                <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                </option>
                ))}
            </StyledSelect>
            </FormRow>
            <FormRow>
            <StyledLabel htmlFor="stock">Stock</StyledLabel>
            <CardInputs
                textAlign={TextAlign.Center}
                largo="100%"
                name="stock"
                type="number"
                step="1"
                placeholder="Ej. 25.5"
                value={stock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(parseFloat(e.target.value))}
            />
            </FormRow>
            <FormRow>
            <StyledLabel htmlFor="equipoFuncional">Funcional</StyledLabel>
            <StyledSelect name="equipoFuncional" value={equipoFuncional ? "si" : "no"} onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                if (value === "si") {
                    setEquipoFuncional(true);
                } else if (value === "no") {
                    setEquipoFuncional(false);
                } else {
                    setEquipoFuncional(true); // Default to true if empty
                }
            }}>
                <option value="">Es funcional</option>
                <option value="si">Si</option>
                <option value="no">No</option>
            </StyledSelect>
            </FormRow>
            <FormRow>
            <StyledLabel htmlFor="numSerie">Número de serie</StyledLabel>
            <CardInputs
                textAlign={TextAlign.Center}
                largo="100%"
                name="numSerie"
                type="text"
                placeholder="número de serie"
                value={numSerie}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumSerie(e.target.value)}
            />
            </FormRow>
            <FormRow>
            <StyledLabel htmlFor="precioInput">Precio</StyledLabel>
            <CardInputs
                textAlign={TextAlign.Center}
                largo="100%"
                name="precioInput"
                type="number"
                placeholder="precio del equipo"
                value={precioEquipo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePrecioChange(e)}
            />
            </FormRow>
        </>
    );
};

const InventarioVehiculoEquipoModal: React.FC<Props> = props => {
    const [equipos, setEquipos] = useState<any[]>([]);

    const fetchEquipos = async () => {
        try {
            const { data, error } = await supabase
                .from("Equipos")
                .select("*", { count: "exact" })
                .eq("organizacion", props.organizacion);
            if (error) {
                throw error;
            }

            if (data) {
                console.log("Productos fetched successfully:", data);
                setEquipos(data);
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    useEffect(() => {
        fetchEquipos();
    }, []);

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>{`Nueva entrada de ${props.flag === "equipo" ? "equipo" : props.flag === "vehiculo" ? "vehículo" : ""}`}</h2>
                <ModalForm>
                    {renderEquipoFields(equipos)}
                    <ModalButton
                        margin="0"
                        onClick={() => {
                            props.closeModal();
                        }}
                    >
                        Cerrar
                    </ModalButton>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
    );
};

export default InventarioVehiculoEquipoModal;

