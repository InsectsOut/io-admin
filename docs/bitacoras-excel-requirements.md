# Requisitos Capturados Desde Excel (Alancree 2026)

## Estructura funcional

- Se manejan 3 bitacoras: `ECEXTT` (exteriores), `ECINT` (interiores), `VOLADORES`.
- Cada bitacora corresponde a un solo servicio.
- El encabezado superior del servicio trae: folio, fecha, cliente, direccion, tecnico, hora entrada/salida, encargado e info del encargado.

## Logica por tipo de bitacora

### Exteriores (ECEXTT)

- Se revisan estaciones exteriores.
- Se captura rodenticida usado por estacion.
- El consumo se registra en porcentaje fijo.
- Existen claves de hallazgo (catalogo en la misma hoja) y observaciones.

### Interiores (ECINT)

- Se revisan estaciones interiores.
- Hay columnas de plagas y filas por estacion.
- Se captura numero de incidencias por plaga y estacion.
- Cambio de placa de goma: solo Si/No.
- Hay claves y observaciones.

### Voladores

- Similar a interiores, enfocado en insectos voladores.
- Se captura incidencias por plaga y estacion.
- Cambio de placa de goma: solo Si/No.
- Hay claves y observaciones.

## Reglas de captura acordadas

- Codigos de estacion en formato: `EXT-01`, `INT-01`, `VOL-01`.
- Puede haber multiples claves por estacion en el mismo servicio.
- Observaciones por estacion.
- Cantidades de incidencias como enteros.
- Cierre parcial permitido (se puede cerrar servicio con estaciones no revisadas).
- Firma de cliente no requerida en v1.
- Estaciones cambian poco; su listado base estara en base de datos.

## Catálogos

- Plagas: vienen de base de datos.
- Claves: personalizables por organizacion (no globales ni por cliente).
- Sin hallazgos en Excel suele representarse con celda vacia.

## Prioridad v1

- Listado de servicios con acceso a bitacora.
- Captura de bitacora exterior.
- Captura de bitacora interior.
- Captura de bitacora voladores.

## Notas para UX v1

- Para voladores conviene checklist o filtro para mostrar solo plagas voladoras en captura.
- En el flujo principal, el acceso puede anclarse al listado actual de servicios.
- Si no existe bitacora para la direccion/tipo, mostrar estado: No hay bitacora disponible.

## Pendientes por definir

- Catalogo inicial exacto de claves por organizacion y su estructura (codigo, titulo, concepto, severidad sugerida).
- Reglas para estaciones nuevas: solo admin desde pantalla de configuracion de bitacora.

## Decisiones cerradas (2026-06-24)

- Escala de consumo exteriores fija: 0, 25, 50, 75, 100.
- En interiores/voladores, celda vacia se interpreta como 0.
- Alta/edicion de estaciones: solo admin.
- Claves por organizacion.
- En voladores se habilita checklist de plagas permitidas para evitar filtrado manual continuo.
