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
          responsable_id: number
          telefono: string
          tipo_cliente: string
          update_at: string
        }
        Insert: {
          apellidos?: string | null
          created_at?: string
          email: string
          id?: number
          nombre: string
          responsable_id: number
          telefono: string
          tipo_cliente: string
          update_at?: string
        }
        Update: {
          apellidos?: string | null
          created_at?: string
          email?: string
          id?: number
          nombre?: string
          responsable_id?: number
          telefono?: string
          tipo_cliente?: string
          update_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Clientes_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "Responsables"
            referencedColumns: ["id"]
          }
        ]
      }
      Direcciones: {
        Row: {
          calle: string
          ciudad: string
          codigo_postal: string
          colonia: string
          created_at: string
          estado: string
          id: number
          numero_ext: string
          numero_int: string | null
          piso: string | null
          udpated_at: string
          cliente_id: number | null
        }
        Insert: {
          calle: string
          ciudad: string
          codigo_postal: string
          colonia: string
          created_at?: string
          estado: string
          id?: number
          numero_ext: string
          numero_int?: string | null
          piso?: string | null
          udpated_at?: string
          cliente_id: number | null
        }
        Update: {
          calle?: string
          ciudad?: string
          codigo_postal?: string
          colonia?: string
          created_at?: string
          estado?: string
          id?: number
          numero_ext?: string
          numero_int?: string | null
          piso?: string | null
          udpated_at?: string
          cliente_id: number | null
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
      plaguicidas: {
        Row: {
          id: number,
          nombre: string | null,
          registro: string | null,
          presentacion: string | null,
          ingrediente_activo: string | null,
          dosis_min: string | null,
          dosis_max: string | null
        }
        Insert: {
          id: number,
          nombre: string | null,
          registro: string | null,
          presentacion: string | null,
          ingrediente_activo: string | null,
          dosis_min: string | null,
          dosis_max: string | null
        }
        Update: {
          id?: number,
          nombre?: string | null,
          registro?: string | null,
          presentacion?: string | null,
          ingrediente_activo?: string | null,
          dosis_min?: string | null,
          dosis_max?: string | null
        }
        Relationships: [

        ]
      }
      Empleados: {
        Row: {
          activo: boolean
          created_at: string
          id: number
          nombre: string
          updated_at: string | null
          puesto?: string |null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: number
          nombre: string
          updated_at?: string | null
          puesto?: string |null
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: number
          nombre?: string
          updated_at?: string | null
          puesto?: string |null
        }
        Relationships: []
      }
      Productos: {
        Row: {
          created_at: string
          dosificacion: number | null
          id: number
          nombre: string
          registro_cofepris: string | null
          tags: string[] | null
          tipo_producto: string
          unidades: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosificacion?: number | null
          id?: number
          nombre: string
          registro_cofepris?: string | null
          tags?: string[] | null
          tipo_producto: string
          unidades?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosificacion?: number | null
          id?: number
          nombre?: string
          registro_cofepris?: string | null
          tags?: string[] | null
          tipo_producto?: string
          unidades?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      RegistroAplicacion: {
        Row: {
          area_aplicacion: string | null
          cantidad: number | null
          created_at: string
          id: number
          producto_id: number
          servicio_id: number
          tipo_aplicacion: string | null
          updated_at: string
          unidad: string
          tipo_plaga_id: number | null
          plaguicida_id: number
        }
        Insert: {
          area_aplicacion?: string | null
          cantidad?: number | null
          created_at?: string
          id?: number
          producto_id: number
          servicio_id: number
          tipo_aplicacion?: string | null
          updated_at?: string
          unidad?: string | null
          tipo_plaga_id: number | null
          plaguicida_id: number
        }
        Update: {
          area_aplicacion?: string | null
          cantidad?: number | null
          created_at?: string
          id?: number
          producto_id?: number
          servicio_id?: number
          tipo_aplicacion?: string | null
          updated_at?: string
          unidad?: string | null
          tipo_plaga_id: number | null
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
            foreignKeyName: "RegistroAplicacion_plaguicida_id_fkey"
            columns: ["plaguicida_id"]
            isOneToOne: false
            referencedRelation: "plaguicidas"
            referencedColumns: ["id"]
          }
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
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      Servicios: {
        Row: {
          cancelado: boolean | null
          cliente_id: number
          created_at: string
          direccion_id: number
          fecha_servicio: string
          folio: number
          frecuencia_recomendada: string | null
          horario_servicio: string
          id: number
          observaciones: string | null
          orden_compra: string | null
          realizado: boolean | null
          responsable_id: number | null
          tipo_folio: string | null
          tipo_servicio: string | null
          updated_at: string
          tipo_plaga: string | null
          tipo_plaga_id: number | null
          tipo_plaga_array_id: any | null

        }
        Insert: {
          cancelado?: boolean | null
          cliente_id: number
          created_at?: string
          direccion_id: number
          fecha_servicio: string
          folio: number
          frecuencia_recomendada?: string | null
          horario_servicio: string
          id?: number
          observaciones?: string | null
          orden_compra?: string | null
          realizado?: boolean | null
          responsable_id?: number | null
          tipo_folio?: string | null
          tipo_servicio?: string | null
          updated_at?: string
        }
        Update: {
          cancelado?: boolean | null
          cliente_id?: number
          created_at?: string
          direccion_id?: number
          fecha_servicio?: string
          folio?: number
          frecuencia_recomendada?: string | null
          horario_servicio?: string
          id?: number
          observaciones?: string | null
          orden_compra?: string | null
          realizado?: boolean | null
          responsable_id?: number | null
          tipo_folio?: string | null
          tipo_servicio?: string | null
          updated_at?: string
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
            foreignKeyName: "Servicios_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "Responsables"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
