# Contrato de Datos v1 - Modulo Bitacoras

## Objetivo

Definir payloads y reglas para capturar EXT, INT y VOL por servicio sin romper el flujo actual de servicios.

## Reglas funcionales cerradas

- Escala de consumo exteriores: 0, 25, 50, 75, 100.
- Celda vacia en INT/VOL equivale a 0.
- Estaciones editables solo por admin.
- Claves por organizacion.
- Multiples claves por estacion en el mismo servicio.
- Si no existe bitacora para direccion/tipo, estado visible: No hay bitacora disponible.

## Flujo API propuesto

### 1) Obtener estado de bitacoras para un servicio

Entrada:

- servicio_id

Salida:

- direccion_id
- bitacoras_activas: lista por tipo (ECEXTT, ECINT, VOLADORES)
- revision_existente por tipo
- bandera no_hay_bitacora_disponible por tipo

### 2) Crear/obtener revision de bitacora por servicio

Entrada:

- servicio_id
- bitacora_id
- encabezado_servicio (folio, fecha, tecnico, horas, encargado)

Salida:

- revision_id
- estado inicial en_captura

### 3) Cargar estaciones de la bitacora

Entrada:

- bitacora_id

Salida:

- estaciones ordenadas por orden y codigo_estacion

### 4) Guardar captura por estacion

Entrada:

- revision_id
- estacion_id
- tipo_bitacora
- consumo_porcentaje (solo EXT)
- goma_cambiada (INT/VOL)
- observacion_estacion
- claves_ids[]
- hallazgos[]: lista de { plaga_id, cantidad, comentario }

Reglas:

- cantidad debe ser entero >= 0
- para INT/VOL, celdas vacias del formulario se guardan como 0
- para EXT, consumo_porcentaje solo acepta [0, 25, 50, 75, 100]

Salida:

- revision_estacion_id
- resumen_estacion

### 5) Cierre parcial o cierre final de revision

Entrada:

- revision_id
- estado destino: parcial o cerrada
- observacion_general

Salida:

- estado final de la revision
- total_estaciones
- estaciones_revisadas
- estaciones_no_revisadas

## Payload de ejemplo

### Upsert cabecera de revision

{
"servicio_id": 1453,
"bitacora_id": 22,
"encabezado_servicio": {
"folio": 3201,
"fecha_servicio": "2026-06-24",
"tecnico_id": 18,
"hora_entrada": "09:00",
"hora_salida": "10:30",
"encargado": "Juan Perez",
"encargado_info": "Jefe de mantenimiento"
}
}

### Upsert estacion exterior

{
"revision_id": 801,
"estacion_id": 9001,
"tipo_bitacora": "ECEXTT",
"consumo_porcentaje": 50,
"goma_cambiada": null,
"observacion_estacion": "Actividad moderada",
"claves_ids": [12, 18],
"hallazgos": [
{ "plaga_id": 3, "cantidad": 1, "comentario": "Rastro reciente" }
]
}

### Upsert estacion interior/voladores

{
"revision_id": 802,
"estacion_id": 9105,
"tipo_bitacora": "ECINT",
"consumo_porcentaje": null,
"goma_cambiada": true,
"observacion_estacion": "Se reemplazo placa",
"claves_ids": [21],
"hallazgos": [
{ "plaga_id": 4, "cantidad": 0, "comentario": null },
{ "plaga_id": 7, "cantidad": 2, "comentario": "Dos incidencias" }
]
}

## Contrato de UI en servicios

Desde el listado de servicios, agregar por fila:

- accion Abrir bitacoras
- badges por tipo: EXT, INT, VOL
- estado por badge:
    - Sin bitacora
    - En captura
    - Parcial
    - Cerrada

## Filtro de plagas para voladores

Mantener en configuracion por organizacion una lista de plagas permitidas para VOLADORES.

Regla de UI:

- en captura VOL solo se muestran plagas de esa lista
- no se obliga a filtrar manualmente por cada servicio

## Riesgos v1

- Si no existe bitacora activa para una direccion/tipo, se pierde continuidad de datos por estacion.
- Si la organizacion no carga claves, la captura debe permitir continuar sin claves.
- Para evitar errores de captura, bloquear teclado libre en consumo EXT y usar selector fijo.

