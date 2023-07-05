<?php

require '../db-connect.php';
require '../cors.php';
function verifyToken(): int
{

    $_POST = json_decode(file_get_contents('php://input'), true);
    $token = $_POST['token'] ?? '';

    if (empty($token)) {
        return false;
    }

    $dbh = connectDB();

// Vérification de l'existence du token dans la base de données
    $query = "SELECT user_id, date FROM tokens WHERE token = :token";
    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $currentDate = date('Y-m-d');
        $tokenDate = $result['date'];

        if ($tokenDate < $currentDate) {
            // Suppression du token expiré
            $deleteQuery = "DELETE FROM tokens WHERE token = :token";
            $deleteStmt = $dbh->prepare($deleteQuery);
            $deleteStmt->bindParam(':token', $token);
            $deleteStmt->execute();
        } else {
            return intval($result["user_id"]);
        }
    }

    return -1;
}

;