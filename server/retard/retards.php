<?php

require '../db-connect.php';
require '../cors.php';
date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json');

$utilisateur_id = $_POST['utilisateur_id'] ?? '';
$dateRetard = $_POST['dateRetard'] ?? '';
$minuteRetard = $_POST['minuteRetard'] ?? '';
$motif = $_POST['motif'] ?? '';


class Retard
{
    private int $utilisateur_id;
    private string $motif;
    private string $dateRetard;
    private int $minuteRetard;

    private $dbh;

    public function __construct(int $utilisateur_id, string $motif, string $dateRetard, int $minuteRetard)
    {
        $this->dbh = connectDB();
        $this->utilisateur_id = $utilisateur_id;
        $this->minuteRetard = $minuteRetard;
        $this->dateRetard = $dateRetard;
        $this->motif = $motif;
        $this->ajoutBdd();
    }


    function ajoutBdd(): void
    {
        $query = "INSERT INTO retards ( utilisateur_id, motif, date_retard, minutes_retard)
          VALUES (:utilisateur_id, :motif, :date_retard, :minute_retard)";
        $stmt = $this->dbh->prepare($query);
        $stmt->bindParam(':utilisateur_id', $this->utilisateur_id);
        $stmt->bindParam(':motif', $this->motif);
        $stmt->bindParam(':date_retard', $this->dateRetard);
        $stmt->bindParam(':minute_retard', $this->minuteRetard);
        $stmt->execute();
    }
}

function verifInfo($id_utilisateur, $motif, $dateRetard, $minuteRetard): void
{
    $response = ['success' => false, 'message' => 'Veuillez saisir :'];

    if (empty($id_utilisateur)) {
        $response['message'] .= ' un id d\'utilisateur;';
    }

    if (empty($dateRetard)) {
        $response['message'] .= ' la date du retard;';
    }

    if (empty($minuteRetard)) {
        $response['message'] .= ' l\'heure du retard;';
    }

    if (empty($motif)) {
        $response['message'] .= ' un motif;';
    }

    if ($response['message'] != 'Veuillez saisir :') {
        http_response_code(400);
        echo json_encode($response);
        exit;
    }
}

verifInfo($utilisateur_id, $motif, $dateRetard, $minuteRetard);

$retard = new Retard(intval($utilisateur_id), $motif, $dateRetard, $minuteRetard);

$response = ['success' => true, 'message' => "Tout s'est bien passé"];
http_response_code(200);
echo json_encode($response);
exit;
