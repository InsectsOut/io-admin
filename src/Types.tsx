// Types.ts
interface Servicio {
    id: number;
    folio: string;
    Clientes: {
      nombre: string;
      apellidos: string;
    };
    fecha_servicio: string;
    realizado: boolean;
    tipo_servicio: string;
  }
  
  export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  