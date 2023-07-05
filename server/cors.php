<?php
//header('Access-Control-Allow-Origin: http://localhost:8080');
//header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
//header('Access-Control-Allow-Headers: Content-Type');
//
//header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json');
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
