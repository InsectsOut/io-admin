export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      AreaGubernamental: {
        Row: {
          created_at: string
          id: number
          nombreAreaGob: string | null
          organizacion: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nombreAreaGob?: string | null
          organizacion?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nombreAreaGob?: string | null
          organizacion?: string | null
        }
        Relationships: []
      }
      Bitacoras: {
        Row: {
          cliente_id: number
          created_at: string
          direccion_id: number
          estado: Database["public"]["Enums"]["bitacora_estado"]
          id: number
          layout_height: number | null
          layout_image_url: string | null
          layout_width: number | null
          nombre: string | null
          notas_generales: string | null
          organizacion: string
          tipo: Database["public"]["Enums"]["bitacora_tipo"]
          updated_at: string
          version: number
        }
        Insert: {
          cliente_id: number
          created_at?: string
          direccion_id: number
          estado?: Database["public"]["Enums"]["bitacora_estado"]
          id?: number
          layout_height?: number | null
          layout_image_url?: string | null
          layout_width?: number | null
          nombre?: string | null
          notas_generales?: string | null
          organizacion: string
          tipo: Database["public"]["Enums"]["bitacora_tipo"]
          updated_at?: string
          version?: number
        }
        Update: {
          cliente_id?: number
          created_at?: string
          direccion_id?: number
          estado?: Database["public"]["Enums"]["bitacora_estado"]
          id?: number
          layout_height?: number | null
          layout_image_url?: string | null
          layout_width?: number | null
          nombre?: string | null
          notas_generales?: string | null
          organizacion?: string
          tipo?: Database["public"]["Enums"]["bitacora_tipo"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "Bitacoras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bitacoras_direccion_id_fkey"
            columns: ["direccion_id"]
            isOneToOne: false
            referencedRelation: "Direcciones"
            referencedColumns: ["id"]
          },
        ]
      }
      ClavesBitacora: {
        Row: {
          activo: boolean
          clave: string
          concepto: string
          created_at: string
          id: number
          organizacion: string
          tipo: Database["public"]["Enums"]["bitacora_tipo"] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          clave: string
          concepto: string
          created_at?: string
          id?: number
          organizacion: string
          tipo?: Database["public"]["Enums"]["bitacora_tipo"] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          clave?: string
          concepto?: string
          created_at?: string
          id?: number
          organizacion?: string
          tipo?: Database["public"]["Enums"]["bitacora_tipo"] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      Clientes: {
        Row: {
          apellidos: string | null
          created_at: string
          email: string
          gob_id: number | null
          id: number
          nombre: string
          organizacion: string | null
          Partida: number | null
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
          gob_id?: number | null
          id?: number
          nombre: string
          organizacion?: string | null
          Partida?: number | null
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
          gob_id?: number | null
          id?: number
          nombre?: string
          organizacion?: string | null
          Partida?: number | null
          responsable_id?: number | null
          telefono?: string
          tipo_cliente?: string
          update_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Clientes_gob_id_fkey"
            columns: ["gob_id"]
            isOneToOne: false
            referencedRelation: "AreaGubernamental"
            referencedColumns: ["id"]
          },
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
          apodo_direccion: string | null
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
          responsable_de_direccion: number | null
          ubicacion: string | null
          udpated_at: string
        }
        Insert: {
          apodo_direccion?: string | null
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
          responsable_de_direccion?: number | null
          ubicacion?: string | null
          udpated_at?: string
        }
        Update: {
          apodo_direccion?: string | null
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
          responsable_de_direccion?: number | null
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
          {
            foreignKeyName: "Direcciones_responsable_de_direccion_fkey"
            columns: ["responsable_de_direccion"]
            isOneToOne: false
            referencedRelation: "Responsables"
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
      EncuestaSatisfaccion: {
        Row: {
          calificacion: number | null
          created_at: string | null
          expires_at: string
          id: string
          nombre_firmante: string | null
          observaciones: string | null
          organizacion: string | null
          pregunta_1: boolean | null
          pregunta_2: boolean | null
          pregunta_3: boolean | null
          pregunta_4: boolean | null
          pregunta_5: boolean | null
          respondido_at: string | null
          servicio_id: number
          token: string
        }
        Insert: {
          calificacion?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          nombre_firmante?: string | null
          observaciones?: string | null
          organizacion?: string | null
          pregunta_1?: boolean | null
          pregunta_2?: boolean | null
          pregunta_3?: boolean | null
          pregunta_4?: boolean | null
          pregunta_5?: boolean | null
          respondido_at?: string | null
          servicio_id: number
          token?: string
        }
        Update: {
          calificacion?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          nombre_firmante?: string | null
          observaciones?: string | null
          organizacion?: string | null
          pregunta_1?: boolean | null
          pregunta_2?: boolean | null
          pregunta_3?: boolean | null
          pregunta_4?: boolean | null
          pregunta_5?: boolean | null
          respondido_at?: string | null
          servicio_id?: number
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "EncuestaSatisfaccion_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "Servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EncuestaSatisfaccion_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["servicio_id"]
          },
        ]
      }
      Equipos: {
        Row: {
          detalles: string | null
          estacion_de_control:
            | Database["public"]["Enums"]["estaciondecontrol"]
            | null
          id: number
          image: string | null
          marca: string | null
          modelo: string | null
          nombre: string
          numero_serie: string | null
          organizacion: string | null
          tipo_equipo: Database["public"]["Enums"]["TipoEquipo"]
        }
        Insert: {
          detalles?: string | null
          estacion_de_control?:
            | Database["public"]["Enums"]["estaciondecontrol"]
            | null
          id?: number
          image?: string | null
          marca?: string | null
          modelo?: string | null
          nombre: string
          numero_serie?: string | null
          organizacion?: string | null
          tipo_equipo: Database["public"]["Enums"]["TipoEquipo"]
        }
        Update: {
          detalles?: string | null
          estacion_de_control?:
            | Database["public"]["Enums"]["estaciondecontrol"]
            | null
          id?: number
          image?: string | null
          marca?: string | null
          modelo?: string | null
          nombre?: string
          numero_serie?: string | null
          organizacion?: string | null
          tipo_equipo?: Database["public"]["Enums"]["TipoEquipo"]
        }
        Relationships: []
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
      EstacionesBitacora: {
        Row: {
          activa: boolean
          area: string | null
          bitacora_id: number | null
          codigo_estacion: string
          created_at: string
          descripcion: string | null
          direccion_id: number
          id: number
          metadata_json: Json | null
          orden: number | null
          organizacion: string
          tipo: Database["public"]["Enums"]["bitacora_tipo"]
          updated_at: string
          x_percent: number | null
          y_percent: number | null
          zona: string | null
        }
        Insert: {
          activa?: boolean
          area?: string | null
          bitacora_id?: number | null
          codigo_estacion: string
          created_at?: string
          descripcion?: string | null
          direccion_id: number
          id?: number
          metadata_json?: Json | null
          orden?: number | null
          organizacion: string
          tipo: Database["public"]["Enums"]["bitacora_tipo"]
          updated_at?: string
          x_percent?: number | null
          y_percent?: number | null
          zona?: string | null
        }
        Update: {
          activa?: boolean
          area?: string | null
          bitacora_id?: number | null
          codigo_estacion?: string
          created_at?: string
          descripcion?: string | null
          direccion_id?: number
          id?: number
          metadata_json?: Json | null
          orden?: number | null
          organizacion?: string
          tipo?: Database["public"]["Enums"]["bitacora_tipo"]
          updated_at?: string
          x_percent?: number | null
          y_percent?: number | null
          zona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "EstacionesBitacora_bitacora_id_fkey"
            columns: ["bitacora_id"]
            isOneToOne: false
            referencedRelation: "Bitacoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EstacionesBitacora_bitacora_id_fkey"
            columns: ["bitacora_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["bitacora_id"]
          },
          {
            foreignKeyName: "EstacionesBitacora_direccion_id_fkey"
            columns: ["direccion_id"]
            isOneToOne: false
            referencedRelation: "Direcciones"
            referencedColumns: ["id"]
          },
        ]
      }
      GrupoDeMovimientos: {
        Row: {
          created_at: string
          id: number
          movimientos_id: number[] | null
          organizacion: string
        }
        Insert: {
          created_at?: string
          id?: number
          movimientos_id?: number[] | null
          organizacion: string
        }
        Update: {
          created_at?: string
          id?: number
          movimientos_id?: number[] | null
          organizacion?: string
        }
        Relationships: []
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
      HallazgosBitacora: {
        Row: {
          cantidad: number
          comentario: string | null
          created_at: string
          id: number
          plaga_id: number | null
          revision_estacion_id: number
          updated_at: string
        }
        Insert: {
          cantidad?: number
          comentario?: string | null
          created_at?: string
          id?: number
          plaga_id?: number | null
          revision_estacion_id: number
          updated_at?: string
        }
        Update: {
          cantidad?: number
          comentario?: string | null
          created_at?: string
          id?: number
          plaga_id?: number | null
          revision_estacion_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "HallazgosBitacora_plaga_id_fkey"
            columns: ["plaga_id"]
            isOneToOne: false
            referencedRelation: "Plagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "HallazgosBitacora_revision_estacion_id_fkey"
            columns: ["revision_estacion_id"]
            isOneToOne: false
            referencedRelation: "RevisionEstacionesBitacora"
            referencedColumns: ["id"]
          },
        ]
      }
      Inventario: {
        Row: {
          id: number
          inv_nombre: string | null
          organizacion: string
          tecnico_id: number | null
          tipo_de_equipo:
            | Database["public"]["Enums"]["TipoEquipoOptions"]
            | null
          tipo_inventario: Database["public"]["Enums"]["TipoInventario"] | null
        }
        Insert: {
          id?: number
          inv_nombre?: string | null
          organizacion: string
          tecnico_id?: number | null
          tipo_de_equipo?:
            | Database["public"]["Enums"]["TipoEquipoOptions"]
            | null
          tipo_inventario?: Database["public"]["Enums"]["TipoInventario"] | null
        }
        Update: {
          id?: number
          inv_nombre?: string | null
          organizacion?: string
          tecnico_id?: number | null
          tipo_de_equipo?:
            | Database["public"]["Enums"]["TipoEquipoOptions"]
            | null
          tipo_inventario?: Database["public"]["Enums"]["TipoInventario"] | null
        }
        Relationships: [
          {
            foreignKeyName: "Inventario_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      Inventario_equipos: {
        Row: {
          equipo_id: number
          funcionales: boolean | null
          id: number
          inventario_id: number | null
          num_de_serie: string | null
          precio: number
          stock: number
        }
        Insert: {
          equipo_id: number
          funcionales?: boolean | null
          id?: number
          inventario_id?: number | null
          num_de_serie?: string | null
          precio: number
          stock: number
        }
        Update: {
          equipo_id?: number
          funcionales?: boolean | null
          id?: number
          inventario_id?: number | null
          num_de_serie?: string | null
          precio?: number
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventario_equipos_equipo_id_fkey"
            columns: ["equipo_id"]
            isOneToOne: false
            referencedRelation: "Equipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Inventario_equipos_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "Inventario"
            referencedColumns: ["id"]
          },
        ]
      }
      Inventario_productos: {
        Row: {
          fecha_de_caducidad: string | null
          id: number
          inventario_id: number | null
          item_de_origen: number | null
          Lote: string | null
          producto_id: number | null
          stock: number
        }
        Insert: {
          fecha_de_caducidad?: string | null
          id?: number
          inventario_id?: number | null
          item_de_origen?: number | null
          Lote?: string | null
          producto_id?: number | null
          stock: number
        }
        Update: {
          fecha_de_caducidad?: string | null
          id?: number
          inventario_id?: number | null
          item_de_origen?: number | null
          Lote?: string | null
          producto_id?: number | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "Inventario_productos_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "Inventario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_productos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "Productos"
            referencedColumns: ["id"]
          },
        ]
      }
      Inventario_vehiculos: {
        Row: {
          funcionales: boolean | null
          id: number
          inventario_id: number | null
          precio: number
          stock: number
          vehiculo_id: number | null
        }
        Insert: {
          funcionales?: boolean | null
          id?: number
          inventario_id?: number | null
          precio: number
          stock: number
          vehiculo_id?: number | null
        }
        Update: {
          funcionales?: boolean | null
          id?: number
          inventario_id?: number | null
          precio?: number
          stock?: number
          vehiculo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Inventario_vehiculos_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "Inventario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_vehículos_vehículo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "Vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      Logs: {
        Row: {
          created_at: string
          debug: Json | null
          id: number
          message: string
          severity: Database["public"]["Enums"]["Severity"]
          stack: string | null
          type: Database["public"]["Enums"]["LogType"]
        }
        Insert: {
          created_at?: string
          debug?: Json | null
          id?: number
          message: string
          severity?: Database["public"]["Enums"]["Severity"]
          stack?: string | null
          type?: Database["public"]["Enums"]["LogType"]
        }
        Update: {
          created_at?: string
          debug?: Json | null
          id?: number
          message?: string
          severity?: Database["public"]["Enums"]["Severity"]
          stack?: string | null
          type?: Database["public"]["Enums"]["LogType"]
        }
        Relationships: []
      }
      Movimientos: {
        Row: {
          date: string
          id: number
          inventario_id: number | null
          item_id: number
          item_type: Database["public"]["Enums"]["TipoItem"]
          notes: string | null
          organizacion: string | null
          quantity: number
          servicio_id: number | null
          tecnico_id: number | null
          type: Database["public"]["Enums"]["TipoMovimiento"]
        }
        Insert: {
          date: string
          id?: number
          inventario_id?: number | null
          item_id: number
          item_type: Database["public"]["Enums"]["TipoItem"]
          notes?: string | null
          organizacion?: string | null
          quantity: number
          servicio_id?: number | null
          tecnico_id?: number | null
          type: Database["public"]["Enums"]["TipoMovimiento"]
        }
        Update: {
          date?: string
          id?: number
          inventario_id?: number | null
          item_id?: number
          item_type?: Database["public"]["Enums"]["TipoItem"]
          notes?: string | null
          organizacion?: string | null
          quantity?: number
          servicio_id?: number | null
          tecnico_id?: number | null
          type?: Database["public"]["Enums"]["TipoMovimiento"]
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "Inventario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Movimientos_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "Servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Movimientos_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["servicio_id"]
          },
          {
            foreignKeyName: "movimientos_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      OrganizacionConfig: {
        Row: {
          accent_color: string
          created_at: string
          id: number
          logo_dark_url: string | null
          logo_url: string | null
          nombre_empresa: string | null
          organizacion: string
          primary_color: string
          secondary_color: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          id?: number
          logo_dark_url?: string | null
          logo_url?: string | null
          nombre_empresa?: string | null
          organizacion: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          id?: number
          logo_dark_url?: string | null
          logo_url?: string | null
          nombre_empresa?: string | null
          organizacion?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
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
          organizacion: string | null
          precio: number | null
          presentacion: string | null
          presentacion_cantidad: number | null
          presentacion_unidad:
            | Database["public"]["Enums"]["PresentacionUnidad"]
            | null
          registro: string | null
          tipo_de_producto: Database["public"]["Enums"]["TipoProducto"] | null
          unidad_de_gasto: Database["public"]["Enums"]["UnidadDeGasto"] | null
        }
        Insert: {
          dosis_max?: string | null
          dosis_min?: string | null
          id?: number
          ingrediente_activo?: string | null
          nombre?: string | null
          organizacion?: string | null
          precio?: number | null
          presentacion?: string | null
          presentacion_cantidad?: number | null
          presentacion_unidad?:
            | Database["public"]["Enums"]["PresentacionUnidad"]
            | null
          registro?: string | null
          tipo_de_producto?: Database["public"]["Enums"]["TipoProducto"] | null
          unidad_de_gasto?: Database["public"]["Enums"]["UnidadDeGasto"] | null
        }
        Update: {
          dosis_max?: string | null
          dosis_min?: string | null
          id?: number
          ingrediente_activo?: string | null
          nombre?: string | null
          organizacion?: string | null
          precio?: number | null
          presentacion?: string | null
          presentacion_cantidad?: number | null
          presentacion_unidad?:
            | Database["public"]["Enums"]["PresentacionUnidad"]
            | null
          registro?: string | null
          tipo_de_producto?: Database["public"]["Enums"]["TipoProducto"] | null
          unidad_de_gasto?: Database["public"]["Enums"]["UnidadDeGasto"] | null
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
          {
            foreignKeyName: "Recomendaciones_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["servicio_id"]
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
            | Database["public"]["Enums"]["DosisRecomendada"]
            | null
          gasto_producto_confirmado: boolean | null
          id: number
          inventario_id: number | null
          inventario_producto_id: number | null
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
            | Database["public"]["Enums"]["DosisRecomendada"]
            | null
          gasto_producto_confirmado?: boolean | null
          id?: number
          inventario_id?: number | null
          inventario_producto_id?: number | null
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
            | Database["public"]["Enums"]["DosisRecomendada"]
            | null
          gasto_producto_confirmado?: boolean | null
          id?: number
          inventario_id?: number | null
          inventario_producto_id?: number | null
          producto_id?: number | null
          servicio_id?: number
          tipo_aplicacion?: string | null
          tipo_plaga_id?: number | null
          unidad?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "RegistroAplicacion_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "Inventario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RegistroAplicacion_inventario_producto_id_fkey"
            columns: ["inventario_producto_id"]
            isOneToOne: false
            referencedRelation: "Inventario_productos"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "RegistroAplicacion_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["servicio_id"]
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
            isOneToOne: false
            referencedRelation: "Clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      Retroalimentacion: {
        Row: {
          captura: string | null
          created_at: string
          descripcion: string | null
          empleado_id: number | null
          id: number
          tipo_feedback: Database["public"]["Enums"]["TipoFeedback"] | null
          titulo: string | null
        }
        Insert: {
          captura?: string | null
          created_at?: string
          descripcion?: string | null
          empleado_id?: number | null
          id?: number
          tipo_feedback?: Database["public"]["Enums"]["TipoFeedback"] | null
          titulo?: string | null
        }
        Update: {
          captura?: string | null
          created_at?: string
          descripcion?: string | null
          empleado_id?: number | null
          id?: number
          tipo_feedback?: Database["public"]["Enums"]["TipoFeedback"] | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Retroalimentacion_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      RevisionesBitacora: {
        Row: {
          bitacora_id: number | null
          created_at: string
          direccion_id: number
          encargado: string | null
          encargado_info: string | null
          estado: Database["public"]["Enums"]["revision_estado"]
          fecha_servicio: string | null
          folio: number | null
          hora_entrada: string | null
          hora_salida: string | null
          id: number
          no_hay_bitacora_disponible: boolean
          observacion_general: string | null
          servicio_id: number
          tecnico_id: number | null
          updated_at: string
        }
        Insert: {
          bitacora_id?: number | null
          created_at?: string
          direccion_id: number
          encargado?: string | null
          encargado_info?: string | null
          estado?: Database["public"]["Enums"]["revision_estado"]
          fecha_servicio?: string | null
          folio?: number | null
          hora_entrada?: string | null
          hora_salida?: string | null
          id?: number
          no_hay_bitacora_disponible?: boolean
          observacion_general?: string | null
          servicio_id: number
          tecnico_id?: number | null
          updated_at?: string
        }
        Update: {
          bitacora_id?: number | null
          created_at?: string
          direccion_id?: number
          encargado?: string | null
          encargado_info?: string | null
          estado?: Database["public"]["Enums"]["revision_estado"]
          fecha_servicio?: string | null
          folio?: number | null
          hora_entrada?: string | null
          hora_salida?: string | null
          id?: number
          no_hay_bitacora_disponible?: boolean
          observacion_general?: string | null
          servicio_id?: number
          tecnico_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "RevisionesBitacora_bitacora_id_fkey"
            columns: ["bitacora_id"]
            isOneToOne: false
            referencedRelation: "Bitacoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RevisionesBitacora_bitacora_id_fkey"
            columns: ["bitacora_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["bitacora_id"]
          },
          {
            foreignKeyName: "RevisionesBitacora_direccion_id_fkey"
            columns: ["direccion_id"]
            isOneToOne: false
            referencedRelation: "Direcciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RevisionesBitacora_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "Servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RevisionesBitacora_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["servicio_id"]
          },
          {
            foreignKeyName: "RevisionesBitacora_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "Empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      RevisionEstacionesBitacora: {
        Row: {
          consumo_porcentaje: number | null
          created_at: string
          estacion_id: number | null
          estado: Database["public"]["Enums"]["revision_estacion_estado"]
          goma_cambiada: boolean | null
          id: number
          observacion: string | null
          revisada: boolean
          revision_id: number
          updated_at: string
        }
        Insert: {
          consumo_porcentaje?: number | null
          created_at?: string
          estacion_id?: number | null
          estado?: Database["public"]["Enums"]["revision_estacion_estado"]
          goma_cambiada?: boolean | null
          id?: number
          observacion?: string | null
          revisada?: boolean
          revision_id: number
          updated_at?: string
        }
        Update: {
          consumo_porcentaje?: number | null
          created_at?: string
          estacion_id?: number | null
          estado?: Database["public"]["Enums"]["revision_estacion_estado"]
          goma_cambiada?: boolean | null
          id?: number
          observacion?: string | null
          revisada?: boolean
          revision_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "RevisionEstacionesBitacora_estacion_id_fkey"
            columns: ["estacion_id"]
            isOneToOne: false
            referencedRelation: "EstacionesBitacora"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RevisionEstacionesBitacora_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "RevisionesBitacora"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RevisionEstacionesBitacora_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "vw_bitacora_servicio_estado"
            referencedColumns: ["revision_id"]
          },
        ]
      }
      RevisionEstacionesClaves: {
        Row: {
          clave_id: number
          created_at: string
          id: number
          revision_estacion_id: number
        }
        Insert: {
          clave_id: number
          created_at?: string
          id?: number
          revision_estacion_id: number
        }
        Update: {
          clave_id?: number
          created_at?: string
          id?: number
          revision_estacion_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "RevisionEstacionesClaves_clave_id_fkey"
            columns: ["clave_id"]
            isOneToOne: false
            referencedRelation: "ClavesBitacora"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RevisionEstacionesClaves_revision_estacion_id_fkey"
            columns: ["revision_estacion_id"]
            isOneToOne: false
            referencedRelation: "RevisionEstacionesBitacora"
            referencedColumns: ["id"]
          },
        ]
      }
      Servicios: {
        Row: {
          cancelado: boolean | null
          cliente_id: number | null
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
          precio: number | null
          realizado: boolean | null
          responsable_id: number | null
          tecnico_id: number | null
          tipo_folio: string | null
          tipo_plaga_array_id: number[] | null
          tipo_plaga_id: number | null
          tipo_servicio: string | null
          updated_at: string | null
          user_id: string | null
          was_used: boolean | null
        }
        Insert: {
          cancelado?: boolean | null
          cliente_id?: number | null
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
          precio?: number | null
          realizado?: boolean | null
          responsable_id?: number | null
          tecnico_id?: number | null
          tipo_folio?: string | null
          tipo_plaga_array_id?: number[] | null
          tipo_plaga_id?: number | null
          tipo_servicio?: string | null
          updated_at?: string | null
          user_id?: string | null
          was_used?: boolean | null
        }
        Update: {
          cancelado?: boolean | null
          cliente_id?: number | null
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
          precio?: number | null
          realizado?: boolean | null
          responsable_id?: number | null
          tecnico_id?: number | null
          tipo_folio?: string | null
          tipo_plaga_array_id?: number[] | null
          tipo_plaga_id?: number | null
          tipo_servicio?: string | null
          updated_at?: string | null
          user_id?: string | null
          was_used?: boolean | null
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
      Vehiculos: {
        Row: {
          color: string | null
          detalles: string | null
          edad: number | null
          id: number
          image: string | null
          marca: string
          modelo: string
          numero_serie: string | null
          placa: string
        }
        Insert: {
          color?: string | null
          detalles?: string | null
          edad?: number | null
          id?: number
          image?: string | null
          marca: string
          modelo: string
          numero_serie?: string | null
          placa: string
        }
        Update: {
          color?: string | null
          detalles?: string | null
          edad?: number | null
          id?: number
          image?: string | null
          marca?: string
          modelo?: string
          numero_serie?: string | null
          placa?: string
        }
        Relationships: []
      }
    }
    Views: {
      vw_bitacora_servicio_estado: {
        Row: {
          bitacora_id: number | null
          direccion_id: number | null
          estado_revision: Database["public"]["Enums"]["revision_estado"] | null
          fecha_servicio: string | null
          folio: number | null
          no_hay_bitacora_disponible: boolean | null
          revision_id: number | null
          servicio_id: number | null
          tipo_bitacora: Database["public"]["Enums"]["bitacora_tipo"] | null
        }
        Relationships: [
          {
            foreignKeyName: "Servicios_direccion_id_fkey"
            columns: ["direccion_id"]
            isOneToOne: false
            referencedRelation: "Direcciones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_folio: { Args: { org_name: string }; Returns: number }
      generate_temporal_folio:
        | { Args: never; Returns: number }
        | { Args: { org_name: string }; Returns: number }
      user_belongs_to_org: { Args: { _organizacion: string }; Returns: boolean }
      user_is_org_admin: { Args: { _organizacion: string }; Returns: boolean }
    }
    Enums: {
      bitacora_estado: "borrador" | "activa" | "archivada"
      bitacora_tipo: "ECEXTT" | "ECINT" | "VOLADORES"
      DosisRecomendada: "min" | "max"
      estaciondecontrol: "roedores" | "vectores" | "goma"
      FrecuenciaServicio:
        | "Ninguna"
        | "Semanal"
        | "Quincenal"
        | "Mensual"
        | "Bimestral"
        | "Trimestral"
        | "Semestral"
        | "Anual"
      LogType: "Error" | "Info" | "Auth" | "Other"
      PresentacionUnidad: "L" | "ml" | "g" | "kg" | "pzs"
      revision_estacion_estado:
        | "revisada"
        | "no_revisada"
        | "sin_bitacora_disponible"
      revision_estado: "en_captura" | "parcial" | "cerrada"
      RolesEmpleado: "tecnico" | "administrador" | "superadmin"
      Severity: "None" | "Low" | "Mid" | "High"
      TipoEquipo:
        | "computo"
        | "bomba_ulv"
        | "termo_nebulizadora"
        | "estacion_control"
        | "otro"
      TipoEquipoOptions:
        | "Plaguicidas"
        | "Equipos de control"
        | "Computo"
        | "Otros"
      TipoFeedback:
        | "ErrorInterfaz"
        | "ErrorCargando"
        | "ErrorGuardando"
        | "ErrorEscalabilidad"
        | "ErrorDatosFaltantes"
        | "ErrorActualizacion"
        | "ErrorGeneral"
      TipoInventario: "principal" | "empleado" | "vehiculo" | "equipo"
      TipoItem: "producto" | "equipo" | "vehiculo"
      TipoMovimiento:
        | "salida"
        | "traspaso"
        | "caducidad"
        | "venta"
        | "basura"
        | "servicio"
        | "entrada"
        | "error"
      TipoProducto: "plaguicida" | "trampa" | "cebo" | "gel"
      UnidadDeGasto: "ml" | "g" | "pzs"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bitacora_estado: ["borrador", "activa", "archivada"],
      bitacora_tipo: ["ECEXTT", "ECINT", "VOLADORES"],
      DosisRecomendada: ["min", "max"],
      estaciondecontrol: ["roedores", "vectores", "goma"],
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
      LogType: ["Error", "Info", "Auth", "Other"],
      PresentacionUnidad: ["L", "ml", "g", "kg", "pzs"],
      revision_estacion_estado: [
        "revisada",
        "no_revisada",
        "sin_bitacora_disponible",
      ],
      revision_estado: ["en_captura", "parcial", "cerrada"],
      RolesEmpleado: ["tecnico", "administrador", "superadmin"],
      Severity: ["None", "Low", "Mid", "High"],
      TipoEquipo: [
        "computo",
        "bomba_ulv",
        "termo_nebulizadora",
        "estacion_control",
        "otro",
      ],
      TipoEquipoOptions: [
        "Plaguicidas",
        "Equipos de control",
        "Computo",
        "Otros",
      ],
      TipoFeedback: [
        "ErrorInterfaz",
        "ErrorCargando",
        "ErrorGuardando",
        "ErrorEscalabilidad",
        "ErrorDatosFaltantes",
        "ErrorActualizacion",
        "ErrorGeneral",
      ],
      TipoInventario: ["principal", "empleado", "vehiculo", "equipo"],
      TipoItem: ["producto", "equipo", "vehiculo"],
      TipoMovimiento: [
        "salida",
        "traspaso",
        "caducidad",
        "venta",
        "basura",
        "servicio",
        "entrada",
        "error",
      ],
      TipoProducto: ["plaguicida", "trampa", "cebo", "gel"],
      UnidadDeGasto: ["ml", "g", "pzs"],
    },
  },
} as const
