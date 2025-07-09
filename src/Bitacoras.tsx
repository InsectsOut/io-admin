import mantenimiento from "./assets/Mantenimiento.png";






interface serviciosProps {
  organizacion?: string;
}

export const Bitacoras: React.FC<serviciosProps> = (props) => {
  type TipoFiltro = "nombres" | "folio" | "";

  return (
    <>
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <img src={mantenimiento} alt="Logo" style={{ width: "85%"}} />
      </div>
    </>
  )
}

export default Bitacoras