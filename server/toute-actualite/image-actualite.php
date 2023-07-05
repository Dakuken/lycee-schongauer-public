<?php

use JetBrains\PhpStorm\NoReturn;

include_once "../cors.php";

header('Content-Type: application/json');

$url = $_GET['url'] ?? '';

if (empty($url)) {
    sendErrorResponse(400, 'Il manque un paramètre');
}

include_once './htmlDom/simple_html_dom.php';

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    sendErrorResponse(400, "L'URL fournie n'est pas valide");
}

$html = file_get_html($url);

if ($html === false) {
    sendErrorResponse(400, "Impossible de charger le fichier HTML à partir de l'URL fournie");
}

$div = $html->find('div.panel.panel--outlined', 0);

if ($div === null) {
    sendErrorResponse(400, "La div avec la classe 'panel panel--outlined' n'a pas été trouvée");
}

$premiereImage = $div->find('img', 0);

if ($premiereImage === null) {
    sendErrorResponse(400, "Aucune image trouvée dans la div avec la classe 'panel panel--outlined'");
}

$urlImage = $premiereImage->src;

sendSuccessResponse(200, $urlImage);

#[NoReturn] function sendSuccessResponse($statusCode, $message): void
{
    $response = ['success' => true, 'message' => $message];
    http_response_code($statusCode);
    echo json_encode($response);
    exit;
}

#[NoReturn] function sendErrorResponse($statusCode, $message): void
{
    $response = ['success' => false, 'message' => $message];
    http_response_code($statusCode);
    echo json_encode($response);
    exit;
}
