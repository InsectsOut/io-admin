import { FormRow, StyledLabel } from "../SubInventarioDetalle";
import { ModalButton, ModalContent, ModalForm, ModalOverlay } from "./CreateInventariosModal";
import { StyledSelect } from "./StyledSelect";
import { Database, Enums, Tables } from "../supabase/Database";
import { supabase } from "../utils/ClientSupabase";
import { useEffect, useState } from "react";
import { CardInputs } from "./CardInputs";
import { TextAlign } from "./CardInputs";
import { useLocation } from "react-router-dom";
interface Props {
    closeModal: () => void;
    flag: Enums<"TipoInventario">;
    organizacion: string;
    fetchInventarioEquipo: () => void;
    inventarioEquipoEntry: InventarioEquipo | null;
    editable: boolean;
    inventarioTiPoEquipo:Enums<"TipoEquipoOptions"> | undefined
}
type Equipo = Tables<"Equipos">;
type TipoDeEquipo = Database["public"]["Enums"]["estaciondecontrol"];
type InventarioEquipo = Tables<"Inventario_equipos">;
type GrupoDeMovimientos = Tables<"GrupoDeMovimientos">;
type Movimientos = Tables<"Movimientos">;

const renderEquipoFields = (
    equipo: Equipo[],
    stock: number,
    setStock: (n: number) => void,
    equipoId: number | null,
    setEquipoId: (id: number | null) => void,
    equipoFuncional: boolean,
    setEquipoFuncional: (b: boolean) => void,
    numSerie: string,
    setNumSerie: (s: string) => void,
    precioEquipo: number,
    setPrecioEquipo: (n: number) => void,
    inventarioEquipoOptioins:Enums<"TipoEquipoOptions"> | undefined
) => {
    const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        setPrecioEquipo(value);
    };
    const allowedTypes = ["bomba_ulv", "estacion_control", "termo_nebulizadora"];


    return (
        <>
            <FormRow>
                <StyledLabel htmlFor="equipoId">Equipo</StyledLabel>
                <StyledSelect
                    name="equipoId"
                    value={equipoId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEquipoId(e.target.value ? parseInt(e.target.value) : null)
                    }
                >
                    {/* <option value="">Selecciona el equipo</option>
                    {equipo.map(equipo => (
                        <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                        </option>
                    ))} */}
                    <option value="">Selecciona el equipo</option>
                    {inventarioEquipoOptioins ==="Computo" ?  equipo.filter(item => item.tipo_equipo ==="computo").map(item => 
                        <option
                        
                        key={item.id}
                        value={item.id}
                        >
                        {item.nombre}
                        </option>
                    ) : inventarioEquipoOptioins ==="Equipos de control" ? equipo.filter(item => allowedTypes.includes(item.tipo_equipo)).map (item =>
                        <option
                        
                        key={item.id}
                        value={item.id}
                        >
                        {item.nombre}
                        </option>
                     ):inventarioEquipoOptioins === "Otros" ? equipo.filter (item => item.tipo_equipo ==="otro").map(item =>
                        <option
                        
                        key={item.id}
                        value={item.id}
                        >
                        {item.nombre}
                        </option>
                     ):<p>No hay equipo que mostrar</p>}
                  
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
                <StyledSelect
                    name="equipoFuncional"
                    value={equipoFuncional ? "si" : "no"}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        if (value === "si") {
                            setEquipoFuncional(true);
                        } else if (value === "no") {
                            setEquipoFuncional(false);
                        } else {
                            setEquipoFuncional(true); // Default to true if empty
                        }
                    }}
                >
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
    const [stock, setStock] = useState<number>(0);
    const [equipoId, setEquipoId] = useState<number | null>(-1);
    const [equipoFuncional, setEquipoFuncional] = useState<boolean>(true);
    const [numSerie, setNumSerie] = useState<string>("");
    const [precioEquipo, setPrecioEquipo] = useState<number>(0);
    const location = useLocation();
    const queryParams = new URLSearchParams(window.location.search);
    const inventarioIdParam = queryParams.get("inventarioId");
    

    const nullAllParameters = () => {
        setStock(0);
        setEquipoId(null);
        setEquipoFuncional(true);
        setNumSerie("");
        setPrecioEquipo(0);
    };

    useEffect(() => {
        nullAllParameters();

        if (props.inventarioEquipoEntry) {
            console.log("jorgais", props.inventarioEquipoEntry);
            setStock(props.inventarioEquipoEntry.stock);
            setEquipoId(props.inventarioEquipoEntry.equipo_id);
            setEquipoFuncional(props.inventarioEquipoEntry.funcionales!);
            setNumSerie(props.inventarioEquipoEntry.num_de_serie || "");
            setPrecioEquipo(props.inventarioEquipoEntry.precio || 0);
        }
    }, []);

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

    const createInventarioEquipo = async (
        inventarioId: number,
        equipoId: number,
        stock: number,
        funcional: boolean,
        precio: number,
        numSerie: string
    ) => {
        try {
            const { data, error } = await supabase.from("Inventario_equipos").insert({
                inventario_id: inventarioId,
                equipo_id: equipoId,
                stock: stock,
                funcionales: funcional,
                precio: precio,
                num_de_serie: numSerie,
            } as InventarioEquipo).select("*");

            if (error) {
                throw error;
            }
           
                console.log("Inventario de equipo creado:", data);
                props.fetchInventarioEquipo();
                props.closeModal();
                if (data) {
                    return data[0].id
                }

        } catch (error) {
            console.error("Error creando inventario de equipo:", error);
        }
    };

    const updateInventario = async (
        flag: Enums<"TipoInventario">,
        equipoId: number,
        stock: number,
        funcional: boolean,
        precio: number,
        numSerie: string
    ) => {
        try {
            if (flag === "equipo") {
                if (props.inventarioEquipoEntry) {
                    const { data, error } = await supabase
                        .from("Inventario_equipos")
                        .update({
                            equipo_id: equipoId,
                            stock: stock,
                            funcionales: funcional,
                            precio: precio,
                            num_de_serie: numSerie,
                        })
                        .eq("id", props.inventarioEquipoEntry?.id);
                    if (error) {
                        throw error;
                    }
                   
                        console.log("Inventario de equipo actualizado:", data);
                        props.fetchInventarioEquipo();
                        props.closeModal();
                  
                }
                else {
                    window.alert("No existe el equipo que se quiere actualizar")
                    return
                }
            }
            if (flag === "vehiculo") {
            }
        } catch (err) {
            console.log(err);
        }
    };

     const createGrupoDeMovimientos = async (movimientoIds?: number[] | null, grupoId?: number | null) => {
            try {
                let existingIds: number[] = [];
    
                // If we already have a group, fetch its current movimientos_id
                if (grupoId) {
                    const { data: existing, error: fetchError } = await supabase
                        .from("GrupoDeMovimientos")
                        .select("movimientos_id")
                        .eq("id", grupoId)
                        .single();
    
                    if (fetchError) {
                        console.error("Error fetching existing group:", fetchError);
                        return null;
                    }
    
                    if (existing?.movimientos_id) {
                        existingIds = existing.movimientos_id;
                    }
                }
    
                // Merge old + new (avoid duplicates)
                const mergedIds = [...new Set([...(existingIds || []), ...(movimientoIds || [])])];
    
                // Upsert with merged IDs
                const { data, error } = await supabase
                    .from("GrupoDeMovimientos")
                    .upsert([
                        {
                            ...(grupoId !== undefined && grupoId !== null && { id: grupoId }),
                            movimientos_id: mergedIds,
                            organizacion: props.organizacion,
                        },
                    ] as GrupoDeMovimientos[])
                    .select("id");
    
                if (error) {
                    console.error("Error in upsert:", error);
                    return null;
                }
    
                return data?.[0]?.id ?? null;
            } catch (err) {
                console.error("Exception:", err);
                return null;
            }
        };

        const createMovimiento = async (
                inventarioID: Number,
                itemType: Enums<"TipoItem">,
                fecha: Date,
                ItemID: number,
                type: Enums<"TipoMovimiento">,
                quanity: number,
                tecnicoID: number | null = null
            ) => {
                try {
                    const { data, error } = await supabase
                        .from("Movimientos")
                        .insert([
                            {
                                inventario_id: inventarioID,
                                item_type: itemType,
                                date: fecha.toISOString(),
                                item_id: ItemID,
                                type: type,
                                quantity: quanity,
                                tecnico_id: tecnicoID,
                                organizacion: props.organizacion,
                            },
                        ] as Movimientos[])
                        .select("*");
        
                    if (error) {
                        console.error("Error creando inventario:", error);
                    } else {
                        console.log("Inventario creado:", data);
                        return data?.[0].id;
                    }
                } catch (err) {
                    console.error("Error creating inventario:", err);
                }
            };

   const inventarioEquipoFlujo = async () => {
    try {

        createInventarioEquipo(
            +inventarioIdParam!,
            equipoId!,
            stock,
            equipoFuncional,
            precioEquipo,
            numSerie
        ).then(async (res) => {
            if (res) {
                const movimientoId = await createMovimiento(
                    +inventarioIdParam!,
                    props.flag === "equipo" ? "equipo" : props.flag === "vehiculo" ? "vehiculo" : "equipo",
                    new Date(),
                    res,
                    "entrada",
                    stock,
                    null
                );
                // if (movimientoId) {
                //     createGrupoDeMovimientos([movimientoId], null);
                // }
            }
        });

    }
    catch(err){

    }

   }

    useEffect(() => {
        fetchEquipos();
    }, []);

    return (
        <ModalOverlay>
            <ModalContent>
                {!props.editable && (
                    <h2>{`Nueva entrada de ${props.flag === "equipo" ? "equipo" : props.flag === "vehiculo" ? "vehículo" : ""}`}</h2>
                )}
                {props.editable && (
                    <h2>{`Editar entada de ${props.flag === "equipo" ? "equipo" : props.flag === "vehiculo" ? "vehículo" : ""}`}</h2>
                )}
                <ModalForm>
                    {renderEquipoFields(
                        equipos,
                        stock,
                        setStock,
                        equipoId,
                        setEquipoId,
                        equipoFuncional,
                        setEquipoFuncional,
                        numSerie,
                        setNumSerie,
                        precioEquipo,
                        setPrecioEquipo,
                        props.inventarioTiPoEquipo
                    )}
                    <FormRow>
                        <ModalButton
                            margin="0"
                            onClick={() => {
                                props.closeModal();
                            }}
                        >
                            Cerrar
                        </ModalButton>
                        {!props.editable && (
                            <ModalButton
                                margin="0"
                                onClick={() => {
                                    inventarioEquipoFlujo()
                                     
                                }}
                            >
                                Crear entrada
                            </ModalButton>
                        )}
                        {props.editable && (
                            <ModalButton
                                margin="0"
                                onClick={() => {
                                    updateInventario(
                                        props.flag,
                                        equipoId!,
                                        stock,
                                        equipoFuncional,
                                        precioEquipo,
                                        numSerie
                                    );
                                }}
                            >
                                Editar entrada entrada
                            </ModalButton>
                        )}
                    </FormRow>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
    );
};

export default InventarioVehiculoEquipoModal;

