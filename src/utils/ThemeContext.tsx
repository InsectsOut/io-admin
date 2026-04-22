import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { DefaultTheme } from "styled-components";
import { supabase } from "./ClientSupabase";

// Valores por defecto — se usan si la organización aún no tiene config guardada
export const defaultTheme: DefaultTheme = {
    primaryColor: "#0d4e80",
    secondaryColor: "#e74c3c",
    accentColor: "#eef5fb",
    logoUrl: null,
    logoDarkUrl: null,
    nombreEmpresa: null,
};

interface BrandThemeContextValue {
    theme: DefaultTheme;
    reloadTheme: () => void;
}

const BrandThemeContext = createContext<BrandThemeContextValue>({
    theme: defaultTheme,
    reloadTheme: () => {},
});

export const useBrandTheme = () => useContext(BrandThemeContext);

export const BrandThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<DefaultTheme>(defaultTheme);

    const fetchTheme = async () => {
        const org = localStorage.getItem("org");
        if (!org) return;

        const { data, error } = await supabase
            .from("OrganizacionConfig")
            .select("primary_color, secondary_color, accent_color, logo_url, logo_dark_url, nombre_empresa")
            .eq("organizacion", org)
            .maybeSingle();

        if (error) {
            console.error("Error cargando config de marca:", error.message);
            return;
        }

        if (data) {
            setTheme({
                primaryColor: data.primary_color,
                secondaryColor: data.secondary_color,
                accentColor: data.accent_color,
                logoUrl: data.logo_url,
                logoDarkUrl: data.logo_dark_url,
                nombreEmpresa: data.nombre_empresa,
            });
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <BrandThemeContext.Provider value={{ theme, reloadTheme: fetchTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </BrandThemeContext.Provider>
    );
};

