document.addEventListener('DOMContentLoaded', function () {
    let users = [];
    let editingUserId = null;

    const userForm = document.querySelector('form'); // Seleccionar el formulario
    const userTableBody = document.querySelector('tbody'); // Seleccionar el cuerpo de la tabla
    const toggleButton = document.getElementById("toggleDarkMode");
    const body = document.body;

    // Función para generar un ID único
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // Función para renderizar la tabla de usuarios
    function renderUserTable() {
        userTableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${user.rol}</td>
                <td>
                    <button class="btn btn-warning btn-edit" data-id="${user.id}">Editar</button>
                    <button class="btn btn-danger btn-delete" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    // Manejar el envío del formulario (Agregar o Editar usuario)
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const rol = document.getElementById('rol').value;

        if (!nombre || !email || rol === "Seleccion un rol") {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        if (editingUserId) {
            // Editar usuario existente
            const index = users.findIndex(user => user.id === editingUserId);
            users[index] = { ...users[index], nombre, email, rol };
            editingUserId = null;
        } else {
            // Agregar nuevo usuario
            const newUser = { id: generateId(), nombre, email, rol };
            users.push(newUser);
        }

        renderUserTable();
        userForm.reset(); // Limpiar el formulario
    });

    // Función para manejar la edición de un usuario
    function handleEdit(e) {
        const userId = e.target.getAttribute('data-id');
        const user = users.find(user => user.id === userId);

        if (user) {
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('email').value = user.email;
            document.getElementById('rol').value = user.rol;
            editingUserId = userId;
        }
    }

    // Función para manejar la eliminación de un usuario
    function handleDelete(e) {
        const userId = e.target.getAttribute('data-id');
        users = users.filter(user => user.id !== userId);
        renderUserTable();
    }

    // Manejar el cambio de modo oscuro/claro
    toggleButton.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        toggleButton.textContent = body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
    });

    // Inicializar la tabla con un usuario de ejemplo (opcional)
    users.push({
        id: generateId(),
        nombre: "Juan Perez",
        email: "juanperez@gmail.com",
        rol: "Administrador"
    });
    renderUserTable();
});

