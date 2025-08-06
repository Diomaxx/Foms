import { API_BASE_URL } from '../../config.js';

const ARTICULOS_ENDPOINT = `${API_BASE_URL}/articulos`;

export async function getArticulos() {
  try {
    const res = await fetch(ARTICULOS_ENDPOINT);
    if (!res.ok) throw new Error('Error al obtener artículos');
    return await res.json();
  } catch (err) {
    console.error('[GET] Artículos:', err);
    return [];
  }
}

export async function createArticulo(data) {
  try {
    const res = await fetch(ARTICULOS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear artículo');
    return await res.json();
  } catch (err) {
    console.error('[POST] Artículo:', err);
    throw err;
  }
}

export async function updateArticulo(id, data) {
  try {
    const res = await fetch(`${ARTICULOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar artículo');
    return await res.json();
  } catch (err) {
    console.error('[PUT] Artículo:', err);
    throw err;
  }
}

export async function deleteArticulo(id) {
  try {
    const res = await fetch(`${ARTICULOS_ENDPOINT}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar artículo');
    return true;
  } catch (err) {
    console.error('[DELETE] Artículo:', err);
    throw err;
  }
}
