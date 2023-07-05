<?php

require '../db-connect.php';
require '../cors.php';
date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
$nom = $_POST['nom'] ?? '';
$login = $_POST['login'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$mail = $_POST['mail'] ?? '';
$password = $_POST['password'] ?? '';
$isAdmin = $_POST['est_admin'] ?? '0';

class Eleve
{
    private string $nom;
    private string $prenom;
    private string $mail;
    private string $password;
    private string $isAdmin;
    private string $login;

    private ?PDO $dbh;

    public function __construct(string $nom, string $prenom, string $mail, string $password, string $isAdmin, string $login)
    {
        $this->dbh = connectDB();
        $this->nom = $nom;
        $this->prenom = $prenom;
        $this->mail = $mail;
        $this->isAdmin = $isAdmin;
        $this->login = $login;
        $this->password = $this->cryptPassword($password);
        $this->verifLogin();

        $this->ajoutBdd();

    }

    private function verifLogin(): void
    {
        $query = "SELECT * FROM utilisateurs WHERE login = :login";
        $stmt = $this->dbh->prepare($query);
        $stmt->bindParam(':login', $this->login);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Ce login est déjà utilisé']);
            exit;
        }
    }

    private function cryptPassword(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    function ajoutBdd(): void
    {
        $query = "INSERT INTO utilisateurs (login, nom,prenom,email,password, est_admin) VALUES (:login, :nom,:prenom,:mail,:password, :isAdmin)";
        $stmt = $this->dbh->prepare($query);
        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':prenom', $this->prenom);
        $stmt->bindParam(':mail', $this->mail);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':isAdmin', $this->isAdmin);
        $stmt->bindParam(':login', $this->login);
        $stmt->execute();
    }
}

// ! regarder gérer erreur si un des plusieurs fichiers a un problème pour peut être cancel les autres.
function verifInfo(string $nom, string $prenom , string $mail, string $password, string $isAdmin, string $login): void
{
    $response = ['success' => false, 'message' => 'Veuillez saisir :', "data" => [$isAdmin, $nom, $prenom, $mail, $password, $isAdmin, $login]];

    if (empty($nom)) {
        $response['message'] .= ' un nom;';
    }

    if (empty($prenom)) {
        $response['message'] .= ' un prenom;';
    }

    if (empty($mail)) {
        $response['message'] .= ' un mail;';
    }

    if (empty($password)) {
        $response['message'] .= ' un password;';
    }

    if (!isset($isAdmin) || $isAdmin == null || $isAdmin == "") {
        $response['message'] .= ' un isAdmin;';
    }

    if(empty($login)){
        $response['message'] .= ' un login;';
    }



    if ($response['message'] != 'Veuillez saisir :') {
        http_response_code(400);
        echo json_encode($response);
        exit;
    }
}

verifInfo($nom, $prenom, $mail, $password, $isAdmin, $login);
$eleve = new Eleve($nom, $prenom, $mail, $password, $isAdmin,$login);
$response = ['success' => true, 'message' => "Tout s'est bien passé"];
http_response_code(200);
echo json_encode($response);
exit;

