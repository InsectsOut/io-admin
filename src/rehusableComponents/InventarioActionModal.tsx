import { FormRow, StyledLabel } from "../SubInventarioDetalle";
import { ModalButton, ModalContent, ModalForm, ModalOverlay } from "./CreateInventariosModal";
import { CardInputs as CardInputs2 } from "./CardInputs";
import { StyledSelect } from "./StyledSelect";
import ReactDatePicker from "react-datepicker";
import { Enums, Tables } from "../supabase/Database";
import { useEffect, useState } from "react";
import { supabase } from "../utils/ClientSupabase";

type Productos = Tables<"Productos">;
type InventarioProducos = Tables<"Inventario_productos">;
type Inventarios = Tables<"Inventario">;
type Movimientos = Tables<"Movimientos">;
type GrupoDeMovimientos = Tables<"GrupoDeMovimientos">;

type InventarioProductoEntradas = InventarioProducos & {
    Productos: Productos | null;
};

import { TextAlign } from "./CardInputs";
interface InventarioActionModalProps {
    editable: boolean;
    flag: Enums<"TipoInventario">;
    entryId: number | null;
    stockFromEmpleados: number | null;
    itemId: number | null;
    inventarioEntry: InventarioProducos[] | null;
    stock: number | null;
    lote: string;
    fechaDeCaducidad: Date | null;
    inventarioPrincipalId: number | null;
    closeModal: () => void;
    fetchInventarioProductosConEntradas: () => void;
    fetchInventarioProductosConEntradasPorPrincipal: (singleEntryId: number | null) => void;
    organizacion: string | null;
}

const InventarioActionModal: React.FC<InventarioActionModalProps> = props => {
    const [productoId, setProductoId] = useState<number>(-1);
    const [stock, setStock] = useState<number>(props.stock ?? -1);
    const [productos, setProductos] = useState<Productos[]>([]);
    const [inventarioId, setInventarioId] = useState<number>(
        Number(new URLSearchParams(window.location.search).get("inventarioId"))
    );
    const [inventarioEntry, setInventarioEntry] = useState<InventarioProducos[] | null>(props.inventarioEntry ?? null);
    const [entryId, setEntryId] = useState<number | null>(props.entryId ?? null);
    const [entradasConProductosPrincipal, setEntradasConProductosPrincipal] = useState<InventarioProductoEntradas[]>(
        []
    );
    const [entradasConProductos, setEntradasConProductos] = useState<InventarioProductoEntradas[]>([]);
    const [lote, setLote] = useState<string>(props.lote ?? "");
    const [fechaDeCaducidad, setFechaDeCaducidad] = useState<Date | null>(props.fechaDeCaducidad ?? null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 10;
    const [inventariosPrincipales, setInventariosPrincipales] = useState<Inventarios[] | null>();
    const [inventarioPrincipalId, setInventarioPrincipalId] = useState<number | null>(
        props.inventarioPrincipalId ?? null
    );
    const [itemType, setItemType] = useState<Enums<"TipoItem">>();
    const [cantidad, setCantidad] = useState<number>(1);
    const [itemId, setItemId] = useState<number | null>(props.itemId ?? null);
    const productoSeleccionado = entradasConProductosPrincipal?.find(inv => inv.id === itemId);
    const [stockFromEmpleados, setStockFromEmpleados] = useState<number | null>(props.stockFromEmpleados ?? null);
    const [tecnicoId, setTecnicoId] = useState<number>();

    const nullAllParameters = () => {
        setProductoId(-1);
        setStock(0);
        setInventarioPrincipalId(-1);
        setInventarioEntry(null);
        setFechaDeCaducidad(null);
        setItemId(-1);
        setLote("");
    };
    const handleFechaDeCaducidadChange = (date: Date | null) => {
        setFechaDeCaducidad(date);
    };

    const editEntry = async (
        entryId: number,
        {
            productoId,
            stock,
            lote,
            fechaDeCaducidad,
        }: {
            productoId?: number;
            stock?: number;
            lote?: string;
            fechaDeCaducidad?: string;
        }
    ) => {
        try {
            const updateData: Partial<InventarioProducos> = {};
            if (productoId !== undefined) updateData.producto_id = productoId;
            if (stock !== undefined) updateData.stock = stock;
            if (lote !== undefined) updateData.Lote = lote;
            if (fechaDeCaducidad !== undefined) updateData.fecha_de_caducidad = fechaDeCaducidad;

            const { data, error } = await supabase.from("Inventario_productos").update(updateData).eq("id", entryId);

            if (error) {
                console.error("Error editando inventario:", error);
            } else {
                setProductoId(-1);
                setStock(0);
                props.closeModal();
            }
        } catch (err) {
            console.error("Error editing inventario:", err);
        }
    };

    const fetchSingleEntry = async (entryId: number) => {
        try {
            const { data, error } = await supabase.from("Inventario_productos").select("*").eq("id", entryId);
            nullAllParameters();

            if (error) {
                throw error;
            }

            if (data) {
                setItemId(data[0]?.id ?? -1);
                setInventarioEntry(data);
                setProductoId(data?.[0]?.producto_id ?? productoId);
                setStock(data[0]?.stock);
                setLote(data[0]?.Lote ?? "");
                setInventarioPrincipalId(data[0]?.inventario_id ?? -1);

                const [year, month, day] = data[0]?.fecha_de_caducidad!.split("-").map(Number);
                const formattedDob = new Date(year, month - 1, day);
                setFechaDeCaducidad(formattedDob);
                if (props.flag === "empleado") {
                    return data[0];
                }
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };

    const fetchInventarioProductosConEntradas = async () => {
        try {
            const { data, error, count } = await supabase
                .from("Inventario_productos")
                .select("*, Productos!inner(*)", { count: "exact" })
                .eq("inventario_id", inventarioId)
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;
            setTotalPages(totalPages);
            if (error) {
                throw error;
            }

            if (data) {
                setEntradasConProductos(data);
                return data;
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };

    const consumirDeInventarioPrincipal = async () => {
        try {
            if (!inventarioId) return window.alert("Falta el Inventario destino");
            if (!productoId) return window.alert("Falta el Producto");
            if (!stock) return window.alert("Falta el Stock");
            const grupoMovId  = await createGrupoDeMovimientos([]);

           const firstMovId =  await createMovimiento(
                inventarioPrincipalId!,
                "producto",
                new Date(),
                itemId!,
                cantidad > 1 ? "salida" : "traspaso",
                cantidad < 1 ? cantidad * -1 : cantidad,
                tecnicoId!
            );
            if(!firstMovId) return window.alert("Error al crear el movimiento de salida");
            await createGrupoDeMovimientos([firstMovId],grupoMovId);
          const secondMovId =   await createMovimiento(
                inventarioId!,
                "producto",
                new Date(),
                entryId!,
                cantidad > 1 ? "traspaso" : "salida",
                cantidad < 1 ? cantidad * -1 : cantidad,
                tecnicoId!
            );
            if(!secondMovId) return window.alert("Error al crear el movimiento de entrada");
           await createGrupoDeMovimientos([secondMovId],grupoMovId);
            if (inventarioEntry?.[0] && entryId) {
                await editEntry(inventarioEntry[0].id, {
                    stock: inventarioEntry[0].stock - cantidad,
                });

                // if (inventarioEntry[0].stock - cantidad === 0) {
                //     await deleteInventarioEntry(inventarioEntry[0].id);
                //     return;
                // }

                await editEntry(entryId, {
                    stock: stockFromEmpleados! + cantidad,
                });

                if (stockFromEmpleados! + cantidad === 0) {
                    await deleteInventarioEntry(entryId);
                    //regresarProductoAlnventarioPrincipal(stockFromEmpleados!,stock!,entryId);
                    return;
                }

                await props.fetchInventarioProductosConEntradasPorPrincipal(null);
                await props.fetchInventarioProductosConEntradas();
                await nullAllParameters();
                await props.closeModal();
            }
        } catch (error) {
            console.error("Error during the operation:", error);
            window.alert("Ocurrió un error durante la operación. Revisa la consola.");
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

    const createEntry = async (
        inventarioID: number,
        productoID: number,
        stock: number,
        fechaCad: Date,
        itemDeOrigen: number | null,
        lote: string | null
    ) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .insert([
                    {
                        inventario_id: inventarioID,
                        producto_id: productoID,
                        stock: stock,
                        fecha_de_caducidad: fechaCad.toISOString(),
                        item_de_origen: itemDeOrigen ?? null,
                        Lote: lote,
                    },
                ] as InventarioProducos[])
                .select("*");

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                await setEntryId(data?.[0]?.id ?? null);
                setProductoId(-1);
                setStock(0);
                setLote("");
                setFechaDeCaducidad(null);
                props.closeModal();
                props.fetchInventarioProductosConEntradas();
                return data?.[0];
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
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
                console.error("Error creando movimiento:", error);
            } else {
                setProductoId(-1);
                setStock(0);
                setLote("");
                setFechaDeCaducidad(null);
                props.closeModal();
                return data?.[0].id;
            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    };

    const fetchLotes = async (lotePrincipal: string) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .select("Lote")
                .eq("Lote", lotePrincipal)
                .eq("inventario_id", inventarioId);
            if (data) {
                return true;
            }
        } catch (err) {
            console.error("Error fetching lotes:", err);
        }
    };
    const deleteInventarioEntry = async (entryId: number) => {
        try {
            const { error, data } = await supabase.from("Inventario_productos").delete().eq("id", entryId);
            if (error) {
                console.error("Error trying to delete the entry", error);
            } else {
                if (props.flag === "empleado") {
                    const itemDeOrigen = (await props.itemId) ?? -1;
                    const movGruopoId = await createGrupoDeMovimientos([], null);
                   const firstMovId = await  createMovimiento(
                        inventarioPrincipalId!,
                        "producto",
                        new Date(),
                        entryId,
                        "salida",
                        stockFromEmpleados!,
                        null
                    );
                    if(!firstMovId) return window.alert("Error al crear el movimiento de salida");
                    createGrupoDeMovimientos([firstMovId],movGruopoId);
                    const newEntry = await fetchSingleEntry(itemDeOrigen);
                    const stockOrigen = newEntry?.stock ?? 0;
                    const entradaNuevaId = newEntry?.id ?? -1;
                    const nuevoInventarioPrincipalId = newEntry?.inventario_id ?? -1;

                    await regresarProductoAlnventarioPrincipal(stockFromEmpleados!, stockOrigen!, itemDeOrigen);
                   const secondMovId =  await createMovimiento(
                        nuevoInventarioPrincipalId!,
                        "producto",
                        new Date(),
                        entradaNuevaId!,
                        "traspaso",
                        stockFromEmpleados!,
                        null
                    );if(!secondMovId) return window.alert("Error al crear el movimiento de entrada");
                    await createGrupoDeMovimientos([secondMovId],movGruopoId);
                }
                await fetchInventarioProductosConEntradas();
                await nullAllParameters();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchInventarioProductosConEntradasPorPrincipal = async (singleEntryId: number | null) => {
        try {
            let query = supabase
                .from("Inventario_productos")
                .select("*, Productos!inner(*)")
                .eq("inventario_id", inventarioPrincipalId!);

            if (singleEntryId !== null) {
                query = query.eq("id", singleEntryId);
            }
            const { data, error } = await query;
            if (error) {
                throw error;
            }

            if (data) {
                setEntradasConProductosPrincipal(data);
                return data;
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    };

    const fetchproductos = async () => {
        try {
            const { data, error } = await supabase.from("Productos").select("*");

            if (error) {
                throw error;
            }

            if (data) {
                setProductos(data);
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };
    const fetchInventariosPrincipales = async () => {
        if (inventariosPrincipales) {
            if (inventariosPrincipales?.length > 0) {
                return;
            }
        }

        try {
            const { data, error } = await supabase.from("Inventario").select("*").eq("tipo_inventario", "principal");

            if (error) {
                throw error;
            }

            if (data) {
                setInventariosPrincipales(data);
            } else {
                console.log("No products found.");
            }
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    const regresarProductoAlnventarioPrincipal = async (
        stockFromEmpleados: number,
        stockPrincipal: number,
        entryId: number
    ) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .update({ stock: stockFromEmpleados! + stockPrincipal })
                .eq("id", entryId);
            if (!error) {
                props.fetchInventarioProductosConEntradasPorPrincipal(null);
                props.fetchInventarioProductosConEntradas();
            }
        } catch (error) {
            console.error("Error regresando producto al inventario principal:", error);
        }
    };

    useEffect(() => {
        if (props.flag === "empleado" && inventarioPrincipalId) {
            const fetchData = async () => {
                const entradasDeEmpleado = await fetchInventarioProductosConEntradas();
                console.log(entradasConProductos);
                const invEntradasDePrincipal = await fetchInventarioProductosConEntradasPorPrincipal(null);
                console.log(invEntradasDePrincipal);

                if (!Array.isArray(invEntradasDePrincipal) || !Array.isArray(entradasDeEmpleado)) return;

                const lotesAEliminar = new Set(entradasDeEmpleado.map(item => item.Lote));

                const updated = invEntradasDePrincipal.filter(item => !lotesAEliminar.has(item.Lote));

                if (props.editable) {
                    return;
                } else {
                    setEntradasConProductosPrincipal(updated);
                }
            };

            fetchData();
        }
    }, [inventarioPrincipalId]);

    useEffect(() => {
        if (props.flag === "principal") {
            nullAllParameters();
            fetchproductos();
        }
        if (props.flag === "empleado") {
            fetchproductos();
            fetchInventariosPrincipales();
        }
    }, []);

    // useEffect(()=>{

    // },[])

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>{props.editable ? "Editar Entrada" : "Crear Nueva Entrada"}</h2>
                <ModalForm>
                    {props.flag === "empleado" && (
                        <FormRow>
                            <StyledLabel htmlFor="inventario_id">Inventario Principal</StyledLabel>
                            <StyledSelect
                                name={"inventario_id"}
                                required
                                disabled={props.editable}
                                value={inventarioPrincipalId ?? -1}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setInventarioPrincipalId(+e.target.value);
                                }}
                            >
                                <option value={-1} disabled>
                                    Selecciona un Inventario
                                </option>
                                {inventariosPrincipales?.map(inventario => (
                                    <option key={inventario.id} value={inventario.id}>
                                        {inventario.inv_nombre ?? "Inventario Principal"}
                                    </option>
                                ))}
                            </StyledSelect>
                        </FormRow>
                    )}
                    {props.flag === "principal" && (
                        <FormRow>
                            <StyledLabel htmlFor="producto_id">Producto</StyledLabel>
                            <StyledSelect
                                name="producto_id"
                                value={productoId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProductoId(+e.target.value)}
                            >
                                <option value={-1} disabled>
                                    Selecciona un Producto
                                </option>
                                {productos.map(producto => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </StyledSelect>
                        </FormRow>
                    )}
                    {props.flag === "empleado" && (
                        <FormRow>
                            <StyledLabel htmlFor="producto_id">Producto</StyledLabel>
                            <StyledSelect
                                name="producto_id"
                                required
                                value={itemId}
                                defaultValue={-1}
                                disabled={props.editable}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setItemId(+e.target.value);
                                    if (!itemType) setItemType("producto");
                                    fetchSingleEntry(+e.target.value);
                                    setCantidad(1); // reset quantity when product changes
                                }}
                            >
                                <option value={-1} disabled>
                                    Producto | Lote | Stock
                                </option>
                                {entradasConProductosPrincipal?.map(inventario => (
                                    <option key={inventario.id} value={inventario.id as number}>
                                        Producto: {inventario.Productos?.nombre} | Lote: {inventario.Lote} | Stock:{" "}
                                        {inventario.stock}
                                    </option>
                                ))}
                            </StyledSelect>
                        </FormRow>
                    )}

                    {/* Conditionally show the quantity input if a product is selected */}
                    {productoSeleccionado && (
                        <FormRow>
                            <StyledLabel htmlFor="cantidad">Cantidad (max: {productoSeleccionado.stock})</StyledLabel>
                            <CardInputs2
                                type="number"
                                largo="100%"
                                // @ts-ignore
                                textAlign="center"
                                name="cantidad"
                                min={-stockFromEmpleados!}
                                step="1"
                                max={productoSeleccionado.stock}
                                value={cantidad}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(e.target.value);
                                    const max = productoSeleccionado.stock;
                                    setCantidad(Math.min(value, max));
                                }}
                            />
                        </FormRow>
                    )}
                    {props.flag === "principal" && (
                        <>
                            <FormRow>
                                <StyledLabel htmlFor="stock">Stock</StyledLabel>
                                <CardInputs2
                                    textAlign={TextAlign.Center}
                                    largo="100%"
                                    name="stock"
                                    type="number"
                                    step="1"
                                    placeholder="Ej. 25.5"
                                    value={stock}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setStock(parseFloat(e.target.value))
                                    }
                                />
                            </FormRow>
                            <>
                                <FormRow>
                                    <StyledLabel htmlFor="presentacion_cantidad">Fecha de Caducidad</StyledLabel>

                                    <ReactDatePicker
                                        //@ts-ignore
                                        wrapperClassName="datepicker-wrapper"
                                        className="my-custom-datepicker"
                                        dateFormat="YYYY-MM-dd"
                                        onChange={date => {
                                            handleFechaDeCaducidadChange(date);
                                        }}
                                        selected={fechaDeCaducidad}
                                    ></ReactDatePicker>
                                </FormRow>
                                <FormRow>
                                    <StyledLabel htmlFor="presentacion_cantidad">Lote</StyledLabel>
                                    <CardInputs2
                                        textAlign={TextAlign.Center}
                                        largo="100%"
                                        name="presentacion_cantidad"
                                        type="text"
                                        placeholder="Lote del producto"
                                        value={lote}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLote(e.target.value)}
                                    />
                                </FormRow>
                            </>
                        </>
                    )}
                    <FormRow style={{ justifyContent: "flex-end", gap: "1rem" }}>
                        {props.editable && entryId && props.flag === "principal" && (
                            <ModalButton
                                onClick={() => {
                                    editEntry(entryId, {
                                        stock: stock,
                                        lote: lote,
                                        fechaDeCaducidad: fechaDeCaducidad?.toISOString(),
                                    });
                                    fetchInventarioProductosConEntradas();
                                }}
                                type="button"
                            >
                                Editar Entrada
                            </ModalButton>
                        )}
                        {props.editable && entryId && props.flag === "empleado" && (
                            <ModalButton
                                onClick={() => {
                                    consumirDeInventarioPrincipal();
                                }}
                                type="button"
                            >
                                Editar Entrada
                            </ModalButton>
                        )}
                        {!props.editable && props.flag === "principal" && (
                            <ModalButton
                                onClick={() =>
                                    createEntry(inventarioId, productoId!, stock!, fechaDeCaducidad!, null, lote)
                                }
                                type="button"
                            >
                                Crear Entrada
                            </ModalButton>
                        )}
                        {!props.editable && props.flag === "empleado" && (
                            <ModalButton
                                onClick={async () => {
                                    try {
                                        if (!inventarioId) return window.alert("Falta el Inventario destino");
                                        if (!productoId) return window.alert("Falta el Producto");
                                        if (!stock) return window.alert("Falta el Stock");
                                        if (!fechaDeCaducidad) return window.alert("Falta la Fecha de caducidad");

                                        const grupoMovId = await createGrupoDeMovimientos([], null);
                                        // 1. CREAR MOVIMIENTO DE SALIDA
                                        const firstMovId = await createMovimiento(
                                            inventarioPrincipalId!,
                                            "producto",
                                            new Date(),
                                            itemId!,
                                            "salida",
                                            cantidad,
                                            tecnicoId!
                                        );
                                        if (!firstMovId) {
                                            return window.alert("Error al crear el movimiento de salida");
                                        }
                                        await createGrupoDeMovimientos([firstMovId], grupoMovId);
                                        // 3. CREAR ENTRADA

                                        // 4. ACTUALIZAR STOCK DE LA ENTRADA ORIGINAL
                                        if (inventarioEntry?.[0]) {
                                            const newEntry = await createEntry(
                                                inventarioId,
                                                productoId,
                                                cantidad,
                                                fechaDeCaducidad,
                                                itemId,
                                                inventarioEntry?.[0].Lote
                                            );

                                            // 2. CREAR MOVIMIENTO DE ENTRADA
                                            const secondMovId = await createMovimiento(
                                                inventarioId!,
                                                "producto",
                                                new Date(),
                                                newEntry?.id!,
                                                "traspaso",
                                                cantidad,
                                                tecnicoId!
                                            );
                                            if (!secondMovId) {
                                                return window.alert("Error al crear el movimiento de salida");
                                            }
                                            await createGrupoDeMovimientos([secondMovId], grupoMovId);
                                            await editEntry(inventarioEntry[0].id, {
                                                stock: inventarioEntry[0].stock - cantidad,
                                            });
                                            await props.closeModal();
                                        }
                                    } catch (error) {
                                        console.error("Error durante la operación secuencial:", error);
                                        window.alert("Ocurrió un error durante la operación. Revisa la consola.");
                                    }
                                }}
                            >
                                Confirmar Traspaso
                            </ModalButton>
                        )}

                        <ModalButton onClick={() => props.closeModal()}>Cerrar</ModalButton>
                    </FormRow>
                </ModalForm>
            </ModalContent>
        </ModalOverlay>
    );
};

export default InventarioActionModal;

