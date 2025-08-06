import { articulosCategorizados } from '../data/articulosCategorizados.js';
import {
  getArticulos,
  createArticulo
} from '../api/inventario/articulosApi.js';

export async function renderInventario(container) {
  const articulos = await getArticulos();

  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Inventario - Artículos</h2>
        <div class="header-buttons">
          <button class="btn btn-primary" id="btnMostrarFormulario">Agregar nuevo artículo</button>
        </div>
      </div>

      <div class="table-container" id="listadoArticulos">
        <h3>Artículos registrados</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Observaciones</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${articulos.map(art => `
              <tr>
                <td>${art.nombre}</td>
                <td>${art.categoria}</td>
                <td>${art.observaciones ?? '-'}</td>
                <td>${art.cantidad}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-container" id="formularioAgregar" style="display: none;">
        <h3>Selecciona los artículos a registrar</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            ${articulosCategorizados.map((art, i) => `
              <tr>
                <td>
                  <input type="checkbox" class="chk-articulo" data-index="${i}" />
                  <label style="margin-left: 8px;">${art.nombre}</label>
                </td>
                <td>
                  <span class="categoria-fija">${art.categoria ?? '-'}</span>
                </td>
                <td>
                  <input type="number" class="input-cantidad" data-index="${i}" min="0" value="0" disabled />
                </td>
                <td>
                  ${art.prioridad
                    ? '<span class="status-badge status-active">Alta</span>'
                    : '<span class="status-badge status-inactive">Normal</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="text-center" style="margin: 30px 0;">
          <button class="btn btn-primary" id="btnRegistrarArticulos">Registrar artículos</button>
          <button class="btn btn-danger" id="btnCancelarFormulario">Cancelar</button>
        </div>
      </div>
    </section>
  `;

  // Mostrar formulario
  container.querySelector('#btnMostrarFormulario').addEventListener('click', () => {
    container.querySelector('#listadoArticulos').style.display = 'none';
    container.querySelector('#formularioAgregar').style.display = 'block';
  });

  // Cancelar formulario
  container.querySelector('#btnCancelarFormulario').addEventListener('click', () => {
    renderInventario(container); // recargar estado original
  });

  // Activar/desactivar campos según el checkbox
  container.querySelectorAll('.chk-articulo').forEach(chk => {
    chk.addEventListener('change', () => {
      const index = chk.dataset.index;
      const inputCantidad = container.querySelector(`.input-cantidad[data-index="${index}"]`);
      const enabled = chk.checked;
      inputCantidad.disabled = !enabled;
      if (!enabled) inputCantidad.value = 0;
    });
  });

  // Registrar artículos vía API
  container.querySelector('#btnRegistrarArticulos').addEventListener('click', async () => {
    const nuevos = [];
    container.querySelectorAll('.chk-articulo:checked').forEach(chk => {
      const index = chk.dataset.index;
      const cantidad = parseInt(container.querySelector(`.input-cantidad[data-index="${index}"]`).value);
      const categoria = articulosCategorizados[index].categoria;

      if (cantidad > 0) {
        nuevos.push({
          nombre: articulosCategorizados[index].nombre,
          categoria,
          observaciones: '',
          cantidad
        });
      }
    });

    for (const art of nuevos) {
      try {
        await createArticulo(art);
      } catch (err) {
        console.error('Error creando artículo:', art, err);
      }
    }

    alert(`${nuevos.length} artículo(s) registrado(s) correctamente.`);
    renderInventario(container); // recargar
  });
}
