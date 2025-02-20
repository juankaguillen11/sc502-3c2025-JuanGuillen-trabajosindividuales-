document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('producto-form');
    const listaProductos = document.getElementById('lista-productos');
    const filtroCategoria = document.getElementById('filtro-categoria');
    let productos = [];

    form.addEventListener('submit', agregarProducto);
    filtroCategoria.addEventListener('change', filtrarProductos);

    function agregarProducto(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const categoria = document.getElementById('categoria').value;

        const producto = {
            nombre,
            precio,
            categoria
        };

        productos.push(producto);
        form.reset();
        mostrarProductos();
    }

    function mostrarProductos(productosFiltrados = productos) {
        listaProductos.innerHTML = '';
        productosFiltrados.forEach((producto, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${producto.nombre} - $${producto.precio} - ${producto.categoria}</span>
                <button class="eliminar" data-index="${index}">Eliminar</button>
            `;
            listaProductos.appendChild(li);
        });

        document.querySelectorAll('.eliminar').forEach(button => {
            button.addEventListener('click', eliminarProducto);
        });
    }

    function eliminarProducto(e) {
        const index = e.target.getAttribute('data-index');
        productos.splice(index, 1);
        mostrarProductos();
    }

    function filtrarProductos() {
        const categoriaSeleccionada = filtroCategoria.value;
        let productosFiltrados;

        if (categoriaSeleccionada === 'Todos') {
            productosFiltrados = productos;
        } else {
            productosFiltrados = productos.filter(producto => producto.categoria === categoriaSeleccionada);
        }

        mostrarProductos(productosFiltrados);
    }
});
