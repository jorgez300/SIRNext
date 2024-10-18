DROP TABLE IF EXISTS public.clientes;
CREATE TABLE IF NOT EXISTS public.clientes
(
    id SERIAL PRIMARY KEY,
    identificacion VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS public.compras;
CREATE TABLE IF NOT EXISTS public.compras
(
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    fecha timestamp without time zone NOT NULL,
    proveedorid INTEGER NOT NULL,
    usuarioid VARCHAR(255) NOT NULL,
    totalarticulos integer NOT NULL,
    totalcompra numeric(10,2) NOT NULL,
    estado VARCHAR(255) NOT NULL DEFAULT 'VIGENTE'::character varying
);

DROP TABLE IF EXISTS public.itemcompras;
CREATE TABLE IF NOT EXISTS public.itemcompras
(
    comprauid VARCHAR(255) NOT NULL,
    posicion integer NOT NULL,
    productoid VARCHAR(255) NOT NULL,
    cantidad integer NOT NULL,
    costo numeric(10,2) NOT NULL,
    precio numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL
);

DROP TABLE IF EXISTS public.itemventas;
CREATE TABLE IF NOT EXISTS public.itemventas
(
    ventauid VARCHAR(255) NOT NULL,
    posicion integer NOT NULL,
    productoid VARCHAR(255) NOT NULL,
    cantidad integer NOT NULL,
    costo numeric(10,2) NOT NULL,
    precio numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL
);

DROP TABLE IF EXISTS public.productos;
CREATE TABLE IF NOT EXISTS public.productos
(
    codigo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    marcaprod VARCHAR(255) NOT NULL,
    vigente boolean NOT NULL,
    existencia integer NOT NULL,
    costo numeric(10,2) NOT NULL,
    precio numeric(10,2) NOT NULL,
    minimo integer,
    maximo integer,
    ubicacion VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS public.productosvehiculos;
CREATE TABLE IF NOT EXISTS public.productosvehiculos
(
    codigo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    desde integer,
    hasta integer
);

DROP TABLE IF EXISTS public.proveedores;
CREATE TABLE IF NOT EXISTS public.proveedores
(
    id SERIAL PRIMARY KEY,
    identificacion VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS public.ventas;
CREATE TABLE IF NOT EXISTS public.ventas
(
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    fecha timestamp without time zone NOT NULL,
    clienteid integer NOT NULL,
    usuarioid VARCHAR(255) NOT NULL,
    totalarticulos integer NOT NULL,
    totalventa numeric(10,2) NOT NULL,
    estado VARCHAR(255) NOT NULL DEFAULT 'VIGENTE'::character varying
);

