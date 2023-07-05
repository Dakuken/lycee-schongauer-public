<?php
require '../token/verify-token.php';
require '../cors.php';
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
$token = $_POST['token'] ?? '';
$indexStart = $_POST['index_start'] ?? '';

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
'SELECT utilisateurs.nom, utilisateurs.prenom, absences.motif, absences.date_debut, absences.heure_debut, absences.date_fin, absences.heure_fin, fichiers.lien
FROM utilisateurs
INNER JOIN absences ON utilisateurs.id = absences.utilisateur_id
LEFT JOIN fichiers ON absences.pieces_jointes = fichiers.id
WHERE absences.utilisateur_id = utilisateurs.id
ORDER BY absences.id DESC
LIMIT :indexStart, 15
');
$sth->bindParam(':indexStart', $indexStart, PDO::PARAM_INT);
$sth->execute();
$result = $sth->fetchAll(PDO::FETCH_ASSOC);
$response = array('success' => true, 'message' => "Le token est valide", 'data' => $result);
http_response_code(200);
echo json_encode($response);
exit;

