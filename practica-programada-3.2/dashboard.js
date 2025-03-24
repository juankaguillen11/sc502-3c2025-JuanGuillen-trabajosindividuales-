document.addEventListener('DOMContentLoaded', function(){
    let tasks = [];
    let taskCounter = 0;
    let commentCounter = 0;

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="text-center">No hay tareas. ¡Agrega una nueva tarea!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'col-md-4 mb-3';
            taskElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Fecha límite: ${task.due_date}</small></p>
                        <button class="btn btn-primary btn-sm edit-task" data-id="${task.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Eliminar</button>
                        <h6 class="mt-3">Comentarios:</h6>
                        <ul class="list-group">
                            ${task.comments.map(comment => `
                                <li class="list-group-item">
                                    ${comment.text}
                                    <button class="btn btn-sm btn-outline-secondary edit-comment" data-task-id="${task.id}" data-comment-id="${comment.id}">Editar</button>
                                    <button class="btn btn-sm btn-outline-danger delete-comment" data-task-id="${task.id}" data-comment-id="${comment.id}">Eliminar</button>
                                </li>
                            `).join('')}
                        </ul>
                        <button class="btn btn-success btn-sm mt-2 add-comment" data-id="${task.id}">Agregar Comentario</button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskElement);
        });

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.edit-task').forEach(btn => btn.addEventListener('click', editTask));
        document.querySelectorAll('.delete-task').forEach(btn => btn.addEventListener('click', deleteTask));
        document.querySelectorAll('.add-comment').forEach(btn => btn.addEventListener('click', addComment));
        document.querySelectorAll('.edit-comment').forEach(btn => btn.addEventListener('click', editComment));
        document.querySelectorAll('.delete-comment').forEach(btn => btn.addEventListener('click', deleteComment));
    }

    function editTask(e) {
        const taskId = parseInt(e.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDueDate').value = task.due_date;
            document.getElementById('taskModalLabel').textContent = 'Editar Tarea';
            new bootstrap.Modal(document.getElementById('taskModal')).show();
        }
    }

    function deleteTask(e) {
        const taskId = parseInt(e.target.dataset.id);
        tasks = tasks.filter(t => t.id !== taskId);
        loadTasks();
    }

    function addComment(e) {
        const taskId = parseInt(e.target.dataset.id);
        document.getElementById('commentTaskId').value = taskId;
        document.getElementById('commentId').value = '';
        document.getElementById('commentText').value = '';
        document.getElementById('commentModalLabel').textContent = 'Agregar Comentario';
        new bootstrap.Modal(document.getElementById('commentModal')).show();
    }

    function editComment(e) {
        const taskId = parseInt(e.target.dataset.taskId);
        const commentId = parseInt(e.target.dataset.commentId);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const comment = task.comments.find(c => c.id === commentId);
            if (comment) {
                document.getElementById('commentTaskId').value = taskId;
                document.getElementById('commentId').value = commentId;
                document.getElementById('commentText').value = comment.text;
                document.getElementById('commentModalLabel').textContent = 'Editar Comentario';
                new bootstrap.Modal(document.getElementById('commentModal')).show();
            }
        }
    }

    function deleteComment(e) {
        const taskId = parseInt(e.target.dataset.taskId);
        const commentId = parseInt(e.target.dataset.commentId);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.comments = task.comments.filter(c => c.id !== commentId);
            loadTasks();
        }
    }

    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (id) {
            // Editar tarea existente
            const task = tasks.find(t => t.id === parseInt(id));
            if (task) {
                task.title = title;
                task.description = description;
                task.due_date = dueDate;
            }
        } else {
            // Agregar nueva tarea
            taskCounter++;
            const newTask = {
                id: taskCounter,
                title: title,
                description: description,
                due_date: dueDate,
                comments: []
            };
            tasks.push(newTask);
        }

        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        loadTasks();
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
    });

    document.getElementById('commentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const taskId = parseInt(document.getElementById('commentTaskId').value);
        const commentId = document.getElementById('commentId').value;
        const commentText = document.getElementById('commentText').value;
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            if (commentId) {
                // Editar comentario existente
                const comment = task.comments.find(c => c.id === parseInt(commentId));
                if (comment) {
                    comment.text = commentText;
                }
            } else {
                // Agregar nuevo comentario
                commentCounter++;
                task.comments.push({
                    id: commentCounter,
                    text: commentText
                });
            }
        }

        bootstrap.Modal.getInstance(document.getElementById('commentModal')).hide();
        loadTasks();
        document.getElementById('commentForm').reset();
    });

    // Inicializar la aplicación
    loadTasks();
});
