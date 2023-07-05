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


function getInnerHtmlWithoutFormatting($element) {
    if ($element === null) {
        return '';
    }

    $html = $element->innertext;
    $html = preg_replace('/\"/', '\'', $html);
    $html = str_replace(["\t"], "", $html);

    return $html;
}

function removeVideosFromHtml($html) {
    $pattern = '/<div class=\'plyr wysiwyg_media wysiwyg_media--video\'[^>]*>.*?<\/div>/s';
    $cleanHtml = preg_replace($pattern, '', $html);

    return $cleanHtml;
}

function removeFiguresFromHtml($html) {
    $pattern = '/<figure[^>]*>.*?<\/figure>/s';
    $cleanHtml = preg_replace($pattern, '', $html);

    return $cleanHtml;
}


$titleElement = $div->find('h1', 0);
$title = ($titleElement !== null) ? $titleElement->plaintext : '';

$infoPublicationElement = $div->find('div.p-like', 0);
$infoPublication = getInnerHtmlWithoutFormatting($infoPublicationElement);

$bandeauElement = $div->find('div.p-like', 1);
$bandeau = ($bandeauElement !== null) ? $bandeauElement->plaintext : '';
$bandeauHtml = getInnerHtmlWithoutFormatting($bandeauElement);

$contenueElement = $div->find('div#corps', 0);
$contenue = ($contenueElement !== null) ? $contenueElement->plaintext : '';
$contenueHtml = getInnerHtmlWithoutFormatting($contenueElement);
if ($contenueHtml !== '') {
    $contenueHtml = removeVideosFromHtml($contenueHtml);
    $contenueHtml = removeFiguresFromHtml($contenueHtml);
}


sendSuccessResponse(200, [
    'title' => $title,
    'infoPublication' => $infoPublication,
    'bandeau' => $bandeauHtml,
    'contenue' => $contenueHtml
]);

#[NoReturn] function sendSuccessResponse($statusCode, $data): void
{
    $response = ['success' => true, 'data' => $data];
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
