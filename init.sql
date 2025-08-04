-- Tabla de voluntarios
CREATE TABLE voluntarios (
  id       SERIAL PRIMARY KEY,
  codigo   VARCHAR(20) UNIQUE,
  nombre   VARCHAR(100),
  ci       VARCHAR(20) UNIQUE,
  telefono VARCHAR(20),
  activo   BOOLEAN DEFAULT TRUE
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE
);

-- Tabla intermedia entre voluntarios y roles
CREATE TABLE voluntarios_roles (
  id_voluntario INTEGER,
  id_rol        INTEGER,
  PRIMARY KEY (id_voluntario, id_rol),
  FOREIGN KEY (id_voluntario) REFERENCES voluntarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_rol) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tabla de brigadas
CREATE TABLE brigadas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100),
  descripcion TEXT
);

-- Tabla intermedia entre brigadas y voluntarios
CREATE TABLE brigadas_voluntarios (
  id_brigada    INTEGER,
  id_voluntario INTEGER,
  PRIMARY KEY (id_brigada, id_voluntario),
  FOREIGN KEY (id_brigada) REFERENCES brigadas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_voluntario) REFERENCES voluntarios(id) ON DELETE CASCADE
);

-- Artículos generales
CREATE TABLE articulos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100),
  categoria     VARCHAR(100),
  observaciones TEXT,
  cantidad      INTEGER
);

-- Refacciones
CREATE TABLE refacciones (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100),
  categoria        VARCHAR(100),
  observaciones    TEXT,
  costo_aproximado INTEGER
);

-- Tipos de ropa
CREATE TABLE ropa (
  id     SERIAL PRIMARY KEY,
  tipo   VARCHAR(100),
  nombre VARCHAR(100)
);

-- Tallas disponibles
CREATE TABLE tallas (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE
);

-- Tabla intermedia entre ropa y tallas
CREATE TABLE ropa_tallas (
  id_ropa  INTEGER,
  id_talla INTEGER,
  cantidad INTEGER,
  PRIMARY KEY (id_ropa, id_talla),
  FOREIGN KEY (id_ropa) REFERENCES ropa(id) ON DELETE CASCADE,
  FOREIGN KEY (id_talla) REFERENCES tallas(id) ON DELETE CASCADE
);
