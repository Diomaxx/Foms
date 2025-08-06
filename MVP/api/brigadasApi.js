import { API_BASE_URL } from '../config.js';

const BRIGADAS_ENDPOINT = `${API_BASE_URL}/brigadas`;

export async function getBrigadas() {
  try {
    const res = await fetch(BRIGADAS_ENDPOINT);
    if (!res.ok) throw new Error('Error al obtener brigadas');
    return await res.json();
  } catch (err) {
    console.error('[GET] Brigadas:', err);
    return [];
  }
}

export async function createBrigada(data) {
  try {
    const res = await fetch(BRIGADAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear brigada');
    return await res.json();
  } catch (err) {
    console.error('[POST] Brigada:', err);
    throw err;
  }
}

export async function updateBrigada(id, data) {
  try {
    const res = await fetch(`${BRIGADAS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar brigada');
    return await res.json();
  } catch (err) {
    console.error('[PUT] Brigada:', err);
    throw err;
  }
}

export async function deleteBrigada(id) {
  try {
    const res = await fetch(`${BRIGADAS_ENDPOINT}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar brigada');
    return true;
  } catch (err) {
    console.error('[DELETE] Brigada:', err);
    throw err;
  }
}
