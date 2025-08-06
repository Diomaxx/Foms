import { articulosCategorizados } from '../data/articulosCategorizados.js';
import { createArticulo } from '../api/inventario/articulosApi.js';

export function renderFormularioBrigada(container) {
  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Formulario de Registro de Brigada</h2>
      </div>

      <!-- Paso 1: Datos Generales -->
      <div class="modal-step active" data-step="1">
        <h3>Información General</h3>
        <form id="formBrigadaDatos">
          <div class="form-group">
            <label for="nombreBrigada">Nombre de la brigada</label>
            <input type="text" id="nombreBrigada" required>
          </div>
          <div class="form-group">
            <label for="cantidadBomberos">Cantidad de bomberos activos</label>
            <input type="number" id="cantidadBomberos" required>
          </div>
          <div class="form-group">
            <label for="celularComandante">Celular del comandante</label>
            <input type="text" id="celularComandante" required>
          </div>
          <div class="form-group">
            <label for="encargadoLogistica">Encargado de logística</label>
            <input type="text" id="encargadoLogistica" required>
          </div>
          <div class="form-group">
            <label for="celularLogistica">Celular de logística</label>
            <input type="text" id="celularLogistica" required>
          </div>
          <div class="form-group">
            <label for="numeroEmergencia">Número de emergencia público</label>
            <input type="text" id="numeroEmergencia" required>
          </div>
          <button type="button" class="btn btn-primary" id="btnSiguiente1">Siguiente</button>
        </form>
      </div>

      <!-- Paso 2: Artículos - con tabla -->
      <div class="modal-step" data-step="2">
        <h3>Selección de Artículos</h3>
        <div class="table-container">
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
                  <td>${art.categoria || '-'}</td>
                  <td><input type="number" class="input-cantidad" data-index="${i}" min="0" value="0" disabled /></td>
                  <td>
                    ${art.prioridad
                      ? '<span class="status-badge status-active">Alta</span>'
                      : '<span class="status-badge status-inactive">Normal</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <button type="button" class="btn btn-primary" id="btnSiguiente2">Siguiente</button>
      </div>

      <!-- Paso Final -->
      <div class="modal-step" data-step="3">
        <h3>Confirmación</h3>
        <p>Verifica todos los datos antes de enviar.</p>
        <button type="submit" class="btn btn-primary" id="btnEnviarFormulario">Enviar formulario</button>
      </div>
    </section>
  `;

  // 🔄 Navegación entre pasos
  const steps = container.querySelectorAll('.modal-step');
  const showStep = stepNum => {
    steps.forEach(s => s.classList.remove('active'));
    container.querySelector(`.modal-step[data-step="${stepNum}"]`).classList.add('active');
  };

  container.querySelector('#btnSiguiente1').addEventListener('click', () => {
    const form = container.querySelector('#formBrigadaDatos');
    if (form.checkValidity()) {
      showStep(2);
    } else {
      form.reportValidity();
    }
  });

  container.querySelector('#btnSiguiente2').addEventListener('click', () => {
    showStep(3);
  });

  // 🔘 Activar cantidad si se marca el checkbox
  container.querySelectorAll('.chk-articulo').forEach(chk => {
    chk.addEventListener('change', () => {
      const index = chk.dataset.index;
      const inputCantidad = container.querySelector(`.input-cantidad[data-index="${index}"]`);
      inputCantidad.disabled = !chk.checked;
      if (!chk.checked) inputCantidad.value = 0;
    });
  });

  // ✅ Enviar formulario completo
  container.querySelector('#btnEnviarFormulario').addEventListener('click', async () => {
    const nuevos = [];
    container.querySelectorAll('.chk-articulo:checked').forEach(chk => {
      const index = chk.dataset.index;
      const cantidad = parseInt(container.querySelector(`.input-cantidad[data-index="${index}"]`).value);
      if (cantidad > 0) {
        nuevos.push({
          nombre: articulosCategorizados[index].nombre,
          categoria: articulosCategorizados[index].categoria || 'Sin categoría',
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

    alert(`Formulario enviado con ${nuevos.length} artículos registrados.`);
    location.reload(); // reiniciar
  });
}
