Create Table Voluntarios(
  id       SERIAL PRIMARY KEY,
  codigo   VARCHAR(20) UNIQUE,
  nombre   VARCHAR(100),
  ci       VARCHAR(20) UNIQUE,
  telefono VARCHAR(20)
);


CREATE TABLE IF NOT EXISTS roles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE
);

Create Table VoluntariosRoles(
  id_voluntario INTEGER REFERENCES Voluntarios(id),
  id_rol        INTEGER REFERENCES roles(id),
  PRIMARY KEY (id_voluntario, id_rol)
);

Create Table Brigadas(
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100),
  descripcion TEXT
);

Create Table BrigadasVoluntarios(
  id_brigada    INTEGER REFERENCES Brigadas(id),
  id_voluntario INTEGER REFERENCES Voluntarios(id),
  PRIMARY KEY (id_brigada, id_voluntario)
);

create Table articulos(
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100),
  categoria      VARCHAR(100),
  observaciones TEXT,
  cantidad    INTEGER
);


create Table articulos(
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100),
  categoria      VARCHAR(100),
  observaciones TEXT,
  costo_aproximado    INTEGER
);