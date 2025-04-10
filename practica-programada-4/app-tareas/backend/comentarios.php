<?php
require('db.php');


function addComment($taskId, $userId, $description)
{
    global $pdo;
    try {
        $sql = "INSERT INTO comments (task_id, user_id, description) VALUES (:task_id, :user_id, :description)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'task_id' => $taskId,
            'user_id' => $userId,
            'description' => $description
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        echo $e->getMessage();
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
        echo $e->getMessage();
        return [];
    }
}


function updateComment($commentId, $description)
{
    global $pdo;
    try {
        $sql = "UPDATE comments SET description = :description WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'description' => $description,
            'id' => $commentId
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}


function deleteComment($commentId)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $commentId]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}


$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');
session_start();

if (isset($_SESSION["user_id"])) {
    $userId = $_SESSION["user_id"];

    try {
        switch ($method) {
            case 'GET': 
                if (isset($_GET['task_id'])) {
                    $comments = getCommentsByTask($_GET['task_id']);
                    echo json_encode($comments);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "task_id es requerido"]);
                }
                break;

            case 'POST': 
                $input = json_decode(file_get_contents("php://input"), true);
                if (isset($input['task_id'], $input['description'])) {
                    $commentId = addComment($input['task_id'], $userId, $input['description']);
                    if ($commentId > 0) {
                        http_response_code(201);
                        echo json_encode(["message" => "Comentario agregado exitosamente", "id" => $commentId]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al agregar el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Datos insuficientes"]);
                }
                break;

            case 'PUT': 
                $input = json_decode(file_get_contents("php://input"), true);
                if (isset($_GET['id'], $input['description'])) {
                    if (updateComment($_GET['id'], $input['description'])) {
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

            case 'DELETE': 
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
                    echo json_encode(["error" => "ID de comentario es requerido"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["error" => "Método no permitido"]);
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al procesar la solicitud"]);
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}
