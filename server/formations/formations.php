<?php
require '../db-connect.php';
require '../cors.php';
date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json');

$nom = $_POST['nom'] ?? '';
$pieceJointe = $_FILES['pieceJointe'] ?? '';

//verifInfo($id, $dateDeb, $heureDeb, $heureFin, $dateFin, $motif, $pieceJointe);


class Formations
{
    private string $nom;
    private $pieceJointe;
    private string $piecesJointesLink;

    private ?PDO $dbh;

    public function __construct(string $nom, $pieceJointe)
    {
        $this->dbh = connectDB();
        $this->nom = $nom;
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
            $targetDirectory = './formationsFlyer/';

            $fileName = $files['name'];
            $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
            $fileNameWithoutExtension = pathinfo($fileName, PATHINFO_FILENAME);

            $uniqueFileName = $fileNameWithoutExtension . '_' . date('d-m-Y_H\hi-s') . '.' . $fileExtension;
            $targetFile = $targetDirectory . $uniqueFileName;
            $this->piecesJointesLink = $targetFile;
            $bidule = move_uploaded_file($files['tmp_name'], $targetFile);
            if (!$bidule) {
                $response = ['success' => false, 'message' => "Une erreur s'est produite lors du téléchargement du fichier sur le serveur."];
                http_response_code(500);
                echo json_encode($response);
                exit;
            }
        }
    }

    function ajoutBdd(): void
    {


        if (!empty($this->piecesJointesLink)) {
            $query = "INSERT INTO formations (nom, piece_jointe)
          VALUES (:nom, :piece_jointe)";
            $stmt = $this->dbh->prepare($query);
            $stmt->bindParam(':piece_jointe', $this->piecesJointesLink);
        } else {
            $query = "INSERT INTO formations (nom)
          VALUES (:nom)";
            $stmt = $this->dbh->prepare($query);
        }


        $stmt->bindParam(':nom', $this->nom);

        $stmt->execute();
    }
}

// ! regarder gérer erreur si un des plusieurs fichiers a un problème pour peut être cancel les autres.
function verifInfo(string $nom): void
{
    $response = ['success' => false, 'message' => 'Veuillez saisir :'];

    if (empty($nom)) {
        $response['message'] .= ' un nom;';
    }


    if ($response['message'] != 'Veuillez saisir :') {
        http_response_code(400);
        echo json_encode($response);
        exit;
    }
}

verifInfo($nom);
$abs = new Formations($nom, $pieceJointe);

$response = ['success' => true, 'message' => "Tout s'est bien passé"];
http_response_code(200);
echo json_encode($response);
exit;

