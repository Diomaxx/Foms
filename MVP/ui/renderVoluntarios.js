import {
  getVoluntarios,
  createVoluntario,
  updateVoluntario,
  deleteVoluntario
} from '../api/voluntariosApi.js';

export async function renderVoluntarios(container) {
  const voluntarios = await getVoluntarios();

  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Gestión de Voluntarios</h2>
        <div class="header-buttons">
          <button class="btn" id="btnOpenModal">Agregar Voluntario</button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>CI</th>
              <th>Teléfono</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${voluntarios.map(v => `
              <tr>
                <td>${v.id}</td>
                <td>${v.codigo}</td>
                <td>${v.nombre}</td>
                <td>${v.ci}</td>
                <td>${v.telefono}</td>
                <td>
                  <span class="status-badge ${v.activo ? 'status-active' : 'status-inactive'}">
                    ${v.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button class="btn edit" data-id="${v.id}">Editar</button>
                  <button class="btn delete" data-id="${v.id}">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal -->
    <div class="modal" id="voluntarioModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Nuevo Voluntario</h3>
          <button class="close-btn" id="btnCloseModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="voluntarioForm">
            <input type="hidden" id="voluntarioId" />
            <div class="form-group">
            <label for="codigo">Código</label>
            <input type="text" id="codigo" readonly />
            </div>
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input type="text" id="nombre" required />
            </div>
            <div class="form-group">
              <label for="ci">CI</label>
              <input type="text" id="ci" required />
            </div>
            <div class="form-group">
              <label for="telefono">Teléfono</label>
              <input type="text" id="telefono" required />
            </div>
            <div class="form-group">
              <label for="activo">Activo</label>
              <select id="activo">
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" id="btnGuardar">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = container.querySelector('#voluntarioModal');
  const form = modal.querySelector('#voluntarioForm');

  // Abrir modal
  container.querySelector('#btnOpenModal').addEventListener('click', () => {
    resetForm();
    modal.classList.add('show');
  });

  // Cerrar modal
  modal.querySelector('#btnCloseModal').addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = form.querySelector('#voluntarioId').value;
    const data = {
      codigo: form.codigo.value,
      nombre: form.nombre.value,
      ci: form.ci.value,
      telefono: form.telefono.value,
      activo: form.activo.value === 'true'
    };

    try {
      if (id) {
        await updateVoluntario(id, data);
      } else {
        await createVoluntario(data);
      }
      modal.classList.remove('show');
      await renderVoluntarios(container);
    } catch (err) {
      alert('Error al guardar voluntario');
    }
  });

  // Editar
  container.querySelectorAll('.btn.edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const v = voluntarios.find(vol => vol.id == id);
      if (!v) return;

      form.voluntarioId.value = v.id;
      form.codigo.value = v.codigo;
      form.nombre.value = v.nombre;
      form.ci.value = v.ci;
      form.telefono.value = v.telefono;
      form.activo.value = v.activo ? 'true' : 'false';

      container.querySelector('#modalTitle').textContent = 'Editar Voluntario';
      modal.classList.add('show');
    });
  });

  // Eliminar
  container.querySelectorAll('.btn.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('¿Eliminar este voluntario?')) {
        await deleteVoluntario(id);
        await renderVoluntarios(container);
      }
    });
  });

  function resetForm() {
  form.reset();
  form.voluntarioId.value = '';
  const codigoGenerado = `VOL${voluntarios.length + 1}`;
  form.codigo.value = codigoGenerado;
  container.querySelector('#modalTitle').textContent = 'Nuevo Voluntario';
 }
}
