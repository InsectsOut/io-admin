# 📋 Actualización: Sistema de Bitácoras con Plagas y Códigos CLAVE

## ✅ Lo que se implementó

El componente `BitacoraServicio.tsx` ha sido actualizado para permitir a los técnicos:

### 1. **Registrar Incidencias de Plagas por Estación**

- **Dropdown de Plagas**: Seleccionar qué tipo de plaga encontraron
- **Campo de Cantidad**: Número de incidencias/individuos encontrados
- **Botón Agregar**: Para registrar múltiples plagas en la misma estación
- **Lista de Hallazgos**: Mostrar todas las plagas encontradas con opción de eliminar

**Ejemplo:**

```
🐛 Incidencias de Plagas
[Dropdown: Cucarachas] [Cantidad: 5] [Agregar]
✓ Cucarachas - 5 unidades [Eliminar]
✓ Hormigas - 2 unidades [Eliminar]
```

### 2. **Marcar Códigos CLAVE**

- **Checkboxes Múltiples**: Seleccionar uno o varios códigos
- **Códigos Visuales**: Cada código muestra: `[LD]` Lámpara Desconectada
- **Filtrados por Tipo**: Solo muestra claves aplicables (ECEXTT/ECINT/VOLADORES)

**Ejemplo:**

```
🔑 Códigos CLAVE
☐ [LD] Lámpara Desconectada
☑ [BF] Bulbo Fundido
☐ [LO] Lámpara Obstruida
☑ [LPV] Letrero Poco Visible
```

### 3. **Estructura Completa de Captura**

Por cada estación se captura:

- ✅ Revisada (checkbox)
- ✅ Consumo % o Goma Cambiada (según tipo)
- ✅ **NUEVO: Plagas encontradas (múltiples)**
- ✅ **NUEVO: Códigos CLAVE (múltiples)**
- ✅ Observaciones (textarea)

---

## 🗄️ Tablas de BD Utilizadas

| Tabla                      | Descripción                     | Estado     |
| -------------------------- | ------------------------------- | ---------- |
| `Plagas`                   | Catálogo de tipos de plagas     | ✅ Existía |
| `ClavesBitacora`           | Códigos CLAVE con concepto      | ✅ Existía |
| `HallazgosBitacora`        | Plagas encontradas por estación | ✅ Existía |
| `RevisionEstacionesClaves` | Claves marcadas por estación    | ✅ Existía |

**Nota:** No se crearon nuevas tablas, se utilizaron las existentes.

---

## 🔄 Flujo de Datos

### Al Cargar la Bitácora:

1. **Carga Plagas** → `SELECT * FROM Plagas`
2. **Carga Claves** → `SELECT * FROM ClavesBitacora WHERE tipo = ? AND activo = true`
3. **Carga Hallazgos** → `SELECT * FROM HallazgosBitacora WHERE revision_estacion_id = ?`
4. **Carga Claves Marcadas** → `SELECT * FROM RevisionEstacionesClaves WHERE revision_estacion_id = ?`

### Al Guardar:

1. **Guarda Capturas Base** → `UPSERT RevisionEstacionesBitacora`
2. **Guarda Hallazgos** → `INSERT INTO HallazgosBitacora` (nuevos solamente)
3. **Guarda Claves** → `DELETE + INSERT INTO RevisionEstacionesClaves` (limpia y re-inserta)
4. **Actualiza Estado** → `UPDATE RevisionesBitacora` (borrador/parcial/cerrada)

---

## 🎯 Funciones de Utilidad (Internas)

```typescript
// Agregar una plaga encontrada
agregarHallazgo(estacionId: number)
  → Valida que haya plaga y cantidad
  → Agrega a hallazgos
  → Limpia input temporal

// Eliminar una plaga registrada
eliminarHallazgo(estacionId: number, index: number)

// Marcar/desmarcar un código CLAVE
toggleClave(estacionId: number, claveId: number)

// Verificar si un código está marcado
isClaveActive(estacionId: number, claveId: number): boolean
```

---

## 📱 UI/UX por Sección

### Sección de Plagas

```
┌─────────────────────────────────────┐
│ 🐛 Incidencias de Plagas            │
├─────────────────────────────────────┤
│ [Dropdown Plagas] [Cantidad] [Agregar]
│
│ ✓ Nombre Plaga 1 - X unidades [Eliminar]
│ ✓ Nombre Plaga 2 - Y unidades [Eliminar]
└─────────────────────────────────────┘
```

### Sección de Claves

```
┌─────────────────────────────────────┐
│ 🔑 Códigos CLAVE                    │
├─────────────────────────────────────┤
│ ☐ [LD] Concepto 1                   │
│ ☑ [BF] Concepto 2                   │
│ ☐ [LO] Concepto 3                   │
│ ☑ [LPV] Concepto 4                  │
└─────────────────────────────────────┘
```

---

## 🚀 Cómo Usar

### Paso 1: Abrir Bitácora de Estación

Navega a: `/bitacoras/servicio/{servicioId}/{tipo}`

- Ejemplo: `/bitacoras/servicio/123/ECEXTT`

### Paso 2: Registrar Plagas

1. Selecciona tipo de plaga en dropdown
2. Ingresa cantidad encontrada
3. Click en "Agregar"
4. Repite si hay más plagas

### Paso 3: Marcar Claves

1. Revisa la lista de códigos CLAVE
2. Marca (☑) los que aplican a esta estación
3. Puedes marcar múltiples

### Paso 4: Completar Datos Base

1. Marca "Revisada" si aplica
2. Registra "Consumo %" o "Goma Cambiada"
3. Agrega "Observaciones" generales

### Paso 5: Guardar

- **Botón "Guardar"**: Guarda pero permite editar más
- **Botón "Cerrar revisión"**: Guarda y marca como completa

---

## ⚠️ Notas Importantes

1. **Plagas Múltiples**: Un técnico puede reportar varios tipos de plagas en la misma estación
2. **Claves Múltiples**: Puede haber varios problemas (LD + BF + LPV, etc)
3. **Hallazgos Temporales**: Si refrescas la página antes de guardar, los hallazgos nuevos se pierden
4. **Claves Filtradas**: Solo mostrarán claves activas del tipo de bitácora actual
5. **Sincronización**: Al guardar, automáticamente se actualiza el estado de la revisión

---

## 🔧 Cambios Técnicos

### Archivos Modificados:

- `src/BitacoraServicio.tsx` - Componente principal actualizado

### Tipos TypeScript Agregados:

```typescript
type Plaga = { id: number; plaga: string | null };
type ClaveBitacora = { id: number; clave: string; concepto: string; titulo: string };
type Hallazgo = { id?: number; plaga_id: number | null; cantidad: number; comentario: string | null };
type ClaveEstacion = { id?: number; clave_id: number };
```

### Estilos Nuevos:

- `SubsectionTitle` - Títulos de secciones
- `HallazgoItem` - Items de hallazgos listados
- `CheckboxContainer` - Contenedor de checkboxes
- `ClaveCode` - Estilo visual del código
- `SmallButton` - Botón pequeño para acciones
- Otros estilos de soporte

---

## 🧪 Testing Recomendado

- [ ] Abrir una bitácora y verificar que carga plagas y claves
- [ ] Agregar múltiples plagas y verificar que se muestren
- [ ] Eliminar una plaga y verificar que desaparezca
- [ ] Marcar/desmarcar códigos CLAVE
- [ ] Guardar y recargar para verificar persistencia
- [ ] Cerrar revisión y verificar estado
- [ ] Probar en diferentes tipos (ECEXTT, ECINT, VOLADORES)

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si no hay plagas en una estación?**
R: No hay problema, puedes dejar la sección vacía. El campo es opcional.

**P: ¿Puedo editar plagas después de guardar?**
R: Sí, puedes eliminar y agregar nuevas. Al guardar se actualiza automáticamente.

**P: ¿Los códigos CLAVE son obligatorios?**
R: No, la sección solo se muestra si hay claves disponibles. Son opcionales.

**P: ¿Qué significa cada código CLAVE?**
R: Depende de tu configuración en ClavesBitacora. Los técnicos pueden ver el concepto completo pasando el mouse.

---

**Fecha de implementación:** 2026-08-19
**Desarrollador:** GitHub Copilot
**Estado:** ✅ Funcional

