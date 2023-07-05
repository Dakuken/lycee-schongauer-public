<?php
require '../db-connect.php';
require '../cors.php';
date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json');

$nom = $_POST['nom'] ?? '';
$pieceJointe = $_FILES['pieceJointe'] ?? '';
$link = $_POST['link'] ?? '';

//verifInfo($id, $dateDeb, $heureDeb, $heureFin, $dateFin, $motif, $pieceJointe);


class Services
{
    private string $nom;
    private $pieceJointe;
    private string $piecesJointesLink;

    private string $link;

    private ?PDO $dbh;

    public function __construct(string $nom, $pieceJointe, string $link)
    {
        $this->dbh = connectDB();
        $this->nom = $nom;
        $this->pieceJointe = $pieceJointe;
        $this->link = $link;


        if (!empty($this->pieceJointe)) {
            $this->traitementFichier();
        }

        $this->ajoutBdd();


    }


    function traitementFichier(): void
    {
        if (isset($_FILES['pieceJointe'])) {
            $files = $_FILES['pieceJointe'];
            $targetDirectory = './servicesPhoto/';

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
            $query = "INSERT INTO services (nom, photo, lien)
          VALUES (:nom, :piece_jointe, :link)";
            $stmt = $this->dbh->prepare($query);
            $stmt->bindParam(':piece_jointe', $this->piecesJointesLink);
        } else {
            $query = "INSERT INTO services (nom, lien)
          VALUES (:nom, :link)";
            $stmt = $this->dbh->prepare($query);
        }


        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':link', $this->link);
        $stmt->execute();
    }
}

// ! regarder gérer erreur si un des plusieurs fichiers a un problème pour peut être cancel les autres.
function verifInfo(string $nom, string $link): void
{
    $response = ['success' => false, 'message' => 'Veuillez saisir :'];

    if (empty($nom)) {
        $response['message'] .= ' un nom;';
    }

    if (empty($link)) {
        $response['message'] .= ' un lien;';
    }

    if ($response['message'] != 'Veuillez saisir :') {
        http_response_code(400);
        echo json_encode($response);
        exit;
    }
}

verifInfo($nom, $link);
$abs = new Services($nom, $pieceJointe, $link);

$response = ['success' => true, 'message' => "Tout s'est bien passé"];
http_response_code(200);
echo json_encode($response);
exit;

