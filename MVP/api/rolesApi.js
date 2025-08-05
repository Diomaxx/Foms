import { API_BASE_URL } from './config.js';

async function fetchRoles() {
    try {
        console.log('🔄 Intentando cargar roles desde:', `${API_BASE_URL}/roles`);
        const response = await fetch(`${API_BASE_URL}/roles`);
        console.log('📡 Respuesta del servidor roles:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Roles cargados:', data);
        return data;
    } catch (error) {
        console.error('❌ Error fetching roles:', error);
        showNotification('Error al cargar roles', 'error');
        return [];
    }
}

async function createRole(roleData) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roleData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newRole = await response.json();
        return newRole;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
}

async function updateRole(id, roleData) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roleData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedRole = await response.json();
        return updatedRole;
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
}

async function deleteRoleAPI(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting role:', error);
        throw error;
    }
}