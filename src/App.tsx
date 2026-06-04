import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./Routes";
import NavBar from "./NavBar";
import "./App.css";
import { ToastProvider } from "./rehusableComponents/Toast";
import { BrandThemeProvider } from "./utils/ThemeContext";

const PUBLIC_ROUTES = ["/encuesta/"];

function AppContent() {
    const { pathname } = useLocation();
    const isPublicRoute = PUBLIC_ROUTES.some(prefix => pathname.startsWith(prefix));

    return (
        <>
            {!isPublicRoute && <NavBar />}
            <AppRoutes />
        </>
    );
}

function App() {
    return (
        <BrandThemeProvider>
            <ToastProvider>
                <Router basename="/">
                    <AppContent />
                </Router>
            </ToastProvider>
        </BrandThemeProvider>
    );
}

export default App;
