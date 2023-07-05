<?php

use JetBrains\PhpStorm\NoReturn;
require '../cors.php';
require '../db-connect.php';
header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);

//// Récupération des données en POST
$id = $_POST["login"] ?? '';
$mdp = $_POST["password"] ?? '';
$nom = $_POST["nom"] ?? '';
$prenom = $_POST["prenom"] ?? '';
$email = $_POST["email"] ?? '';



if (empty($id)) {
    errorMessage("Veuillez saisir l'identifiant.");
}

if (empty($mdp)) {
    errorMessage("Veuillez saisir le mot de passe.");
}

if (empty($email)) {
    errorMessage("Veuillez saisir l'email.");
}

if (empty($prenom)) {
    errorMessage("Veuillez saisir le prénom.");
}

if (empty($nom)) {
    errorMessage("Veuillez saisir le nom.");
}

$mdp = password_hash($mdp, PASSWORD_DEFAULT);

#[NoReturn]
function errorMessage(string $message): void
{
    http_response_code(400);
    $response = array('success' => false, 'message' => $message);
    echo json_encode($response);
    exit;
}

try {
    $dbh = connectDB();

    // Check if the login already exists in the database
    $query = "SELECT COUNT(*) as count FROM utilisateurs WHERE login = :id";
    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] > 0) {
        errorMessage("Ce login existe déjà.");
    }

    // Insert the user data into the database
    $query = "INSERT INTO utilisateurs (login, nom, prenom, password, email) VALUES (:id, :nom, :prenom, :mdp, :email) ";
    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':mdp', $mdp);
    $stmt->bindParam(':nom', $nom);
    $stmt->bindParam(':prenom', $prenom);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $response = array('success' => true, 'message' => 'Les informations sont valides.');
} catch (PDOException $e) {
    http_response_code(401);
    $response = array('success' => false, 'message' => "Les informations sont invalides : " . $e->getMessage());
}

$dbh = null;
echo json_encode($response);
