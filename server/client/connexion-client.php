<?php
require '../db-connect.php';
require '../cors.php';
require '../token/create-token.php';
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
header('Access-Control-Allow-Origin: *');

// Autoriser les méthodes GET, POST et OPTIONS
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Autoriser les en-têtes spécifiques
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier la méthode de la requête
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre avec un statut 200 pour les requêtes OPTIONS
    http_response_code(200);
    exit();
}
//// Récupération des données en POST
$id = $_POST["login"] ?? '';
$mdp = $_POST["password"] ?? '';

// Vérification si l'identifiant et le mot de passe sont renseignés
if (empty($id) || empty($mdp)) {
    http_response_code(400);
    $response = array('success' => false, 'message' => 'Veuillez saisir l\'identifiant et le mot de passe.');
    echo json_encode($response);
    exit;
}


$dbh = connectDB();

// Requête pour vérifier si l'identifiant et le mot de passe correspondent à ceux dans la base de données
$query = "SELECT password, id FROM utilisateurs WHERE login = :id";
$stmt = $dbh->prepare($query);
$stmt->bindParam(':id', $id);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if (isset($result['password'])  && isset($result['id']) ) {
    $verify = password_verify($mdp, $result['password']);
    if ($verify) {
        $token = createToken($result['id']);
        if ($token) {
            http_response_code(200);
            $response = array('success' => true, 'message' => 'Le token a été créé.', 'token' => $token);
        } else {
            http_response_code(401);
            $response = array('success' => false, 'message' => "Erreur lors de la création du token.");
        }
    } else {
        http_response_code(401);
        $response = array('success' => false, 'message' => "Le mot de passe ou l'identifiant est invalide.");
    }
} else {
    http_response_code(401);
    $response = array('success' => false, 'message' => "Le mot de passe ou l'identifiant est invalide.");
}

$dbh = null;
echo json_encode($response);
exit;
