import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Inicio";
import NavBar from "./NavBar";
import Servicios from "./Servicios";
import CreateServiceForm from "./CreateServiceForm";
import DocumentUploader from "./Empleados";
import ServiciosCard from "./ServiciosCard";
import Clientes from "./Clientes";
import ClientesCard from "./ClientesCard";
import CreateClientForm from "./CreateCliente";
import { useEffect, useState } from "react";
import { supabase } from "./utils/ClientSupabase";
import MyDocument from "./Constancia";
import { PDFViewer } from "@react-pdf/renderer";
import Calendar from "./Calendar";
import EmpleadosCard from "./EmpleadosCard";
import CreateEmployee from "./CreateEmployee";
import MyConstanciaMobile from "./ConstanciaMobile";
import Bitacoras from "./Bitacoras";
import Inventario from "./Inventario";
import Profile from "./Profile";
import { Tables } from "./supabase/Database";
import CertificadoServicio from "./ConstanciaLight";
import Configuracion from "./Configuracion";

const AppRoutes = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<any>(null);
    const [session, setSessionData] = useState<any>();
    const [user_id, setUser_id] = useState<string>("");
    const [org, setOrg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true); // Add loading state to prevent premature rendering

    const getSession = async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                throw new Error(error.message);
            }

            setSessionData(data?.session);
            const userId = data?.session?.user?.id ?? "";
            setUser_id(userId);
            localStorage.setItem("user_id", data?.session?.user?.id ?? "");

            await fetchOrganización(userId);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false); // Set loading to false once session and org are fetched
        }
    };

    const authSupabase = () => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate("/");
            } else if (session && location.pathname === "/") {
                navigate("/inicio");
            }
        });
    };

    const fetchOrganización = async (user_id: string | null) => {
        try {
            let query = supabase;
            const { data, error } = await query
                .from("Empleados")
                .select("organizacion")
                .filter("user_id", "eq", user_id);
            //@ts-ignore
            setOrg(data?.[0]?.organizacion ?? "");
            //@ts-ignore
            localStorage.setItem("org", data?.[0]?.organizacion ?? "");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        authSupabase();
        getSession();
    }, [navigate]);

    useEffect(() => {
        fetchOrganización(localStorage.getItem("user_id") ?? "");
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            {/* <Route path="/login" element={<> <Login></Login></>}>  </Route> */}

            <Route
                path="/"
                element={
                    <>
                        {" "}
                        <Login setToken={setToken}></Login>
                    </>
                }
            >
                {" "}
            </Route>

            {session && (
                <>
                    <Route
                        path="/inicio"
                        element={
                            <>
                                <Dashboard />
                            </>
                        }
                    ></Route>
                    <Route
                        path="/Servicios"
                        element={
                            <>
                                <Servicios organizacion={localStorage.getItem("org") ?? ""} />
                            </>
                        }
                    ></Route>
                    <Route
                        path="/Clientes"
                        element={
                            <>
                                <Clientes organizacion={localStorage.getItem("org") ?? ""} />
                            </>
                        }
                    ></Route>
                    <Route
                        path="/Servicios/:folio"
                        element={
                            <>
                                <ServiciosCard organizacion={localStorage.getItem("org") ?? ""} />
                            </>
                        }
                    ></Route>
                    <Route
                        path="/Clientes/:id"
                        element={
                            <>
                                <ClientesCard organizacion={localStorage.getItem("org") ?? ""} />
                            </>
                        }
                    ></Route>
                    <Route
                        path="/nuevo-servicio"
                        element={
                            <>
                                <CreateServiceForm user_id={localStorage.getItem("user_id") ?? ""} />
                            </>
                        }
                    ></Route>
                    <Route
                        path="/nuevo-cliente"
                        element={
                            <>
                                <CreateClientForm
                                    organizacion={localStorage.getItem("org") ?? ""}
                                    user_id={localStorage.getItem("user_id") ?? ""}
                                />
                            </>
                        }
                    ></Route>
                    <Route path="/Servicios/pdf/:folio" element={<MyDocument />} />
                    <Route path="/Servicios/pdfMobile/:folio" element={<MyConstanciaMobile />} />
                    <Route path="/calendar" element={<Calendar organizacion={localStorage.getItem("org") ?? ""} />} />
                    <Route
                        path="/empleados"
                        element={<DocumentUploader organizacion={localStorage.getItem("org") ?? ""} />}
                    />
                    <Route path="/empleados/:id" element={<EmpleadosCard />} />
                    <Route
                        path="/nuevo-empleado"
                        element={<CreateEmployee organizacion={localStorage.getItem("org") ?? ""} />}
                    />
                    <Route path="/bitacoras" element={<Bitacoras organizacion={localStorage.getItem("org") ?? ""} />} />
                    <Route
                        path="/inventario"
                        element={<Inventario organizacion={localStorage.getItem("org") ?? ""} />}
                    />
                    <Route path="/certificado/:id" element={<CertificadoServicio></CertificadoServicio>}></Route>
                    <Route
                        path="/perfil"
                        element={
                            <Profile
                                user={{
                                    id: session.user.id,
                                    email: session.user.email ?? "",
                                    role: session.user.role,
                                    name: session.user.user_metadata?.name,
                                    avatarUrl: session.user.user_metadata?.avatar_url,
                                    organizacion: localStorage.getItem("org") ?? "",
                                }}
                            />
                        }
                    />
                    <Route path="/configuracion" element={<Configuracion />} />
                </>
            )}
        </Routes>
    );
};

export default AppRoutes;
