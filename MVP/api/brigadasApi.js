import { API_BASE_URL } from './config.js';

async function fetchBrigadas() {
    try {
        console.log('🔄 Intentando cargar brigadas desde:', `${API_BASE_URL}/brigadas`);
        const response = await fetch(`${API_BASE_URL}/brigadas`);
        console.log('📡 Respuesta del servidor brigadas:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Brigadas cargadas:', data);
        brigadas = data;
        return data;
    } catch (error) {
        console.error('❌ Error fetching brigadas:', error);
        showNotification('Error al cargar brigadas', 'error');
        return [];
    }
}

async function createBrigada(brigadaData) {
    try {
        const response = await fetch(`${API_BASE_URL}/brigadas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(brigadaData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newBrigada = await response.json();
        return newBrigada;
    } catch (error) {
        console.error('Error creating brigada:', error);
        throw error;
    }
}

async function updateBrigada(id, brigadaData) {
    try {
        const response = await fetch(`${API_BASE_URL}/brigadas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(brigadaData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedBrigada = await response.json();
        return updatedBrigada;
    } catch (error) {
        console.error('Error updating brigada:', error);
        throw error;
    }
}

async function deleteBrigadaAPI(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/brigadas/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting brigada:', error);
        throw error;
    }
}