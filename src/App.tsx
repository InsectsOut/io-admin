import { BrowserRouter as Router } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import AppRoutes from "./Routes";
import NavBar from "./NavBar";
import "./App.css";
import { ToastProvider } from "./rehusableComponents/Toast";

function App() {
    return (
        <ToastProvider>
            <Router basename="/">
                <NavBar></NavBar>
                <AppRoutes />
            </Router>
        </ToastProvider>
    );
}

export default App;
