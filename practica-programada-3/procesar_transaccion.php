<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $descripcion = $_POST["descripcion"];
    $monto = floatval($_POST["monto"]);

    $transaccion = [
        "id" => uniqid(),
        "descripcion" => $descripcion,
        "monto" => $monto
    ];

    if (!isset($_SESSION["transacciones"])) {
        $_SESSION["transacciones"] = [];
    }

    $_SESSION["transacciones"][] = $transaccion;

    calcularEstadoCuenta();
}

function calcularEstadoCuenta() {
    $transacciones = $_SESSION["transacciones"];
    $montoTotal = array_sum(array_column($transacciones, "monto"));
    $montoConInteres = $montoTotal * 1.026;
    $cashBack = $montoTotal * 0.001;
    $montoFinal = $montoConInteres - $cashBack;

    $estadoCuenta = [
        "transacciones" => $transacciones,
        "montoTotal" => $montoTotal,
        "montoConInteres" => $montoConInteres,
        "cashBack" => $cashBack,
        "montoFinal" => $montoFinal
    ];

    $_SESSION["estado_cuenta"] = $estadoCuenta;

    generarArchivoEstadoCuenta($estadoCuenta);
}

function generarArchivoEstadoCuenta($estadoCuenta) {
    $contenido = "Estado de Cuenta\n\n";
    $contenido .= "Transacciones:\n";
    foreach ($estadoCuenta["transacciones"] as $transaccion) {
        $contenido .= "{$transaccion['descripcion']}: \${$transaccion['monto']}\n";
    }
    $contenido .= "\nMonto total: \${$estadoCuenta['montoTotal']}\n";
    $contenido .= "Monto con interés (2.6%): \${$estadoCuenta['montoConInteres']}\n";
    $contenido .= "Cash back (0.1%): \${$estadoCuenta['cashBack']}\n";
    $contenido .= "Monto final a pagar: \${$estadoCuenta['montoFinal']}\n";

    file_put_contents("estado_cuenta.txt", $contenido);
}

header("Location: index.php");
exit();
?>