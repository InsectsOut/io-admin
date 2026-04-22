import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        logoUrl: string | null;
        logoDarkUrl: string | null;
        nombreEmpresa: string | null;
    }
}

