<?php
include_once "../cors.php";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://lyc-schongauer.monbureaunumerique.fr/sg.do?PROC=RSS_BLOG&ACTION=CONSULTER_RSS_BLOG&ID_RUBRIQUE=206');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
curl_close($ch);