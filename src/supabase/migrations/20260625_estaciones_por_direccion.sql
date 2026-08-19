-- Patch: Estaciones por direccion y tipo (no por servicio)
-- Fecha: 2026-06-25
begin;
-- 1) Hacer que bitacora_id sea opcional para permitir catalogo estable por direccion.
alter table public."EstacionesBitacora"
alter column bitacora_id drop not null;
-- 2) Agregar direccion_id y tipo para modelar estaciones fijas por direccion.
alter table public."EstacionesBitacora"
add column if not exists direccion_id bigint;
alter table public."EstacionesBitacora"
add column if not exists tipo public.bitacora_tipo;
-- 3) Backfill desde Bitacoras para registros existentes.
update public."EstacionesBitacora" eb
set direccion_id = b.direccion_id,
    tipo = b.tipo
from public."Bitacoras" b
where eb.bitacora_id = b.id
    and (
        eb.direccion_id is null
        or eb.tipo is null
    );
-- 4) Endurecer integridad para el nuevo modelo.
alter table public."EstacionesBitacora"
alter column direccion_id
set not null;
alter table public."EstacionesBitacora"
alter column tipo
set not null;
alter table public."EstacionesBitacora"
add constraint "EstacionesBitacora_direccion_id_fkey" foreign key (direccion_id) references public."Direcciones" (id);
-- 5) Reemplazar unicidad por la nueva llave natural direccion+tipo+codigo.
alter table public."EstacionesBitacora" drop constraint if exists "EstacionesBitacora_bitacora_id_codigo_estacion_key";
alter table public."EstacionesBitacora"
add constraint "EstacionesBitacora_direccion_tipo_codigo_key" unique (direccion_id, tipo, codigo_estacion);
create index if not exists "EstacionesBitacora_idx_direccion_tipo" on public."EstacionesBitacora" (direccion_id, tipo);
commit;