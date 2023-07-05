<?php

require '../cors.php';
require '../token/verify-token.php';
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
$token = $_POST['token'] ?? '';
$indexStart = $_POST['index_start'] ?? '';
$eleveOrAdmin = $_POST['eleveOrAdmin'] ?? '';
$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';


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


if ($eleveOrAdmin === "admin") {

    $sth = $dbh->prepare(
        'SELECT utilisateurs.nom, utilisateurs.prenom, utilisateurs.email as mail FROM utilisateurs WHERE utilisateurs.est_admin = 1 ' . ($nom != '' ? 'AND utilisateurs.nom LIKE :nom ' : '') .  ($prenom != '' ? 'AND utilisateurs.prenom LIKE :prenom ' : '') . ' LIMIT :indexStart, 15');

} else if ($eleveOrAdmin === "eleve") {
    $sth = $dbh->prepare(
        "SELECT utilisateurs.nom, utilisateurs.prenom, utilisateurs.email as mail, utilisateurs.id as userId FROM utilisateurs WHERE utilisateurs.est_admin = 0 "  . ($nom != '' ? 'AND utilisateurs.nom LIKE :nom ' : '') .  ($prenom != '' ? 'AND utilisateurs.prenom LIKE :prenom ' : '') . " LIMIT :indexStart, 15");
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Manque parametre eleve ou admin']);
    exit;
}


$sth->bindParam(':indexStart', $indexStart, PDO::PARAM_INT);
if ($nom != '') {
    $nom = '%' . $nom . '%';
    $sth->bindParam(':nom', $nom, PDO::PARAM_STR);
}

if ($prenom != '') {
    $prenom = '%' . $prenom . '%';
    $sth->bindParam(':prenom', $prenom, PDO::PARAM_STR);
}

$sth->execute();
$result = $sth->fetchAll(PDO::FETCH_ASSOC);


$response = array('success' => true, 'message' => "Le token est valide", 'data' => $result);
http_response_code(200);
echo json_encode($response);
exit;

