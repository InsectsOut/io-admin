import { Page, Text, Document, StyleSheet, View, Image, Font, PDFViewer } from '@react-pdf/renderer';
import logo from '../src/assets/logoGrande.png'
import { supabase } from './utils/ClientSupabase';
import { useEffect, useState } from 'react';
import { Tables } from "./database-types";
import { useParams } from 'react-router-dom';

type Servicio = Tables<"Servicios">
type Cliente = Tables<"Clientes">
type Responsables = Tables<"Responsables">
type Registros = Tables<"RegistroAplicacion">
type plaguicidas = Tables<"plaguicidas">



Font.register({
    family: 'Open Sans',
    src: 'http://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf',
});


const styles = StyleSheet.create({
    body: {
        overflow: "hidden",
        paddingBottom: 85,
        paddingHorizontal: 35,
        color: "black",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        fontFamily: 'Open Sans',
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
const recommendationsMIP = [
    "Tapar coladeras en",
    "Instalar guardapolvo en puerta",
    "Mantener corto el césped",
    "Reparar fuga de agua en",
    "Recoger alimentos y trastes sucios",
    "Sellar orificios, grietas y/o endiduras",
];


const recommendationsMIP2 = [
    "No trapear en dos dias a 15 cm de la pared",
    "Instalar mosquiteros en",
    "Limpiar derrames en piso y paredes No dejar alimento de mascota expuesto",
    "No introducir alimento sin revisar cajas de carton o madera Almacenar a 10 cm. Del piso y la pared.",
    "Utilizar cubre colchon y lavar la ropa con agua caliente"
];





const MyDocument = () => {

    type ServicioConClientes = Servicio & {
        Clientes: Cliente | null,
        Responsables: Responsables
    };
    type RegistrosPlaguicidas = Registros & {
        plaguicidas: plaguicidas | null
    };
    const [servicio, setServicio] = useState<ServicioConClientes[]>([])
    const { folio } = useParams();
    const [registroAp, setRegistroAp] = useState<RegistrosPlaguicidas[]>([])
    const [servicioId, setServicioId] = useState<number | undefined>(servicio?.[0]?.id)
    console.log('folio from params:', folio);

    const fetchServicio = async () => {
        try {
            const { data: serv, error: error } = await supabase
                .from("Servicios")
                .select(`*, Clientes!inner(*), Responsables!inner(*)`)
                .filter("folio", "eq", folio)

            if (!serv) {
                console.error(error)
            }
            setServicio(serv as any)
            setServicioId(serv?.[0]?.id)
            console.log(serv)

        }

        catch (err) {
            console.log(err)
        }
    }
    const fetchRegistros = async () => {
        try {
            const { data: reg, error: error } = await supabase
                .from("RegistroAplicacion")
                .select(`*, plaguicidas!inner(*)`)
                .filter("servicio_id", "eq", servicioId)

            if (!reg) {
                console.error(error)
            }
            setRegistroAp(reg as any)
            console.log("registros", reg)

        }

        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchServicio()
    }, [])

    useEffect(() => {
        if (servicioId !== undefined) {
            fetchRegistros();
        }
    }, [servicioId]);


    return (
        <PDFViewer width="100%" height="100%">
            < Document >
                <Page size={"LETTER"} style={styles.body}>
                    <View style={styles.container}></View>
                    <View style={styles.header}>
                        <View style={{ display: "flex", flexDirection: "row", width: "75%", alignItems: "center" }}>
                            <Image src={logo} style={{ width: "25%" }} />
                            <Text style={styles.title}> INSECTS OUT PREVENCIÓN Y MANEJO INTEGREAL DE PLAGAS, S.A DE C.V</Text>
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
                                <Text style={styles.fechaUnderline}> {servicio[0]?.horario_servicio}</Text>
                            </View>
                            <View style={styles.fechaElement}>
                                <View style={{ width: "30%" }}>
                                    <Text style={{ color: "rgb(37, 37, 88)" }}>Hora Salida</Text>
                                </View>
                                <Text style={styles.fechaUnderline}> 14:30</Text>
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
                                <Text style={{ ...styles.fechaUnderline, width: "84%" }}> {servicio[0]?.direccion_id} </Text>
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
                            <Text style={{ paddingLeft: "3px" }}>PLAGUICIDA</Text>
                            <Text style={{ paddingLeft: "3px" }}>DOSIFICACION</Text>
                            <Text style={{ paddingLeft: "3px" }}>NUM. REGISTRO</Text>
                            <Text style={{ paddingLeft: "3px" }}>LOTE</Text>
                            <Text style={{ paddingLeft: "3px" }}>TOTAL UTILIZADO</Text>
                        </View>
                        {true &&
                            <View style={{ display: "flex", flexDirection: "column", gap: 0, height: "90px", justifyContent: "space-around", flexShrink: 1 }}>

                                {registroAp?.map((registro) =>

                                    <View style={styles.registrosINfo}>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.tipo_aplicacion}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.area_aplicacion}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.plaguicidas?.nombre}</Text>
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "14%", padding: 0, margin: 0 }}>
                                            <Text style={{ width: "100%", padding: 0, margin: 0, flexGrow: 1 }}>
                                                {registro?.plaguicidas?.dosis_max ? registro?.plaguicidas?.dosis_max : ""} {registro?.plaguicidas?.dosis_min}
                                            </Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.plaguicidas?.registro}</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>902F37A80</Text>
                                        </View>
                                        <View style={styles.registrosStyleInfoContainer}>
                                            <Text>{registro?.cantidad} {registro?.unidad}</Text>
                                        </View>
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
                    <View style={styles.section}>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: 'white' }]} />
                            <Text style={styles.label}>Semanal</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: 'white', }]} />
                            <Text style={styles.label}>Quincenal</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: 'white', }]} />
                            <Text style={styles.label}>Mensual</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: 'white', }]} />
                            <Text style={styles.label}>Único puntual</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, { backgroundColor: 'white', }]} />
                            <Text style={styles.label}>Otro</Text>
                        </View>

                    </View>
                    <View style={{ ...styles.fechaTitle, width: "100%", backgroundColor: "white", alignItems: "center", justifyContent: "center", color: "red", fontSize: "8px", marginTop: "30px" }} >
                        <Text style={{ paddingLeft: "3px", height: "100%" }}>GARANTIA DE ACUERDO AL TIEMPO SUGERIDO PARA REALIZAR EL PROXIMO SERVICIO Y CUMPLIR CON LAS RECOMENDACIONES SIGUIENTES:</Text>
                    </View>

                </Page>
                <Page size={"LETTER"} style={styles.body}>
                    <View style={styles.container}></View>
                    <View style={styles.recomendacionesContent}>
                        <Text style={styles.recomendacionesHeader}>RECOMENDACIONES GENERALES IMPORTANTES</Text>
                        <View style={styles.listContainer}>
                            {recommendations.map((item, index) => (
                                <View key={index} style={styles.item}>
                                    <Text>{`${index + 1}. ${item}`}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={{ ...styles.fechaSection, marginTop: "30px", color: "rgb(214,43,51)" }}>
                        <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "center", height: "30%" }} >
                            <Text style={{ paddingLeft: "3px" }}>INSPECCIÓN Y RECOMENDACIONES DE ACUERDO A MANEJO INTEGRADO DE PLAGAS</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", }}>

                            <View style={{ ...styles.checkboxContainer, width: "50%", flexDirection: "column", alignContent: "flex-start" }}>
                                {recommendationsMIP.map((recos) => (
                                    <View style={{ display: "flex", flexDirection: "row", height: "30%", width: "100%" }}>
                                        <View style={[styles.checkbox, { backgroundColor: 'white', borderColor: "rgb(214,43,51)" }]} >
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", height: "100%" }}>
                                            <Text style={styles.label}>{recos}</Text>
                                            < View style={{ ...styles.recsUnderline, width: "50%", height: "100%", position: "relative" }}><Text style={{ position: "absolute", bottom: "0", color: "black" }}>lorem ipsum lorem ipsum</Text></View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View style={{ ...styles.checkboxContainer, width: "50%", flexDirection: "column", alignContent: "flex-start", justifyContent: "center" }}>
                                {recommendationsMIP2.map((recos) => (
                                    <View style={{ display: "flex", flexDirection: "row", height: "30%", width: "100%" }}>
                                        <View style={[styles.checkbox, { backgroundColor: 'white', borderColor: "rgb(214,43,51)" }]} >
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", height: "100%" }}>
                                            <Text style={styles.label}>{recos}</Text>
                                            <View style={{ ...styles.recsUnderline, width: "50%", height: "100%", marginTop: "-16px", marginLeft: "12px", color: "black", position: "relative" }}><Text style={{ position: "absolute", top: "12px", }}>lorem ipsum lorem ipsum</Text></View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
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
                                <View style={styles.firmasContainer}><Text>NOMBRE Y FIRMA</Text></View>
                                <View style={styles.firmasContainer}><Text>NOMBRE Y FIRMA</Text></View>
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
                <Page size={"LETTER"} style={styles.body}>
                    <View style={styles.container}></View>
                    <View style={{ ...styles.reporteFotográficoContainer }} >
                        <View style={{ ...styles.fechaTitle, width: "100%", alignItems: "center", justifyContent: "center", height: "10%" }} >
                            <Text style={{ paddingLeft: "3px" }}>REPORTE RFOTOGRÁFICO</Text>
                        </View>
                        <View style={styles.reporteFotográficoInfo}></View>
                    </View>
                </Page>
            </Document >
        </PDFViewer>
    )
};

export default MyDocument