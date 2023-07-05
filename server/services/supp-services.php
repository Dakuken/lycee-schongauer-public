<?php
require '../token/verify-token.php';
require '../cors.php';
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
$token = $_POST['token'] ?? '';
$id = $_POST['id'] ?? '';

//verifier token
$isTokenValid = verifyToken();
if ($isTokenValid == -1) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token invalide ' . $isTokenValid]);
    exit;
}

//verifier utilisateur admin
$dbh = connectDB();
$query = "SELECT est_admin FROM utilisateurs,tokens where id = user_id and token = :id";
$stmt = $dbh->prepare($query);
$stmt->bindParam(':id', $token);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if (empty($result['est_admin']) || $result['est_admin'] != 1) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => "Vous n'êtes pas administrateur", 'data' => $result, 'token' => $token]);
    exit;
}

$sth = $dbh->prepare(
    "DELETE FROM services WHERE id = :id;");
$sth->bindParam(':id', $id,  PDO::PARAM_INT);
$sth->execute();
$response = array('success' => true, 'message' => "Services supprimer");
http_response_code(200);
echo json_encode($response);
exit;

