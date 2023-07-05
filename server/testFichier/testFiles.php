<?php

header('Content-Type: application/json');
$file = $_FILES['file'] ?? '';

if (!$file || !is_file($_FILES['file']['tmp_name'])) {
    http_response_code(400);
    $response = array('success' => false, 'message' => 'Aucun fichier sélectionné.');
    echo json_encode($response);
    exit;
}


// Définir le dossier de destination où vous souhaitez stocker les fichiers

$targetDirectory = './enregistre/';
$fileName = $_FILES['file']['name'];
$fileNameWithoutExtension = pathinfo($fileName, PATHINFO_FILENAME);
$fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);


date_default_timezone_set('Europe/Paris');
// Générer un nom de fichier unique en concaténant la date du jour
$uniqueFileName = $fileNameWithoutExtension . '_' . date('d-m-Y_H\hi-s'). '.' . $fileExtension;

$targetFile = $targetDirectory . $uniqueFileName;

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    http_response_code(200);
    $response = array('success' => true, 'message' => 'Le fichier a été téléchargé avec succès.');
} else {
    http_response_code(500);
    $response = array('success' => false, 'message' => 'Une erreur s\'est produite lors du téléchargement du fichier sur le serveur.');
}
echo json_encode($response);
exit;