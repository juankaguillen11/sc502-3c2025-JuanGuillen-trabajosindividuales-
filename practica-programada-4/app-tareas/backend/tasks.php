<?php
require('db.php');

function createTask($userId, $title, $description, $dueDate)
{
    global $pdo;
    try {
        $sql = "INSERT INTO tasks (user_id, title, description, due_date) VALUES (:user_id, :title, :description, :due_date)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'due_date' => $dueDate
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        echo $e->getMessage();
        return 0;
    }
}

function getTasksByUser($userId)
{
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Asociar comentarios a cada tarea
        foreach ($tasks as &$task) {
            $task['comments'] = getCommentsByTask($task['id']);
        }

        return $tasks;
    } catch (Exception $ex) {
        echo "Error al obtener las tareas del usuario: " . $ex->getMessage();
        return [];
    }
}

function getCommentsByTask($taskId)
{
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT id, comment FROM comments WHERE task_id = :task_id");
        $stmt->execute(['task_id' => $taskId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return [];
    }
}

function editTask($id, $title, $description, $dueDate)
{
    global $pdo;
    try {
        $sql = "UPDATE tasks SET title = :title, description = :description, due_date = :due_date WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'title' => $title,
            'description' => $description,
            'due_date' => $dueDate,
            'id' => $id
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

function deleteTask($id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM tasks WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["id" => $id]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

function validateInput($input)
{
    return isset($input['title'], $input['description'], $input['due_date']);
}

session_start();

if (isset($_SESSION["user_id"])) {
    $userId = $_SESSION["user_id"];
    $method = $_SERVER['REQUEST_METHOD'];
    header('Content-Type: application/json');

    try {
        switch ($method) {
            case 'GET':
                $tasks = getTasksByUser($userId);
                echo json_encode($tasks);
                break;

            case 'POST':
                $input = json_decode(file_get_contents("php://input"), true);
                if (validateInput($input)) {
                    $taskId = createTask($userId, $input['title'], $input['description'], $input['due_date']);
                    if ($taskId > 0) {
                        http_response_code(201);
                        echo json_encode(["message" => "Tarea creada exitosamente. Id: $taskId"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al crear la tarea"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Datos insuficientes"]);
                }
                break;

            case 'PUT':
                $input = json_decode(file_get_contents("php://input"), true);
                if (validateInput($input) && isset($_GET['id'])) {
                    if (editTask($_GET['id'], $input['title'], $input['description'], $input['due_date'])) {
                        http_response_code(200);
                        echo json_encode(["message" => "Tarea actualizada exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al actualizar la tarea"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Datos insuficientes o ID inválido"]);
                }
                break;

            case 'DELETE':
                if (isset($_GET['id'])) {
                    if (deleteTask($_GET['id'])) {
                        http_response_code(200);
                        echo json_encode(["message" => "Tarea eliminada exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Error al eliminar la tarea"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "ID inválido"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["error" => "Método no permitido"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}
