import { API_BASE_URL } from '../../config.js';

const BRIGADAS_VOLUNTARIOS_ENDPOINT = `${API_BASE_URL}/brigadas-voluntarios`;

// Obtener todas las relaciones brigada-voluntario
export async function getBrigadasVoluntarios() {
  try {
    const response = await fetch(BRIGADAS_VOLUNTARIOS_ENDPOINT);
    if (!response.ok) {
      throw new Error('Error al obtener brigadas-voluntarios');
    }
    return await response.json();
  } catch (err) {
    console.error('❌ Error en getBrigadasVoluntarios:', err);
    return [];
  }
}

// Crear nueva relación brigada-voluntario
export async function createBrigadaVoluntario(data) {
  try {
    const response = await fetch(BRIGADAS_VOLUNTARIOS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Error al crear relación brigada-voluntario');
    }

    return await response.json();
  } catch (err) {
    console.error('❌ Error en createBrigadaVoluntario:', err);
    throw err;
  }
}

// Eliminar relación (opcional, por si lo necesitas después)
export async function deleteBrigadaVoluntario(id_voluntario, id_brigada) {
  try {
    const response = await fetch(`${BRIGADAS_VOLUNTARIOS_ENDPOINT}?id_voluntario=${id_voluntario}&id_brigada=${id_brigada}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar relación brigada-voluntario');
    }

    return await response.json();
  } catch (err) {
    console.error('❌ Error en deleteBrigadaVoluntario:', err);
    throw err;
  }
}
