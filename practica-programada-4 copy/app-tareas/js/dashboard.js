document.addEventListener('DOMContentLoaded', function () {

    const API_URL = "backend/tasks.php";
    const COMMENTS_API_URL = "backend/comments.php";
    let isEditMode = false;
    let edittingId;
    let tasks = [];

    async function loadTasks() {
        // Obtener las tareas desde el backend
        try {
            const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
            if (response.ok) {
                tasks = await response.json();
                renderTasks(tasks);
            } else {
                if (response.status === 401) {
                    // Redirigir si no hay sesión activa
                    window.location.href = "index.html";
                }
                console.error("Error al obtener tareas");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            let commentsList = '';
            if (task.comments && task.comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                task.comments.forEach(comment => {
                    commentsList += `
                    <li class="list-group-item">
                        ${comment.comment}
                        <button type="button" class="btn btn-sm btn-link edit-comment" data-commentid="${comment.id}">Editar</button>
                        <button type="button" class="btn btn-sm btn-link remove-comment" data-commentid="${comment.id}">Eliminar</button>
                    </li>`;
                });
                commentsList += '</ul>';
            }

            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                    ${commentsList}
                    <button type="button" class="btn btn-sm btn-link add-comment" data-taskid="${task.id}">Agregar Comentario</button>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Eliminar</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(function (button) {
            button.addEventListener('click', handleAddComment);
        });

        document.querySelectorAll('.edit-comment').forEach(function (button) {
            button.addEventListener('click', handleEditComment);
        });

        document.querySelectorAll('.remove-comment').forEach(function (button) {
            button.addEventListener('click', handleDeleteComment);
        });
    }

    function handleEditTask(event) {
        try {
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);

            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.due_date;

            isEditMode = true;
            edittingId = taskId;

            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();

        } catch (error) {
            alert("Error intentando editar la tarea");
            console.error(error);
        }
    }

    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        try {
            const response = await fetch(`${API_URL}?id=${id}`, { credentials: 'include', method: 'DELETE' });
            if (response.ok) {
                loadTasks();
            } else {
                console.error("Problema al eliminar la tarea");
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAddComment(event) {
        const taskId = parseInt(event.target.dataset.taskid);
        const comment = prompt("Escribe tu comentario:");

        if (comment) {
            try {
                const response = await fetch(COMMENTS_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task_id: taskId, comment }),
                    credentials: 'include'
                });

                if (response.ok) {
                    loadTasks(); // Recargar las tareas y comentarios
                } else {
                    console.error("Error al agregar el comentario");
                }
            } catch (err) {
                console.error("Error en la solicitud al agregar el comentario", err);
            }
        }
    }

    async function handleEditComment(event) {
        const commentId = parseInt(event.target.dataset.commentid);
        const oldComment = event.target.parentElement.textContent.trim(); // Obtener el texto actual del comentario

        const newComment = prompt("Edita el comentario:", oldComment);

        if (newComment) {
            try {
                const response = await fetch(`${COMMENTS_API_URL}?id=${commentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: newComment }),
                    credentials: 'include'
                });

                if (response.ok) {
                    loadTasks(); // Recargar las tareas y comentarios
                } else {
                    console.error("Error al editar el comentario");
                }
            } catch (err) {
                console.error("Error en la solicitud al editar el comentario", err);
            }
        }
    }

    async function handleDeleteComment(event) {
        const commentId = parseInt(event.target.dataset.commentid);

        try {
            const response = await fetch(`${COMMENTS_API_URL}?id=${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                loadTasks(); // Recargar las tareas y comentarios
            } else {
                console.error("Error al eliminar el comentario");
            }
        } catch (err) {
            console.error("Error en la solicitud al eliminar el comentario", err);
        }
    }

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, description: description, due_date: dueDate })
            });

            if (!response.ok) {
                console.error("No se pudo actualizar la tarea");
            }

        } else {
            const newTask = { title, description, due_date: dueDate };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });

            if (!response.ok) {
                console.error("No se pudo agregar la tarea");
            }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadTasks();
});
