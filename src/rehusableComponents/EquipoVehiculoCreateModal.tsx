import { FormRow, StyledLabel } from "../SubInventarioDetalle";
import { ModalButton, ModalContent, ModalForm, ModalOverlay } from "./CreateInventariosModal";
import { CardInputs, CardInputs as CardInputs2 } from "./CardInputs";
import { StyledSelect } from "./StyledSelect";
import ReactDatePicker from "react-datepicker";
import { Database, Enums, Tables } from "../supabase/Database";
import { useEffect, useState } from "react";
import { select, set } from "ts-pattern/dist/patterns";
import { supabase } from "../utils/ClientSupabase";
import Spinner from "./Spinner";
type Equipo = Tables<"Equipos">;
type TipoEstacionDeControl = Database["public"]["Enums"]["estaciondecontrol"];
type TipoEquipoControlOption = Database["public"]["Enums"]["TipoEquipo"];
enum ProductoOption {
    Plaguicidas = "Plaguicidas",
    EquiposDeControl = "Equipos de control",
    Computo="Computo",
    Otros="Otros",
}
interface Props {
    closeModal: () => void;
    editable?: boolean;
    organizacion: string;
    fetchEquipos: () => void;
    equipoId: number | null;
    selectedOption?: ProductoOption;
}

const EquipoCreateModal: React.FC<Props> = ({
    closeModal,
    editable,
    organizacion,
    fetchEquipos,
    equipoId,
    selectedOption,
}) => {
    const [nombreEquipo, setNombreEquipo] = useState<string>("");
    const [tipoEquipoOptions, setTipoEquipoOptions] = useState<{ value: TipoEquipoControlOption; label: string }[]>([
        { value: "bomba_ulv", label: "Bomba de aspersión" },
        { value: "estacion_control", label: "Estación de Control" },
        { value: "termo_nebulizadora", label: "Termo Nebulizadora" },
        { value: "otro", label: "Otro" },
    ]);
    const [tiopoEstacionOptions, setTiopoEstacionOptions] = useState<{ value: TipoEstacionDeControl; label: string }[]>(
        [
            { value: "roedores", label: "Estación de control de roedores" },
            { value: "vectores", label: "Estación de control de vectores" },
            { value: "goma", label: "Trampa de goma" },
        ]
    );
    const [tipoEquipo, setTipoEquipo] = useState<TipoEquipoControlOption>();
    const [tipoEstacion, setTipoEstacion] = useState<TipoEstacionDeControl>();
    const [marca, setMarca] = useState<string>("");
    const [modelo, setModelo] = useState<string>("");
    const [numeroSerie, setNumeroSerie] = useState<string>("");
    const [detalles, setDetalles] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [createButtonDisabled, setCreateButtonDisabled] = useState<boolean>(true);
    // const [imagen, setImagen] = useState<string>("");

    const handleNombreEquipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreEquipo(e.target.value);
    };

    const handleTipoEquipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value as TipoEquipoControlOption;
        setTipoEquipo(value);
    };

    const handleTipoEstacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value as TipoEstacionDeControl;
        setTipoEstacion(value);
    };

    const handleMarcaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMarca(e.target.value);
    };
    const handleModeloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModelo(e.target.value);
    };
    const handleNumeroSerieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumeroSerie(e.target.value);
    };
    const handleDetallesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetalles(e.target.value);
    };

    const fetchSingleEquipo = async (equipoId: number) => {
        try {
            const { data, error, count } = await supabase.from("Equipos").select("*").eq("id", equipoId);
            if (error) {
                throw error;
            }

            if (data) {
                const [equipos] = data;
                setNombreEquipo(equipos?.nombre);
                setTipoEquipo(equipos?.tipo_equipo);
                setMarca(equipos?.marca ?? "");
                setModelo(equipos?.modelo ?? "");
                setNumeroSerie(equipos?.numero_serie ?? "");
                setDetalles(equipos?.detalles ?? "");
                setTipoEstacion(equipos?.estacion_de_control ?? undefined);
                console.log("Equipos fetched successfully:", data);
            } else {
                console.log("No equipos found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    const createEquipo = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from("Equipos").insert([
                {
                    nombre: nombreEquipo,
                    tipo_equipo: tipoEquipo,
                    estacion_de_control: tipoEstacion || null,
                    marca: marca,
                    modelo: modelo,
                    numero_serie: numeroSerie,
                    detalles: detalles,
                    organizacion: organizacion,
                },
            ] as Equipo[]);
            if (error) {
                console.error("Error inserting equipo:", error);
                return null;
            }
            setIsLoading(false);
            console.log("Equipo created:", data);
            closeModal();
            fetchEquipos();
            return data;
        } catch (err) {
            console.error("Unexpected error:", err);
            return null;
        }
    };
    const updateEquipo = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("Equipos")
                .update([
                    {
                        nombre: nombreEquipo,
                        tipo_equipo: tipoEquipo || null,
                        estacion_de_control: tipoEstacion || null,
                        marca: marca,
                        modelo: modelo,
                        numero_serie: numeroSerie,
                        detalles: detalles,
                        organizacion: organizacion,
                    },
                ] as Partial<Equipo>)
                .eq("id", equipoId!);
            if (error) {
                console.error("Error inserting equipo:", error);
                return null;
            }
            setIsLoading(false);
            console.log("Equipo created:", data);
            closeModal();
            fetchEquipos();
            return data;
        } catch (err) {
            console.error("Unexpected error:", err);
            return null;
        }
    };

    const validateForm = (): boolean => {
        if (nombreEquipo === "") return false;
        if (tipoEquipo === undefined) return false;
        if (marca === "") return false;
        if (modelo === "") return false;
        if (numeroSerie === "") return false;
        return true;
    };

    useEffect(() => {
        if (selectedOption === ProductoOption.Computo) {
            setTipoEquipo("computo");
        }
        else if (selectedOption === ProductoOption.Otros){
            setTipoEquipo("otro");
        }
        console.log("Validating form...");
        validateForm() ? setCreateButtonDisabled(false) : setCreateButtonDisabled(true);
    }, [nombreEquipo, tipoEquipo, marca, modelo, numeroSerie]);

    useEffect(() => {
        if (editable && equipoId) {
            fetchSingleEquipo(equipoId);
        }
    }, []);

    return (
        <ModalOverlay>
            <ModalContent>
                <h2 style={{ color: "black" }}>{editable ? "Editar Producto" : "Añadir Equipo"}</h2>
                <ModalForm>
                    <FormRow className="productoModalRows">
                        <StyledLabel htmlFor="EquipoNombre">Nombre del equipo</StyledLabel>
                        <CardInputs
                            largo="100%"
                            placeholder="Nombre del equipo"
                            type="text"
                            required
                            name="EquipoNombre"
                            id="EquipoNombre"
                            autoComplete="off"
                            autoFocus
                            value={nombreEquipo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleNombreEquipoChange(e);
                            }}
                        />
                    </FormRow>
                    {(selectedOption !== ProductoOption.Computo && selectedOption !== ProductoOption.Otros) && (
                        <FormRow className="productoModalRows">
                            <StyledLabel htmlFor="registroCofepris">Tipo de equipo</StyledLabel>
                            <StyledSelect
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    handleTipoEquipoChange(e);
                                }}
                                value={tipoEquipo || ""}
                            >
                                <option style={{ color: "#838383", fontFamily: "Open Sans , sans-serif" }} value="">
                                    Elige el tipo de equipo a registrar
                                </option>
                                {tipoEquipoOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </StyledSelect>
                        </FormRow>
                    )}
                    {tipoEquipo === "estacion_control" && (
                        <FormRow className="productoModalRows">
                            <StyledLabel htmlFor="registroCofepris">Tipo de estación </StyledLabel>
                            <StyledSelect
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    handleTipoEstacionChange(e);
                                }}
                                value={tipoEstacion || ""}
                            >
                                <option style={{ color: "#838383", fontFamily: "Open Sans , sans-serif" }} value="">
                                    Elige el tipo de estación a registrar
                                </option>
                                {tiopoEstacionOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </StyledSelect>
                        </FormRow>
                    )}

                    <FormRow className="productoModalRows">
                        <StyledLabel htmlFor="equipoMarca">Marca</StyledLabel>
                        <CardInputs
                            largo="100%"
                            placeholder="Marca del  equipo"
                            type="text"
                            required
                            name="equipoMarca"
                            id="equipoMarca"
                            autoComplete="off"
                            value={marca}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleMarcaChange(e);
                            }}
                        />
                    </FormRow>

                    <FormRow className="productoModalRows">
                        <StyledLabel htmlFor="equipoModelo">Modelo</StyledLabel>
                        <CardInputs
                            largo="100%"
                            placeholder="Modelo del equipo"
                            type="text"
                            required
                            name="equipoModelo"
                            id="equipoModelo"
                            autoComplete="off"
                            value={modelo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleModeloChange(e);
                            }}
                        />
                    </FormRow>

                    <>
                        <FormRow className="productoModalRows">
                            <StyledLabel htmlFor="numeroSerie">Número de serie</StyledLabel>
                            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Número de serie"
                                    type="text"
                                    required
                                    name="numeroSerie"
                                    id="numeroSerie"
                                    autoComplete="off"
                                    value={numeroSerie}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleNumeroSerieChange(e);
                                    }}
                                />
                            </div>
                        </FormRow>
                        <FormRow className="productoModalRows">
                            <StyledLabel htmlFor="dosisMaxima">Detalles</StyledLabel>
                            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                                <CardInputs
                                    largo="100%"
                                    placeholder="Detalles adicionales"
                                    type="text"
                                    required
                                    name="dosisMaxima"
                                    id="dosisMaxima"
                                    autoComplete="off"
                                    value={detalles}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleDetallesChange(e);
                                    }}
                                />
                            </div>
                        </FormRow>
                    </>
                </ModalForm>
                <div className="modalButtonsContainer">
                    {!editable && (
                        <ModalButton
                            disableFunction={createButtonDisabled}
                            disabled={createButtonDisabled || isLoading}
                            onClick={() => {
                                createEquipo();
                            }}
                            margin="0"
                        >
                            {isLoading ? <Spinner /> : "Añadir Equipo"}
                        </ModalButton>
                    )}
                    {editable && (
                        <ModalButton
                            disabled={createButtonDisabled || isLoading}
                            onClick={() => {
                                updateEquipo();
                            }}
                            margin="0"
                        >
                            {isLoading ? <Spinner /> : "Editar Equipo"}
                        </ModalButton>
                    )}
                    <ModalButton
                        onClick={() => {
                            closeModal();
                        }}
                    >
                        Cerrar
                    </ModalButton>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EquipoCreateModal;

