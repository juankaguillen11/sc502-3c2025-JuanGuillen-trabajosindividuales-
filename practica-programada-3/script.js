document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('transaccion-form');
    const listaTransacciones = document.getElementById('lista-transacciones');
    const resumenCuenta = document.getElementById('resumen-cuenta');
    let transacciones = [];

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const descripcion = document.getElementById('descripcion').value;
        const monto = parseFloat(document.getElementById('monto').value);

        transacciones.push({ descripcion, monto });
        actualizarEstadoCuenta();
        form.reset();
    });

    function actualizarEstadoCuenta() {
        listaTransacciones.innerHTML = '';
        let montoTotal = 0;

        transacciones.forEach(transaccion => {
            const li = document.createElement('li');
            li.textContent = `${transaccion.descripcion}: $${transaccion.monto.toFixed(2)}`;
            listaTransacciones.appendChild(li);
            montoTotal += transaccion.monto;
        });

        const montoConInteres = montoTotal * 1.026;
        const cashBack = montoTotal * 0.001;
        const montoFinal = montoConInteres - cashBack;

        resumenCuenta.innerHTML = `
            <p>Monto total: $${montoTotal.toFixed(2)}</p>
            <p>Monto con interés (2.6%): $${montoConInteres.toFixed(2)}</p>
            <p>Cash back (0.1%): $${cashBack.toFixed(2)}</p>
            <p>Monto final a pagar: $${montoFinal.toFixed(2)}</p>
        `;

        // Aquí deberías hacer una llamada AJAX para guardar los datos en el servidor
        // y generar el archivo de texto, pero eso requeriría un backend PHP funcionando
    }
});


