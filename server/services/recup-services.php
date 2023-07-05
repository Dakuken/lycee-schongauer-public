<?php

require '../token/verify-token.php';
require '../cors.php';
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
//verifier utilisateur admin
$dbh = connectDB();


$sth = $dbh->prepare(
    'SELECT id,nom, photo,lien
FROM services
');


$sth->execute();
$result = $sth->fetchAll(PDO::FETCH_ASSOC);



$response = array('success' => true, 'message' => "Le token est valide", 'data' => $result);
http_response_code(200);
echo json_encode($response);
exit;

