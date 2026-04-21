import { useEffect, useState } from "react";
import { PestControlData } from "./RegistroData";
import styled from "styled-components";
import { Database, Enums, Tables } from "../src/supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import DelModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ConfirmModal from "./rehusableComponents/ConfirmationModal";
import { useToast } from "./rehusableComponents/Toast";

type RegistroAplicacion = Tables<"RegistroAplicacion">;
type RegistroConProducto = Tables<"RegistroAplicacion"> & {
    Productos: Tables<"Productos"> | null;
    Inventario_productos: Tables<"Inventario_productos">[] | null;
};

const RegistroContainer = styled.div<{ clicado?: boolean; alturaregitro: number }> /*style*/ `
    position: "relative";
    width: 100%;
    height: ${props => (props.clicado ? `${props.alturaregitro * 3.5 + 10}rem` : "5%")};
    max-height: 60vh;
    background: #f4f4f4;
    border-radius: 0.7179rem;
    margin-top: 2rem;
    transition: all 0.3s ease-in-out;
    box-shadow: ${props => (props.clicado ? "0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25)" : "none")};
    .topContent {
        width: 100%;
        background: #0d4e80;
        border-radius: 1rem;
        content: "";
        height: 2.429rem;
        display: flex;
        align-items: center;
        justify-content: center;
        :hover {
            cursor: pointer;
        }
        p {
            margin: 0;
        }
    }
    .bottomContent {
        :hover {
            color: #646cff;
        }
        transition: all 0.3s ease-in-out;
        overflow-y: scroll;
        height: ${props => props.alturaregitro * 3.5 + 5}rem;
        max-height: 50vh;

        ul {
            transition: all 0s ease-in-out;

            height: ${props => (props.clicado ? "auto" : "0")};
            box-shadow: ${props => (props.clicado ? "0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25)" : "none")};
        }
        li {
            transition: all 0.1s ease-in-out;
            width: ${props => (props.clicado ? "100%" : "0")};
            font-size: ${props => (props.clicado ? "100%" : "0")};
        }
    }
    .listElement {
        transition: all 0.1s ease-in-out;
        display: flex;
        font-size: ${props => (props.clicado ? "100%" : "0")};
        justify-content: space-evenly;
        color: ${props => (props.clicado ? "black" : "none")};
        box-shadow: ${props => (props.clicado ? "0px 0.1rem 0.1rem rgba(0, 0, 0, 0.25)" : "none")};
        width: 100%;
        :hover {
            cursor: pointer;
        }
    }
    p {
        text-align: left;
    }

    .listElement p {
        flex-grow: 1;
    }

    @media (max-width: 900px) {
        transition: none;
        width: 100%;
        height: auto;
        max-height: none;

        .topContent {
            display: none;
        }
        .bottomContent {
            transition: none;
            overflow-x: hidden;
            overflow-y: visible;
            height: auto;
            max-height: none;

            ul {
                height: auto;
            }
            li {
                width: 100%;
                font-size: 100%;
            }
        }
        .listElement {
            transition: none;
            font-size: 100%;
            color: black;
        }
    }

    .deleteButton {
        all: unset;
        display: flex;
        font-weight: bolder;
        color: white !important;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: #c1716e;
        border-radius: 10%;
        height: 100%;
        margin-right: 1rem;
        &:hover {
            cursor: pointer;
            transform: scale(1.15);
        }
    }
`;

interface registrosProps {
    servicioId: number;
    openModal?: () => void;
    //sendDataParent?: any;
    title?: string | null;
}

const PlaguicidasCard: React.FC<registrosProps> = props => {
    const [clicked, setClicked] = useState<boolean>(false);
    const [registros, setRegistros] = useState<RegistroConProducto[]>([]);
    const [modalOpen, setOpen] = useState<boolean>(false);
    const [registroId, setRegistroId] = useState<number>();
    const [servicio_Id, setServicioId] = useState<number>(props?.servicioId);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [cantidadUsada, setCantidadUsada] = useState<number>(0);
    const [cantidades, setCantidades] = useState<Record<number, number>>({});
    const navigate = useNavigate();
    const { folio } = useParams();
    const { showToast } = useToast();
    const [enableConfirm, setEnableConfirm] = useState<boolean>(false);
    const [disableInputs, setDisableInputs] = useState<boolean>(false);

    const getRegistroFromQuery = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const registro = urlParams.get("plaguicida");
        if (registro) {
            return registro;
        }
    };

    const openModal = (e: React.MouseEvent, registroId: number) => {
        e.stopPropagation();

        // Get the current URL and update the params
        const url = new URL(window.location.href);
        url.searchParams.set("registro", registroId.toString());

        // Update the URL without navigation
        window.history.replaceState({}, "", url);

        // Open the modal
        setOpenDeleteModal(true);
    };

    const fetchRegistros = async () => {
        if (!props?.servicioId || registros.length > 0) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from("RegistroAplicacion")
                .select(
                    `
        *,
        Productos(*),
        Inventario_productos(*)
      `
                )
                .eq("servicio_id", props.servicioId);

            if (error) {
                console.error("Error fetching RegistroAplicacion:", error.message);
                return;
            }

            if (data) {
                console.log("Registros con productos:", data);
                const formattedData = data.map(item => ({
                    ...item,
                    Inventario_productos: item.Inventario_productos ? [item.Inventario_productos] : null,
                }));
                setRegistros(formattedData);

                if (formattedData[0]?.cantidad_usada) {
                    setCantidadUsada(formattedData[0].cantidad_usada);
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    const FetchWasUsedFromServicio = async () => {
        try {
            const { data, error } = await supabase
                .from("Servicios")
                .select("was_used")
                .filter("folio", "eq", `${folio}`)
                .filter("organizacion", "eq", localStorage.getItem("org"))
                .single();

            if (error) {
                console.error("Error fetching 'was_used' from Servicios:", error.message);
                return false;
            }
            if (data) {
                return data.was_used;
            }
        } catch (err) {
            console.error("Unexpected error fetching 'was_used':", err);
            return false;
        }
    };

    const updateServicioWasUsed = async (servicioId: number) => {
        try {
            const { data, error } = await supabase
                .from("Servicios")
                .update({ was_used: true })
                .eq("id", servicioId)
                .select("*");

            if (error) {
                console.error("Error updating 'was_used' in Servicios:", error.message);
                return;
            }

            if (data) {
                console.log("'was_used' updated to true for servicio ID", servicioId);
            }
        } catch (err) {
            console.error("Unexpected error updating 'was_used':", err);
        }
    };
    const handleCantidadRegistroChange = async (registroId: number, newCantidad: number) => {
        try {
            const { data, error } = await supabase
                .from("RegistroAplicacion")
                .update({ cantidad_usada: newCantidad })
                .eq("id", registroId)
                .select("*");

            if (error) {
                console.error("Error updating cantidad usada:", error.message);
                return;
            }
            if (data) {
                console.log("Updated cantidad usada for registro ID", registroId, "to", newCantidad);
            }
        } catch (err) {
            console.error("Error updating cantidad usada: in registro", err);
        }
    };

    useEffect(() => {
        if (props?.servicioId !== null) {
            fetchRegistros();
        }
    }, [props]);

    useEffect(() => {
        if (registros.length > 0) {
            setClicked(true);
        }
    }, [registros]);

    useEffect(() => {
        const checkIfServicioWasUsed = async () => {
            const wasUsed = await FetchWasUsedFromServicio();

            if (!wasUsed) return;

            setEnableConfirm(false);
            setDisableInputs(true);
        };
        checkIfServicioWasUsed();
    }, []);

    // const handleClick = (number: number) => {
    //     props.sendDataParent(number);
    // };

    const deleteRegistros = async (servicioId: string) => {
        try {
            let query = supabase.from("RegistroAplicacion").delete().eq("id", servicioId);

            const { error, data: registros } = await query;

            if (error) {
                console.log("Error borrando el registro de aplicación ", error);
            }
            if (!error) {
                navigate(`/Servicios/${folio}`);
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchInventraioProductos = async (idsProductosRows: number) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .select("*")
                .eq("inventario_id", idsProductosRows);

            if (error) {
                console.log("Error fetching inventario productos:", error);
            }
            if (data) {
                console.log("Inventario productos:", data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.table(registros);
        if (!registros.length) return;

        const cantidadesIniciales: Record<number, number> = {};

        registros.forEach(registro => {
            cantidadesIniciales[registro.id] = registro.cantidad_usada ?? 0;
        });

        setCantidades(cantidadesIniciales);
    }, [registros]);

    const generarMovimientoInventario = async (
        registro: RegistroConProducto,
        cantidad: number
        //item_type: Enums<"item_type">
    ) => {
        try {
            const { data, error } = await supabase.from("Movimientos").insert({
                item_type: "producto",
                inventario_id: registro.inventario_id ?? 0,
                quantity: cantidad,
                type: "servicio",
                servicio_id: props.servicioId ?? 0,
                item_id: registro.inventario_producto_id ?? 0,
                date: new Date().toISOString(),
                organizacion: localStorage.getItem("org") ?? undefined,
            });

            if (error) {
                console.error("Error generando movimiento de inventario:", error.message);
            } else {
                console.log("Movimiento de inventario generado:", data);
            }
        } catch (err) {
            console.error("Error generando movimiento de inventario:", err);
        }
    };

    const handleConfirmConsumption = async () => {
        const registrosActualizados = registros.map(registro => ({
            ...registro,
            cantidad_usada: cantidades[registro.id] ?? registro.cantidad_usada ?? 0,
        }));

        try {
            for (const registro of registrosActualizados) {
                if (registro.cantidad_usada > 0) {
                    await generarMovimientoInventario(registro, registro.cantidad_usada);
                }
            }
            setEnableConfirm(false);
            setOpen(false);
        } catch (err) {
            console.error("Error saving consumption:", err);
        }
    };

    const restInventarioProductos = async (registro: RegistroConProducto, cantidad: number, stock: number) => {
        try {
            const inventarioProductoId = registro.inventario_producto_id;
            let cantidadGastada = cantidad;
            const unidadDeGasto = registro.Productos?.unidad_de_gasto;
            const presentacionUnidad = registro.Productos?.presentacion_unidad;

            if (!inventarioProductoId) {
                console.error("No inventario_producto_id found");
                return;
            }

            if (cantidad <= 0) {
                window.alert("La cantidad usada debe ser mayor a 0 para restar del inventario.");
                return;
            }

            if (!unidadDeGasto) {
                window.alert("No se pudo obtener la unidad de gasto para este producto. No se restará del inventario.");
                return;
            }

            switch (true) {
                case unidadDeGasto === "ml" && presentacionUnidad === "ml":
                    cantidadGastada = cantidad;
                    break;

                case unidadDeGasto === "ml" && presentacionUnidad === "L":
                    cantidadGastada = cantidad / 1000;
                    break;

                case unidadDeGasto === "g" && presentacionUnidad === "g":
                    cantidadGastada = cantidad;
                    break;

                case unidadDeGasto === "g" && presentacionUnidad === "kg":
                    cantidadGastada = cantidad / 1000;
                    break;

                case unidadDeGasto === "pzs" && presentacionUnidad === "pzs":
                    cantidadGastada = cantidad;
                    break;

                default:
                    console.warn(
                        `Combinación no soportada: gasto=${unidadDeGasto}, presentación=${presentacionUnidad}`
                    );
                    cantidadGastada = cantidad;
            }

            if (cantidadGastada > stock) {
                window.alert(
                    `La cantidad ingresada (${cantidadGastada}) es mayor a la cantidad registrada en el inventario (${stock}).`
                );
                return;
            }

            if (cantidadGastada <= 0) {
                window.alert("La cantidad gastada calculada es menor o igual a 0, no se restará del inventario.");
                return;
            }

            const { data, error } = await supabase
                .from("Inventario_productos")
                .update({ stock: stock - cantidadGastada })
                .eq("id", inventarioProductoId)
                .select("*");

            if (error) {
                console.error("Error restando cantidad del inventario:", error.message);
                return false;
            }

            return true;

            console.log("Inventario actualizado:", data);
        } catch (err) {
            console.error("Error restando inventario:", err);
        }
    };

    const renderConfirmButton = () => (
        <button
            onClick={async () => {
                setOpen(true);
            }}
            style={{
                all: "unset",
                display: "flex",
                fontWeight: "bold",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                width: "95%",
                padding: "0.5rem 1rem",
                background: enableConfirm ? "#0d4e80" : "#0d4e80",
                borderRadius: "0.7179rem",
                cursor: enableConfirm ? "pointer" : "not-allowed",
                transition: "all 0.3s ease-in-out",
                boxSizing: "border-box",
                opacity: enableConfirm ? 1 : 0.6,
            }}
            disabled={!enableConfirm}
            onMouseEnter={e => enableConfirm && (e.currentTarget.style.background = "#0a3a5f")}
            onMouseLeave={e => enableConfirm && (e.currentTarget.style.background = "#0d4e80")}
        >
            Confirmar
        </button>
    );
    return (
        <>
            <RegistroContainer clicado={clicked} alturaregitro={registros.length} className="registrosContainer">
                <div
                    className="topContent"
                    onClick={() => {
                        fetchRegistros();
                        setClicked(prevState => !prevState);
                    }}
                >
                    <p>{props.title ? props.title : ""}</p>
                </div>
                <div className="bottomContent">
                    {registros
                        ?.sort((a, b) => a.id - b.id)
                        .filter(
                            (data, index, self) =>
                                index ===
                                self.findIndex(
                                    item =>
                                        item.Inventario_productos?.[0]?.Lote === data.Inventario_productos?.[0]?.Lote
                                )
                        )
                        .map((data, index) => (
                            <div
                                style={{ width: "100%", display: "flex", alignItems: "center" }}
                                key={index}
                                className="listElement"
                                onClick={() => {
                                    setRegistroId(data?.id);
                                    // handleClick(data?.id);
                                }}
                            >
                                <div style={{ display: "flex", width: "55%", alignItems: "center", gap: "0.5rem" }}>
                                    <p style={{ marginLeft: "1rem", width: "5%", textAlign: "center" }}>{index + 1}</p>
                                    <p style={{ width: "50%", textAlign: "left", marginRight: "1rem" }}>
                                        <strong>{data?.Productos?.nombre}</strong> - Lote:{" "}
                                        {data?.Inventario_productos?.[0]?.Lote}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "45%",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <input
                                        value={cantidades[data?.id] ?? 0}
                                        min={0}
                                        type="number"
                                        id="cantidadInput"
                                        disabled={disableInputs}
                                        onChange={e => {
                                            const value = Number(e.target.value);

                                            setCantidades(prev => ({
                                                ...prev,
                                                [data.id]: value,
                                            }));
                                            setEnableConfirm(true);
                                        }}
                                        onBlur={() => {
                                            const value = cantidades[data.id];
                                            //window.alert(`¿Desea actualizar la cantidad usada a ${value}?`);
                                            if (value) {
                                                handleCantidadRegistroChange(data.id, value);
                                            }
                                        }}
                                        style={{
                                            all: "unset",
                                            width: "60%",
                                            textAlign: "center",
                                            padding: "0.25rem",
                                        }}
                                    />
                                    <span style={{ width: "40%", textAlign: "left" }}>
                                        {data?.Productos?.unidad_de_gasto}
                                    </span>
                                </div>
                                {/* <button
                                    onClick={e => {
                                        openModal(e, data?.id);
                                    }}
                                    className="deleteButton"
                                >
                                    X
                                </button> */}
                            </div>
                        ))}
                    {registros.length > 0 && clicked && (
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "1rem",
                                paddingBottom: "1rem",
                            }}
                        >
                            {renderConfirmButton()}
                        </div>
                    )}

                    {modalOpen && (
                        <ConfirmModal
                            isOpen={modalOpen}
                            titulo="Confirmar consumo"
                            mensaje={`Se restará del inventario la cantidad usada y no podrás hacer cambios posteriores. Verifica que los valores sean correctos.
                            la Cantidad usada para este servicio es: ${cantidadUsada} ${registros[0]?.Productos?.unidad_de_gasto}`}
                            onConfirm={async () => {
                                setOpen(false);
                                const runner = async () => {
                                    const registrosFiltrados = [...registros]
                                        .sort((a, b) => a.id - b.id)
                                        .filter(
                                            (data, index, self) =>
                                                index ===
                                                self.findIndex(
                                                    item =>
                                                        item.Inventario_productos?.[0]?.Lote ===
                                                        data.Inventario_productos?.[0]?.Lote
                                                )
                                        );
                                    for (const registro of registrosFiltrados) {
                                        const success = await restInventarioProductos(
                                            registro,
                                            cantidades[registro.id] ?? 0,
                                            registro.Inventario_productos?.[0]?.stock ?? 0
                                        );
                                        if (!success) {
                                            showToast("Error al confirmar el consumo", "error");
                                            return;
                                        }
                                    }
                                    await handleConfirmConsumption();
                                    await updateServicioWasUsed(props.servicioId ?? 0);
                                    await FetchWasUsedFromServicio().then(wasUsed => {
                                        if (wasUsed === true) {
                                            setEnableConfirm(false);
                                            setDisableInputs(true);
                                        }
                                    });
                                    showToast("Consumo confirmado correctamente", "success");
                                };
                                await runner();
                            }}
                            onCancel={() => setOpen(false)}
                            btnConfirmText="Aceptar"
                            btnCancelText="Rechazar"
                        />
                    )}
                </div>

                {openDeleteModal && (
                    <DelModal
                        btnText={"Eliminar registro"}
                        titulo={"¿Seguro quiere eliminar el registro?"}
                        closeModal={() => {
                            setOpenDeleteModal(false);
                        }}
                        del={() => {
                            deleteRegistros(getRegistroFromQuery() ?? "");
                        }}
                    ></DelModal>
                )}
            </RegistroContainer>
        </>
    );
};

export default PlaguicidasCard;

