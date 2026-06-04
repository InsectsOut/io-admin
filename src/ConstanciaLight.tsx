import styled from "styled-components";
import logo from "../src/assets/logoGrande.png";
import { useParams } from "react-router-dom";
import { Enums, Tables } from "./supabase/Database";
import { supabase } from "./utils/ClientSupabase";
import { useEffect, useRef, useState } from "react";
import { generatePdf } from "./utils/PdfGenerator";
import Spinner from "./rehusableComponents/Spinner";
import { CreateButton } from "./rehusableComponents/CreateInventariosModal";
import { FaDownload } from "react-icons/fa";

const Wrapper = styled.div`
    width: 100%;
    @media (max-width: 600px) {
    }
    .page-break {
        page-break-before: always;
        padding-top: 1rem;
    }
`;

const ConstanciaContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 1rem;
    background: #2c2c2c;
    height: auto;
    min-width: 816px;
    @media (max-width: 600px) {
    }
`;

const Page = styled.div`
    width: 816px; /* LETTER */
    min-width: 816px;
    min-height: 1056px;
    padding: 35px;
    font-family: Arial, sans-serif;
    color: black;
    position: relative;
    border: 1px solid black;
    background: white;
    font-family: "Open Sans";
    height: auto;
    box-sizing: border-box;
    max-height: fit-content;
    @media (max-width: 600px) {
    }

    .headerDiv {
    }

    .midTitle {
        display: "none";
        flex-direction: "row";
        width: "100vw";
        justify-content: "center";
        margin-top: 2rem;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    width: 75%;
    justify-content: flex-start;
`;
const HeaderRight = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    align-items: center;
    margin-bottom: 12px;
`;

const Logo = styled.img`
    width: 25%;
`;

const Title = styled.h1`
    font-size: 12px;
    color: rgb(37, 37, 88);
    margin: 0;
    &.cerTitle {
        font-weight: 600;
    }
`;

const FolioBox = styled.div`
    background: rgb(108, 203, 235);
    width: 70%;
    border: 1.5px solid rgb(57, 133, 227);
    text-align: center;
`;

const SectionTitle = styled.div`
    background: rgb(37, 37, 88);
    color: white;
    font-size: 10px;
    padding: 6px;
    margin-top: 10px;
`;

const Value = styled.div`
    border-bottom: 2px solid rgb(37, 37, 88);
    width: 80%;
    font-size: 10px;
`;

const TableHeader = styled.div`
    display: flex;
    background: rgb(37, 37, 88);
    color: white;
    font-size: 9px;
    padding: 6px;
    box-sizing: border-box;
    justify-content: space-between;
    width: 100%;
`;

const TableRow = styled.div`
    display: flex;
    font-size: 9px;
    padding: 4px 0;
    border-bottom: 1px solid #ddd;
`;

const Col = styled.div`
    width: 12%;
`;

const CheckboxRow = styled.div`
    display: flex;
    gap: 20px;
    margin: 20px 0;
`;

const Checkbox = styled.div<{ checked?: boolean }>`
    width: 10px;
    height: 10px;
    border: 1px solid black;
    background: ${({ checked }) => (checked ? "black" : "white")};
`;

const RecommendationsBox = styled.div`
    background: rgb(214, 43, 51);
    color: white;
    padding: 10px;
    font-size: 9px;
`;

const Footer = styled.div`
    margin-top: 30px;
    text-align: center;
    font-size: 10px;
`;

const RedBar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 8px;
    height: 100%;
    background: #c62828;
`;

const Content = styled.div`
    width: 100%;
`;

const Section = styled.div`
    margin-bottom: 28px;

    .fechaTitle {
        width: 45%;
        background-color: rgb(37, 37, 88);
        height: 11%;
        color: white;
        font-size: 10px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        margin-bottom: 8px;
    }
    &.frecuenciasContainer {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    &.recomendacionesContent {
        width: 100%;
        margin-top: 20px;
        padding: 10px;
        height: auto;
        background-color: rgb(214, 43, 51);
        color: white;
    }
`;

const SectionHeader = styled.div<{ largo?: string }>`
    background: #23245a;
    color: white;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 16px;
    width: ${({ largo }) => (largo ? largo : "55%")};
    display: flex;
    &.recomendacionesHeader {
        background: none;
        text-decoration: underline;
        justify-content: center;
        width: 100%;
        margin-bottom: 0;
    }
    &.reporteFotograficoHeader {
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-bottom: 0;
        height: "40px";
        min-height: "40px";
        max-height: "40px";
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: left;
`;

const Field = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 10px;
    width: 33%;
    height: auto;
    align-items: flex-end;
    &.longerField {
        width: 100%;
    }
`;

const Label = styled.span`
    font-size: 8px;
    font-weight: bold;
`;

const Line = styled.p`
    width: 70%;
    border-bottom: 2px solid rgb(37, 37, 88);
    margin-bottom: 0;
    &.longerLine {
        width: 84%;
    }
`;

const CheckBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    width: 20%;
    gap: 0.5rem;
`;
const Checbox = styled.div<{ checked: boolean }>`
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-width: 1px;
    border-style: solid;
    border-color: black;
    background: ${({ checked }) => (checked ? "black" : "white")};
`;

type FrecuenciaLabel = {
    value: Enums<"FrecuenciaServicio"> | "Otro";
    label: string;
};

type FrecuenciaConOtro = Enums<"FrecuenciaServicio"> | "Otro";
type Servicios = Tables<"Servicios">;
type Clientes = Tables<"Clientes">;
type Empleados = Tables<"Empleados">;

type RegistroConProductos = Tables<"RegistroAplicacion"> & {
    Productos: Tables<"Productos"> | null;
    Plagas: { plaga?: string } | null;
};

type RegistroConProductosArray = RegistroConProductos[];

type ClientesConDirecciones = Tables<"Clientes"> & {
    Direcciones: Tables<"Direcciones">[] | null;
};

type Responsables = Tables<"Responsables">;

type Recomendaciones = Tables<"Recomendaciones">;

const recomendaciones = [
    "No se deben exponer mujeres embarazadas, en lactancia o menores de edad",
    "Se deberán guardar todos los alimentos antes de iniciar el servicio.",
    "Entrar al inmueble después de 2 horas de haberse realizado el servicio.",
    "Lavar todos los utensilios de cocina expuestos durante el servicio.",
];

const CertificadoServicio = ({}) => {
    const frecuencias: FrecuenciaLabel[] = [
        { value: "Semanal", label: "Semanal" },
        { value: "Quincenal", label: "Quincenal" },
        { value: "Mensual", label: "Mensual" },
        { value: "Ninguna", label: "Único puntual" },
        { value: "Otro", label: "Otro" },
    ];

    const [servicioData, setServicioData] = useState<Servicios>();
    const [clienteData, setClienteData] = useState<ClientesConDirecciones>();
    const [responsableData, setResponsableData] = useState<Responsables>();
    const [registroConProductos, setRegistroConProductos] = useState<RegistroConProductosArray>([]);
    const { id } = useParams();
    const [recommendations, setRecommendations] = useState<Recomendaciones[]>();
    const [signedUrls, setSignedUrls] = useState<{ [key: number]: string }>({});
    const [tecnicoName, setTecnicoName] = useState<string>("");
    const [firmaClienteUrl, setFirmaClienteUrl] = useState<string>("");
    const [firmaTecnicoUrl, setFirmaTecnicoUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [encuestaData, setEncuestaData] = useState<Tables<"EncuestaSatisfaccion"> | null>(null);
    const pdfRef = useRef<HTMLDivElement>(null);

    const fetchRegistrosByServicioId = async (servicio_id: string) => {
        try {
            let query = supabase;
            const { data, error } = await query
                .from("RegistroAplicacion")
                .select(`*, Productos(*), Plagas(*)`)
                .filter("servicio_id", "eq", servicio_id);

            if (error) {
                throw new Error(error.message);
            }
            if (data) {
                console.log(data);
                setRegistroConProductos(data as RegistroConProductosArray);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchResponsableById = async (responsable_id: number | null) => {
        try {
            let query = supabase;
            const { data, error } = await query
                .from("Responsables")
                .select("*")
                .filter("id", "eq", responsable_id)
                .single();
            if (data) {
                setResponsableData(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getResponsableData = () => {
        const direccion = clienteData?.Direcciones?.find(dir => dir.id === servicioData?.direccion_id);
        const responsableId = direccion?.responsable_de_direccion ?? null;
        if (responsableId) {
            fetchResponsableById(responsableId);
        }
    };

    const fetchClienteById = async (cliente_id: number | null) => {
        try {
            let query = supabase;
            const { data, error } = await query
                .from("Clientes")
                .select(
                    `
                    *,
                    Direcciones(*)
                  `
                )
                .filter("id", "eq", cliente_id)
                .filter("organizacion", "eq", localStorage.getItem("org") ?? "");
            if (error) {
                throw new Error(error.message);
            }
            if (data) {
                const cliente = data?.[0];
                if (cliente) {
                    setClienteData(cliente);
                } else {
                    setClienteData(undefined);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };
    const fetchServicioById = async (servicio_id: string) => {
        try {
            const { data, error } = await supabase
                .from("Servicios")
                .select(
                    `
        *,
        tecnico:Empleados!Servicios_tecnico_id_fkey (
          nombre,Firma
        )
      `
                )
                .eq("id", Number(servicio_id))
                .eq("organizacion", localStorage.getItem("org") ?? "")
                .single(); // 👈 important

            if (error) throw error;

            const firmaClienteUrl = await generateSignedUrl(data?.firma_cliente ?? "", "imagenes_servicios", false);
            const firmaTecnicoUrl = await generateSignedUrl(data?.tecnico?.Firma ?? "", "documentos_empleados", false);
            setFirmaTecnicoUrl(firmaTecnicoUrl);
            setServicioData(data);
            setFirmaClienteUrl(firmaClienteUrl);
            setTecnicoName(data?.tecnico?.nombre ?? "");

            await fetchClienteById(data?.cliente_id ?? null);
        } catch (err) {
            console.error(err);
        }
    };

    const generateSignedUrl = async (path: string, bucket: string, transform: boolean) => {
        try {
            const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
            if (error) {
                throw new Error(error.message);
            }
            return data?.signedUrl ?? "";
        } catch (err) {
            console.log(err);
            return "";
        }
    };

    const fetchRecomendaciones = async (servicio_id: number) => {
        try {
            let query = supabase;
            const { data, error } = await query
                .from("Recomendaciones")
                .select("*")
                .filter("servicio_id", "eq", servicio_id);
            if (data) {
                setRecommendations(data);

                // Fetch signed URLs for all images
                const urls: { [key: number]: string } = {};
                await Promise.all(
                    data.map(async (rec: Recomendaciones) => {
                        if (rec.imagen) {
                            urls[rec.id] = await generateSignedUrl(rec.imagen, "imagenes_servicios", true);
                        }
                    })
                );
                setSignedUrls(urls);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handlePdf = async () => {
        setLoading(true);
        const element = document.getElementById("pdf-root");
        if (!element) return;

        // px → mm
        const heightPx = element.scrollHeight;
        const heightMm = heightPx * 0.264583;

        const blob = await generatePdf(element, "constancia.pdf", heightMm);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "constancia.pdf";
        a.click();
        URL.revokeObjectURL(url);
        setLoading(false);
    };
    useEffect(() => {
        if (id) fetchServicioById(id);
        fetchRegistrosByServicioId(id ?? "");
        fetchRecomendaciones(id ? Number(id) : 0);
        // getResponsableData();
    }, []);
    useEffect(() => {
        getResponsableData();
    }, [clienteData, servicioData]);

    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!id) return;
            const { data } = await supabase
                .from("EncuestaSatisfaccion")
                .select("*")
                .eq("servicio_id", Number(id))
                .not("respondido_at", "is", null)
                .order("respondido_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            if (data) setEncuestaData(data as Tables<"EncuestaSatisfaccion">);
        };
        fetchEncuesta();
    }, [id]);

    return (
        <Wrapper style={{ width: "100vw", display: "flex", justifyContent: "center", overflowX: "auto" }}>
            <ConstanciaContainer>
                <CreateButton
                    onClick={handlePdf}
                    // @ts-ignore
                    disabled={loading}
                    style={{
                        position: "fixed",
                        top: "100px",
                        right: "35px",
                        zIndex: 9999,
                    }}
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", fontSize: "16px", fontWeight: "500" }}>
                            Descargar PDF <FaDownload style={{ marginLeft: "8px" }} />
                        </div>
                    )}
                </CreateButton>
                <Page ref={pdfRef} id="pdf-root">
                    <Header className="headerDiv">
                        <HeaderLeft>
                            <img crossOrigin="anonymous" style={{ width: "25%" }} src={logo}></img>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <Title style={{ fontSize: "15px" }}>INSECTS OUT PREVENCIÓN</Title>
                                <Title style={{ fontSize: "15px" }}>Y MANEJO INTEGRAL DE PLAGAS, S.A DE C.V</Title>
                            </div>
                        </HeaderLeft>
                        <HeaderRight>
                            <Title style={{ color: "red", fontSize: "12px", marginBottom: "1px" }}>FOLIO</Title>
                            <FolioBox>
                                {typeof servicioData?.folio === "number"
                                    ? servicioData.folio < 0
                                        ? `FT ${servicioData.folio}`
                                        : servicioData.folio
                                    : ""}
                            </FolioBox>
                        </HeaderRight>
                    </Header>
                    <div style={{ marginTop: "2rem" }}>
                        <div className="midTitle">
                            <Title
                                className="cerTitle"
                                style={{ width: "100%", fontSize: "25px", textAlign: "center" }}
                            >
                                CERTIFICADO DE SERVICIO
                            </Title>
                        </div>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader className="fechaTitle">
                                FECHA Y HORA DE ENTRADA Y SALIDA DEL SERVICIO
                            </SectionHeader>

                            <Row>
                                <Field>
                                    <div style={{ width: "30%" }}>
                                        <Label>FECHA</Label>
                                    </div>

                                    <Line>{servicioData?.fecha_servicio}</Line>
                                </Field>

                                <Field>
                                    <div style={{ width: "30%" }}>
                                        <Label>Hora Entrada</Label>
                                    </div>

                                    <Line>{servicioData?.horario_entrada}</Line>
                                </Field>

                                <Field>
                                    <div style={{ width: "30%" }}>
                                        <Label>Hora Salida</Label>
                                    </div>

                                    <Line>{servicioData?.horario_salida}</Line>
                                </Field>
                            </Row>
                        </Section>

                        {/* INFORMACIÓN GENERAL */}
                        <Section>
                            <SectionHeader className="fechaTitle">INFORMACIÓN GENERAL DEL CLIENTE</SectionHeader>

                            <Row>
                                <Field className="longerField">
                                    <div
                                        style={{
                                            width: "130.55px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>NOMBRE</Label>
                                    </div>
                                    <Line className="longerLine">
                                        {clienteData?.nombre} {clienteData?.apellidos}
                                        {(() => {
                                            const direccion = clienteData?.Direcciones?.find(
                                                dir => dir.id === servicioData?.direccion_id
                                            );
                                            return direccion?.apodo_direccion
                                                ? ` / ${direccion.apodo_direccion.toUpperCase()}`
                                                : "";
                                        })()}
                                    </Line>
                                </Field>
                            </Row>

                            <Row>
                                <Field className="longerField">
                                    <div
                                        style={{
                                            width: "130.55px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>DIRECCION</Label>
                                    </div>
                                    <Line className="longerLine">
                                        {(() => {
                                            const direccion = clienteData?.Direcciones?.find(
                                                dir => dir.id === servicioData?.direccion_id
                                            );
                                            if (!direccion) return "";
                                            return `${direccion.calle ?? ""} ${direccion.numero_ext ?? ""} ${direccion.numero_int ?? ""} ${direccion.colonia ?? ""} ${direccion.ciudad ?? ""} ${direccion.estado ?? ""} ${direccion.codigo_postal ?? ""}`.trim();
                                        })()}
                                    </Line>
                                </Field>
                            </Row>

                            <Row>
                                <Field className="longerField">
                                    <div
                                        style={{
                                            width: "130.55px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>GIRO COMERCIAL</Label>
                                    </div>
                                    <Line className="longerLine">{servicioData?.tipo_servicio}</Line>
                                </Field>
                            </Row>

                            <Row>
                                <Field style={{ width: "50%" }}>
                                    <div
                                        style={{
                                            width: "130.55px",
                                            minWidth: "130.55px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>RESPONSABLE</Label>
                                    </div>
                                    <Line style={{ width: "68%" }}>{responsableData?.nombre}</Line>
                                </Field>

                                <Field style={{ width: "50%" }}>
                                    <div
                                        style={{
                                            width: "32%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>PUESTO</Label>
                                    </div>
                                    <Line style={{ width: "100%" }}>{responsableData?.puesto}</Line>
                                </Field>
                            </Row>

                            <Row>
                                <Field style={{ width: "50%" }}>
                                    <div
                                        style={{
                                            minWidth: "130.55px",
                                            width: "130.55px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>E-MAIL</Label>
                                    </div>
                                    <Line style={{ width: "68%" }}>{responsableData?.email}</Line>
                                </Field>

                                <Field style={{ width: "50%" }}>
                                    <div
                                        style={{
                                            width: "32%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-end",
                                            justifyContent: "left",
                                        }}
                                    >
                                        <Label>TELEFONO</Label>
                                    </div>
                                    <Line style={{ width: "100%" }}>{responsableData?.telefono}</Line>
                                </Field>
                            </Row>
                        </Section>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader
                                style={{
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    gap: "12px",
                                    marginBottom: "0",
                                }}
                                largo="100%"
                            >
                                APLICACIONES REALIZADAS
                            </SectionHeader>
                            <div style={{ marginTop: "1rem" }}>
                                <SectionHeader
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        gap: "12px",
                                        marginBottom: "0",
                                    }}
                                    largo="100%"
                                >
                                    <Col style={{ width: "16%" }}>TIPO APLICACION</Col>
                                    <Col style={{ width: "16%" }}>AREA</Col>
                                    <Col style={{ width: "16%" }}>PLAGA</Col>
                                    <Col style={{ width: "16%" }}>PLAGUICIDA</Col>
                                    <Col style={{ width: "12%" }}>DOSIFICACION</Col>
                                    <Col style={{ width: "12%" }}>LOTE</Col>
                                    <Col style={{ width: "12%" }}>REGISTRO COFEPRIS</Col>
                                </SectionHeader>
                            </div>
                            <div>
                                {registroConProductos && registroConProductos.length > 0 ? (
                                    registroConProductos.map(registro => (
                                        <TableRow key={registro.id}>
                                            <Col style={{ width: "16%" }}>{registro.tipo_aplicacion ?? ""}</Col>
                                            <Col style={{ width: "16%" }}>{registro.area_aplicacion ?? ""}</Col>
                                            <Col style={{ width: "16%" }}>{registro.Plagas?.plaga ?? ""}</Col>
                                            <Col style={{ width: "16%" }}>{registro.Productos?.nombre ?? ""}</Col>
                                            <Col style={{ width: "12%" }}>
                                                {registro.dosis_recomendada === "max"
                                                    ? registro.Productos?.dosis_max
                                                    : registro.Productos?.dosis_min}
                                            </Col>
                                            <Col style={{ width: "12%" }}>{""}</Col>
                                            <Col style={{ width: "12%" }}>{registro.Productos?.registro ?? ""}</Col>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <Col style={{ width: "100%" }}>No hay aplicaciones registradas.</Col>
                                    </TableRow>
                                )}
                            </div>
                        </Section>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader
                                style={{
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    gap: "12px",
                                    marginBottom: "0",
                                    background: "rgb(14,78,127)",
                                }}
                                largo="100%"
                            >
                                INFORMACIÓN DEL CLIENTE
                            </SectionHeader>
                        </Section>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader
                                style={{
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    gap: "12px",
                                    marginBottom: "0",
                                    background: "rgb(14,78,127)",
                                }}
                                largo="100%"
                            >
                                SERVICIO SUGERIDO DE ACUERDO A LA PROBLEMÁTICA DE PLAGAS
                            </SectionHeader>
                        </Section>
                        <Section className="frecuenciasContainer">
                            {frecuencias.map(({ value, label }) => (
                                <CheckBoxContainer key={value}>
                                    <Checbox checked={servicioData?.frecuencia_recomendada === value}></Checbox>
                                    <Label style={{ color: "black" }}>{label}</Label>
                                </CheckBoxContainer>
                            ))}
                        </Section>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <Label style={{ color: "red" }}>
                                GARANTIA DE ACUERDO AL TIEMPO SUGERIDO PARA REALIZAR EL PROXIMO SERVICIO Y CUMPLIR CON
                                LAS RECOMENDACIONES SIGUIENTES:
                            </Label>
                        </Section>
                        <Section className="recomendacionesContent">
                            <SectionHeader largo="100%" className="recomendacionesHeader">
                                RECOMENDACIONES GENERALES IMPORTANTES
                            </SectionHeader>

                            <Section
                                style={{
                                    fontSize: "8px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "left",
                                    height: "fit-content",
                                }}
                            >
                                {recomendaciones?.map((rec, index) => (
                                    <Label
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "left",
                                            fontSize: ".8rem",
                                        }}
                                        key={index}
                                    >
                                        {index + 1}
                                        {"."} {rec}
                                    </Label>
                                ))}
                            </Section>
                        </Section>
                    </div>
                    <div className="page-break" style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader className="reporteFotograficoHeader">
                                <Label
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                    }}
                                >
                                    REPORTE FOTOGRÁFICO
                                </Label>
                                <Label>INSPECCIÓN Y RECOMENDACIONES DE ACUERDO A MANEJO INTEGRADO DE PLAGAS</Label>
                            </SectionHeader>
                        </Section>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader largo="100%" style={{ fontSize: "12px" }}>
                                <Col style={{ width: "33%" }}>
                                    <Label>Problema</Label>
                                </Col>
                                <Col style={{ width: "33%" }}>
                                    <Label>Recomendaciones</Label>
                                </Col>
                                <Col style={{ width: "34%" }}>
                                    <Label>Foto Evidencia</Label>
                                </Col>
                            </SectionHeader>
                            {/* Aquí va la sección dinámica de filas de reporte fotográfico */}
                            {recommendations?.map(recs => (
                                <TableRow key={recs.id} style={{ alignItems: "flex-start", minHeight: "40px" }}>
                                    <Col style={{ width: "33%", wordBreak: "break-word", padding: "4px" }}>
                                        <Label style={{ color: "black" }}>{recs?.problema ?? ""}</Label>
                                    </Col>

                                    <Col style={{ width: "33%", wordBreak: "break-word", padding: "4px" }}>
                                        <Label style={{ color: "black" }}>
                                            {Array.isArray(recs.acciones) && (
                                                <ol style={{ paddingLeft: "18px", margin: 0 }}>
                                                    {recs.acciones.map((accion, idx) => (
                                                        <li key={idx} style={{ fontSize: "9px", marginBottom: "2px" }}>
                                                            {accion}
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}
                                        </Label>
                                    </Col>

                                    <Col style={{ width: "34%", padding: "4px" }}>
                                        <div
                                            style={{
                                                width: "100%",
                                                minHeight: "40px",
                                                background: "#f0f0f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {recs?.imagen ? (
                                                signedUrls[recs.id] ? (
                                                    <img
                                                        crossOrigin="anonymous"
                                                        src={signedUrls[recs.id]}
                                                        alt="Evidencia"
                                                        style={{
                                                            width: "200px",
                                                            height: "200px",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: "8px", color: "#888" }}>
                                                        Cargando foto...
                                                    </span>
                                                )
                                            ) : (
                                                <span style={{ fontSize: "8px", color: "#888" }}>Foto aquí</span>
                                            )}
                                        </div>
                                    </Col>
                                </TableRow>
                            ))}
                        </Section>
                    </div>
                    <div className="page-break" style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader largo="100%">
                                <div style={{ width: "50%" }}>
                                    <Label>INSECTS OUT</Label>
                                </div>
                                <div style={{ width: "50%" }}>
                                    <Label>CLIENTE RECIBE SERVICIO Y RECOMENDACIONES</Label>
                                </div>
                            </SectionHeader>
                        </Section>

                        <Section
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                display: "flex",
                                justifyContent: "space-between",
                                border: "solid black 1px",
                                height: "400px",
                                alignItems: "flex-end",
                            }}
                        >
                            <div
                                style={{
                                    width: "50%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "90%",
                                    justifyContent: "flex-end",
                                }}
                            >
                                {/* Signature image for technician */}
                                <div
                                    style={{
                                        width: "80%",
                                        height: "100%",
                                        border: "1px solid #ccc",
                                        marginBottom: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#fafafa",
                                    }}
                                >
                                    {firmaTecnicoUrl ? (
                                        <img
                                            crossOrigin="anonymous"
                                            src={firmaTecnicoUrl}
                                            alt="Firma Técnico"
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        />
                                    ) : (
                                        <span style={{ color: "#aaa", fontSize: "10px" }}>Espacio para firma</span>
                                    )}
                                </div>
                                <Label style={{ fontSize: "1rem", fontWeight: "normal" }}>{tecnicoName}</Label>
                                <Label style={{ fontSize: "1rem", fontWeight: "normal" }}>NOMBRE Y FIRMA TÉCNICO</Label>
                            </div>
                            <div
                                style={{
                                    width: "50%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: "90%",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <div
                                    style={{
                                        width: "80%",
                                        height: "100%",
                                        border: "1px solid #ccc",
                                        marginBottom: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#fafafa",
                                    }}
                                >
                                    {firmaClienteUrl ? (
                                        <img
                                            crossOrigin="anonymous"
                                            src={firmaClienteUrl}
                                            alt="Firma Cliente"
                                            style={{
                                                maxWidth: "200px",

                                                objectFit: "contain",
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: "#aaa", fontSize: "10px" }}>Espacio para firma</span>
                                    )}
                                </div>
                                <Label style={{ fontSize: "1rem", fontWeight: "normal" }}>
                                    {clienteData?.nombre} {clienteData?.apellidos}
                                </Label>
                                <Label style={{ fontSize: "1rem", fontWeight: "normal" }}>
                                    NOMBRE Y FIRMA DEL CLIENTE
                                </Label>
                            </div>
                        </Section>
                    </div>
                    {/* ─── ENCUESTA DE SATISFACCIÓN ─────────────────────────── */}
                    <div className="page-break" style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader
                                largo="100%"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    background: "#23245a",
                                    fontSize: "12px",
                                    letterSpacing: "1px",
                                }}
                            >
                                ENCUESTA DE SATISFACCIÓN
                            </SectionHeader>
                        </Section>
                        <Section>
                            <SectionHeader largo="55%">REALIZACIÓN DEL SERVICIO Y SATISFACCIÓN</SectionHeader>
                            {[
                                "El personal estuvo a tiempo y se presentó con usted.",
                                "El personal portaba su uniforme y Equipo de Protección Personal.",
                                "El personal le preguntó cuál era su problema de plagas y las áreas.",
                                "El personal inspeccionó y atendió las áreas afectadas.",
                                "El personal le dio sugerencias posteriores.",
                            ].map((pregunta, idx) => {
                                const key = `pregunta_${idx + 1}` as keyof Pick<
                                    Tables<"EncuestaSatisfaccion">,
                                    "pregunta_1" | "pregunta_2" | "pregunta_3" | "pregunta_4" | "pregunta_5"
                                >;
                                const respuesta = encuestaData ? encuestaData[key] : null;
                                return (
                                    <Row key={idx} style={{ alignItems: "center", padding: "4px 0", borderBottom: "1px solid #eee" }}>
                                        <Field className="longerField" style={{ width: "80%" }}>
                                            <Label style={{ fontSize: "9px", color: "black" }}>
                                                {idx + 1}) {pregunta}
                                            </Label>
                                        </Field>
                                        <div style={{ display: "flex", gap: "8px", width: "20%", justifyContent: "flex-end" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                                <Checbox checked={respuesta === true} />
                                                <Label style={{ fontSize: "8px" }}>Sí</Label>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                                <Checbox checked={respuesta === false} />
                                                <Label style={{ fontSize: "8px" }}>No</Label>
                                            </div>
                                        </div>
                                    </Row>
                                );
                            })}

                            <Row style={{ marginTop: "8px", alignItems: "center" }}>
                                <Label style={{ fontSize: "9px" }}>
                                    Calificación general (2 pts por pregunta):
                                </Label>
                                <div
                                    style={{
                                        marginLeft: "8px",
                                        background: "#23245a",
                                        color: "white",
                                        padding: "2px 10px",
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        borderRadius: "3px",
                                    }}
                                >
                                    {encuestaData?.calificacion ?? "—"} / 10
                                </div>
                            </Row>

                            <Row style={{ marginTop: "10px", flexDirection: "column", gap: "4px" }}>
                                <Label style={{ fontSize: "9px" }}>Observaciones, sugerencias o felicitaciones:</Label>
                                <div
                                    style={{
                                        borderBottom: "1px solid #23245a",
                                        minHeight: "18px",
                                        width: "100%",
                                        fontSize: "9px",
                                        paddingBottom: "2px",
                                    }}
                                >
                                    {encuestaData?.observaciones ?? ""}
                                </div>
                            </Row>

                            <Row style={{ marginTop: "12px", gap: "24px" }}>
                                <Field style={{ width: "60%", alignItems: "flex-end" }}>
                                    <Label>NOMBRE Y FIRMA</Label>
                                    <Line style={{ width: "65%" }}>{encuestaData?.nombre_firmante ?? ""}</Line>
                                </Field>
                                <Field style={{ width: "40%", alignItems: "flex-end" }}>
                                    <Label>SELLO</Label>
                                    <Line style={{ width: "65%" }} />
                                </Field>
                            </Row>
                            <Row style={{ marginTop: "6px" }}>
                                <Label style={{ fontSize: "9px" }}>Vo.Bo. DE LA DEPENDENCIA</Label>
                            </Row>

                            {!encuestaData && (
                                <Row style={{ marginTop: "8px" }}>
                                    <Label style={{ fontSize: "8px", color: "#aaa" }}>
                                        Encuesta pendiente de respuesta por el cliente.
                                    </Label>
                                </Row>
                            )}
                        </Section>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                        <Section>
                            <SectionHeader
                                largo="100%"
                                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                            >
                                <Label>Faro de San Sebastian 115 - A Frac. El Faro. León Gto.</Label>
                                <Label>Tel: 777-85-64 477-228-75-65</Label>
                                <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                                    <Label>http://www.insectsout.com.mx/</Label>
                                    <Label>gerencia@insectsout.com.mx</Label>
                                </div>
                            </SectionHeader>
                        </Section>
                    </div>
                    <div>
                        <Section>
                            <SectionHeader style={{ display: "flex", justifyContent: "center" }} largo="100%">
                                <Label style={{ fontSize: "1rem" }}>LICENCIA SANITARIA 08-11A182</Label>
                            </SectionHeader>
                        </Section>
                    </div>
                </Page>
            </ConstanciaContainer>
        </Wrapper>
    );
};

export default CertificadoServicio;

