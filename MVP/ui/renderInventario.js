import { articulosCategorizados } from '../data/articulosCategorizados.js';
import {
  getArticulos,
  createArticulo,
  deleteArticulo
} from '../api/inventario/articulosApi.js';
import { getBrigadas } from '../api/brigadasApi.js'; // Asegúrate de importar esto

export async function renderInventario(container) {
  const articulos = await getArticulos();
  const brigadas = await getBrigadas();
  const mapaBrigadas = {};
  for (const b of brigadas) {
    mapaBrigadas[b.id] = b.nombre;
  }

  const agrupados = {};
  for (const art of articulos) {
    const match = art.observaciones?.match(/brigada_id:\s*(\d+)/);
    const brigadaId = match ? match[1] : 'Sin Brigada';
    const nombreVisible = match ? (mapaBrigadas[brigadaId] || `Brigada ${brigadaId}`) : 'Sin Brigada';

    if (!agrupados[nombreVisible]) agrupados[nombreVisible] = [];
    agrupados[nombreVisible].push(art);
  }

  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Inventario - Artículos</h2>
      </div>

      ${agrupados['Sin Brigada'] ? `
        <div class="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Hay ${agrupados['Sin Brigada'].length} artículo(s) sin brigada asignada.</span>
          <button class="btn btn-danger btn-sm" id="btnEliminarSinBrigada">
            <i class="bi bi-trash"></i> Eliminar todos
          </button>
        </div>
      ` : ''}

      <div class="accordion" id="accordionInventario">
        ${Object.entries(agrupados).map(([brigadaKey, items], idx) => `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${idx}">
              <button class="accordion-button ${idx !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse-${idx}" aria-expanded="${idx === 0}" aria-controls="collapse-${idx}">
                ${brigadaKey} — ${items.length} artículo(s)
              </button>
            </h2>
            <div id="collapse-${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}"
              aria-labelledby="heading-${idx}" data-bs-parent="#accordionInventario">
              <div class="accordion-body">
                <table class="table table-bordered table-hover table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Cantidad</th>
                      <th>Prioridad</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${items.map(art => `
                      <tr>
                        <td>${art.nombre}</td>
                        <td>${art.categoria}</td>
                        <td>${art.cantidad}</td>
                        <td>
                          ${art.prioridad
                            ? '<span class="badge bg-danger">Alta</span>'
                            : '<span class="badge bg-secondary">Normal</span>'}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Formulario de registro (oculto por defecto) -->
      <div class="table-container" id="formularioAgregar" style="display: none; margin-top: 40px;">
        <h3>Selecciona los artículos a registrar</h3>
        <table class="table table-bordered table-hover table-striped align-middle">
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
                  <label class="ms-2">${art.nombre}</label>
                </td>
                <td>${art.categoria ?? '-'}</td>
                <td>
                  <input type="number" class="input-cantidad form-control form-control-sm" data-index="${i}" min="0" value="0" disabled />
                </td>
                <td>
                  ${art.prioridad
                    ? '<span class="badge bg-danger">Alta</span>'
                    : '<span class="badge bg-secondary">Normal</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="text-center mt-3">
          <button class="btn btn-primary" id="btnRegistrarArticulos">Registrar artículos</button>
          <button class="btn btn-secondary" id="btnCancelarFormulario">Cancelar</button>
        </div>
      </div>
    </section>
  `;

  // Mostrar formulario
  const btnMostrar = container.querySelector('#btnMostrarFormulario');
  if (btnMostrar) {
    btnMostrar.addEventListener('click', () => {
      container.querySelector('#formularioAgregar').style.display = 'block';
      btnMostrar.style.display = 'none';
    });
  }

  // Cancelar formulario
  const btnCancelar = container.querySelector('#btnCancelarFormulario');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => renderInventario(container));
  }

  // Eliminar sin brigada
  const btnEliminar = container.querySelector('#btnEliminarSinBrigada');
  if (btnEliminar) {
    btnEliminar.addEventListener('click', async () => {
      if (!confirm('¿Eliminar todos los artículos sin brigada?')) return;
      for (const art of agrupados['Sin Brigada'] || []) {
        try {
          await deleteArticulo(art.id);
        } catch (err) {
          console.error(`Error eliminando artículo ID ${art.id}:`, err);
        }
      }
      alert('Eliminados correctamente.');
      await renderInventario(container);
    });
  }

  // Checkbox → activar cantidad
  container.querySelectorAll('.chk-articulo').forEach(chk => {
    chk.addEventListener('change', () => {
      const index = chk.dataset.index;
      const input = container.querySelector(`.input-cantidad[data-index="${index}"]`);
      input.disabled = !chk.checked;
      if (!chk.checked) input.value = 0;
    });
  });

  // Registrar artículos (sin brigada asignada)
  const btnRegistrar = container.querySelector('#btnRegistrarArticulos');
  if (btnRegistrar) {
    btnRegistrar.addEventListener('click', async () => {
      const nuevos = [];
      container.querySelectorAll('.chk-articulo:checked').forEach(chk => {
        const index = chk.dataset.index;
        const cantidad = parseInt(container.querySelector(`.input-cantidad[data-index="${index}"]`).value);
        if (cantidad > 0) {
          nuevos.push({
            nombre: articulosCategorizados[index].nombre,
            categoria: articulosCategorizados[index].categoria,
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

      alert(`${nuevos.length} artículo(s) registrado(s).`);
      renderInventario(container);
    });
  }
}
