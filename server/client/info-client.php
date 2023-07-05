<?php
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
require '../cors.php';
include_once '../token/verify-token.php';
header('Access-Control-Allow-Origin: *');

$isTokenValid = verifyToken();

if ($isTokenValid != -1) {
    $dbh = connectDB();
    $query = "SELECT id,nom,prenom,email,est_admin FROM utilisateurs where id = :id";
    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':id', $isTokenValid);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(empty($result)){
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Token invalide' . $isTokenValid]);
        exit;
    }
    $response = array('success' => true, 'message' => "Le token est valide", 'data' => $result[0]);
    http_response_code(200);
    echo json_encode($response);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token invalide']);
}
exit;
