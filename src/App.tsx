import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import NavBar from "./NavBar";
import "./App.css";
import { ToastProvider } from "./rehusableComponents/Toast";
import { BrandThemeProvider } from "./utils/ThemeContext";

function App() {
    return (
        <BrandThemeProvider>
            <ToastProvider>
                <Router basename="/">
                    <NavBar></NavBar>
                    <AppRoutes />
                </Router>
            </ToastProvider>
        </BrandThemeProvider>
    );
}

export default App;
