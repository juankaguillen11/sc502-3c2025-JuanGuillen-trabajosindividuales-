<?php
require('db.php'); // Conexión a la base de datos

function addComment($taskId, $comment)
{
    global $pdo;
    try {
        $sql = "INSERT INTO comments (task_id, comment) VALUES (:task_id, :comment)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'task_id' => $taskId,
            'comment' => $comment
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        return 0;
    }
}

function getCommentsByTask($taskId)
{
    global $pdo;
    try {
        $sql = "SELECT * FROM comments WHERE task_id = :task_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['task_id' => $taskId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return [];
    }
}

function updateComment($commentId, $comment)
{
    global $pdo;
    try {
        $sql = "UPDATE comments SET comment = :comment WHERE id = :comment_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'comment' => $comment,
            'comment_id' => $commentId
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        return false;
    }
}

function deleteComment($commentId)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :comment_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['comment_id' => $commentId]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        return false;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');
session_start();

if (isset($_SESSION["user_id"])) { // Hay sesión activa
    try {
        switch ($method) {
            case 'POST': // Agregar comentario
                $input = json_decode(file_get_contents("php://input"), true);
                if (isset($input['task_id'], $input['comment'])) {
                    $commentId = addComment($input['task_id'], $input['comment']);
                    if ($commentId > 0) {
                        http_response_code(201);
                        echo json_encode(["message" => "Comentario agregado exitosamente", "id" => $commentId]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al guardar el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Faltan datos obligatorios"]);
                }
                break;

            case 'GET': // Obtener comentarios de una tarea
                if (isset($_GET['task_id'])) {
                    $comments = getCommentsByTask($_GET['task_id']);
                    echo json_encode($comments);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "task_id es requerido"]);
                }
                break;

            case 'PUT': // Actualizar comentario
                $input = json_decode(file_get_contents("php://input"), true);
                if (isset($_GET['id'], $input['comment'])) {
                    if (updateComment($_GET['id'], $input['comment'])) {
                        http_response_code(200);
                        echo json_encode(["message" => "Comentario actualizado exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al actualizar el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Datos insuficientes"]);
                }
                break;

            case 'DELETE': // Eliminar comentario
                if (isset($_GET['id'])) {
                    if (deleteComment($_GET['id'])) {
                        http_response_code(200);
                        echo json_encode(["message" => "Comentario eliminado exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al eliminar el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "ID de comentario requerido"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["error" => "Método no permitido"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error interno del servidor"]);
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}
