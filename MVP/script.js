// Configuración de la API
const API_BASE_URL = 'http://10.26.7.253:3000/api';

// Datos de ejemplo (simulando base de datos)
let voluntarios = [];
let roles = [];

let brigadas = [
    { id: 1, nombre: 'Brigada Alpha', descripcion: 'Brigada principal de respuesta rápida', miembros: 5 },
    { id: 2, nombre: 'Brigada Beta', descripcion: 'Brigada de apoyo y logística', miembros: 3 }
];

let articulos = [
    { id: 1, nombre: 'Extintor CO2', categoria: 'Equipos de Extinción', cantidad: 10, observaciones: 'Para fuegos eléctricos' },
    { id: 2, nombre: 'Manguera 50m', categoria: 'Equipos de Agua', cantidad: 8, observaciones: 'Manguera de alta presión' },
    { id: 3, nombre: 'Casco de Seguridad', categoria: 'Protección Personal', cantidad: 15, observaciones: 'Cascos certificados' }
];

let refacciones = [
    { id: 1, nombre: 'Bomba de Agua', categoria: 'Bombas', costo_aproximado: 2500, observaciones: 'Bomba centrífuga 1000L/min' },
    { id: 2, nombre: 'Válvula de Control', categoria: 'Válvulas', costo_aproximado: 800, observaciones: 'Válvula de 2 pulgadas' }
];

let ropa = [
    { 
        id: 1, 
        tipo: 'Traje de Bombero', 
        nombre: 'Traje Nomex',
        tallas: [
            { talla: 'M', cantidad: 5 },
            { talla: 'L', cantidad: 8 },
            { talla: 'XL', cantidad: 3 }
        ]
    },
    { 
        id: 2, 
        tipo: 'Botas', 
        nombre: 'Botas de Seguridad',
        tallas: [
            { talla: '40', cantidad: 4 },
            { talla: '41', cantidad: 6 },
            { talla: '42', cantidad: 5 }
        ]
    }
];

let tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '40', '41', '42', '43', '44', '45'];

// Estado de la aplicación
let currentUser = null;
let isAuthenticated = false;

// Elementos DOM
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');

// Funciones para consumir la API
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

// Funciones para consumir la API de Brigadas
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

// Funciones para consumir la API de Roles
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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    showLoginModal();
});

async function initializeApp() {
    // Cargar voluntarios, brigadas y roles desde la API
    await fetchVoluntarios();
    await fetchBrigadas();
    await fetchRoles();
    
    // Verificar si hay usuario autenticado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        hideLoginModal();
        updateUI();
        loadDashboard();
    }
}

function setupEventListeners() {
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Modales de autenticación
    document.getElementById('showRegister').addEventListener('click', showRegisterModal);
    document.getElementById('showLogin').addEventListener('click', showLoginModal);
    document.getElementById('closeLogin').addEventListener('click', hideLoginModal);
    document.getElementById('closeRegister').addEventListener('click', hideRegisterModal);

    // Formularios de autenticación
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Cerrar sesión
    logoutBtn.addEventListener('click', handleLogout);

    // Botones de agregar
    document.getElementById('addVoluntarioBtn').addEventListener('click', () => showModal('addVoluntarioModal'));
    document.getElementById('addBrigadaBtn').addEventListener('click', () => showModal('addBrigadaModal'));
    document.getElementById('addRoleBtn').addEventListener('click', () => showModal('addRoleModal'));
    document.getElementById('addArticuloBtn').addEventListener('click', () => showModal('addArticuloModal'));
    document.getElementById('addRefaccionBtn').addEventListener('click', () => showModal('addRefaccionModal'));
    document.getElementById('addRopaBtn').addEventListener('click', () => showModal('addRopaModal'));

    // Cerrar modales
    document.getElementById('closeAddVoluntario').addEventListener('click', () => hideModal('addVoluntarioModal'));
    document.getElementById('closeAddBrigada').addEventListener('click', () => hideModal('addBrigadaModal'));
    document.getElementById('closeAddRole').addEventListener('click', () => hideModal('addRoleModal'));
    document.getElementById('closeAddArticulo').addEventListener('click', () => hideModal('addArticuloModal'));
    document.getElementById('closeAddRefaccion').addEventListener('click', () => hideModal('addRefaccionModal'));
    document.getElementById('closeAddRopa').addEventListener('click', () => hideModal('addRopaModal'));

    // Formularios de agregar
    document.getElementById('addVoluntarioForm').addEventListener('submit', handleAddVoluntario);
    document.getElementById('addBrigadaForm').addEventListener('submit', handleAddBrigada);
    document.getElementById('addRoleForm').addEventListener('submit', handleAddRole);
    document.getElementById('addArticuloForm').addEventListener('submit', handleAddArticulo);
    document.getElementById('addRefaccionForm').addEventListener('submit', handleAddRefaccion);
    document.getElementById('addRopaForm').addEventListener('submit', handleAddRopa);

    // Tabs del inventario
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });

    // Gestión de tallas en ropa
    document.getElementById('addTallaBtn').addEventListener('click', addTallaField);
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove-talla')) {
            e.target.parentElement.remove();
        }
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Funciones de autenticación
function showLoginModal() {
    loginModal.style.display = 'block';
    registerModal.style.display = 'none';
}

function showRegisterModal() {
    registerModal.style.display = 'block';
    loginModal.style.display = 'none';
}

function hideLoginModal() {
    loginModal.style.display = 'none';
}

function hideRegisterModal() {
    registerModal.style.display = 'none';
}

async function handleLogin(e) {
    e.preventDefault();
    const codigo = document.getElementById('loginCodigo').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Buscar voluntario por código
        const voluntario = voluntarios.find(v => v.codigo === codigo);
        if (voluntario && password === '123456') { // Contraseña por defecto
            currentUser = voluntario;
            isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(voluntario));
            hideLoginModal();
            updateUI();
            loadDashboard();
            showNotification('Inicio de sesión exitoso', 'success');
        } else {
            showNotification('Código o contraseña incorrectos', 'error');
        }
    } catch (error) {
        console.error('Error during login:', error);
        showNotification('Error al iniciar sesión', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const codigo = document.getElementById('registerCodigo').value;
    const nombre = document.getElementById('registerNombre').value;
    const ci = document.getElementById('registerCI').value;
    const telefono = document.getElementById('registerTelefono').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const voluntarioData = {
            codigo,
            nombre,
            ci,
            telefono,
            activo: true
        };

        const newVoluntario = await createVoluntario(voluntarioData);
        currentUser = newVoluntario;
        isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(newVoluntario));
        hideRegisterModal();
        updateUI();
        loadDashboard();
        showNotification('Registro exitoso', 'success');
    } catch (error) {
        console.error('Error registering voluntario:', error);
        if (error.message.includes('409')) {
            showNotification('El código o CI ya está registrado', 'error');
        } else {
            showNotification('Error al registrar voluntario', 'error');
        }
    }
}

function handleLogout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('currentUser');
    showLoginModal();
    updateUI();
}

function updateUI() {
    if (isAuthenticated && currentUser) {
        userName.textContent = currentUser.nombre;
        document.querySelector('.user-menu').style.display = 'flex';
        document.querySelector('.nav').style.display = 'block';
    } else {
        userName.textContent = 'Usuario';
        document.querySelector('.user-menu').style.display = 'none';
        document.querySelector('.nav').style.display = 'none';
    }
}

// Navegación
async function handleNavigation(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href').substring(1);
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    
    // Cargar datos según la sección
    try {
        switch(target) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'voluntarios':
                await loadVoluntarios();
                break;
            case 'brigadas':
                await loadBrigadas();
                break;
            case 'roles':
                await loadRoles();
                break;
            case 'inventario':
                loadInventario();
                break;
            case 'ropa':
                loadRopa();
                break;
        }
    } catch (error) {
        console.error('Error loading section:', error);
        showNotification('Error al cargar la sección', 'error');
    }
}

// Dashboard
async function loadDashboard() {
    try {
        // Asegurar que tenemos los datos más recientes de voluntarios y brigadas
        await fetchVoluntarios();
        await fetchBrigadas();
        document.getElementById('totalVoluntarios').textContent = voluntarios.filter(v => v.activo).length;
        document.getElementById('totalBrigadas').textContent = brigadas.length;
        document.getElementById('totalArticulos').textContent = articulos.reduce((sum, art) => sum + art.cantidad, 0);
        document.getElementById('totalRopa').textContent = ropa.length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Voluntarios
async function loadVoluntarios() {
    try {
        await fetchVoluntarios();
        const tbody = document.getElementById('voluntariosTableBody');
        tbody.innerHTML = '';
        
        voluntarios.forEach(voluntario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${voluntario.codigo}</td>
                <td>${voluntario.nombre}</td>
                <td>${voluntario.ci}</td>
                <td>${voluntario.telefono}</td>
                <td><span class="status-badge ${voluntario.activo ? 'status-active' : 'status-inactive'}">${voluntario.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn-edit" onclick="editVoluntario(${voluntario.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-danger" onclick="toggleVoluntarioStatus(${voluntario.id})">
                        <i class="fas fa-${voluntario.activo ? 'ban' : 'check'}"></i> ${voluntario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading voluntarios:', error);
        showNotification('Error al cargar voluntarios', 'error');
    }
}

async function handleAddVoluntario(e) {
    e.preventDefault();
    const codigo = document.getElementById('voluntarioCodigo').value;
    const nombre = document.getElementById('voluntarioNombre').value;
    const ci = document.getElementById('voluntarioCI').value;
    const telefono = document.getElementById('voluntarioTelefono').value;

    try {
        const voluntarioData = {
            codigo,
            nombre,
            ci,
            telefono,
            activo: true
        };

        await createVoluntario(voluntarioData);
        hideModal('addVoluntarioModal');
        await loadVoluntarios();
        loadDashboard();
        showNotification('Voluntario agregado exitosamente', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error adding voluntario:', error);
        if (error.message.includes('409')) {
            showNotification('El código o CI ya está registrado', 'error');
        } else {
            showNotification('Error al agregar voluntario', 'error');
        }
    }
}

async function toggleVoluntarioStatus(id) {
    try {
        const voluntario = voluntarios.find(v => v.id === id);
        if (voluntario) {
            const updatedData = {
                ...voluntario,
                activo: !voluntario.activo
            };
            
            await updateVoluntario(id, updatedData);
            await loadVoluntarios();
            loadDashboard();
            showNotification(`Voluntario ${updatedData.activo ? 'activado' : 'desactivado'}`, 'success');
        }
    } catch (error) {
        console.error('Error toggling voluntario status:', error);
        showNotification('Error al cambiar estado del voluntario', 'error');
    }
}

// Brigadas
async function loadBrigadas() {
    try {
        await fetchBrigadas();
        const tbody = document.getElementById('brigadasTableBody');
        tbody.innerHTML = '';
        
        brigadas.forEach(brigada => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${brigada.nombre}</td>
                <td>${brigada.descripcion}</td>
                <td>${brigada.miembros || 0}</td>
                <td>
                    <button class="btn-edit" onclick="editBrigada(${brigada.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-danger" onclick="deleteBrigada(${brigada.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading brigadas:', error);
        showNotification('Error al cargar brigadas', 'error');
    }
}

async function handleAddBrigada(e) {
    e.preventDefault();
    const nombre = document.getElementById('brigadaNombre').value;
    const descripcion = document.getElementById('brigadaDescripcion').value;

    try {
        const brigadaData = {
            nombre,
            descripcion
        };

        await createBrigada(brigadaData);
        hideModal('addBrigadaModal');
        await loadBrigadas();
        loadDashboard();
        showNotification('Brigada agregada exitosamente', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error adding brigada:', error);
        showNotification('Error al agregar brigada', 'error');
    }
}

async function deleteBrigada(id) {
    if (confirm('¿Está seguro de eliminar esta brigada?')) {
        try {
            await deleteBrigadaAPI(id);
            await loadBrigadas();
            loadDashboard();
            showNotification('Brigada eliminada exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting brigada:', error);
            showNotification('Error al eliminar brigada', 'error');
        }
    }
}

// Roles
async function loadRoles() {
    try {
        const rolesData = await fetchRoles();
        roles = rolesData;
        const tbody = document.getElementById('rolesTableBody');
        tbody.innerHTML = '';
        
        roles.forEach(role => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${role.nombre}</td>
                <td>
                    <button class="btn-edit" onclick="editRole(${role.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-danger" onclick="deleteRole(${role.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading roles:', error);
        showNotification('Error al cargar roles', 'error');
    }
}

async function handleAddRole(e) {
    e.preventDefault();
    const nombre = document.getElementById('roleNombre').value;

    try {
        const roleData = {
            nombre
        };

        await createRole(roleData);
        hideModal('addRoleModal');
        await loadRoles();
        showNotification('Rol agregado exitosamente', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error adding role:', error);
        showNotification('Error al agregar rol', 'error');
    }
}

async function deleteRole(id) {
    if (confirm('¿Está seguro de eliminar este rol?')) {
        try {
            await deleteRoleAPI(id);
            await loadRoles();
            showNotification('Rol eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting role:', error);
            showNotification('Error al eliminar rol', 'error');
        }
    }
}

// Inventario
function loadInventario() {
    loadArticulos();
    loadRefacciones();
}

function loadArticulos() {
    const tbody = document.getElementById('articulosTableBody');
    tbody.innerHTML = '';
    
    articulos.forEach(articulo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${articulo.nombre}</td>
            <td>${articulo.categoria}</td>
            <td>${articulo.cantidad}</td>
            <td>${articulo.observaciones || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editArticulo(${articulo.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteArticulo(${articulo.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadRefacciones() {
    const tbody = document.getElementById('refaccionesTableBody');
    tbody.innerHTML = '';
    
    refacciones.forEach(refaccion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${refaccion.nombre}</td>
            <td>${refaccion.categoria}</td>
            <td>$${refaccion.costo_aproximado.toLocaleString()}</td>
            <td>${refaccion.observaciones || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editRefaccion(${refaccion.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteRefaccion(${refaccion.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleAddArticulo(e) {
    e.preventDefault();
    const nombre = document.getElementById('articuloNombre').value;
    const categoria = document.getElementById('articuloCategoria').value;
    const cantidad = parseInt(document.getElementById('articuloCantidad').value);
    const observaciones = document.getElementById('articuloObservaciones').value;

    const newArticulo = {
        id: articulos.length + 1,
        nombre,
        categoria,
        cantidad,
        observaciones
    };

    articulos.push(newArticulo);
    hideModal('addArticuloModal');
    loadArticulos();
    loadDashboard();
    showNotification('Artículo agregado exitosamente', 'success');
    e.target.reset();
}

function handleAddRefaccion(e) {
    e.preventDefault();
    const nombre = document.getElementById('refaccionNombre').value;
    const categoria = document.getElementById('refaccionCategoria').value;
    const costo_aproximado = parseInt(document.getElementById('refaccionCosto').value);
    const observaciones = document.getElementById('refaccionObservaciones').value;

    const newRefaccion = {
        id: refacciones.length + 1,
        nombre,
        categoria,
        costo_aproximado,
        observaciones
    };

    refacciones.push(newRefaccion);
    hideModal('addRefaccionModal');
    loadRefacciones();
    showNotification('Refacción agregada exitosamente', 'success');
    e.target.reset();
}

function deleteArticulo(id) {
    if (confirm('¿Está seguro de eliminar este artículo?')) {
        articulos = articulos.filter(a => a.id !== id);
        loadArticulos();
        loadDashboard();
        showNotification('Artículo eliminado exitosamente', 'success');
    }
}

function deleteRefaccion(id) {
    if (confirm('¿Está seguro de eliminar esta refacción?')) {
        refacciones = refacciones.filter(r => r.id !== id);
        loadRefacciones();
        showNotification('Refacción eliminada exitosamente', 'success');
    }
}

// Ropa
function loadRopa() {
    const tbody = document.getElementById('ropaTableBody');
    tbody.innerHTML = '';
    
    ropa.forEach(item => {
        const tallasInfo = item.tallas.map(t => `${t.talla}: ${t.cantidad}`).join(', ');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.nombre}</td>
            <td>${tallasInfo}</td>
            <td>
                <button class="btn-edit" onclick="editRopa(${item.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="deleteRopa(${item.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleAddRopa(e) {
    e.preventDefault();
    const tipo = document.getElementById('ropaTipo').value;
    const nombre = document.getElementById('ropaNombre').value;
    
    const tallas = [];
    document.querySelectorAll('.talla-item').forEach(item => {
        const talla = item.querySelector('.talla-select').value;
        const cantidad = parseInt(item.querySelector('.talla-cantidad').value);
        if (talla && cantidad > 0) {
            tallas.push({ talla, cantidad });
        }
    });

    if (tallas.length === 0) {
        showNotification('Debe agregar al menos una talla', 'error');
        return;
    }

    const newRopa = {
        id: ropa.length + 1,
        tipo,
        nombre,
        tallas
    };

    ropa.push(newRopa);
    hideModal('addRopaModal');
    loadRopa();
    loadDashboard();
    showNotification('Ropa agregada exitosamente', 'success');
    e.target.reset();
    resetTallasContainer();
}

function deleteRopa(id) {
    if (confirm('¿Está seguro de eliminar esta prenda?')) {
        ropa = ropa.filter(r => r.id !== id);
        loadRopa();
        loadDashboard();
        showNotification('Ropa eliminada exitosamente', 'success');
    }
}

// Gestión de tallas
function addTallaField() {
    const container = document.getElementById('tallasContainer');
    const tallaItem = document.createElement('div');
    tallaItem.className = 'talla-item';
    tallaItem.innerHTML = `
        <select class="talla-select">
            <option value="">Seleccionar talla</option>
            ${tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <input type="number" class="talla-cantidad" placeholder="Cantidad" min="0">
        <button type="button" class="btn-remove-talla">×</button>
    `;
    container.appendChild(tallaItem);
}

function resetTallasContainer() {
    const container = document.getElementById('tallasContainer');
    container.innerHTML = `
        <div class="talla-item">
            <select class="talla-select">
                <option value="">Seleccionar talla</option>
                ${tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
            <input type="number" class="talla-cantidad" placeholder="Cantidad" min="0">
            <button type="button" class="btn-remove-talla">×</button>
        </div>
    `;
}

// Tabs
function handleTabChange(e) {
    const tabName = e.target.getAttribute('data-tab');
    
    // Actualizar botones de tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Mostrar contenido correspondiente
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// Utilidades
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Estilos según tipo
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Funciones de edición (placeholder)
function editVoluntario(id) {
    showNotification('Función de edición en desarrollo', 'info');
}

function editBrigada(id) {
    showNotification('Función de edición en desarrollo', 'info');
}

function editRole(id) {
    showNotification('Función de edición en desarrollo', 'info');
}

function editArticulo(id) {
    showNotification('Función de edición en desarrollo', 'info');
}

function editRefaccion(id) {
    showNotification('Función de edición en desarrollo', 'info');
}

function editRopa(id) {
    showNotification('Función de edición en desarrollo', 'info');
} 