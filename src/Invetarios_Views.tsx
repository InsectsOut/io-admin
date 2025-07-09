import styled from 'styled-components';
import { FaPlus, FaTools, FaSignOutAlt, FaClipboardList, FaUserCog, FaWarehouse, FaLaptop, FaCar, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { boolean } from 'ts-pattern/dist/patterns';
import useBodyClick from "./UseBodyClick";
import { FolioLink, ServiciosElement, ServiciosElement1, ServiciosElement2, ServiciosElement3, ServiciosElement4, ServiciosElement5 } from './Servicios';


interface inventario_Views_Props {
    organizacion?: string;
    flag: string | undefined;
}
enum InventarioFlag {
    tecnicos = "tecnicos",
    principal = "principal",
    equipo = "equipo",
    vehiculos = "vehiculos",
    menu_Principal = "menu_principal"
}

const StyledServiciosElement1 = styled(ServiciosElement1)`
   
`;

const StyledServiciosElement2 = styled(ServiciosElement2)`
    
`;

const StyledServiciosElement3 = styled(ServiciosElement3)`
 
`;

const Inventario_Menu: React.FC<inventario_Views_Props> = (props) => {
    return (
        <>
            {props.flag === InventarioFlag.tecnicos && (
                <>
                    <h1>SACATE A BAÑAR LUPE TECNICA</h1>
                    <ServiciosElement>
                        <StyledServiciosElement1>
                            <h1>Lupe</h1>
                        </StyledServiciosElement1>
                        <StyledServiciosElement2>
                            <h1>como</h1>
                        </StyledServiciosElement2>
                        <StyledServiciosElement3>
                            <h1>estas</h1>
                        </StyledServiciosElement3>
                    </ServiciosElement>
                </>
            )}
            {props.flag === InventarioFlag.equipo && 
       <h1>SACATE A BAÑAR LUPE EQUIPERA</h1>
       }
       {props.flag === InventarioFlag.vehiculos && 
       <h1>SACATE A BAÑAR LUPE VEHICULAR</h1>
       }
       {props.flag === InventarioFlag.principal && 
       <h1>SACATE A BAÑAR LUPE PRINCIPAL</h1>
       }
       {props.flag === InventarioFlag.menu_Principal && 
       <h1>SACATE A BAÑAR LUPE PA TRAS</h1>
       }
        </>
    );
};

export default Inventario_Menu;