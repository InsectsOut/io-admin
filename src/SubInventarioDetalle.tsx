// ✅ SubInventarioDetalle.tsx
import { SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { CardInputs } from './rehusableComponents/CardInputs';
import { CreateButton, ModalButton, ModalContent, ModalForm, ModalOverlay } from './rehusableComponents/CreateInventariosModal';
import { StyledSelect } from './rehusableComponents/StyledSelect';
import { Database, Tables } from './supabase/Database';
import { supabase } from './utils/ClientSupabase';
import { set } from 'ts-pattern/dist/patterns';
import { eq } from '@fullcalendar/core/internal-common';
import { FaEdit } from 'react-icons/fa';
interface SubInventarioDetalleProps {
    name?: string;
    items: InventarioItem[];
    onAddItem: (item: string) => void;
    flag: string;
}

type TipoDeGasto = Database["public"]["Enums"]["UnidadDeGasto"]
type PresentaciónUnidad = Database["public"]["Enums"]["PresentacionUnidad"]
type Productos = Tables<"Productos">;
type InventarioProducos = Tables<"Inventario_productos">;


interface InventarioItem {
    inventario_id: number;
    producto_id: number;
    stock: number;
    unidad_de_gasto: string;
    presentacion_cantidad: number;
    presentacion_unidad: string;
    precio: number;
}

enum InventarioFlag {
    tecnicos = 'tecnicos',
    principal = 'principal',
    equipo = 'equipo',
    vehiculos = 'vehiculos',
    menu_Principal = 'menu_principal',
}

const SectionContainer = styled.div`
  width: 95%;
  background-color: #F7F9FB;
  border-radius: 0.5rem;
  box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  margin: 1rem auto;
  font-family: 'Open Sans';
`;

const SectionTitle = styled.h2`
  color: #0D4E80;
  margin-bottom: 1rem;
`;

const EntryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EntryItem = styled.li`
  background: white;
  margin-bottom: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0.287rem 0.287rem rgba(0, 0, 0, 0.1);
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items:center;
  gap: 1rem;
  font-family: 'Open Sans', sans-serif;
  h3{
    cursor: pointer;
  }
`;
const EntryText = styled.span`
  font-size: 1rem;
`;

const AddForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AddInput = styled.input`
  padding: 0.5rem;
  flex: 1;
`;

const AddButton = styled.button`
  background: #0D4E80;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
`;

const EntryRow = styled.div`
  width: 20%;
  display: flex;
  justify-content: flex-start;

  &.entryFirstElement{
    width: 20%;
  }
  &.entrySecondElement{
    width: 15%;
  }
  &.entryThirdElement{
    width: 15%;
  }
  &.entryFourthElement{
    width: 15%;
  }
  &.entryFifthElement{
    width: 15%;
  }
 
`;

const SubInventarioDetalle: React.FC<SubInventarioDetalleProps> = ({
    name,
    items,
    onAddItem,
    flag,
}) => {
    const [newItem, setNewItem] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoId, setProductoId] = useState<number>();
    const [stock, setStock] = useState<number>();
    const [unidadDeGasto, setUnidadDeGasto] = useState<TipoDeGasto>();
    const [presentacionCantidad, setPresentacionCantidad] = useState<number | null>(null)
    const [presentacionUnidad, setPresentacionUnidad] = useState<PresentaciónUnidad>();
    const [precio, setPrecio] = useState<number | null>(null);
    const [productos, setProductos] = useState<Productos[]>([]);
    const [inventarioId, setInventarioId] = useState<number>(
        Number(new URLSearchParams(window.location.search).get("inventarioId"))

    );
    const [inventarioEntries, setInventarioEntries] = useState<InventarioProducos[] | null>(null)
    const [inventarioEntry, setInventarioEntry] = useState<InventarioProducos[] | null>(null)
    const [editable, setEditable] = useState<boolean>(false)
    const [entryId,setEntryId] = useState<number | null>(null)

    enum TipoDeGastoEnum {
        gramos = "g",
        mililitros = "ml",
        piezas = "pzs",
    }

    enum PresentacionUnidadEnum {
        gramos = "g",
        litros = "L",
        mililitros = "ml",
        kilogramos = "kg",
        piezas = "pzs"
    }



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAddItem(newItem.trim());
            setNewItem('');
        }
    };

    const fetchInventarioProductos = async () => {
        try {
            const { data, error } = await supabase
                .from('Inventario_productos')
                .select('*')
                .eq('inventario_id', inventarioId)

            if (error) {
                throw error;
            }

            if (data) {
                console.log("Inventario productos fetched successfully:", data);
                setInventarioEntries(data)
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    }
    const fetchSingleEntry = async (entryId:number) => {
        try {
            const { data, error } = await supabase
                .from('Inventario_productos')
                .select('*')
                .eq('id', entryId)

            if (error) {
                throw error;
            }

            if (data) {
                console.log("Inventario productos fetched successfully:", data);
               setInventarioEntry(data)
               setProductoId(data[0]?.producto_id ?? productoId);
                setStock(data[0].stock);
                setUnidadDeGasto(data[0].unidad_de_gasto);
                setPresentacionCantidad(data[0].presentacion_cantidad);
                setPresentacionUnidad(data[0].presentacion_unidad);
                setPrecio(data[0].precio);
               // setIsModalOpen(false);
                fetchInventarioProductos();
            } else {
                console.log("No inventario productos found.");
            }
        } catch (error) {
            console.error("Error fetching inventario productos:", error);
        }
    }

    const createEntry = async () => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .insert([{
                    inventario_id: inventarioId, // Assuming you have a fixed inventario_id for this example
                    producto_id: productoId,
                    stock: stock,
                    unidad_de_gasto: unidadDeGasto,
                    presentacion_cantidad: presentacionCantidad,
                    presentacion_unidad: presentacionUnidad,
                    precio: precio
                }] as InventarioProducos[]);

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                console.log("Inventario creado:", data);
                setProductoId(undefined);
                setStock(undefined);
                setUnidadDeGasto(undefined);
                setPresentacionCantidad(null);
                setPresentacionUnidad(undefined);
                setPrecio(null);
                setIsModalOpen(false);
                fetchInventarioProductos();

            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    }
    const editEntry = async (entryId:number) => {
        try {
            const { data, error } = await supabase
                .from("Inventario_productos")
                .update<Partial<InventarioProducos>>({
                    producto_id: productoId,
                    stock: stock,
                    unidad_de_gasto: unidadDeGasto,
                    presentacion_cantidad: presentacionCantidad ?? 0,
                    presentacion_unidad: presentacionUnidad,
                    precio: precio ?? 0
                  })
                .eq("id",entryId)

            if (error) {
                console.error("Error creando inventario:", error);
            } else {
                console.log("Inventario creado:", data);
                setProductoId(undefined);
                setStock(undefined);
                setUnidadDeGasto(undefined);
                setPresentacionCantidad(null);
                setPresentacionUnidad(undefined);
                setPrecio(null);
                setIsModalOpen(false);
                fetchInventarioProductos();

            }
        } catch (err) {
            console.error("Error creating inventario:", err);
        }
    }

    const fetchproductos = async () => {
        try {
            const { data, error } = await supabase
                .from('Productos')
                .select('*');

            if (error) {
                throw error;
            }

            if (data) {
                console.log("Productos fetched successfully:", data);
                setProductos(data);
            } else {
                console.log("No products found.");
            }
        }
        catch (error) {
            console.error("Error fetching productos:", error);
        }
    }

    useEffect(() => {
        if (InventarioFlag.tecnicos === flag) {
            fetchInventarioProductos();
            fetchproductos();
        }

    }, []);

    return (
        <SectionContainer>
            <SectionTitle>Contenido de {flag}</SectionTitle>
            {flag === InventarioFlag.tecnicos &&
                <EntryList>
                    {inventarioEntries?.map((entry, index) => (
                        <EntryItem key={index}>
                            <EntryRow
                                className="entryFirstElement"
                            >
                                <EntryText>
                                    <strong>Producto:</strong> {productos.find((item) => item.id === entry?.producto_id)?.nombre}
                                </EntryText>
                            </EntryRow>
                            <EntryRow
                                className="entrySecondElement"
                            >
                                <EntryText><strong>Stock:</strong> {entry.stock}</EntryText>
                            </EntryRow>
                            <EntryRow
                                className="entryThirdElement"
                            >
                                <EntryText><strong>Unidad de Gasto:</strong> {entry.unidad_de_gasto}</EntryText>
                            </EntryRow>
                            <EntryRow
                                className="entryFourthElement"
                            >
                                <EntryText><strong>Presentación:</strong> {entry.presentacion_cantidad} {entry.presentacion_unidad}</EntryText>
                            </EntryRow>
                            <EntryRow
                                className="entryFifthElement"
                            >
                                <EntryText><strong>Precio:</strong> ${entry.precio}</EntryText>
                            </EntryRow>
                            <h3 
                            onClick={() => {fetchSingleEntry(entry.id);setEditable(true); setIsModalOpen(true); setEntryId(entry.id)}}
                            style={{ alignSelf: "left" }} className="primerSector" id="iconSector" > <FaEdit size={20} /></h3>
                        </EntryItem>
                    ))}
                </EntryList>
            }


            <CreateButton onClick={() => setIsModalOpen(true)}>
                <FaPlus />
            </CreateButton>


            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h2>Crear Nueva Entrada</h2>
                        <ModalForm>
                            <StyledSelect
                                largo="100%"
                                type="number"
                                name="producto_id"
                                required={true}
                                defaultValue=""
                                value={productoId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setProductoId(+e.target.value) }}
                            >
                                <option value="" disabled>
                                    Selecciona un Producto
                                </option>
                                {productos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </StyledSelect>
                            <CardInputs
                                largo="100%"
                                placeholder="Stock"
                                type="number"
                                step="0.01"
                                name="stock"
                                required={true}
                                value={stock}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(parseFloat(e.target.value))}
                            />
                            <StyledSelect name="unidad_de_gasto" required defaultValue=""
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUnidadDeGasto(e.target.value as TipoDeGasto)}
                                value={unidadDeGasto}
                            >
                                <option value="" disabled>
                                    Unidad de Gasto
                                </option>
                                {Object.entries(TipoDeGastoEnum).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </StyledSelect>
                            <CardInputs
                                largo="100%"
                                placeholder="Presentación Cantidad"
                                type="number"
                                step="0.01"
                                name="presentacion_cantidad"
                                required={true}
                                value={presentacionCantidad}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPresentacionCantidad(parseFloat(e.target.value))}
                            />
                            <StyledSelect name="presentacion_unidad" required defaultValue=""
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPresentacionUnidad(e.target.value as PresentaciónUnidad)}
                                value={presentacionUnidad}
                            >
                                <option value="" disabled>
                                    Presentación Unidad
                                </option>
                                {Object.entries(PresentacionUnidadEnum).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </StyledSelect>
                            <CardInputs
                                largo="100%"
                                placeholder="Precio"
                                type="number"
                                step="0.01"
                                name="precio"
                                required={true}
                                value={precio}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrecio(parseFloat(e.target.value))}
                            />
                            {editable && entryId &&
                                <ModalButton onClick={() => editEntry(entryId)} type="button">Editar Entrada</ModalButton>
                            }
                            {!editable &&
                                <ModalButton onClick={() => createEntry()} type="button">Crear Entrada</ModalButton>
                            }
                        </ModalForm>
                        <ModalButton onClick={() => setIsModalOpen(false)}>Cerrar</ModalButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </SectionContainer>
    );
};

export default SubInventarioDetalle;
