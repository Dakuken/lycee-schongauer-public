<?php
require '../cors.php';
// Récupérer le lien du fichier depuis la base de données
$_POST = json_decode(file_get_contents('php://input'), true);
$lienFichier = $_POST['lien'] ?? '';
if(empty($lienFichier)){
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Lien invalide']);
    exit;
}

//retirer deux premier caractere
$lienFichier = substr($lienFichier, 2);
$lienFichier = '../absence/' . $lienFichier;
// Vérifier que le fichier existe sur le serveur
if (file_exists($lienFichier)) {
    // Récupérer le nom du fichier
    $nomFichier = basename($lienFichier);

    // Définir les en-têtes HTTP pour indiquer que la réponse est un fichier téléchargeable
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $nomFichier . '"');

    // Lire et envoyer le contenu du fichier
    readfile($lienFichier);

    // Terminer l'exécution du script
} else {
    // Le fichier n'existe pas sur le serveur
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Le fichier demandé est introuvable']);
}
exit;
