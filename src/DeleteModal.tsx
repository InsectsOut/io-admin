import styled from "styled-components";
import { useEffect, useState } from "react";
import { Enums, Tables } from "./supabase/Database";
import { supabase } from "./utils/ClientSupabase";

type Movimientos = Tables<"Movimientos">;
const organizacion = localStorage.getItem("organizacion") || "";

const DeleteModal = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgb(0, 0, 0, 0.7);
    top: 0;
    right: 0%;
    display: flex;
    justify-content: center;
    align-items: center;

    .doubleInput {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
`;

const ModalContent = styled.div`
    position: relative;
    width: 30.78%;
    height: 20%;
    background: #f4f4f4;
    min-width: fit-content;
    box-shadow: 0px 4.59475px 4.59475px rgba(0, 0, 0, 0.25);
    border-radius: 0.718rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.75rem;
    gap: 1rem;
    color: white;
`;
const CloseButton = styled.div`
    width: 9.46px;
    height: 9.46px;
    color: #727272;
    position: absolute;
    top: 20px;
    right: 20px;
    font-weight: bolder;
    &:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
`;
const Titulo = styled.h1`
    font-style: normal;
    color: black;
    font-weight: 700;
    font-size: 1.436rem;
    line-height: 1.875rem;
    display: flex;
    text-align: center;
    margin-bottom: 0.5rem;
`;

const ServicioInfo = styled.div`
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 0.5rem;

    .fecha {
        display: flex;
    }
    .inve {
        justify-content: center;
    }
    .nombre {
        display: flex;
    }
    .folio {
        display: flex;
    }
    .inventario {
        flex-direction: column;
        align-items: center;
    }
    .menu {
        margin-top: 0.5rem;
        justify-content: space-between;
        gap: 0.5rem;
    }
`;

const SubTitles = styled.p`
    height: 1.25rem;
    margin: unset;
    font-style: normal;
    font-weight: 500;
    font-size: 0.9375rem;
    line-height: 1.25rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #838383;
`;

const DeleteButton = styled.button`
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8.625rem;
    min-width: fit-content;
    min-height: 2.25rem;
    height: 2.25rem;
    background: #0d4e80;
    border-radius: 0.359rem;
    padding: 0 1rem 0 1rem;
    font-style: normal;
    font-weight: 700;
    font-size: 1.005rem;
    &:hover {
        cursor: pointer;
        background-color: #2980b9;
        transform: scale(1.05);
        color: white;
    }
`;

interface cardProps {
    closeModal: () => void;
    folio?: string;
    nombre?: string;
    fecha?: string;
    apellido?: string;
    del: (event?: React.MouseEvent<HTMLButtonElement>, motivoSalida?: string) => void;
    titulo: string;
    btnText: string;
    puesto?: string;
    tipo?: string;
    stock?: number;
    invNombre?: string;
    principal?: ("entradas" | "menu")[];
}



const DelModal: React.FC<cardProps> = ({
    closeModal,
    folio,
    nombre,
    fecha,
    apellido,
    del,
    titulo,
    btnText,
    puesto,
    tipo,
    stock,
    invNombre,
    principal,
}) => {
    const [registro, setRegistro] = useState<string>("");
    const [motivoSalida, setMotivoSalida] = useState<string>(""); // 👈 Added
    const params = new URLSearchParams(window.location.search);

    const getRegistroFromQuery = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const registro = urlParams.get("registro");
        return registro;
    };

    useEffect(() => {});

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
                                  organizacion: organizacion,
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


    const movimientoOptions: Enums<"TipoMovimiento">[] = [
        "salida",
        "caducidad",
        "venta",
        "basura",
        "error"
    ];
    return (
        <DeleteModal>
            <ModalContent>
                <CloseButton onClick={closeModal}>X</CloseButton>
                <Titulo>{titulo}</Titulo>

                {window.location.pathname === "/empleados" && (
                    <ServicioInfo>
                        <div className="nombre">
                            <SubTitles>Nombre: {nombre}</SubTitles>
                        </div>
                        <div className="fecha">
                            <SubTitles>Puesto: {puesto}</SubTitles>
                        </div>
                    </ServicioInfo>
                )}

                {window.location.pathname === "/Clientes" && (
                    <ServicioInfo>
                        <div className="nombre">
                            <SubTitles>
                                Nombre: {nombre} {apellido}
                            </SubTitles>
                        </div>
                        <div className="fecha">
                            <SubTitles>Giro comercial: {tipo}</SubTitles>
                        </div>
                    </ServicioInfo>
                )}

                {window.location.pathname === "/Servicios" && (
                    <ServicioInfo>
                        <div className="folio">
                            <SubTitles>Folio: {folio}</SubTitles>
                        </div>
                        <div className="nombre">
                            <SubTitles>
                                Nombre: {nombre} {apellido}
                            </SubTitles>
                        </div>
                        <div className="fecha">
                            <SubTitles>Fecha: {fecha}</SubTitles>
                        </div>
                    </ServicioInfo>
                )}

                {window.location.pathname === `/Servicios/${folio}` && (
                    <ServicioInfo>
                        <div className="folio">
                            <SubTitles>
                                ¿Está seguro de querer generar un folio permanente para este servico? <br />
                                Esta acción es irreversible
                            </SubTitles>
                        </div>
                    </ServicioInfo>
                )}

                {window.location.pathname === `/inventario` &&
                    params.get("inventarioId") &&
                    params.get("flag") === "principal" && (
                        <ServicioInfo>
                            <div className="folio inventario">
                                {principal?.includes("entradas") && (
                                    <SubTitles>¿Está seguro de querer eliminar el producto del inventario?</SubTitles>
                                )}

                                {principal?.includes("menu") && (
                                    <SubTitles>¿Está seguro de querer eliminar el inventario?</SubTitles>
                                )}

                                <div className="folio menu">
                                    <div className="folio">
                                        {tipo && (
                                            <SubTitles>
                                                <strong>Producto: </strong> {tipo}
                                            </SubTitles>
                                        )}
                                    </div>
                                    {stock && (
                                        <div className="nombre">
                                            <SubTitles>
                                                <strong>Stock: </strong> {stock}
                                            </SubTitles>
                                        </div>
                                    )}
                                    {invNombre && (
                                        <div className="inve">
                                            <SubTitles>
                                                <strong>Inventario: </strong> {invNombre}
                                            </SubTitles>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ServicioInfo>
                    )}

                {window.location.pathname === `/inventario` &&
                    params.get("flag") === "principal" && (
                        <ServicioInfo>
                            <div className="folio inventario">
                                {principal?.includes("menu") && (
                                    <SubTitles>
                                        Se eliminará el inventario : <strong> {invNombre}</strong>
                                    </SubTitles>
                                )}
                            </div>
                        </ServicioInfo>
                    )}

                {getRegistroFromQuery() && (
                    <ServicioInfo>
                        <div
                            className="folio"
                            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                            <SubTitles style={{ textAlign: "center" }}>
                                ¿Está seguro de querer eliminar el registro de aplicación?{" "}
                                <strong>ID:{getRegistroFromQuery()}</strong>{" "}
                            </SubTitles>{" "}
                            <SubTitles style={{ textAlign: "center" }}>Esta acción es irreversible</SubTitles>
                        </div>
                    </ServicioInfo>
                )}

                {/* ✅ NEW SECTION FOR FLAG=EQUIPO */}
                {params.get("flag") === "equipo" && (
                    <ServicioInfo className="inventario">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                            <SubTitles style={{ textAlign: "center" }}>
                                Seleccione el tipo de movimiento de salida que justifica la eliminación:
                            </SubTitles>
                            <select
                                value={motivoSalida}
                                onChange={(e) => setMotivoSalida(e.target.value)}
                                style={{
                                    padding: "0.4rem",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    fontSize: "0.9rem",
                                    width: "80%",
                                    textAlign: "center",
                                    marginTop: "0.3rem",
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                {movimientoOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </ServicioInfo>
                )}
                {/* ✅ END NEW SECTION */}

                <DeleteButton
                    onClick={() => {
                        if (params.get("flag") === "equipo" && !motivoSalida) {
                            alert("Por favor seleccione un motivo de salida antes de eliminar.");
                            return;
                        }
                        del?.(undefined, motivoSalida);
                       if (params.get("flag") === "equipo" && motivoSalida) {
                            createMovimiento(
                                Number(params.get("inventarioId")),
                                "equipo",
                                new Date(),
                                Number(params.get("equipoId")),
                                motivoSalida as Enums<"TipoMovimiento">,
                               Number(params.get("stock")) || 1,
                                null
                            );
                        }
                        closeModal?.();
                    }}
                >
                    {btnText}
                </DeleteButton>
            </ModalContent>
        </DeleteModal>
    );
};

export default DelModal;
