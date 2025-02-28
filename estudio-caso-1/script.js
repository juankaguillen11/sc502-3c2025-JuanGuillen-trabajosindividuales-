document.addEventListener('DOMContentLoaded', function() {
    const commentsList = document.getElementById('commentsList');
    const newCommentName = document.getElementById('newCommentName');
    const newCommentText = document.getElementById('newCommentText');
    const addCommentBtn = document.getElementById('addCommentBtn');

    let comments = [
        { id: 1, name: "Adriana Sandi Masis", text: "Excelente profesional, siempre disponible para resolver dudas.", date: "10/02/2025" },
        { id: 2, name: "Lucia Sandi Masis", text: "Trato excepcional con los niños, mi hijo se siente muy cómodo.", date: "08/02/2025" },
        { id: 3, name: "Ana Masis", text: "Explicaciones claras y seguimiento detallado del tratamiento.", date: "05/02/2025" }
    ];

    function renderComments() {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    }

    function createCommentElement(comment) {
        const div = document.createElement('div');
        div.className = 'comment-card';
        div.innerHTML = `
            <h3 class="patient-name">${comment.name}</h3>
            <p class="comment">"${comment.text}"</p>
            <span class="comment-date">Consulta: ${comment.date}</span>
            <div class="comment-actions">
                <button class="edit-comment" data-id="${comment.id}">Editar</button>
                <button class="delete-comment" data-id="${comment.id}">Eliminar</button>
            </div>
        `;

        div.querySelector('.delete-comment').addEventListener('click', () => deleteComment(comment.id));
        div.querySelector('.edit-comment').addEventListener('click', () => editComment(comment.id));

        return div;
    }

    function addComment() {
        const name = newCommentName.value.trim();
        const text = newCommentText.value.trim();
        if (name && text) {
            const newComment = {
                id: Date.now(),
                name: name,
                text: text,
                date: new Date().toLocaleDateString()
            };
            comments.unshift(newComment);
            renderComments();
            newCommentName.value = '';
            newCommentText.value = '';
        } else {
            alert("Por favor, ingresa tu nombre y comentario.");
        }
    }

    function deleteComment(id) {
        comments = comments.filter(comment => comment.id !== id);
        renderComments();
    }

    function editComment(id) {
        const comment = comments.find(c => c.id === id);
        if (comment) {
            const newText = prompt("Editar comentario:", comment.text);
            if (newText !== null && newText.trim() !== "") {
                comment.text = newText.trim();
                renderComments();
            }
        }
    }

    addCommentBtn.addEventListener('click', addComment);

    renderComments();
});
