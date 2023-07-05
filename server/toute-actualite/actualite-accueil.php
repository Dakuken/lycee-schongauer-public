<?php

require '../cors.php';
global $response, $ch;
require './htmlDom/simple_html_dom.php';
include_once "./fluxRSS-MBN.php";

header('Content-Type: application/json');

if ($response === false) {
    $error = curl_error($ch);
    echo 'Erreur lors de la requête : ' . $error;
    exit;
}

$xml = $response;
$xml = simplexml_load_string($xml);

// Tableau pour stocker les objets
$articles = array();

// Parcourir les 4 premiers items
for ($i = 0; $i < 4; $i++) {
    $item = $xml->channel->item[$i];

    $articles[] = (string)$item->link;
}

$data = array();

foreach ($articles as $url) {
    $oneArticle = array();

    $html = file_get_html($url);

    $article = $html->find(".panel.panel--outlined", 0);

    $title = $article->find('h1', 0)->plaintext;
    $oneArticle["title"] = html_entity_decode($title);

    $oneArticle["corps"] = $article->find("#corps", 0)->plaintext;

    $oneArticle["image"] = $article->find('img', 0)->src;
    $oneArticle["link"] = $url;
    $data[] = $oneArticle;
}

$response = [
    'success' => true,
    'message' => "Tout s'est bien passé",
    'data' => $data,
];

http_response_code(200);
echo json_encode($response);
exit;
