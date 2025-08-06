import {
  getBrigadas,
  createBrigada,
  updateBrigada,
  deleteBrigada
} from '../api/brigadasApi.js';

import { getArticulos, deleteArticulo } from '../api/inventario/articulosApi.js';

export async function renderBrigadas(container) {
  const brigadas = await getBrigadas();

  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Gestión de Brigadas</h2>
      </div>

      <div class="brigadas-grid">
        ${brigadas.map(brigada => {
          let meta = {};
          try {
            meta = JSON.parse(brigada.descripcion || '{}');
          } catch (e) {
            console.warn(`Descripción no válida para brigada ${brigada.nombre}`);
          }

          return `
            <div class="brigada-card">
              <h3>${brigada.nombre}</h3>
              <p><strong>Bomberos activos:</strong> ${meta.cantidad_bomberos ?? '-'}</p>
              <p><strong>Comandante:</strong> ${meta.celular_comandante ?? '-'}</p>
              <p><strong>Logística:</strong> ${meta.encargado_logistica ?? '-'}</p>
              <p><strong>Contacto logística:</strong> ${meta.celular_logistica ?? '-'}</p>
              <p><strong>Emergencia:</strong> ${meta.numero_emergencia ?? 'No brindado'}</p>
              <button class="btn edit" data-id="${brigada.id}">Editar</button>
              <button class="btn delete" data-id="${brigada.id}">Eliminar</button>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Modal -->
    <div class="modal" id="brigadaModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="brigadaModalTitle">Nueva Brigada</h3>
          <button class="close-btn" id="btnCloseBrigadaModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="brigadaForm">
            <input type="hidden" id="brigadaId" />
            <div class="form-group">
              <label for="nombre">Nombre (autogenerado)</label>
              <input type="text" id="nombre" readonly />
            </div>
            <div class="form-group">
              <label for="descripcion">Descripción (JSON)</label>
              <textarea id="descripcion" required rows="6"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = container.querySelector('#brigadaModal');
  const form = modal.querySelector('#brigadaForm');

  // Abrir modal
  container.querySelector('#btnOpenBrigadaModal')?.addEventListener('click', () => {
    resetForm();
    modal.classList.add('show');
  });

  // Cerrar modal
  modal.querySelector('#btnCloseBrigadaModal')?.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Guardar brigada
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = form.brigadaId.value;
    const data = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value
    };

    try {
      if (id) {
        await updateBrigada(id, data);
      } else {
        await createBrigada(data);
      }
      modal.classList.remove('show');
      await renderBrigadas(container);
    } catch (err) {
      alert('Error al guardar brigada');
    }
  });

  // Editar brigada
  container.querySelectorAll('.btn.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const b = brigadas.find(brg => brg.id == id);
      if (!b) return;

      form.brigadaId.value = b.id;
      form.nombre.value = b.nombre;
      form.descripcion.value = b.descripcion;

      container.querySelector('#brigadaModalTitle').textContent = 'Editar Brigada';
      modal.classList.add('show');
    });
  });

  // Eliminar brigada con artículos relacionados
  container.querySelectorAll('.btn.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;

      if (!confirm('¿Eliminar esta brigada y sus artículos asociados?')) return;

      try {
        const articulos = await getArticulos();
        const relacionados = articulos.filter(a =>
          a.observaciones?.trim() === `brigada_id: ${id}`
        );

        for (const art of relacionados) {
          try {
            await deleteArticulo(art.id);
          } catch (err) {
            console.warn(`No se pudo eliminar artículo ID ${art.id}:`, err);
          }
        }

        await deleteBrigada(id);
        await renderBrigadas(container);
        alert(`Brigada y ${relacionados.length} artículo(s) eliminados.`);
      } catch (err) {
        console.error('Error al eliminar brigada:', err);
        alert('Error al eliminar la brigada. Intenta nuevamente.');
      }
    });
  });

  function resetForm() {
    form.reset();
    form.brigadaId.value = '';
    form.nombre.value = `BRG${brigadas.length + 1}`;
    form.descripcion.value = '';
    container.querySelector('#brigadaModalTitle').textContent = 'Nueva Brigada';
  }
}
