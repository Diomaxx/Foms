import {
  getVoluntarios,
  createVoluntario,
  deleteVoluntario
} from '../api/voluntariosApi.js';
import { getBrigadas } from '../api/brigadasApi.js';
import {
  getBrigadasVoluntarios,
  createBrigadaVoluntario
} from '../api/brigadas/brigadasVoluntariosApi.js';

export async function renderVoluntarios(container) {
  const [voluntarios, brigadas, relaciones] = await Promise.all([
    getVoluntarios(),
    getBrigadas(),
    getBrigadasVoluntarios()
  ]);

  // Relacionar voluntario con brigada
  const voluntariosConBrigada = voluntarios.map(vol => {
    const rel = relaciones.find(rel => rel.id_voluntario === vol.id);
    const brigada = rel ? brigadas.find(b => b.id === rel.id_brigada) : null;
    return {
      ...vol,
      brigadaNombre: brigada?.nombre ?? 'Sin asignar'
    };
  });

  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Gestión de Voluntarios</h2>
        <div class="header-buttons">
          <button class="btn" id="btnOpenVoluntarioModal">Agregar Voluntario</button>
        </div>
      </div>

      <div class="voluntarios-grid">
        ${voluntariosConBrigada.map(vol => `
          <div class="voluntario-card">
            <h4>${vol.nombre}</h4>
            <p><strong>CI:</strong> ${vol.ci}</p>
            <p><strong>Teléfono:</strong> ${vol.telefono}</p>
            <p><strong>Brigada:</strong> ${vol.brigadaNombre}</p>
            <button class="btn btn-danger btn-sm eliminar-voluntario" data-id="${vol.id}">Eliminar</button>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Modal -->
    <div class="modal" id="voluntarioModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Nuevo Voluntario</h3>
          <button class="close-btn" id="btnCloseVoluntarioModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="voluntarioForm">
            <div class="form-group">
              <label for="nombre">Nombre completo</label>
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
              <label for="brigada">Brigada asignada</label>
              <select id="brigada" required>
                <option value="">Seleccione una brigada</option>
                ${brigadas.map(b => `<option value="${b.id}">${b.nombre}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = container.querySelector('#voluntarioModal');
  const form = modal.querySelector('#voluntarioForm');

  // Abrir modal
  container.querySelector('#btnOpenVoluntarioModal').addEventListener('click', () => {
    form.reset();
    modal.classList.add('show');
  });

  // Cerrar modal
  modal.querySelector('#btnCloseVoluntarioModal').addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Registrar nuevo voluntario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const ci = form.ci.value.trim();
    const telefono = form.telefono.value.trim();
    const id_brigada = parseInt(form.brigada.value);

    try {
      const nuevo = await createVoluntario({ nombre, ci, telefono });
      await createBrigadaVoluntario({ id_voluntario: nuevo.id, id_brigada });

      alert('Voluntario registrado correctamente.');
      modal.classList.remove('show');
      await renderVoluntarios(container);
    } catch (err) {
      console.error('Error al registrar voluntario:', err);
      alert('Error al registrar voluntario.');
    }
  });

  // Eliminar voluntario
  container.querySelectorAll('.btn.delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('¿Eliminar este voluntario?')) {
        try {
          await deleteVoluntario(id);
          await renderVoluntarios(container);
        } catch (err) {
          console.error('Error eliminando voluntario:', err);
          alert('No se pudo eliminar el voluntario.');
        }
      }
    });
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
  })
}