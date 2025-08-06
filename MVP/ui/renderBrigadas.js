import {
  getBrigadas,
  createBrigada,
  updateBrigada,
  deleteBrigada
} from '../api/brigadasApi.js';

export async function renderBrigadas(container) {
  const brigadas = await getBrigadas();

  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Gestión de Brigadas</h2>
        <div class="header-buttons">
          <button class="btn" id="btnOpenBrigadaModal">Agregar Brigada</button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${brigadas.map(b => `
              <tr>
                <td>${b.nombre}</td>
                <td>${b.descripcion}</td>
                <td>
                  <button class="btn edit" data-id="${b.id}">Editar</button>
                  <button class="btn delete" data-id="${b.id}">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
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
              <label for="descripcion">Descripción</label>
              <input type="text" id="descripcion" required />
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
  container.querySelector('#btnOpenBrigadaModal').addEventListener('click', () => {
    resetForm();
    modal.classList.add('show');
  });

  // Cerrar modal
  modal.querySelector('#btnCloseBrigadaModal').addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Guardar
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

  // Editar
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

  // Eliminar
  container.querySelectorAll('.btn.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('¿Eliminar esta brigada?')) {
        await deleteBrigada(id);
        await renderBrigadas(container);
      }
    });
  });

  function resetForm() {
    form.reset();
    form.brigadaId.value = '';
    form.nombre.value = `BRG${brigadas.length + 1}`; // Código autogenerado
    container.querySelector('#brigadaModalTitle').textContent = 'Nueva Brigada';
  }
}
