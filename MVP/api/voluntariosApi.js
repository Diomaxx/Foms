import { API_BASE_URL } from '../config.js';

const VOLUNTARIOS_ENDPOINT = `${API_BASE_URL}/voluntarios`;

export async function getVoluntarios() {
  try {
    const res = await fetch(VOLUNTARIOS_ENDPOINT);
    if (!res.ok) throw new Error('Error al obtener voluntarios');
    return await res.json();
  } catch (err) {
    console.error('[GET] Voluntarios:', err);
    return [];
  }
}

export async function getVoluntarioById(id) {
  try {
    const res = await fetch(`${VOLUNTARIOS_ENDPOINT}/${id}`);
    if (!res.ok) throw new Error('Voluntario no encontrado');
    return await res.json();
  } catch (err) {
    console.error('[GET by ID] Voluntario:', err);
    return null;
  }
}

export async function createVoluntario(data) {
  try {
    const res = await fetch(VOLUNTARIOS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear voluntario');
    return await res.json();
  } catch (err) {
    console.error('[POST] Voluntario:', err);
    throw err;
  }
}

export async function updateVoluntario(id, data) {
  try {
    const res = await fetch(`${VOLUNTARIOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar voluntario');
    return await res.json();
  } catch (err) {
    console.error('[PUT] Voluntario:', err);
    throw err;
  }
}

export async function deleteVoluntario(id) {
  try {
    const res = await fetch(`${VOLUNTARIOS_ENDPOINT}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar voluntario');
    return true;
  } catch (err) {
    console.error('[DELETE] Voluntario:', err);
    throw err;
  }
}
