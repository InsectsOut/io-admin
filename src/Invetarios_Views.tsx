import { useState } from "react";
import { FaUserCog, FaWarehouse, FaLaptop, FaCar } from "react-icons/fa";
import SubInventarioList from "./SubInventarioList";
import SubInventarioDetalle from "./SubInventarioDetalle";

interface inventario_Views_Props {
    organizacion: string;
    flag: string | undefined;
}

enum InventarioFlag {
    tecnicos = "tecnicos",
    principal = "principal",
    equipo = "equipo",
    vehiculos = "vehiculos",
    menu_Principal = "menu_principal",
}

const Inventario_Menu: React.FC<inventario_Views_Props> = ({ flag, organizacion }) => {
    const [selectedSub, setSelectedSub] = useState<number | null>(null);
    const [subinventarios, setSubinventarios] = useState<Record<string, string[]>>({
        tecnicos: ["Juan Pérez", "Ana López"],
        principal: ["Bodega Principal"],
        equipo: ["Equipo Electrónico"],
        vehiculos: ["Camionetas"],
    });
    const fakeItems = [
        {
            inventario_id: 1,
            producto_id: 101,
            stock: 25.5,
            unidad_de_gasto: "kg",
            presentacion_cantidad: 5,
            presentacion_unidad: "paquete",
            precio: 149.99,
        },
        {
            inventario_id: 2,
            producto_id: 202,
            stock: 10,
            unidad_de_gasto: "litros",
            presentacion_cantidad: 1,
            presentacion_unidad: "botella",
            precio: 89.5,
        },
        {
            inventario_id: 3,
            producto_id: 303,
            stock: 100,
            unidad_de_gasto: "unidad",
            presentacion_cantidad: 10,
            presentacion_unidad: "pieza",
            precio: 12.75,
        },
    ];

    const [detalle, setDetalle] = useState<Record<string, string[]>>({
        "Juan Pérez": ["3 trampas", "2 mochilas"],
        "Ana López": ["1 aspersor", "5 litros químico A"],
        "Bodega Principal": ["Insecticida A - 12 unidades", "Mascarillas - 200 piezas"],
        "Equipo Electrónico": ["Laptop HP - 5 disponibles", "Multímetros - 7 unidades"],
        Camionetas: ["QRO-123 - En ruta", "QRO-456 - En mantenimiento"],
    });

    const handleAddSub = (newName: string) => {
        if (!flag) return;
        setSubinventarios(prev => ({
            ...prev,
            [flag]: [...(prev[flag] || []), newName],
        }));
        setDetalle(prev => ({
            ...prev,
            [newName]: [],
        }));
    };

    const handleAddItem = (item: string) => {
        if (!selectedSub) return;
        setDetalle(prev => ({
            ...prev,
            [selectedSub]: [...(prev[selectedSub] || []), item],
        }));
    };

    const getIcon = () => {
        switch (flag) {
            case InventarioFlag.tecnicos:
                return <FaUserCog />;
            case InventarioFlag.principal:
                return <FaWarehouse />;
            case InventarioFlag.equipo:
                return <FaLaptop />;
            case InventarioFlag.vehiculos:
                return <FaCar />;
            default:
                return null;
        }
    };

    if (!flag || flag === InventarioFlag.menu_Principal) {
        return <h1 className="title">Selecciona una categoría del inventario</h1>;
    }

    return (
        <>
            {selectedSub && <button onClick={() => setSelectedSub(null)}>← Volver a subinventarios</button>}
            {!selectedSub ? (
                <SubInventarioList
                    organizacion={organizacion}
                    title={`Inventarios de ${flag}`}
                    icon={getIcon()}
                    subinventarios={subinventarios[flag] || []}
                    onSelect={id => {
                        setSelectedSub(id);
                        console.log(id);
                    }}
                    onAdd={handleAddSub}
                    flag={flag}
                />
            ) : (
                <SubInventarioDetalle
                    // name={selectedSub}
                    flag={flag}
                    items={fakeItems || []}
                    onAddItem={handleAddItem}
                />
            )}
        </>
    );
};

export default Inventario_Menu;
