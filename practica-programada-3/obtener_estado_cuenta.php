<?php
session_start();

if (isset($_SESSION["estado_cuenta"])) {
    echo json_encode($_SESSION["estado_cuenta"]);
} else {
    echo json_encode([
        "transacciones" => [],
        "montoTotal" => 0,
        "montoConInteres" => 0,
        "cashBack" => 0,
        "montoFinal" => 0
    ]);
}
?>

