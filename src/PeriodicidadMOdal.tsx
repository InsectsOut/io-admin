import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import useBodyClick from "./UseBodyClick";


export const StyledDatePicker = styled(DatePicker) /*style*/`
margin-left:.5rem;
  width: 95%; 
  margin-top: 1rem;
  background:white;
  color:#727272;
  text-align:center;
  border:none;
  font-size:1rem;
  margin-top:.25rem;
background:none;
text-align:left;

  &:hover{
    cursor:pointer;
  }
`;
const Input = styled.input /*style*/`
margin-left:.5rem;
  width: 95%; 
  margin-top: 1rem;
  background:white;
  color:#727272;
  text-align:center;
  border:none;
  font-size:1rem;
  margin-top:.25rem;
background:none;
text-align:left;

  &:hover{
    cursor:pointer;
  }
`;

const RepInput = styled(Input)`
height: 100%;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  z-index: 2;
  top: 100%;
  display: flex;
  flex-direction: column;
  height: 50vh;
  .modalTop{
   height: 90%;
   overflow: hidden;
  }
  .modalBottom{
   height: 10%;
  }
  justify-content: space-between;
  input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 1;
    display: block !important; 
    filter: invert(1) ;
    font-size: 1rem;
    margin-right: 1rem;
  }
`;

const Title = styled.h3`
  margin-bottom: 15px;
`;

const Label = styled.label<{ marginBott: number }>`
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: ${(props) => (props.marginBott ? `${props.marginBott}px` : "5px")};
`;
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f3f3f3;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
`;

const DateInput = styled.input`
  border: none;
  background: transparent;
  font-size: 14px;
  margin-left: 8px;
  cursor: pointer;
  outline: none;
  color:black;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 8px;
`;

const DaysContainer = styled.div<{ margin: string }>`
  display: flex;
  justify-content: space-between;
  margin: ${(props) => (props.margin ? `${props.margin}px` : "15px 0")};
`;

const DayButton = styled.div<{ selected: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.selected ? "#0057D9" : "#f3f3f3")};
  color: ${(props) => (props.selected ? "white" : "black")};
  font-size: 14px;
  cursor: pointer;
  display:flex;
  justify-content:center;
  align-items:center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.div`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
`;

const SaveButton = styled(Button)`
  background: #0057D9;
  color: white;
`;

const CancelButton = styled(Button)`
  background: #ddd;
  color: black;
`;

interface periodicidadProps {
  onClose: boolean
  startDateProp: Date | null
  startDateSend?: (date: Date) => void;
  selectedDaySend?: (day: number) => void;
  numDeServiciosSend?: (num: number) => void;
  ModalCloser?: (num: boolean) => void;
  dateGenerator?: () => void;
  dateTag: boolean;
  fechas_recomendadas?: Date[];
  datesSender?: (date: Date[]) => void;
}


const PeriodicidadModal: React.FC<periodicidadProps> = ({ onClose, startDateProp, startDateSend, selectedDaySend, numDeServiciosSend, ModalCloser, dateGenerator, dateTag, fechas_recomendadas, datesSender }) => {
  const [startDate, setStartDate] = useState<Date | null>(startDateProp);
  const [selectedDays, setSelectedDays] = useState<number | null>();
  const days = [
    { name: "D", number_of_day: 0 as number },
    { name: "L", number_of_day: 1 },
    { name: "M", number_of_day: 2 },
    { name: "M", number_of_day: 3 },
    { name: "J", number_of_day: 4 },
    { name: "V", number_of_day: 5 },
    { name: "S", number_of_day: 6 }
  ];
  const [numDeServicios, setNumDeServicios] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [endDate, setEndDate] = useState("2025-08-02");
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modifiedDates, setModifiedDates] = useState<Date[]>(fechas_recomendadas ? fechas_recomendadas : [])
  const [dateTagState , setDateTagState] = useState<boolean>(dateTag)


  const toggleDay = (day: any, index: number) => {
    setSelectedDays(day
    );
    selectedDaySend ? selectedDaySend(index) : null
    console.log(index)
  };

  const handleNumServiciosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let cambio = +event.target.value
    if (cambio) {
      setNumDeServicios(cambio)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    if (startDate && startDateSend) {
      startDateSend(startDate)
    }
  }, [startDate])



  useEffect(() => {
    if (numDeServicios && numDeServiciosSend) {
      numDeServiciosSend(numDeServicios)
    }
  }, [numDeServicios])

  useEffect(() => {
    if (fechas_recomendadas && fechas_recomendadas.length > 0) {
      setModifiedDates(fechas_recomendadas);
    }
  }, [fechas_recomendadas]); 
  useBodyClick(() => {
    ModalCloser ? ModalCloser(modalOpen) : null
    setModalOpen(false)

  }, [modalRef])

  const handleDatesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const cambio = new Date(event.target.value); 
    setModifiedDates((prevDates) => {
      const updated = [...prevDates];
      updated[index] = cambio;
      return updated;
    });
  };

  

  const dateTagChange = () =>{
    setDateTagState(prev => !prev)
    setModalOpen(true)

    
  }

 

  return (

    <ModalContainer
      ref={modalRef}
    >
      <div className="modalTop">
        {!dateTagState && (
          <><Title>Repetir</Title><Label>Iniciar</Label><InputContainer>
            <FaCalendarAlt />
            <StyledDatePicker
              value={startDate?.toISOString().split("T")[0]}
              dateFormat='yy-mm-dd'
              onChange={(date: Date) => setStartDate(date)} />
          </InputContainer><Label
            marginBott={0}
          >Número de servicios</Label><InputContainer>
              <RepInput type="number"
                value={numDeServicios}
                onChange={handleNumServiciosChange}
                placeholder="Eliga el número de servicios a crear"
              ></RepInput>
            </InputContainer><Label>Día de los servicios</Label><DaysContainer
              margin={"0"}
            >
              {days.map(({ name, number_of_day }) => (
                <DayButton
                  selected={selectedDays === number_of_day}
                  key={number_of_day} onClick={() => toggleDay(number_of_day, number_of_day)}>
                  {name} {/* Ensure only a string is rendered */}
                </DayButton>
              ))}
            </DaysContainer></>
        )}

        {dateTagState && (
          <><><Title>Fechas recomendadas</Title><Label>Iniciar</Label></>
            <div

              style={{ overflowY: "scroll", marginTop: ".5rem", display: "flex", gap: ".5rem", flexDirection: "column", height: "100%" }}>

              {modifiedDates?.map((fecha, index) =>

                <div style={{ marginTop: ".5rem", display: "flex", gap: ".5rem" }}>
                  <input
                    value={fecha?.toISOString().split("T")[0]}
                    onChange={(e) => handleDatesChange(e, index)}
                    style={{
                      background: "white", width: "100%", color: "gray", border: "0.071793rem solid #727272", height: "2.5125rem", borderRadius: "0.215379rem"
                    }} type="date"></input>
                    {/* TODO PODER HACER QUE SE MODIFIQUE LA HORA  */}
                  {/* <input style={{
                    background: "white", width: "45%", color: "gray", border: "0.071793rem solid #727272", height: "2.5125rem", borderRadius: "0.215379rem"
                  }} type="time"></input> */}

                </div>)}


            </div></>
        )}

      </div>
      <div className="modalBottom">

        <Footer>
          {!dateTagState &&
            <><CancelButton onClick={() => { ModalCloser ? ModalCloser(modalOpen) : null;}}>Descartar</CancelButton>
            <SaveButton ref={buttonRef} onClick={(event: React.MouseEvent<HTMLButtonElement>) =>{ ;dateGenerator ? dateGenerator() : null; dateTagChange(); }}>Generar fechas</SaveButton></>
          }
          {dateTagState &&
            <><CancelButton onClick={() => { ModalCloser ? ModalCloser(modalOpen) : null; }}>Cancelar</CancelButton><SaveButton
              onClick={() => {
                if (datesSender) datesSender(modifiedDates);
                if (ModalCloser) ModalCloser(modalOpen);
                window.alert("fechas guardadas");
              }}
            >
              Guardar fechas
            </SaveButton></>

          }
        </Footer>
      </div>
    </ModalContainer>
  );
};


export default PeriodicidadModal