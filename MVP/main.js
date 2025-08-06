import { renderFormularioBrigada } from './ui/renderFormularioBrigadas.js';
import { renderVoluntarios } from './ui/renderVoluntarios.js';
import { renderBrigadas } from './ui/renderBrigadas.js';
import { renderInventario } from './ui/renderInventario.js';


const content = document.getElementById('content');
const navButtons = document.querySelectorAll('nav button');

navButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    // Quitar clase "active" a todos
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const section = btn.dataset.section;
    switch (section) {
      case 'registro':
        await renderFormularioBrigada(content); // nueva función
        break;

      case 'brigadas':
        await renderBrigadas(content);
        break;

      case 'voluntarios':
          await renderVoluntarios(content);
          break;


      case 'inventario':
          await renderInventario(content);
          break;

      default:
        content.innerHTML = '<p>Sección no implementada aún.</p>';
    }
  });
});

// Cargar por defecto la sección de brigadas
document.querySelector('nav button[data-section="brigadas"]').click();
