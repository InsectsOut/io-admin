import { Page, Text, Document, StyleSheet, View, Image, Font, PDFViewer } from '@react-pdf/renderer';
import logo from '../src/assets/logoGrande.png'
import { supabase } from './utils/ClientSupabase';
import { useEffect, useState } from 'react';
import { Enums, Tables } from "../src/supabase/Database";
import { useParams } from 'react-router-dom';
const { IO_SUPABASE_URL } = import.meta.env;

type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">
type Responsables = Tables<"Responsables">
type Registros = Tables<"RegistroAplicacion">
type Productos = Tables<"Productos">
type Direcciones = Tables<"Direcciones">
type Recomendaciones = Tables<"Recomendaciones">
type Plagas = Tables<"Plagas">

// Font.register({
//     family: 'Open Sans',
//     src: 'http://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf',
// });


const styles = StyleSheet.create({
    body: {
        overflow: "hidden",
        paddingBottom: 85,
        paddingHorizontal: 35,
        color: "black",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        // fontFamily: 'Open Sans',
        position: "relative",
        transform: "scale(1)"

    },
    header: {
        padding: 0,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "20%",
        textAlign: "left",
        alignItems: "center",
        gap: ".5rem",
    },
    title: {
        fontSize: "13px",
        color: "rgb(37,37,88)",
        width: "60%",

    },

    folioSection: {
        display: "flex",
        flexDirection: "column",
        width: "30%",
        alignItems: "center",
        marginBottom: "12px"
    },
    folioBox: {
        backgroundColor: "rgb(108, 203, 235)",
        width: "70%",
        border: 'solid',
        borderColor: 'rgb(57, 133, 227)',
        borderWidth: 1.5, // You can adjust the width as needed
        textAlign: "center"
    },
    midTitle: {
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        justifyContent: "center"


    },

    fechaSection: {
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "20%"
    },

    fechaTitle: {
        width: "45%", backgroundColor: "rgb(37,37,88)",
        height: "11%",
        color: "white",
        fontSize: "8px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: "8px"
    },
    fechaElement: {
        display: "flex",
        flexDirection: "row",
        fontSize: "8px",
        width: "33%",
        height: "auto"
    },
    fechaUnderline: {
        width: "70%",
        borderBottomWidth: 2, // Thickness of the bottom border
        borderBottomColor: 'rgb(37, 37, 88)', // Color of the bottom border
    },

    container: {
        position: 'absolute',
        width: '2%', // Width of the content container
        height: "94%", // Height of the content container (adjust as needed)
        backgroundColor: 'white', // Background color of the content
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        borderLeftWidth: 4,
        borderLeftColor: '#143340',
        borderRightWidth: 4,
        borderRightColor: 'rgb(214,43,51)',
        marginTop: "40px",
        marginLeft: "20px",
        transform: "scale(1.25)",
    },
    registrosINfo: {
        display: "flex",
        fontSize: "6px",
        flexDirection: "row",
        width: "100%",

        justifyContent: "space-around"
    },

    section: {
        display: "flex",
        flexDirection: 'row',
        width: "100%",
        justifyContent: "space-around",
        marginTop: "-100px",
    },
    checkboxContainer: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: "20px"

    },
    checkbox: {
        width: 10,
        height: 10,
        marginRight: 5,
        borderWidth: 1,
        borderColor: 'black'
    },
    label: {
        fontSize: 6,
        width: "50%",
        height: "100%"
    },
    recomendacionesHeader: {
        fontSize: 10,
        marginBottom: 10,
        textDecoration: 'underline',
        alignSelf: "center"
    },
    listContainer: {
        flexDirection: 'column',
        fontSize: 8,


    },
    item: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    recomendacionesContent: {
        marginTop: "20px",
        padding: 10,
        height: 72,
        backgroundColor: "rgb(214,43,51)",
        color: "white",
    },
    recsUnderline: {
        borderBottomWidth: 1, // Thickness of the bottom border
        borderBottomColor: "rgb(214,43,51)", // Color of the bottom border  
        marginTop: "-12px",
        marginRight: "24px",
        fontSize: "6px",
        display: "flex"

    },

    reporteFotográficoContainer: {
        display: "flex",
        flexDirection: "column",
        height: "40%",
        marginTop: "12px"
    },
    reporteFotográficoInfo: {
        display: "flex",
        flexDirection: "column",
        height: "50%",
        marginTop: "5px",
        borderWidth: 1,
        borderColor: "black",
    },
    rotateImage: {
       transform:"rotate(-90deg) scale(.9)",
    },
    firmasContainer: {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        fontSize: "10px",
        color: "rgb(37,37,88)"

    },
    registrosStyleInfoContainer: {
        width: "12%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 0,
        margin: 0
    }
});

const recommendations = [
    "No se deben exponer mujeres embarazadas, en lactancia o menores de edad",
    "Se deberán guardar todos los alimentos antes de iniciar el servicio.",
    "Entrar al inmueble después de 2 horas de haberse realizado el servicio.",
    "Lavar todos los utensilios de cocina expuestos durante el servicio."
];



const MyDocument = () => {
    type ServicioConClientes = Servicio & {
        Clientes: Cliente | null,
        Responsables: Responsables,
        Recomendaciones: Recomendaciones
    };
    type RegistrosPlaguicidas = Registros & {
        Productos: Productos | null
        Plagas: Plagas | null
    };
    const [servicio, setServicio] = useState<ServicioConClientes[]>([])
    const { folio } = useParams();
    const [registroAp, setRegistroAp] = useState<RegistrosPlaguicidas[]>([])
    const [servicioId, setServicioId] = useState<number | undefined>(servicio?.[0]?.id)
    const [direccion, setDireccion] = useState<Direcciones[]>([])
    const [frecuencia_recomendada, setFrecuencia_recomendada] = useState<Enums<"FrecuenciaServicio">>("Ninguna")
    const [otraFrecuencia, setOtraFrecuencia] = useState<boolean>(false)
    const [firmaClientePath, setFirmaClientePath] = useState<string>("")
    const [firma, setFirma] = useState<string>("")
    const [recomendaciones, setRecomendaciones] = useState<Recomendaciones[]>()
    const [imagenUrl, setImagenUrl] = useState<string[]>([]);
    const [firmaUrl,setFirmaUrl] = useState<string>("")

    const fetchServicio = async () => {
        try {
            const { data: serv } = await supabase
                .from("Servicios")
                .select(`
                    *,
                    Clientes(*),
                    Responsables(*),
                    Empleados:aplicador_Responsable(*),
                    Recomendaciones(*)
                  `)
                .filter("folio", "eq", folio)

            if (!serv) {
                console.error("No existe servicio relacionado a ese folio")
            }
            if (serv) {
                setServicio(serv as any ?? []);
                setServicioId(serv?.[0]?.id);
                fetchDireccion(serv[0]?.direccion_id ?? 0);
                //@ts-ignore
                FetchFirmaEmpleado(serv[0]?.Empleados?.Firma)

                // Set firmaClientePath and fetch the firma image
                const firmaClientePath = serv[0]?.firma_cliente ?? "";

                if (firmaClientePath) {
                    fetchFirmaImg(firmaClientePath); // Ensure this function updates the 'firma' state
                }

                if (serv[0]?.frecuencia_recomendada) {
                    setFrecuencia_recomendada(serv[0]?.frecuencia_recomendada);

                    if (!["Quincenal", "Semanal", "Mensual", "Ninguna"].includes(serv[0]?.frecuencia_recomendada)) {
                        setOtraFrecuencia(true);
                    }
                }
            }

        }

        catch (err) {
            console.log(err)
        }
    }

    const fetchRecomendaciones = async () => {
        try {
            const { data: rec } = await supabase
                .from("Recomendaciones")
                .select(`
                    *
                  `)
                .filter("servicio_id", "eq", servicioId)

            if (!rec) {
                console.error("No existen recomendaciones relacionados a ese servicio")
            }
           

            if (rec) {
                setRecomendaciones(rec)
                // Fetch all image URLs asynchronously
                Promise.all(rec.map(async (img,index) => {
                    const imgUrl = await fetchRecImagen(img?.imagen ?? "");
                    return imgUrl ?? ""; // Default to empty string if imgUrl is undefined
                }))
                .then(imagenesArray => {
                    setImagenUrl(imagenesArray); // Now imagenesArray is always a string[] (no undefined)
                })  
                .catch(error => console.error("Error fetching images:", error));
            }
    

        }

        catch (err) {
            console.log(err)
        }
    }
    const fetchRegistros = async () => {
        try {
            const { data: reg, error: error } = await supabase
                .from("RegistroAplicacion")
                .select(`
                    *,
                    Productos(*),
                    Plagas(*)
                  `)
                .filter("servicio_id", "eq", servicioId)

            if (!reg) {
                console.error(error)
            }
            setRegistroAp(reg as any)
        }

        catch (err) {
            console.log(err)
        }
    }

    const fetchDireccion = async (direccion_id: number) => {
        try {
            let query = await supabase
                .from("Direcciones")
                .select(`*`)
                .filter("id", "eq", direccion_id)
            const { data, error } = query;
            if (error) {
                console.log(error);
            }
            if (data) {
                setDireccion(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchFirmaImg = async (firmaCliente: string) => {
        try {
            const { data, error } = await supabase
                .storage
                .from('imagenes_servicios')
                .createSignedUrl(firmaCliente, 3600); // 3600 seconds = 1 hour

            if (error) {
                console.error('Failed to create signed URL:', error.message);
                return;
            }

            if (data?.signedUrl) {
                setFirma(data.signedUrl); // Set the signed URL
            } else {
                console.error('No signed URL returned.');
            }
        } catch (err) {
            console.error('Error fetching firma image:', err);
        }
    };
    const FetchFirmaEmpleado = async (firmaCliente: string) => {
        try {
            const { data, error } = await supabase
                .storage
                .from('documentos_empleados')
                .createSignedUrl(firmaCliente, 3600); // 3600 seconds = 1 hour

            if (error) {
                console.error('Failed to create signed URL:', error.message);
                return;
            }

            if (data?.signedUrl) {
                setFirmaUrl(data?.signedUrl); // Set the signed URL
            } else {
                console.error('No signed URL returned.');
            }
        } catch (err) {
            console.error('Error fetching firma image:', err);
        }
    };
    const fetchRecImagen = async (imagenRec: string) => {
        try {
            const { data, error } = await supabase
                .storage
                .from('imagenes_servicios')
                .createSignedUrl(imagenRec, 3600); // 3600 seconds = 1 hour

            if (error) {
                console.error('Failed to create signed URL:', error.message);
                return;
            }

            if (data?.signedUrl) {
                return(data?.signedUrl); // Set the signed URl
            } else {
                console.error('No signed Image URL returned.');
            }
        } catch (err) {
            console.error('Error fetching firma image:', err);
        }
    };

 

    useEffect(() => {
        fetchServicio()
    }, [])
    useEffect(() => {
    }, [imagenUrl])

    useEffect(() => {
        if (servicioId !== undefined) {
          //  fetchRecImagen("108/reporte-2025-01-20-cl-0")
            fetchRegistros();
            fetchRecomendaciones();
        }
    }, [servicioId]);


    return (
        <PDFViewer width="100%" height="100%">
            < Document
            >
                <Page  wrap={false} size={"LETTER"} style={{...styles.body}}>
                    <View style={styles.container}></View>
                    <View style={styles.header}>
                        <View style={{ display: "flex", flexDirection: "row", width: "75%", alignItems: "center" }}>
                            <Image src={logo} style={{ width: "25%" }} />
                            <Text style={{...styles.title,fontSize:"12px"}}> INSECTS OUT PREVENCIÓN Y MANEJO INTEGRAL DE PLAGAS, S.A DE C.V</Text>
                        </View>
                        <View style={styles.folioSection} >
                            <Text style={{ color: "red", fontSize: "12px" }}>FOLIO</Text>
                            <View style={styles.folioBox}><Text>{folio}</Text></View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.midTitle}>
                            <Text style={{ ...styles.title, width: "100%", fontSize: "20px", textAlign: "center" }}>CERTIFICADO DE SERVICIO</Text>
                        </View>
                    </View>
                    <View style={{ ...styles.fechaSection, marginBottom: "-100px" }}>
                        <View style={styles.fechaTitle} >
                            <Text style={{ paddingLeft: "3px" }}>FECHA Y HORA DE ENTRADA Y SALIDA DEL SERVICIO</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                            <View style={styles.fechaElement}>
                                <View style={{ width: "30%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>FECHA</Text>
                                </View>
                                <Text style={styles.fechaUnderline}> {servicio[0]?.fecha_servicio}</Text>
                            </View>
                            <View style={styles.fechaElement}>
                                <View style={{ width: "30%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>Hora Entrada</Text>
                                </View>
                                <Text style={styles.fechaUnderline}> {servicio[0]?.horario_entrada || servicio[0]?.horario_servicio}</Text>
                            </View>
                            <View style={styles.fechaElement}>
                                <View style={{ width: "30%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>Hora Salida</Text>
                                </View>
                                <Text style={styles.fechaUnderline}>{servicio[0]?.horario_salida}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ ...styles.fechaSection }} >
                        <View style={styles.fechaTitle} >
                            <Text style={{ paddingLeft: "3px" }}>INFORMACIÓN GENERAL DEL CLIENTE</Text>
                        </View>
                        <View style={{ display: "flex", gap: "10px", width: "100%" }}>
                            <View style={{ ...styles.fechaElement, width: "100%" }}>
                                <View style={{ width: "16%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>NOMBRE</Text>
                                </View>
                                <Text style={{ ...styles.fechaUnderline, width: "84%" }}> {servicio?.[0]?.Clientes?.nombre} {servicio?.[0]?.Clientes?.apellidos}</Text>
                            </View>
                            <View style={{ ...styles.fechaElement, width: "100%" }}>
                                <View style={{ width: "16%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>DIRECCION</Text>
                                </View>
                                <Text style={{ ...styles.fechaUnderline, width: "84%" }}>{direccion[0]?.calle} {direccion[0]?.ciudad} {direccion[0]?.colonia} {direccion[0]?.numero_ext} {direccion[0]?.codigo_postal}</Text>
                            </View>
                            <View style={{ ...styles.fechaElement, width: "100%" }}>
                                <View style={{ width: "16%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>GIRO COMERCIAL</Text>
                                </View>
                                <Text style={{ ...styles.fechaUnderline, width: "84%" }}> {servicio[0]?.tipo_servicio}</Text>
                            </View>
                            <View style={{ ...styles.fechaElement, width: "100%" }}>
                                <View style={{ ...styles.fechaElement, width: "50%" }}>
                                    <View style={{ width: "32%" }}>
                                        <Text style={{ color: "rgb(37, 37, 88)" }}>RESPONSABLE</Text>
                                    </View>
                                    <Text style={{ ...styles.fechaUnderline, width: " 68%" }}> {servicio[0]?.Responsables?.nombre}</Text>
                                </View>
                                <View style={{ ...styles.fechaElement, width: "50%" }}>
                                    <View style={{ width: "16%" }}>
                                        <Text style={{ color: "rgb(37, 37, 88)" }}>PUESTO</Text>
                                    </View>
                                    <Text style={{ ...styles.fechaUnderline, width: "84%" }}> {servicio[0]?.Responsables?.puesto} </Text>
                                </View>
                            </View>
                            <View style={{ ...styles.fechaElement, width: "100%" }}>
                                <View style={{ ...styles.fechaElement, width: "50%" }}>
                                    <View style={{ width: "32%" }}>
                                        <Text style={{ color: "rgb(37, 37, 88)" }}>E-MAIL</Text>
                                    </View>
                                    <Text style={{ ...styles.fechaUnderline, width: " 68%" }}> {servicio[0]?.Responsables?.email} </Text>
                                </View>
                                <View style={{ ...styles.fechaElement, width: "50%" }}>
                                    <View style={{ width: "16%" }}>
                                        <Text style={{ color: "rgb(37, 37, 88)" }}>TELEFONO</Text>
                                    </View>
                                    <Text style={{ ...styles.fechaUnderline, width: "84%" }}> {servicio[0]?.Responsables?.telefono} </Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{ ...styles.fechaSection, marginTop: "0" }}>
                        <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "center" }} >
                            <Text style={{ paddingLeft: "3px" }}>APLICACIONES REALIZADAS</Text>
                        </View>
                    </View>
                    <View style={{
                        ...styles.fechaSection, marginTop: "-120px", gap: "12px",
                    }}>
                        <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "space-around", gap: "12px", marginBottom: "0" }} >
                            <Text style={{ paddingLeft: "3px" }}>TIPO APLICACION</Text>
                            <Text style={{ paddingLeft: "3px" }}>AREA</Text>
                            <Text style={{ paddingLeft: "3px" }}>PLAGA</Text>
                            <Text style={{ paddingLeft: "3px" }}>PLAGUICIDA</Text>
                            <Text style={{ paddingLeft: "3px" }}>DOSIFICACION</Text>
                            <Text style={{ paddingLeft: "3px" }}>NUM. REGISTRO</Text>
                            <Text style={{ paddingLeft: "3px" }}>LOTE</Text>
                            {/* <Text style={{ paddingLeft: "3px" }}>TOTAL UTILIZADO</Text> */}
                        </View>
                        {true &&
                            <View style={{ display: "flex", flexDirection: "column", gap: 0, height: "90px", justifyContent: "space-around", flexShrink: 1 }}>

                                {registroAp?.map((registro) =>

                                    <View
                                    key={registro?.id}
                                    style={{...styles.registrosINfo,marginLeft:"15px"}}>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.tipo_aplicacion}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.area_aplicacion}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.Plagas?.plaga}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.Productos?.nombre}</Text>
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "14%", padding: 0, margin: 0 }}>
                                            <Text style={{ width: "100%", padding: 0, margin: 0, flexGrow: 1 }}>
                                                {registro?.dosis_recomendada === "max" ? registro?.Productos?.dosis_max : registro?.dosis_recomendada === "min" ? registro?.Productos?.dosis_min : ""}
                                            </Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.Productos?.registro}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text></Text>
                                        </View>
                                        {/* <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.cantidad} {registro?.Productos?.tipo_de_producto === "plaguicida" ? registro?.unidad : registro?.Productos?.tipo_de_producto === "cebo" ? "pzs" : "pzs"}</Text>
                                        </View> */}
                                    </View>

                                )}

                            </View>
                        }
                    </View>
                    <View style={{ ...styles.fechaSection, marginTop: "-20px", }}>
                        <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "rgb(14,78,127)" }} >
                            <Text style={{ paddingLeft: "3px" }}>INFORMACIÓN DEL CLIENTE</Text>
                        </View>
                        <View style={{ ...styles.registrosINfo, justifyContent: "flex-start", paddingHorizontal: "12px" }}>
                            <Text >{servicio[0]?.observaciones} </Text>
                        </View>
                    </View>
                    <View style={{
                        ...styles.fechaSection, marginTop: "-90px",
                    }}>
                        <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "rgb(14,78,127)" }} >
                            <Text style={{ paddingLeft: "3px" }}>SERVICIO SUGERIDO DE ACUERDO A LA PROBLEMÁTICA DE PLAGAS</Text>
                        </View>
                    </View>
                    <View style={{...styles.section, marginBottom:"50px"}}>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: frecuencia_recomendada === "Semanal" ? 'black' : "white" }]} />
                            <Text style={styles.label}>Semanal</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: frecuencia_recomendada === "Quincenal" ? 'black' : "white" }]} />
                            <Text style={styles.label}>Quincenal</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: frecuencia_recomendada === "Mensual" ? 'black' : "white" }]} />
                            <Text style={styles.label}>Mensual</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: frecuencia_recomendada === "Ninguna" ? 'black' : "white" }]} />
                            <Text style={styles.label}>Único puntual</Text>
                        </View>

                        <View style={{ ...styles.checkboxContainer }}>

                            <View style={styles.checkboxContainer}>
                                {otraFrecuencia ? (
                                    <>
                                        <View style={[styles.checkbox, { backgroundColor: 'black' }]} />
                                        <Text style={styles.label}>{frecuencia_recomendada}</Text>
                                    </>

                                ) : (

                                    <>
                                        <View style={[styles.checkbox, { backgroundColor: 'white' }]} />
                                        <Text style={styles.label}>Otro</Text>
                                    </>


                                )}
                            </View>

                        </View>

                    </View>
                    <View style={{ ...styles.fechaTitle, width: "100%", backgroundColor: "white", alignItems: "center", justifyContent: "center", color: "red", fontSize: "8px", height:"10px", }} >
                        <Text style={{ paddingLeft: "3px", height: "100%" }}>GARANTIA DE ACUERDO AL TIEMPO SUGERIDO PARA REALIZAR EL PROXIMO SERVICIO Y CUMPLIR CON LAS RECOMENDACIONES SIGUIENTES:</Text>
                    </View>
                    <View style={{...styles.recomendacionesContent, height:"68px", marginTop:"0"}}>
                        <Text style={styles.recomendacionesHeader}>RECOMENDACIONES GENERALES IMPORTANTES</Text>
                        <View style={styles.listContainer}>
                            {recommendations.map((item, index) => (
                                <View key={index} style={styles.item}>
                                    <Text>{`${index + 1}. ${item}`}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                </Page>
                <Page size={"LETTER"} style={styles.body}>
                    <View style={styles.container}></View>

                    <View style={{ ...styles.fechaSection, marginTop: "30px" }}>
                    <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "center", height: "40px", minHeight: "40px", maxHeight:"40px",flexDirection:"column"}} >
                            <Text style={{ paddingLeft: "30px", fontSize:"14px", fontWeight:"bold"}}>REPORTE FOTOGRÁFICO</Text>
                            <Text style={{ paddingLeft: "3px" }}>INSPECCIÓN Y RECOMENDACIONES DE ACUERDO A MANEJO INTEGRADO DE PLAGAS</Text>
                        </View>
                 
                        <View style={{ ...styles.fechaTitle, alignItems: "center", width: "100%", height: "20px", minHeight: "20px", maxHeight:"20px", display: "flex", flexDirection: "row", justifyContent: "space-between", fontSize: "10px", padding: "0px 10px 0px 10px" }}>
                            <View style={{ display: "flex", flexDirection: "column", maxWidth: "30%", flexGrow: 1 }}>
                                <Text>Problema</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "column", maxWidth: "30%", flexGrow: 1 }}>
                                <Text>Recomendaciones</Text>

                            </View>
                            <View style={{ display: "flex", flexDirection: "column", maxWidth: "30%", flexGrow: 1 }}>
                                <Text>Foto</Text>
                            </View>

                        </View>
                        {recomendaciones?.map((rec, index) => (
                            <View
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    fontSize: 10,
                                    padding: 10,
                                    borderWidth: 1,
                                    height: 85,
                                    minHeight: 75,
                                    marginBottom:"3px"
                                }}
                            >
                                {/* Left Column */}
                                <View style={{ display: 'flex', flexDirection: 'column', maxWidth: '30%', flexGrow: 1 }}>
                                    <View>
                                        <Text>{rec.problema}</Text>
                                    </View>
                                </View>

                                {/* Middle Column */}
                                <View style={{ display: 'flex', flexDirection: 'column', maxWidth: '30%', flexGrow: 1 }}>
                                    {rec?.acciones?.map?.((accion, index) => (
                                        <View key={index} style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                                            <Text>{index + 1} </Text>
                                            {/* @ts-ignore */}
                                            <Text>{accion}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Right Column */}
                                <View style={{ display: 'flex', flexDirection: 'column', maxWidth: '30%', flexGrow: 2 }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        {imagenUrl[index] !=="" ? (
                                            <Image

                                            src={imagenUrl[index]} style={{ ...styles.rotateImage, width:"75px",}} />
                                        ) : (
                                            <Text style={{color: 'black', marginBottom: "10px" }}>Sin imagen disponible...</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>


                </Page>
                <Page size={"LETTER"} style={styles.body}>
                    <View>
                        <View style={{ ...styles.reporteFotográficoContainer, height: "50%" }} >
                            <View style={{ display: "flex", height: "10%", flexDirection: "row" }}>
                                <View style={{ ...styles.fechaTitle, width: "50%", alignItems: "center", justifyContent: "center", height: "100%" }} >
                                    <Text style={{ paddingLeft: "3px" }}>CLIENTE RECIBE SERVICIO Y RECOMENDACIONES</Text>
                                </View>
                                <View style={{ ...styles.fechaTitle, width: "50%", alignItems: "center", justifyContent: "center", height: "100%" }} >
                                    <Text style={{ paddingLeft: "3px" }}>INSECTS OUT</Text>
                                </View>
                            </View>
                            <View style={{ ...styles.reporteFotográficoInfo, height: "90%", flexDirection: "row" }}
                            >

                                <View style={styles.firmasContainer}>
                                    {firma ? (
                                        <Image src={firmaUrl} style={{ maxWidth: '600px', backgroundColor: "transparent" }} />
                                    ) : (
                                        <Text style={{ color: "black", marginBottom: "10px" }}>Loading firma...</Text>
                                    )}

                                    <Text style={{ color: "black", marginBottom: "10px" }}>
                                        {/* @ts-ignore */}
                                        {servicio[0]?.Empleados?.nombre}</Text>
                                    <View style={{ ...styles.firmasContainer, marginBottom: "5px" }}><Text>NOMBRE Y FIRMA TÉCNICO</Text></View>
                                </View>
                                <View style={styles.firmasContainer}>
                                    {firma ? (
                                        <Image src={firma} style={{ width: '600px', backgroundColor: "transparent" }} />
                                    ) : (
                                        <Text style={{ color: "black", marginBottom: "10px" }}>Loading firma...</Text>
                                    )}

                                    <Text style={{ color: "black", marginBottom: "10px" }}>

                                        {/* @ts-ignore */}
                                        {servicio[0]?.Clientes?.nombre} {servicio[0]?.Clientes?.apellidos}
                                    </Text>
                                    <View style={{ ...styles.firmasContainer, width: "60%", marginBottom: "5px" }}><Text>NOMBRE Y FIRMA DEL CLIENTE</Text></View>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: "flex", height: "15%", flexDirection: "column", marginTop: "8px" }}>
                            <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "flex-start", height: "100%", flexDirection: "column" }} >
                                <Text style={{ paddingLeft: "3px", fontSize: "16px" }}>Faro de San Sebastian 115 - A Frac. El Faro. León Gto.</Text>
                                <Text style={{ paddingLeft: "3px", fontSize: "12px", marginVertical: "5px" }}>Tel: 777-85-64        477-228-75-65</Text>
                                <View style={{ display: "flex", justifyContent: "space-around", flexDirection: "row", width: "100%" }}>
                                    <Text>www.insectsout.com.mx</Text>
                                    <Text>gerencia@insectsout.com.mx</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: "flex", height: "8%", flexDirection: "column", marginTop: "8px", justifyContent: "center" }}>
                            <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "flex-start", height: "100%", flexDirection: "column" }} >
                                <Text style={{ paddingLeft: "3px", fontSize: "16px", marginTop: "4px" }}>LICENCIA SANITARIA 08-11A182</Text>
                                <View style={{ display: "flex", alignItems: "flex-end", flexDirection: "column", width: "100%", gap: "8px", marginRight: "12px", marginBottom: "20px", textAlign: "center" }}>
                                    <Text style={{ fontSize: "4px" }}>FO-GG-0000</Text>
                                    <Text style={{ fontSize: "4px" }}>Revision: 0</Text>
                                    <Text style={{ fontSize: "4px" }}>Fecha: 02-09-13</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document >
        </PDFViewer>
    )
};

export default MyDocument