<?php

require '../token/verify-token.php';
require '../cors.php';
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
$token = $_POST['token'] ?? '';

//verifier token
$isTokenValid = verifyToken();
if ($isTokenValid == -1) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token invalide ' . $isTokenValid]);
    exit;
}

//verifier utilisateur admin
$dbh = connectDB();

$sth = $dbh->prepare(
    'SELECT id,nom, piece_jointe
FROM formations
');
$sth->execute();
$result = $sth->fetchAll(PDO::FETCH_ASSOC);
$response = array('success' => true, 'message' => "Le token est valide", 'data' => $result);
http_response_code(200);
echo json_encode($response);
exit;

