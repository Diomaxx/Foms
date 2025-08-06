import { articulosCategorizados } from '../data/articulosCategorizados.js';
import { createBrigada } from '../api/brigadasApi.js';
import { createArticulo } from '../api/inventario/articulosApi.js';

export function renderFormularioBrigada(container) {
  function groupByCategoria(articulos) {
    const grupos = {};
    articulos.forEach((art, i) => {
      const categoria = art.categoria || 'Sin categoría';
      if (!grupos[categoria]) grupos[categoria] = [];
      grupos[categoria].push({ ...art, index: i });
    });
    return grupos;
  }


  container.innerHTML = `
    <section>
      <div class="section-header">
        <h2>Formulario de Registro de Brigada</h2>

        <div class="step-indicator-container">
          <div class="step-item" data-step="1">
            <div class="circle">1</div>
            <div class="label">Datos Generales</div>
          </div>
          <div class="step-item" data-step="2">
            <div class="circle">2</div>
            <div class="label">Artículos</div>
          </div>
          <div class="step-item" data-step="3">
            <div class="circle">3</div>
            <div class="label">Confirmación</div>
          </div>
        </div>

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

        <div class="accordion" id="accordionArticulos">
          ${Object.entries(groupByCategoria(articulosCategorizados)).map(([categoria, articulos], i) => `
            <div class="accordion-item">
              <h2 class="accordion-header" id="heading-${i}">
                <button class="accordion-button ${i !== 0 ? 'collapsed' : ''}" type="button"
                        data-bs-toggle="collapse" data-bs-target="#collapse-${i}"
                        aria-expanded="${i === 0}" aria-controls="collapse-${i}">
                  ${categoria}
                </button>
              </h2>
              <div id="collapse-${i}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}"
                  aria-labelledby="heading-${i}" data-bs-parent="#accordionArticulos">
                <div class="accordion-body">
                  <table class="table table-striped table-bordered">
                    <thead>
                      <tr><th>Artículo</th><th>Cantidad</th><th>Prioridad</th></tr>
                    </thead>
                    <tbody>
                      ${articulos.map((art, j) => `
                        <tr>
                          <td>
                            <input type="checkbox" class="chk-articulo" data-index="${art.index}" />
                            <label style="margin-left: 8px;">${art.nombre}</label>
                          </td>
                          <td><input type="number" class="input-cantidad" data-index="${art.index}" min="0" value="0" disabled /></td>
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

        <div class="text-center mt-3">
          <button type="button" class="btn btn-primary" id="btnSiguiente2">Siguiente</button>
        </div>
      </div>


      <!-- Paso Final -->
      <div class="modal-step" data-step="3">
        <h3>Confirmación</h3>
        <p>Verifica todos los datos antes de enviar.</p>
        
        <div id="resumenFormulario" class="mb-4">
          <!-- Aquí se insertará dinámicamente el resumen -->
        </div>

        <button type="submit" class="btn btn-primary" id="btnEnviarFormulario">Enviar formulario</button>
      </div>
    </section>
  `;

  const steps = container.querySelectorAll('.modal-step');

  const updateStepIndicator = (stepNum) => {
    container.querySelectorAll('.step-item').forEach((item, idx) => {
      const circle = item.querySelector('.circle');
      item.classList.remove('active', 'completed');
      if (idx + 1 < stepNum) {
        item.classList.add('completed');
        circle.innerHTML = '&#10003;';
      } else if (idx + 1 === stepNum) {
        item.classList.add('active');
        circle.innerHTML = idx + 1;
      } else {
        circle.innerHTML = idx + 1;
      }
    });
  };

  const showStep = stepNum => {
    steps.forEach(s => s.classList.remove('active'));
    container.querySelector(`.modal-step[data-step="${stepNum}"]`).classList.add('active');
    updateStepIndicator(stepNum);
  };

  container.querySelector('#btnSiguiente1').addEventListener('click', () => {
    const form = container.querySelector('#formBrigadaDatos');
    if (form.checkValidity()) showStep(2);
    else form.reportValidity();
  });

  container.querySelector('#btnSiguiente2').addEventListener('click', () => {
    const resumenDiv = container.querySelector('#resumenFormulario');

    // 1. Resumen de datos generales
    const datosGenerales = {
      nombreBrigada: container.querySelector('#nombreBrigada').value.trim(),
      cantidadBomberos: container.querySelector('#cantidadBomberos').value,
      celularComandante: container.querySelector('#celularComandante').value.trim(),
      encargadoLogistica: container.querySelector('#encargadoLogistica').value.trim(),
      celularLogistica: container.querySelector('#celularLogistica').value.trim(),
      numeroEmergencia: container.querySelector('#numeroEmergencia').value.trim(),
    };

    // 2. Artículos seleccionados
    const articulosSeleccionados = [];
    container.querySelectorAll('.chk-articulo:checked').forEach(chk => {
      const index = chk.dataset.index;
      const cantidad = parseInt(container.querySelector(`.input-cantidad[data-index="${index}"]`).value);
      if (cantidad > 0) {
        articulosSeleccionados.push({
          nombre: articulosCategorizados[index].nombre,
          categoria: articulosCategorizados[index].categoria || 'Sin categoría',
          cantidad,
          prioridad: articulosCategorizados[index].prioridad ? 'Alta' : 'Normal'
        });
      }
    });

    // 3. Construir HTML
    resumenDiv.innerHTML = `
      <h5>Datos de la Brigada</h5>
      <ul>
        <li><strong>Nombre:</strong> ${datosGenerales.nombreBrigada}</li>
        <li><strong>Bomberos activos:</strong> ${datosGenerales.cantidadBomberos}</li>
        <li><strong>Celular comandante:</strong> ${datosGenerales.celularComandante}</li>
        <li><strong>Encargado logística:</strong> ${datosGenerales.encargadoLogistica}</li>
        <li><strong>Celular logística:</strong> ${datosGenerales.celularLogistica}</li>
        <li><strong>Emergencia pública:</strong> ${datosGenerales.numeroEmergencia}</li>
      </ul>

      <h5 class="mt-4">Artículos seleccionados (${articulosSeleccionados.length})</h5>
      ${articulosSeleccionados.length === 0 ? '<p>No se seleccionaron artículos.</p>' : `
        <table class="table table-sm table-bordered table-hover align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            ${articulosSeleccionados.map(art => `
              <tr>
                <td>${art.nombre}</td>
                <td>${art.categoria}</td>
                <td>${art.cantidad}</td>
                <td><span class="badge ${art.prioridad === 'Alta' ? 'bg-danger' : 'bg-secondary'}">${art.prioridad}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    `;

    showStep(3); // avanzar al paso de confirmación
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
