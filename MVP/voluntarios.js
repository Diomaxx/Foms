// En tu voluntariosUI.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const voluntarios = await fetchVoluntarios();
        renderVoluntarios(voluntarios);
    } catch (error) {
        console.error("Error inicial:", error);
    }
});

function renderVoluntarios(voluntarios) {
    const tbody = document.getElementById('voluntariosTableBody');
    tbody.innerHTML = voluntarios.map(voluntario => `
        <tr>
            <td>${voluntario.codigo}</td>
            <td>${voluntario.nombre}</td>
            <td>${voluntario.ci}</td>
            <td>${voluntario.telefono}</td>
            <td>${voluntario.activo ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button onclick="editVoluntario(${voluntario.id})">Editar</button>
                <button onclick="deleteVoluntarioHandler(${voluntario.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function deleteVoluntarioHandler(id) {
    if (confirm('¿Estás seguro de eliminar este voluntario?')) {
        try {
            await deleteVoluntario(id);
            showNotification('Voluntario eliminado', 'success');
            // Recargar la lista
            const voluntarios = await fetchVoluntarios();
            renderVoluntarios(voluntarios);
        } catch (error) {
            showNotification('Error al eliminar', 'error');
        }
    }
}