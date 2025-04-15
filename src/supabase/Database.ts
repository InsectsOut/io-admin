export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Clientes: {
        Row: {
          apellidos: string | null
          created_at: string
          email: string
          id: number
          nombre: string
          organizacion: string | null
          responsable_id: number | null
          telefono: string
          tipo_cliente: string
          update_at: string
          user_id: string | null
        }
        Insert: {
          apellidos?: string | null
          created_at?: string
          email: string
          id?: number
          nombre: string
          organizacion?: string | null
          responsable_id?: number | null
          telefono: string
          tipo_cliente: string
          update_at?: string
          user_id?: string | null
        }
        Update: {
          apellidos?: string | null
          created_at?: string
          email?: string
          id?: number
          nombre?: string
          organizacion?: string | null
          responsable_id?: number | null
          telefono?: string
          tipo_cliente?: string
          update_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Clientes_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "Responsables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Clientes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["user_id"]
          },
        ]
      }
      Direcciones: {
        Row: {
          calle: string
          ciudad: string
          cliente_id: number
          codigo_postal: string
          colonia: string
          created_at: string
          estado: string
          id: number
          numero_ext: string
          numero_int: string | null
          piso: string | null
          ubicacion: string | null
          udpated_at: string
        }
        Insert: {
          calle: string
          ciudad: string
          cliente_id: number
          codigo_postal: string
          colonia: string
          created_at?: string
          estado: string
          id?: number
          numero_ext: string
          numero_int?: string | null
          piso?: string | null
          ubicacion?: string | null
          udpated_at?: string
        }
        Update: {
          calle?: string
          ciudad?: string
          cliente_id?: number
          codigo_postal?: string
          colonia?: string
          created_at?: string
          estado?: string
          id?: number
          numero_ext?: string
          numero_int?: string | null
          piso?: string | null
          ubicacion?: string | null
          udpated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Direcciones_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      DocumentosEmpleados: {
        Row: {
          created_at: string
          es_capacitacion: boolean | null
          id: number
          id_empleado: number | null
          nombre: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          es_capacitacion?: boolean | null
          id?: number
          id_empleado?: number | null
          nombre?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          es_capacitacion?: boolean | null
          id?: number
          id_empleado?: number | null
          nombre?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Documentos empleados_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      Empleados: {
        Row: {
          activo: boolean
          created_at: string
          cuenta_bancaria: number | null
          curp: string | null
          direccion: number | null
          fecha_nacimiento: string | null
          Firma: string | null
          id: number
          imss: string | null
          ine: string | null
          licencia_de_conducir: number | null
          nombre: string
          organizacion: string | null
          puesto: string | null
          telefono: number | null
          tipo_rol: Database["public"]["Enums"]["RolesEmpleado"] | null
          updated_at: string | null
          user_id: string | null
          vigencia_conducir_end: string | null
          vigencia_conducir_start: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          cuenta_bancaria?: number | null
          curp?: string | null
          direccion?: number | null
          fecha_nacimiento?: string | null
          Firma?: string | null
          id?: number
          imss?: string | null
          ine?: string | null
          licencia_de_conducir?: number | null
          nombre: string
          organizacion?: string | null
          puesto?: string | null
          telefono?: number | null
          tipo_rol?: Database["public"]["Enums"]["RolesEmpleado"] | null
          updated_at?: string | null
          user_id?: string | null
          vigencia_conducir_end?: string | null
          vigencia_conducir_start?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          cuenta_bancaria?: number | null
          curp?: string | null
          direccion?: number | null
          fecha_nacimiento?: string | null
          Firma?: string | null
          id?: number
          imss?: string | null
          ine?: string | null
          licencia_de_conducir?: number | null
          nombre?: string
          organizacion?: string | null
          puesto?: string | null
          telefono?: number | null
          tipo_rol?: Database["public"]["Enums"]["RolesEmpleado"] | null
          updated_at?: string | null
          user_id?: string | null
          vigencia_conducir_end?: string | null
          vigencia_conducir_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Empleados_direccion_fkey"
            columns: ["direccion"]
            isOneToOne: false
            referencedRelation: "Direcciones"
            referencedColumns: ["id"]
          },
        ]
      }
      ErroresSistema: {
        Row: {
          created_at: string
          descripcion: string | null
          id: number
          id_user: number
          imagen: string | null
          tipo_error: string | null
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: number
          id_user: number
          imagen?: string | null
          tipo_error?: string | null
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: number
          id_user?: number
          imagen?: string | null
          tipo_error?: string | null
          titulo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ErroresSistema_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      GruposDeServicios: {
        Row: {
          id: number
          organizacion: string | null
          servicios_id: number[] | null
        }
        Insert: {
          id?: number
          organizacion?: string | null
          servicios_id?: number[] | null
        }
        Update: {
          id?: number
          organizacion?: string | null
          servicios_id?: number[] | null
        }
        Relationships: []
      }
      Plagas: {
        Row: {
          created_at: string
          id: number
          plaga: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          plaga?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          plaga?: string | null
        }
        Relationships: []
      }
      Productos: {
        Row: {
          dosis_max: string | null
          dosis_min: string | null
          id: number
          ingrediente_activo: string | null
          nombre: string | null
          presentacion: string | null
          registro: string | null
          tipo_de_producto: Database["public"]["Enums"]["tipo_producto"] | null
        }
        Insert: {
          dosis_max?: string | null
          dosis_min?: string | null
          id?: number
          ingrediente_activo?: string | null
          nombre?: string | null
          presentacion?: string | null
          registro?: string | null
          tipo_de_producto?: Database["public"]["Enums"]["tipo_producto"] | null
        }
        Update: {
          dosis_max?: string | null
          dosis_min?: string | null
          id?: number
          ingrediente_activo?: string | null
          nombre?: string | null
          presentacion?: string | null
          registro?: string | null
          tipo_de_producto?: Database["public"]["Enums"]["tipo_producto"] | null
        }
        Relationships: []
      }
      Recomendaciones: {
        Row: {
          acciones: string[] | null
          created_at: string
          id: number
          imagen: string | null
          problema: string | null
          servicio_id: number | null
          udpated_at: string | null
        }
        Insert: {
          acciones?: string[] | null
          created_at?: string
          id?: number
          imagen?: string | null
          problema?: string | null
          servicio_id?: number | null
          udpated_at?: string | null
        }
        Update: {
          acciones?: string[] | null
          created_at?: string
          id?: number
          imagen?: string | null
          problema?: string | null
          servicio_id?: number | null
          udpated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Recomendaciones_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "Servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      RegistroAplicacion: {
        Row: {
          area_aplicacion: string | null
          cantidad: number | null
          cantidad_usada: number | null
          created_at: string
          dosis_recomendada:
            | Database["public"]["Enums"]["dosis_recomendada"]
            | null
          id: number
          producto_id: number | null
          servicio_id: number
          tipo_aplicacion: string | null
          tipo_plaga_id: number | null
          unidad: string | null
          updated_at: string
        }
        Insert: {
          area_aplicacion?: string | null
          cantidad?: number | null
          cantidad_usada?: number | null
          created_at?: string
          dosis_recomendada?:
            | Database["public"]["Enums"]["dosis_recomendada"]
            | null
          id?: number
          producto_id?: number | null
          servicio_id: number
          tipo_aplicacion?: string | null
          tipo_plaga_id?: number | null
          unidad?: string | null
          updated_at?: string
        }
        Update: {
          area_aplicacion?: string | null
          cantidad?: number | null
          cantidad_usada?: number | null
          created_at?: string
          dosis_recomendada?:
            | Database["public"]["Enums"]["dosis_recomendada"]
            | null
          id?: number
          producto_id?: number | null
          servicio_id?: number
          tipo_aplicacion?: string | null
          tipo_plaga_id?: number | null
          unidad?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "RegistroAplicacion_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "Productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RegistroAplicacion_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "Servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RegistroAplicacion_tipo_plaga_id_fkey"
            columns: ["tipo_plaga_id"]
            isOneToOne: false
            referencedRelation: "Plagas"
            referencedColumns: ["id"]
          },
        ]
      }
      Responsables: {
        Row: {
          cliente_id: number | null
          created_at: string
          email: string | null
          id: number
          nombre: string
          puesto: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          cliente_id?: number | null
          created_at?: string
          email?: string | null
          id?: number
          nombre: string
          puesto: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          cliente_id?: number | null
          created_at?: string
          email?: string | null
          id?: number
          nombre?: string
          puesto?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Responsables_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: true
            referencedRelation: "Clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      Servicios: {
        Row: {
          cancelado: boolean | null
          cliente_id: number
          created_at: string | null
          direccion_id: number | null
          fecha_servicio: string
          firma_cliente: string | null
          folio: number
          frecuencia_recomendada:
            | Database["public"]["Enums"]["FrecuenciaServicio"]
            | null
          grupo_de_servicios: number | null
          horario_entrada: string | null
          horario_salida: string | null
          horario_servicio: string
          id: number
          observaciones: string | null
          orden_compra: string | null
          organizacion: string | null
          realizado: boolean | null
          responsable_id: number | null
          tecnico_id: number | null
          tipo_folio: string | null
          tipo_plaga_array_id: number[] | null
          tipo_plaga_id: number | null
          tipo_servicio: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancelado?: boolean | null
          cliente_id: number
          created_at?: string | null
          direccion_id?: number | null
          fecha_servicio: string
          firma_cliente?: string | null
          folio?: number
          frecuencia_recomendada?:
            | Database["public"]["Enums"]["FrecuenciaServicio"]
            | null
          grupo_de_servicios?: number | null
          horario_entrada?: string | null
          horario_salida?: string | null
          horario_servicio: string
          id?: number
          observaciones?: string | null
          orden_compra?: string | null
          organizacion?: string | null
          realizado?: boolean | null
          responsable_id?: number | null
          tecnico_id?: number | null
          tipo_folio?: string | null
          tipo_plaga_array_id?: number[] | null
          tipo_plaga_id?: number | null
          tipo_servicio?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancelado?: boolean | null
          cliente_id?: number
          created_at?: string | null
          direccion_id?: number | null
          fecha_servicio?: string
          firma_cliente?: string | null
          folio?: number
          frecuencia_recomendada?:
            | Database["public"]["Enums"]["FrecuenciaServicio"]
            | null
          grupo_de_servicios?: number | null
          horario_entrada?: string | null
          horario_salida?: string | null
          horario_servicio?: string
          id?: number
          observaciones?: string | null
          orden_compra?: string | null
          organizacion?: string | null
          realizado?: boolean | null
          responsable_id?: number | null
          tecnico_id?: number | null
          tipo_folio?: string | null
          tipo_plaga_array_id?: number[] | null
          tipo_plaga_id?: number | null
          tipo_servicio?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Servicios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Servicios_direccion_id_fkey"
            columns: ["direccion_id"]
            isOneToOne: false
            referencedRelation: "Direcciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Servicios_grupo_de_servicios_fkey"
            columns: ["grupo_de_servicios"]
            isOneToOne: false
            referencedRelation: "GruposDeServicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Servicios_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "Responsables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Servicios_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Servicios_tipo_plaga_id_fkey"
            columns: ["tipo_plaga_id"]
            isOneToOne: false
            referencedRelation: "Plagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Servicios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_folio: {
        Args: { org_name: string }
        Returns: number
      }
      generate_temporal_folio: {
        Args: { org_name: string } | Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      dosis_recomendada: "min" | "max"
      FrecuenciaServicio:
        | "Ninguna"
        | "Semanal"
        | "Quincenal"
        | "Mensual"
        | "Bimestral"
        | "Trimestral"
        | "Semestral"
        | "Anual"
      RolesEmpleado: "tecnico" | "administrador" | "superadmin"
      tipo_producto: "plaguicida" | "trampa" | "cebo" | "gel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      dosis_recomendada: ["min", "max"],
      FrecuenciaServicio: [
        "Ninguna",
        "Semanal",
        "Quincenal",
        "Mensual",
        "Bimestral",
        "Trimestral",
        "Semestral",
        "Anual",
      ],
      RolesEmpleado: ["tecnico", "administrador", "superadmin"],
      tipo_producto: ["plaguicida", "trampa", "cebo", "gel"],
    },
  },
} as const
