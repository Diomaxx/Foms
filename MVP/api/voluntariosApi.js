import { API_BASE_URL } from './config.js';


async function fetchVoluntarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/voluntarios`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        voluntarios = data;
        return data;
    } catch (error) {
        console.error('Error fetching voluntarios:', error);
        showNotification('Error al cargar voluntarios', 'error');
        return [];
    }
}

async function createVoluntario(voluntarioData) {
    try {
        const response = await fetch(`${API_BASE_URL}/voluntarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(voluntarioData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newVoluntario = await response.json();
        return newVoluntario;
    } catch (error) {
        console.error('Error creating voluntario:', error);
        throw error;
    }
}

async function updateVoluntario(id, voluntarioData) {
    try {
        const response = await fetch(`${API_BASE_URL}/voluntarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(voluntarioData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedVoluntario = await response.json();
        return updatedVoluntario;
    } catch (error) {
        console.error('Error updating voluntario:', error);
        throw error;
    }
}

async function deleteVoluntario(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/voluntarios/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting voluntario:', error);
        throw error;
    }
}