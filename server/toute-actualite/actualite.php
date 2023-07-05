<?php

global $response, $ch;
include_once "../cors.php";
include_once "./fluxRSS-MBN.php";
header('Content-Type: text/xml; charset=utf-8');

if ($response === false) {
    $error = curl_error($ch);
    echo 'Erreur lors de la requête : ' . $error;
    exit;
}else {
    echo $response;
};



