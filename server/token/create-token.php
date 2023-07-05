<?php
function createToken(string $userId): string
{
    global $dbh;
    $tokenExists = true;
    $token = '';
    $dateDansUneSemaine = date('Y-m-d', strtotime('+1 week'));

    $query = "DELETE FROM tokens WHERE user_id = :user_id";
    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    while ($tokenExists) {
        $token = bin2hex(random_bytes(32));
        $query = "SELECT COUNT(*) FROM tokens WHERE token = :token";
        $stmt = $dbh->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $count = $stmt->fetchColumn();

        if ($count === 0) {
            $tokenExists = false;
        }
    }

    $query = "INSERT INTO tokens (user_id, token, date ) VALUES (:id, :token, :date)";
    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':id', $userId);
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':date', $dateDansUneSemaine);
    $stmt->execute();

    return $token;

}

