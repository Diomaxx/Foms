import { articulosCategorizados } from '../data/articulosCategorizados.js';
import { createBrigada } from '../api/brigadasApi.js';
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
          <div class="form-group"><label for="nombreBrigada">Nombre</label><input type="text" id="nombreBrigada" required></div>
          <div class="form-group"><label for="cantidadBomberos">Bomberos activos</label><input type="number" id="cantidadBomberos" required></div>
          <div class="form-group"><label for="celularComandante">Celular comandante</label><input type="text" id="celularComandante" required></div>
          <div class="form-group"><label for="encargadoLogistica">Encargado logística</label><input type="text" id="encargadoLogistica" required></div>
          <div class="form-group"><label for="celularLogistica">Celular logística</label><input type="text" id="celularLogistica" required></div>
          <div class="form-group"><label for="numeroEmergencia">Emergencia pública</label><input type="text" id="numeroEmergencia"></div>
          <button type="button" class="btn btn-primary" id="btnSiguiente1">Siguiente</button>
        </form>
      </div>

      <!-- Paso 2: Artículos -->
      <div class="modal-step" data-step="2">
        <h3>Selección de Artículos</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr><th>Artículo</th><th>Categoría</th><th>Cantidad</th><th>Prioridad</th></tr>
            </thead>
            <tbody>
              ${articulosCategorizados.map((art, i) => `
                <tr>
                  <td><input type="checkbox" class="chk-articulo" data-index="${i}" /><label style="margin-left:8px;">${art.nombre}</label></td>
                  <td>${art.categoria || '-'}</td>
                  <td><input type="number" class="input-cantidad" data-index="${i}" value="0" min="0" disabled /></td>
                  <td>${art.prioridad ? '<span class="status-badge status-active">Alta</span>' : '<span class="status-badge status-inactive">Normal</span>'}</td>
                </tr>`).join('')}
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

  const steps = container.querySelectorAll('.modal-step');
  const showStep = stepNum => {
    steps.forEach(s => s.classList.remove('active'));
    container.querySelector(`.modal-step[data-step="${stepNum}"]`).classList.add('active');
  };

  container.querySelector('#btnSiguiente1').addEventListener('click', () => {
    const form = container.querySelector('#formBrigadaDatos');
    if (form.checkValidity()) showStep(2);
    else form.reportValidity();
  });

  container.querySelector('#btnSiguiente2').addEventListener('click', () => {
    showStep(3);
  });

  container.querySelectorAll('.chk-articulo').forEach(chk => {
    chk.addEventListener('change', () => {
      const index = chk.dataset.index;
      const input = container.querySelector(`.input-cantidad[data-index="${index}"]`);
      input.disabled = !chk.checked;
      if (!chk.checked) input.value = 0;
    });
  });

  container.querySelector('#btnEnviarFormulario').addEventListener('click', async () => {
    const nombre = container.querySelector('#nombreBrigada').value.trim();
    const descripcion = JSON.stringify({
      cantidad_bomberos: container.querySelector('#cantidadBomberos').value,
      celular_comandante: container.querySelector('#celularComandante').value,
      encargado_logistica: container.querySelector('#encargadoLogistica').value,
      celular_logistica: container.querySelector('#celularLogistica').value,
      numero_emergencia: container.querySelector('#numeroEmergencia').value
    });

    try {
      const nueva = await createBrigada({ nombre, descripcion });
      const brigadaId = nueva.id;

      const articulos = [];
      container.querySelectorAll('.chk-articulo:checked').forEach(chk => {
        const index = chk.dataset.index;
        const cantidad = parseInt(container.querySelector(`.input-cantidad[data-index="${index}"]`).value);
        if (cantidad > 0) {
          articulos.push({
            nombre: articulosCategorizados[index].nombre,
            categoria: articulosCategorizados[index].categoria || '-',
            observaciones: `brigada_id: ${brigadaId}`,
            cantidad
          });
        }
      });

      for (const art of articulos) {
        await createArticulo(art);
      }

      alert(`Formulario registrado con ${articulos.length} artículo(s) asignado(s).`);
      location.reload();
    } catch (err) {
      console.error('Error al registrar:', err);
      alert('Error al registrar brigada');
    }
  });
}
