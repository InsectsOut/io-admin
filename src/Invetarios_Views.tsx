import { useState } from "react";
import { FaUserCog, FaWarehouse, FaLaptop, FaCar } from "react-icons/fa";
import SubInventarioList from "./SubInventarioList";
import SubInventarioDetalle from "./SubInventarioDetalle";
import { Enums } from "./supabase/Database";
import { DashbboardButton } from "./Inventario";

interface inventario_Views_Props {
    organizacion: string;
    flag: Enums<"TipoInventario">;
}

const Inventario_Menu: React.FC<inventario_Views_Props> = ({ flag, organizacion }) => {
    const [selectedSub, setSelectedSub] = useState<number | null>(null);
    const [selectedSubName, setSelectedSubName] = useState<string>("");
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
            case "empleado":
                return <FaUserCog />;
            case "principal":
                return <FaWarehouse />;
            case "equipo":
                return <FaLaptop />;
            case "vehiculo":
                return <FaCar />;
            default:
                return null;
        }
    };

    if (!flag) {
        return <h1 className="title">Selecciona una categoría del inventario</h1>;
    }

    const clearParams = () => {
        const url = new URL(window.location.href);
        url.search = ""; // this removes all search params
        window.history.replaceState(null, "", url.toString());
    };

    return (
        <>
            {selectedSub && (
                <DashbboardButton
                    style={{ height: "3rem", margin: "1rem 0", fontSize: "1rem", fontWeight: 600, marginLeft: "2rem" }}
                    onClick={() => {
                        clearParams();
                        setSelectedSub(null);
                    }}
                >
                    ← Volver a subinventarios
                </DashbboardButton>
            )}
            {!selectedSub ? (
                <SubInventarioList
                    organizacion={organizacion}
                    title={`Inventarios de ${flag}`}
                    icon={getIcon()}
                    subinventarios={subinventarios[flag] || []}
                    onSelect={(id, nombre) => {
                        setSelectedSub(id);
                        setSelectedSubName(nombre ?? "");
                    }}
                    onAdd={handleAddSub}
                    flag={flag}
                />
            ) : (
                <SubInventarioDetalle
                    organizacion={organizacion}
                    flag={flag}
                    name={selectedSubName}
                    items={fakeItems || []}
                    onAddItem={handleAddItem}
                />
            )}
        </>
    );
};

export default Inventario_Menu;
