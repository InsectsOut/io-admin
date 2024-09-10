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



const AppRoutes = () => {
    const navigate = useNavigate()
    const [token, setToken] = useState<any>(null)
    const [session, setSessionData] = useState<any>()


    const getSession = async () => {

        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                throw new Error(error.message)
            }
            setSessionData(data?.session)

        }

        catch (err) {
            console.log(err)
        }
    }


    const authSupabase = () => {

        supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate("/")
            }
            else if (session && location.pathname === "/") {
                navigate("/inicio")
            }

        })
    }


    useEffect(() => {
        authSupabase()
        getSession()

    }, [navigate])



    return (
        <Routes>

            {/* <Route path="/login" element={<> <Login></Login></>}>  </Route> */}

            <Route path="/" element={<> <Login setToken={setToken}></Login></>}>  </Route>

            {session &&
                <>
                    <Route path="/inicio" element={<><Dashboard /></>}></Route>
                    <Route path="/Servicios" element={<><Servicios /></>}></Route>
                    <Route path="/Clientes" element={<><Clientes /></>}></Route>
                    <Route path="/Servicios/:folio" element={<><ServiciosCard /></>}></Route>
                    <Route path="/Clientes/:id" element={<><ClientesCard /></>}></Route>
                    <Route path="/nuevo-servicio" element={<><CreateServiceForm /></>}></Route>
                    <Route path="/nuevo-cliente" element={<><CreateClientForm /></>}></Route>
                    <Route path="/Servicios/pdf/:folio" element={<MyDocument />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/empleados" element={<DocumentUploader />} />
                    <Route path="/empleados/:id" element={<EmpleadosCard />} />
                </>
            }


        </Routes>

    )
}

export default AppRoutes;