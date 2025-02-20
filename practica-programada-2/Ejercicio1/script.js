document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcular');
    const salarioBrutoInput = document.getElementById('salarioBruto');
    const resultadoDiv = document.getElementById('resultado');

    calcularBtn.addEventListener('click', calcularDeducciones);

    function calcularDeducciones() {
        const salarioBruto = parseFloat(salarioBrutoInput.value);

        if (isNaN(salarioBruto) || salarioBruto < 0) {
            resultadoDiv.innerHTML = '<p>Por favor, ingrese un salario válido.</p>';
            return;
        }

        const porcentajeCCSS = 10.67;
        const ccss = salarioBruto * (porcentajeCCSS / 100);
        let impuestoRenta = 0;
        let porcentajeRenta = 0;

        if (salarioBruto > 922000 && salarioBruto <= 1352000) {
            porcentajeRenta = 10;
            impuestoRenta = (salarioBruto - 922000) * 0.10;
        } else if (salarioBruto > 1352000 && salarioBruto <= 2373000) {
            porcentajeRenta = 15;
            impuestoRenta = (1352000 - 922000) * 0.10 + (salarioBruto - 1352000) * 0.15;
        } else if (salarioBruto > 2373000 && salarioBruto <= 4745000) {
            porcentajeRenta = 20;
            impuestoRenta = (1352000 - 922000) * 0.10 + (2373000 - 1352000) * 0.15 + (salarioBruto - 2373000) * 0.20;
        } else if (salarioBruto > 4745000) {
            porcentajeRenta = 25;
            impuestoRenta = (1352000 - 922000) * 0.10 + (2373000 - 1352000) * 0.15 + (4745000 - 2373000) * 0.20 + (salarioBruto - 4745000) * 0.25;
        }

        const salarioNeto = salarioBruto - ccss - impuestoRenta;

        resultadoDiv.innerHTML = `
            <p><strong>Cargas Sociales (CCSS ${porcentajeCCSS}%):</strong> ₡${ccss.toFixed(2)}</p>
            <p><strong>Impuesto sobre la Renta (${porcentajeRenta}%):</strong> ₡${impuestoRenta.toFixed(2)}</p>
            <p><strong>Salario Neto:</strong> ₡${salarioNeto.toFixed(2)}</p>
        `;
    }
});

