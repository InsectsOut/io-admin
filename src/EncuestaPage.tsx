import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "./utils/ClientSupabase";
import { Tables } from "./supabase/Database";
import logo from "../src/assets/logoGrande.png";
import Spinner from "./rehusableComponents/Spinner";

type Encuesta = Tables<"EncuestaSatisfaccion">;

// ─── Styled ──────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
    min-height: 100vh;
    background: #2c2c2c;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 1rem;
    box-sizing: border-box;
    font-family: "Open Sans", Arial, sans-serif;
`;

const Card = styled.div`
    background: white;
    width: 100%;
    max-width: 600px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
`;

const HeaderCard = styled.div`
    background: white;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 2px solid #23245a;
`;

const HeaderLogo = styled.img`
    width: 70px;
`;

const HeaderTextBlock = styled.div`
    display: flex;
    flex-direction: column;
`;

const HeaderTitle = styled.p`
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    color: #23245a;
    line-height: 1.3;
`;

const FolioTag = styled.div`
    margin-left: auto;
    background: rgb(108, 203, 235);
    border: 1.5px solid rgb(57, 133, 227);
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
    min-width: 90px;

    .label {
        color: red;
        font-size: 9px;
    }
`;

const SurveyTitle = styled.h1`
    text-align: center;
    font-size: 20px;
    font-weight: 800;
    color: #23245a;
    margin: 20px 0 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
`;

const SectionBanner = styled.div`
    background: #23245a;
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 7px 20px;
    margin: 0 0 16px;
`;

const Body = styled.div`
    padding: 0 20px 24px;
`;

const QuestionRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    gap: 12px;
`;

const QuestionText = styled.p`
    margin: 0;
    font-size: 13px;
    color: #222;
    flex: 1;
`;

const ToggleGroup = styled.div`
    display: flex;
    gap: 8px;
    flex-shrink: 0;
`;

const ToggleBtn = styled.button<{ selected: boolean; variant: "si" | "no" }>`
    all: unset;
    padding: 5px 14px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    border: 2px solid ${({ variant }) => (variant === "si" ? "#23245a" : "#c62828")};
    background: ${({ selected, variant }) => (selected ? (variant === "si" ? "#23245a" : "#c62828") : "white")};
    color: ${({ selected, variant }) => (selected ? "white" : variant === "si" ? "#23245a" : "#c62828")};
    transition:
        background 0.15s,
        color 0.15s;
`;

const ScoreBox = styled.div`
    background: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0;

    .label {
        font-size: 13px;
        font-weight: 700;
        color: #23245a;
    }
    .score {
        font-size: 22px;
        font-weight: 800;
        color: #23245a;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 8px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    min-height: 70px;
    margin-top: 6px;
`;

const InputField = styled.input`
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 8px;
    font-size: 13px;
    font-family: inherit;
    margin-top: 6px;
`;

const FieldLabel = styled.p`
    margin: 14px 0 0;
    font-size: 12px;
    font-weight: 700;
    color: #555;
`;

const SubmitButton = styled.button`
    all: unset;
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #23245a;
    color: white;
    text-align: center;
    padding: 14px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 20px;
    transition: background 0.15s;

    &:hover {
        background: #1a1b45;
    }
    &:disabled {
        background: #999;
        cursor: not-allowed;
    }
`;

const StatusMessage = styled.div<{ type: "error" | "success" | "info" }>`
    padding: 16px 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: ${({ type }) => (type === "error" ? "#c62828" : type === "success" ? "#1a6e2e" : "#23245a")};
    background: ${({ type }) => (type === "error" ? "#fdecea" : type === "success" ? "#e8f5e9" : "#e8ecf8")};
`;

// ─── Preguntas ────────────────────────────────────────────────────────────────

const PREGUNTAS = [
    "El personal estuvo a tiempo y se presentó con usted.",
    "El personal portaba su uniforme y Equipo de Protección Personal.",
    "El personal le preguntó cuál era su problema de plagas y las áreas.",
    "El personal inspeccionó y atendió las áreas afectadas.",
    "El personal le dio sugerencias posteriores.",
] as const;

type RespuestasState = {
    pregunta_1: boolean | null;
    pregunta_2: boolean | null;
    pregunta_3: boolean | null;
    pregunta_4: boolean | null;
    pregunta_5: boolean | null;
};

// ─── Component ───────────────────────────────────────────────────────────────

const EncuestaPage = () => {
    const { token } = useParams<{ token: string }>();

    const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
    const [folio, setFolio] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pageState, setPageState] = useState<"loading" | "expired" | "answered" | "form" | "success" | "error">(
        "loading"
    );

    const [respuestas, setRespuestas] = useState<RespuestasState>({
        pregunta_1: null,
        pregunta_2: null,
        pregunta_3: null,
        pregunta_4: null,
        pregunta_5: null,
    });
    const [observaciones, setObservaciones] = useState("");
    const [nombreFirmante, setNombreFirmante] = useState("");

    const calificacion =
        [
            respuestas.pregunta_1,
            respuestas.pregunta_2,
            respuestas.pregunta_3,
            respuestas.pregunta_4,
            respuestas.pregunta_5,
        ].filter(r => r === true).length * 2;

    const todasRespondidas =
        respuestas.pregunta_1 !== null &&
        respuestas.pregunta_2 !== null &&
        respuestas.pregunta_3 !== null &&
        respuestas.pregunta_4 !== null &&
        respuestas.pregunta_5 !== null;

    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!token) {
                setPageState("error");
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from("EncuestaSatisfaccion")
                    .select("*, Servicios(folio)")
                    .eq("token", token)
                    .single();

                if (error || !data) {
                    setPageState("error");
                    return;
                }

                setEncuesta(data as Encuesta);
                const servicioData = (data as any).Servicios;
                if (servicioData?.folio) setFolio(servicioData.folio);

                const now = new Date();
                const expiry = new Date(data.expires_at);

                if (data.respondido_at) {
                    setPageState("answered");
                } else if (now > expiry) {
                    setPageState("expired");
                } else {
                    setPageState("form");
                }
            } catch {
                setPageState("error");
            } finally {
                setLoading(false);
            }
        };

        fetchEncuesta();
    }, [token]);

    const handleToggle = (key: keyof RespuestasState, value: boolean) => {
        setRespuestas(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!todasRespondidas || !encuesta) return;
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from("EncuestaSatisfaccion")
                .update({
                    pregunta_1: respuestas.pregunta_1,
                    pregunta_2: respuestas.pregunta_2,
                    pregunta_3: respuestas.pregunta_3,
                    pregunta_4: respuestas.pregunta_4,
                    pregunta_5: respuestas.pregunta_5,
                    calificacion,
                    observaciones: observaciones.trim() || null,
                    nombre_firmante: nombreFirmante.trim() || null,
                    respondido_at: new Date().toISOString(),
                })
                .eq("token", token as string);

            if (error) throw error;
            setPageState("success");
        } catch {
            setPageState("error");
        } finally {
            setSubmitting(false);
        }
    };

    const renderBody = () => {
        if (pageState === "loading") {
            return (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                    <Spinner />
                </div>
            );
        }
        if (pageState === "expired") {
            return (
                <StatusMessage type="error">
                    Este enlace ha expirado. Solicita un nuevo enlace al equipo de Insects Out.
                </StatusMessage>
            );
        }
        if (pageState === "answered") {
            return (
                <StatusMessage type="success">
                    ¡Gracias! Esta encuesta ya fue respondida. Apreciamos tu retroalimentación.
                </StatusMessage>
            );
        }
        if (pageState === "success") {
            return (
                <StatusMessage type="success">
                    ¡Encuesta enviada con éxito! Gracias por tu tiempo. Tu opinión nos ayuda a mejorar.
                </StatusMessage>
            );
        }
        if (pageState === "error") {
            return (
                <StatusMessage type="error">
                    Enlace inválido. Por favor verifica la URL o solicita uno nuevo.
                </StatusMessage>
            );
        }

        // Form state
        return (
            <Body>
                <SectionBanner>REALIZACIÓN DEL SERVICIO Y SATISFACCIÓN</SectionBanner>

                {PREGUNTAS.map((pregunta, idx) => {
                    const key = `pregunta_${idx + 1}` as keyof RespuestasState;
                    return (
                        <QuestionRow key={key}>
                            <QuestionText>
                                {idx + 1}) {pregunta}
                            </QuestionText>
                            <ToggleGroup>
                                <ToggleBtn
                                    variant="si"
                                    selected={respuestas[key] === true}
                                    onClick={() => handleToggle(key, true)}
                                >
                                    Sí
                                </ToggleBtn>
                                <ToggleBtn
                                    variant="no"
                                    selected={respuestas[key] === false}
                                    onClick={() => handleToggle(key, false)}
                                >
                                    No
                                </ToggleBtn>
                            </ToggleGroup>
                        </QuestionRow>
                    );
                })}

                <ScoreBox>
                    <span className="label">Calificación general (2 pts por pregunta)</span>
                    <span className="score">{calificacion} / 10</span>
                </ScoreBox>

                <FieldLabel>Observaciones, sugerencias o felicitaciones:</FieldLabel>
                <TextArea
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    placeholder="Escribe aquí tus comentarios..."
                />

                <FieldLabel>Nombre y firma (Nombre completo):</FieldLabel>
                <InputField
                    value={nombreFirmante}
                    onChange={e => setNombreFirmante(e.target.value)}
                    placeholder="Nombre completo"
                />

                <SubmitButton
                    // @ts-ignore
                    disabled={!todasRespondidas || submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? "Enviando..." : "Enviar encuesta"}
                </SubmitButton>

                {!todasRespondidas && (
                    <p style={{ fontSize: "11px", color: "#888", textAlign: "center", marginTop: "8px" }}>
                        Responde todas las preguntas para poder enviar.
                    </p>
                )}
            </Body>
        );
    };

    return (
        <Wrapper>
            <Card>
                <HeaderCard>
                    <HeaderLogo src={logo} alt="Insects Out" crossOrigin="anonymous" />
                    <HeaderTextBlock>
                        <HeaderTitle>INSECTS OUT PREVENCIÓN Y MANEJO</HeaderTitle>
                        <HeaderTitle>INTEGRAL DE PLAGAS, S.A. DE C.V.</HeaderTitle>
                    </HeaderTextBlock>
                    {folio && (
                        <FolioTag>
                            <div className="label"># CONSTANCIA</div>
                            <div>{folio < 0 ? `FT${folio}` : folio}</div>
                        </FolioTag>
                    )}
                </HeaderCard>

                <SurveyTitle>Encuesta de Satisfacción</SurveyTitle>

                {renderBody()}
            </Card>
        </Wrapper>
    );
};

export default EncuestaPage;

