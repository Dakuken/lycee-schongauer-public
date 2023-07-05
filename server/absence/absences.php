<?php
require '../db-connect.php';
require '../cors.php';
date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json');


//! ajouter random carrachter
$utilisateur_id = $_POST['utilisateur_id'] ?? '';

$dateDeb = $_POST['dateDeb'] ?? '';
$heureDeb = $_POST['heureDeb'] ?? '';
$heureFin = $_POST['heureFin'] ?? '';
$dateFin = $_POST['dateFin'] ?? '';
$motif = $_POST['motif'] ?? '';
$pieceJointe = $_FILES['pieceJointe'] ?? '';

//verifInfo($id, $dateDeb, $heureDeb, $heureFin, $dateFin, $motif, $pieceJointe);


class Abscences
{
    private string $utilisateur_id;
    private string $motif;
    private string $dateDeb;
    private string $heureDeb;
    private string $heureFin;
    private $pieceJointe;

    private string $piecesJointesId;
    private string $dateFin;

    private string $piecesJointesLink;
    private ?PDO $dbh;

    public function __construct(string $utilisateur_id, string $motif, string $dateDeb, string $heureDeb, string $heureFin, string $dateFin, $pieceJointe)
    {
        $this->dbh = connectDB();
        $this->utilisateur_id = $utilisateur_id;
        $this->motif = $motif;
        $this->dateDeb = $dateDeb;
        $this->heureDeb = $heureDeb;
        $this->heureFin = $heureFin;
        $this->dateFin = $dateFin;
        $this->pieceJointe = $pieceJointe;


        if (!empty($this->pieceJointe)) {
            $this->traitementFichier();
        }

        $this->ajoutBdd();


    }


    function traitementFichier(): void
    {
        if (isset($_FILES['pieceJointe'])) {
            $files = $_FILES['pieceJointe'];
            $targetDirectory = './justificatif/';

            $fileName = $files['name'];
            $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
            $fileNameWithoutExtension = pathinfo($fileName, PATHINFO_FILENAME);

            $uniqueFileName = $fileNameWithoutExtension . '_' . date('d-m-Y_H\hi-s') . '.' . $fileExtension;
            $targetFile = $targetDirectory . $uniqueFileName;
            $this->piecesJointesLink = $targetFile;

            if (!move_uploaded_file($files['tmp_name'], $targetFile)) {
                $response = ['success' => false, 'message' => 'Une erreur s\'est produite lors du téléchargement du fichier sur le serveur.'];
                http_response_code(500);
                echo json_encode($response);
                exit;
            }

        }
    }

    function ajoutBdd(): void
    {

        if (!empty($this->pieceJointe)) {
            $this->ajoutPiecesJointes();
        }


        if (!empty($this->piecesJointesId)) {
            $query = "INSERT INTO absences ( utilisateur_id, motif, date_debut, heure_debut, date_fin, heure_fin, pieces_jointes)
          VALUES (:utilisateur_id, :motif, :date_debut, :heure_debut, :date_fin, :heure_fin, :pieces_jointes)";
            $stmt = $this->dbh->prepare($query);
            $stmt->bindParam(':pieces_jointes', $this->piecesJointesId);
        } else {
            $query = "INSERT INTO absences ( utilisateur_id, motif, date_debut, heure_debut, date_fin, heure_fin)
          VALUES (:utilisateur_id, :motif, :date_debut, :heure_debut, :date_fin, :heure_fin)";
            $stmt = $this->dbh->prepare($query);
        }


        $stmt->bindParam(':utilisateur_id', $this->utilisateur_id);
        $stmt->bindParam(':motif', $this->motif);
        $stmt->bindParam(':date_debut', $this->dateDeb);
        $stmt->bindParam(':heure_debut', $this->heureDeb);
        $stmt->bindParam(':date_fin', $this->dateFin);
        $stmt->bindParam(':heure_fin', $this->heureFin);
        $stmt->execute();
    }

    function ajoutPiecesJointes(): void
    {
        $query = "INSERT INTO fichiers (lien) VALUES (:link)";
        $stmt = $this->dbh->prepare($query);
        $stmt->bindParam(':link', $this->piecesJointesLink);
        $stmt->execute();
        // Obtenir l'ID de la dernière insertion
        $this->piecesJointesId = $this->dbh->lastInsertId();

    }
}

// ! regarder gérer erreur si un des plusieurs fichiers a un problème pour peut être cancel les autres.
function verifInfo(string $utilisateur_id, string $dateDeb, string $dateFin, string $heureDeb, string $heureFin, string $motif): void
{
    $response = ['success' => false, 'message' => 'Veuillez saisir :'];

    if (empty($utilisateur_id)) {
        $response['message'] .= ' un id d\'utilisateur;';
    }

    if (empty($dateDeb)) {
        $response['message'] .= ' une date de début;';
    }

    if (empty($heureDeb)) {
        $response['message'] .= ' une heure de début;';
    }

    if (empty($heureFin)) {
        $response['message'] .= ' une heure de fin;';
    }

    if (empty($dateFin)) {
        $response['message'] .= ' une date de fin;';
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

verifInfo($utilisateur_id, $dateDeb, $dateFin, $heureDeb, $heureFin, $motif);
$abs = new Abscences($utilisateur_id, $motif, $dateDeb, $heureDeb, $heureFin, $dateFin, $pieceJointe);

$response = ['success' => true, 'message' => "Tout s'est bien passé", "pouet" => [$pieceJointe, $utilisateur_id, $motif, $dateDeb, $heureDeb, $heureFin, $dateFin]];
http_response_code(200);
echo json_encode($response);
exit;

