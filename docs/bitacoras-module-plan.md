# Modulo de Bitacoras

## Objetivo

Construir un modulo por direccion del cliente que permita:

- guardar el layout de la ubicacion
- colocar estaciones de control sobre ese layout
- registrar revisiones por servicio en cada estacion
- capturar hallazgos estructurados y observaciones libres
- visualizar historico, graficos y mapa de calor por direccion

La relacion clave del negocio es esta:

- un cliente puede tener muchas direcciones
- cada direccion puede tener una o varias bitacoras activas o historicas
- cada servicio ocurre en una direccion
- cada servicio revisa estaciones de esa direccion
- cada revision genera hallazgos ligados a una estacion y al servicio

## Contexto del sistema actual

Hoy la app ya tiene estas piezas:

- Clientes
- Direcciones
- Servicios con direccion_id
- Plagas
- RegistroAplicacion, que ya guarda datos por servicio pero sin ubicacion espacial ni estacion

Hallazgo importante para el diseno:

- el modulo Bitacoras todavia no existe funcionalmente; [src/Bitacoras.tsx](../src/Bitacoras.tsx) sigue en mantenimiento
- ya existe un enum para tipo de estacion de control en [src/supabase/Database.ts](../src/supabase/Database.ts), util para arrancar con roedores y vectores

## Referencia operativa del dominio

En control de plagas, la practica normal es revisar puntos fijos de monitoreo o control en cada visita:

- roedores: estaciones cebaderas, trampas, consumo de cebo, actividad, heces, roeduras, avistamientos
- vectores: trampas, puntos de inspeccion, criaderos, acumulacion de agua, actividad de mosquitos, condiciones ambientales
- crawling insects: puntos de monitoreo, capturas, actividad, zonas con saneamiento deficiente o ingreso estructural

Por eso el dato principal no debe vivir solo en el servicio; debe vivir en la combinacion:

- direccion
- estacion
- servicio

## Propuesta de modelo de datos

### 1. Bitacoras

Representa el plano operativo de una direccion.

Campos sugeridos:

- id
- organizacion
- cliente_id
- direccion_id
- nombre
- version
- estado: borrador | activa | archivada
- layout_image_url
- layout_width
- layout_height
- notas_generales
- created_at
- updated_at

Regla:

- una direccion puede tener varias versiones de bitacora, pero solo una activa

### 2. EstacionesBitacora

Representa cada punto dibujado en el layout.

Campos sugeridos:

- id
- bitacora_id
- codigo_estacion
- tipo_estacion: roedores | vectores | goma
- subtipo_estacion: cebadera | trampa mecanica | ovitrampa | luz UV | inspeccion | otro
- x_percent
- y_percent
- area
- zona
- descripcion
- activa
- metadata_json
- created_at
- updated_at

Notas:

- guardar posicion en porcentaje evita romper el layout si la imagen cambia de tamano
- codigo_estacion debe ser visible para tecnico y cliente, por ejemplo R-01, R-02, V-01

### 3. RevisionesBitacora

Cabecera de una revision de bitacora por servicio.

Campos sugeridos:

- id
- bitacora_id
- servicio_id
- direccion_id
- tecnico_id
- fecha_revision
- resumen
- firma_cliente_url
- created_at

Regla:

- normalmente una revision por servicio y direccion

### 4. HallazgosBitacora

Detalle por estacion revisada.

Campos sugeridos:

- id
- revision_id
- estacion_id
- servicio_id
- direccion_id
- plaga_id nullable
- tipo_hallazgo
- severidad: sin_actividad | baja | media | alta | critica
- cantidad nullable
- unidad nullable
- estado_cebo: integro | consumido_parcial | consumido_total | contaminado | no_aplica
- condicion_estacion: correcta | movida | danada | faltante | bloqueada
- accion_tomada nullable
- comentario nullable
- evidencia_url nullable
- created_at
- updated_at

tipo_hallazgo puede arrancar con catalogo cerrado:

- actividad_plaga
- consumo_cebo
- captura
- excreta
- dano_estructural
- criadero
- agua_estancada
- riesgo_sanitario
- observacion_general
- sin_hallazgo

### 5. CatalogoHallazgos

Opcional para la fase 2, si quieren estandarizar reportes.

Campos sugeridos:

- id
- nombre
- categoria
- aplica_a: roedores | vectores | general
- requiere_plaga
- requiere_cantidad
- requiere_estado_cebo
- activo

## Relacion con tablas existentes

### Servicios

Servicios ya tiene direccion_id y cliente_id. Eso permite:

- abrir la bitacora correcta cuando el tecnico entra a un servicio
- acumular historico por direccion y no solo por folio

### Plagas

La tabla Plagas ya existe y debe seguir siendo la fuente principal para:

- especie o tipo detectado
- filtros por hallazgos
- graficas por plaga

### RegistroAplicacion

No conviene forzar bitacoras dentro de RegistroAplicacion porque esa tabla resuelve otra cosa:

- aplicacion de producto
- area de aplicacion
- cantidad y unidad

Recomendacion:

- mantener RegistroAplicacion para aplicaciones
- crear HallazgosBitacora para inspeccion y monitoreo espacial
- si en un servicio hubo aplicacion y hallazgo, ambos quedan ligados al mismo servicio_id

## Flujo funcional propuesto

### Pantalla 1. Listado de bitacoras

Vista inicial del modulo:

- filtro por cliente
- filtro por direccion
- tarjeta por direccion con estado de bitacora
- acceso a historico de servicios y hallazgos

### Pantalla 2. Editor de layout

Objetivo:

- subir imagen o plano simple de la direccion
- dibujar estaciones sobre la imagen
- editar codigo, tipo y zona de cada estacion

MVP recomendado:

- subir una imagen
- colocar marcadores con click
- guardar coordenadas x_percent e y_percent
- mover y eliminar marcadores

Fase posterior:

- poligonos por area
- capas por piso
- iconos por tipo de estacion

### Pantalla 3. Revision por servicio

Desde un servicio existente, abrir la bitacora de su direccion y revisar estaciones.

Cada estacion debe permitir:

- marcar revisada
- seleccionar plaga encontrada
- elegir tipo de hallazgo
- registrar severidad
- capturar consumo de cebo o condicion fisica
- escribir observacion libre
- adjuntar foto

Tambien debe existir un resumen general del servicio:

- hallazgos generales no asociados a una sola estacion
- recomendaciones
- incidencias sanitarias

### Pantalla 4. Historico y analitica

Vista por direccion con:

- timeline de servicios
- tabla de hallazgos por estacion
- grafica por plaga
- grafica por tipo_hallazgo
- mapa de calor sobre layout

## Mapa de calor recomendado

Hay dos mapas de calor utiles aqui:

### 1. Mapa espacial sobre layout

Cada estacion recibe una intensidad segun una formula simple, por ejemplo:

valor = severidad + consumo_cebo + frecuencia_de_hallazgo

Ejemplo inicial:

- sin_actividad = 0
- baja = 1
- media = 2
- alta = 3
- critica = 4

Y se dibuja color sobre el punto o alrededor del punto.

### 2. Mapa temporal

Una matriz estacion x servicio para ver:

- cuales estaciones repiten actividad
- en que periodos sube la incidencia

Para evitar lecturas confusas, conviene usar una escala perceptualmente uniforme en lugar de arcoiris.

## MVP recomendado

### Fase 1

Entregar valor operativo sin canvas complejo:

- crear bitacora por direccion
- guardar imagen de layout
- alta manual de estaciones con coordenadas
- revision por servicio con hallazgos por estacion
- historico simple por direccion

Con esto ya se puede:

- documentar inspecciones
- comparar servicios
- detectar puntos recurrentes

### Fase 2

- editor drag and drop mas fino
- fotos por hallazgo
- dashboard con graficas
- mapa de calor espacial
- filtros por plaga, severidad y rango de fechas

### Fase 3

- importacion desde Excel
- plantillas de estaciones por giro de cliente
- exportacion PDF de bitacora e historico
- alertas por estaciones criticas recurrentes

## Propuesta de UI alineada al repo

Como la app ya usa tarjetas y vistas por ruta, conviene esta estructura:

- /bitacoras
- /bitacoras/:direccionId
- /bitacoras/:direccionId/editor
- /bitacoras/:direccionId/servicio/:servicioId

Componentes sugeridos:

- Bitacoras.tsx: listado y filtros
- BitacoraDetalle.tsx: resumen de direccion, estaciones e historico
- BitacoraEditor.tsx: layout y estaciones
- BitacoraServicio.tsx: captura de revision del servicio
- EstacionMarker.tsx: marcador del layout
- HallazgoModal.tsx: formulario de hallazgo
- BitacoraCharts.tsx: graficas y heatmap

## Riesgos y decisiones importantes

### 1. No mezclar inventario con estaciones de bitacora

Ya existe logica de equipo/estacion en inventario. Esa entidad puede representar el tipo de equipo, pero no reemplaza la estacion operativa colocada en una direccion.

Decicion recomendada:

- inventario = activo o equipo catalogado
- estacion de bitacora = punto operativo en un layout

### 2. Las estaciones necesitan historico, no solo estado actual

Si solo guardamos el estado actual de la estacion, se pierde el valor del modulo.

La fuente de verdad debe ser:

- HallazgosBitacora por servicio

Y el estado actual se calcula desde el ultimo servicio.

### 3. El layout debe versionarse

Cuando el cliente cambie de distribucion:

- no conviene sobrescribir totalmente el layout viejo
- conviene crear nueva version activa

### 4. Excel si, pero despues del MVP

Tiene sentido leer tus excels despues, pero primero conviene fijar el modelo canonico. Si no, acabamos diseñando alrededor del formato del archivo y no del proceso real.

## Backlog tecnico sugerido

### Backend / Supabase

1. Crear tablas Bitacoras, EstacionesBitacora, RevisionesBitacora y HallazgosBitacora.
2. Crear indices por direccion_id, servicio_id, bitacora_id y estacion_id.
3. Crear vistas o RPC para resumen por direccion.
4. Regenerar tipos de Supabase.

### Frontend

1. Reemplazar [src/Bitacoras.tsx](../src/Bitacoras.tsx) por listado funcional.
2. Crear detalle por direccion.
3. Crear editor de layout con markers absolutos en porcentaje.
4. Conectar revision de servicio a la bitacora de su direccion.
5. Agregar dashboard de hallazgos.

### Datos

1. Definir catalogo inicial de hallazgos.
2. Definir catalogo inicial de subtipos de estacion.
3. Definir escala de severidad.
4. Definir reglas para mapa de calor.

## Recomendacion de implementacion

Orden mas seguro:

1. modelo de datos
2. listado de bitacoras por direccion
3. editor simple con imagen + marcadores
4. captura de hallazgos por servicio
5. historico por direccion
6. heatmap y reportes

## Lo que necesito de negocio para cerrar el diseno

Antes de construir, faltaria definir contigo estas decisiones:

1. Una direccion puede tener varias bitacoras activas por tipo, por ejemplo roedores y vectores, o prefieres una sola bitacora con estaciones mixtas.
2. El tecnico revisa todas las estaciones en cada servicio o solo una parte.
3. Los hallazgos generales sin estacion deben vivir en una estacion virtual o en un campo de resumen de revision.
4. Quieres versionar layout por fecha o sobrescribir mientras no haya servicios historicos.
5. Tus excels actuales representan estaciones, servicios, hallazgos, o los tres.

## Siguiente entregable recomendado

Si quieres avanzar ya en codigo, el siguiente paso con mejor retorno es:

- crear migracion SQL para las 4 tablas nuevas
- reemplazar la pantalla de mantenimiento de bitacoras por un listado basico por cliente y direccion

Con eso dejamos lista la base para que luego me pases los excels y adaptemos importadores o catalogos.
