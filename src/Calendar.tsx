import { SetStateAction, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import daygrid from "@fullcalendar/daygrid";
import timegrid from "@fullcalendar/timegrid";
import interaction from "@fullcalendar/interaction";
import EventModal from "./EventModal";
import { supabase } from "./utils/ClientSupabase";
import { Database, Tables } from "./database-types";
import { FormatoInputs } from "./CreateServiceForm";
import { mainStyle, mainStyleNoArrow } from "./ServiciosCard";
import styled from "styled-components";

type Servicio = Tables<"Servicios">;
type Empleado = Tables<"Empleados">;
type Cliente = Tables<"Clientes">;

type ServicioConClientes = Servicio & {
  Clientes: Cliente | null;
  Empleados: Empleado | any;
  aplicador_Responsable?: string;
};

interface FilterEventsProps {
  hovered: boolean;
}

const FilterEvents = styled.div<FilterEventsProps> /*style*/ `
  background: ${props => (props.hovered ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)')} !important;
  cursor: pointer;
  color: #474747;
  height: 2.513rem;
  max-height: 2.513rem;
  width: 13.385rem;
  border: 0.072rem solid #727272;
  border-radius: 0.215rem;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
`;

const Modal = styled.div /*style*/ `
  position: absolute;
  display: flex;
  z-index: 999;
  background: white;
  height: 5rem;
  gap: 1rem;
  margin-top: .5rem;
  padding: .5rem .5rem .5rem .5rem;
  border-radius: 0.215rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  flex-direction: column;

  .selectsContainer {
    display: flex;
    gap: 1rem;
  }
`;

const FilterContainer = styled.div /*style*/ `
  position: absolute;
  left: 15%;
  height: 40.33px;
  user-select: none;

  .filtroActionButtons {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .actionButtonsStyles {
    width: 3.993125rem;
    height: 1.52125rem;
    font-style: normal;
    font-weight: 400;
    font-size: 0.8557rem;
    line-height: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
  }
`;

const RelativeContainer = styled.div /*style*/ `
  position: relative;
`;

const Calendar = () => {
  const [servicios, setServicios] = useState<ServicioConClientes[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<ServicioConClientes[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedAplicador, setSelectedAplicador] = useState<number | undefined>(undefined);
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchServicios = async () => {
    try {
      let query = await supabase.from("Servicios").select(`
        *,
        Clientes(*),
        Empleados:aplicador_Responsable(*)
      `);
      const { data, error } = await query;
      if (error) {
        console.log(error);
      }
      setServicios(data ?? []);
      setFilteredServicios(data ?? []); // Initialize filtered events with all events
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEmpleados = async () => {
    try {
      let query = await supabase.from("Empleados").select(`*`);
      const { data, error } = await query;
      if (error) {
        console.log(error);
      }
      setEmpleados(data ?? []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchClientes = async () => {
    try {
      let query = await supabase.from("Clientes").select(`*`);
      const { data, error } = await query;
      if (error) {
        console.log(error);
      }
      setClientes(data ?? []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClienteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(event.target.value);
  };

  const handleAplicadorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAplicador(parseInt(event.target.value));
  };

  const hoverChange = () => {
    setIsHovered(true);
  };

  const hoverLeave = () => {
    setIsHovered(false);
  };

  const handleModalOpener = () => {
    setModalActive(prev => !prev);
  };

  const applyFilter = () => {
    let filtered = servicios;

    if (selectedClient && selectedClient !== "Filtrar por cliente") {
      filtered = filtered.filter(
        (servicio) =>
          servicio.Clientes?.nombre + " " + servicio.Clientes?.apellidos === selectedClient
      );
    }

    if (selectedAplicador !== undefined && selectedAplicador !== 0) {
      filtered = filtered.filter(
        (servicio) => servicio.Empleados.id === selectedAplicador
      );
    }

    setFilteredServicios(filtered);
  };

  const clearFilter = () => {
    setFilteredServicios(servicios);
    setSelectedClient("");
    setSelectedAplicador(undefined);
  };

  useEffect(() => {
    fetchServicios();
    fetchClientes();
    fetchEmpleados();
  }, []);

  const events = filteredServicios.map((item) => ({
    title: `${item.Clientes?.nombre} ${item.Clientes?.apellidos}` || `Client ${item.cliente_id}`,
    start: `${item?.fecha_servicio}T${item?.horario_servicio}`,
    allDay: false,
    description: item.observaciones,
    folio: item.folio,
    frecuencia: item.frecuencia_recomendada,
    direccion: item.direccion_id,
    tipoServicio: item.tipo_servicio,
    tipoFolio: item.tipo_folio,
    responsable: item.responsable_id,
    realizado: item.realizado,
    cancelado: item.cancelado,
    aplicadorResponsable: item?.Empleados?.nombre,
    aplicadorResponsable_id: item?.aplicador_Responsable,
    tipoPlaga: item.tipo_plaga_id,
    ubicacion: item.direccion_id,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const renderEventContent = (eventInfo: any) => {
    let eventColor = '#3a87ad';
    switch (eventInfo.event.extendedProps.aplicadorResponsable_id) {
      case 1:
        eventColor = '#252558';
        break;
      case 2:
        eventColor = '#D62B33';
        break;
      case 3:
        eventColor = '#0E4E7F';
        break;
      case 4:
        eventColor = '#9F2026';
        break;
      case 5:
        eventColor = '#3C6A1E';
        break;
      default:
        eventColor = '#3C6A1E';
        break;
    }

    return (
      <div style={{ width: "100%", height: '100%', backgroundColor: eventColor, color: 'white', padding: '0 .25rem 0 .25rem', borderRadius: '4px' }}>
        <b>{eventInfo.event.timeText}</b>
        <p>{eventInfo.event.title}</p>
      </div>
    );
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      title: info.event.title,
      startTime: info.event.start,
      endTime: info.event.end,
      description: info.event.extendedProps.description,
      folio: info.event.extendedProps.folio,
      frecuencia: info.event.extendedProps.frecuencia,
      direccion: info.event.extendedProps.direccion,
      tipoServicio: info.event.extendedProps.tipoServicio,
      tipoFolio: info.event.extendedProps.tipoFolio,
      responsable: info.event.extendedProps.responsable,
      realizado: info.event.extendedProps.realizado,
      cancelado: info.event.extendedProps.cancelado,
      aplicadorResponsable: info.event.extendedProps.aplicadorResponsable,
      tipoPlaga: info.event.extendedProps.tipoPlaga,
      ubicacion: info.event.extendedProps.ubicacion,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ padding: '20px', color: 'black', fontFamily: "Dm Sans", position: "relative" }}>
      <FilterContainer className="positioning">
        <RelativeContainer>
          <FilterEvents
            hovered={isHovered}
            id="filterEvents"
            onMouseEnter={hoverChange}
            onMouseLeave={hoverLeave}
            onClick={handleModalOpener}
          >
            <p>Filtrar Servicios</p>
          </FilterEvents>
          {modalActive &&
            <Modal>
              <div className="selectsContainer">
                <select
                  value={selectedClient}
                  onChange={handleClienteChange}
                  style={{ ...mainStyle }}
                >
                  <option>Filtrar por cliente</option>
                  {clientes.map((item) => (
                    <option key={item.id}>
                      {item.nombre} {item.apellidos}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedAplicador}
                  onChange={handleAplicadorChange}
                  style={{ ...mainStyle }}
                >
                  <option value={0}>Filtrar por Aplicador</option>
                  {empleados.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filtroActionButtons">
                <button className="actionButtonsStyles" id="limpiar" onClick={clearFilter}>Limpiar</button>
                <button className="actionButtonsStyles" id="aplicar" type="button" onClick={applyFilter}>Aplicar</button>
              </div>
            </Modal>
          }
        </RelativeContainer>
      </FilterContainer>
      <FullCalendar
        plugins={[daygrid, timegrid, interaction]}
        initialView="dayGridWeek"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        eventTitle={selectedEvent?.title}
        eventStartTime={selectedEvent?.startTime?.toLocaleString()}
        eventEndTime={selectedEvent?.endTime?.toLocaleString()}
        eventDescription={selectedEvent?.description}
        eventFolio={selectedEvent?.folio}
        eventFrecuencia={selectedEvent?.frecuencia}
        eventDireccion={selectedEvent?.direccion}
        eventTipoServicio={selectedEvent?.tipoServicio}
        eventTipoFolio={selectedEvent?.tipoFolio}
        eventResponsable={selectedEvent?.responsable}
        eventRealizado={selectedEvent?.realizado}
        eventCancelado={selectedEvent?.cancelado}
        eventAplicadorResponsable={selectedEvent?.aplicadorResponsable}
        eventTipoPlaga={selectedEvent?.tipoPlaga}
        eventUbicacion={selectedEvent?.ubicacion}
      />
    </div>
  );
};

export default Calendar;
