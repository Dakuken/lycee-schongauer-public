import axios from "axios";
import {API_LINK} from "../../GLOBAL";

let button = <HTMLButtonElement>document.querySelector("#bouton-login");
button.addEventListener("click", async (e) => {
    e.preventDefault();
    if(!hasAllInput()){
        showError("Veuillez remplir tous les champs");
        return;
    }
    let htmlLogin = <HTMLInputElement>document.querySelector("#login");
    let htmlPassword = <HTMLInputElement>document.querySelector("#password");
    let password = htmlPassword.value;
    let login = htmlLogin.value;

    const data = {login, password};
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };


    await axios.post(`${API_LINK}client/connexion-client.php`, data, config).then((res) => {
        loginCorrect(res.data.token);
    }).catch((res) => {
        if (res.response) {
            showError(res.response.data.message);
        } else {
            showError("Problème avec le serveur, veuillez réessayer plus tard");
        }
    });
});

function loginCorrect(token: string) {
    let error = <HTMLParagraphElement>document.querySelector("#error");
    error.innerText = '';
    localStorage.setItem("token", token);
    window.location.href = "../accueil/accueil.html";
}

function showError(message: string) {
    let error = <HTMLParagraphElement>document.querySelector("#error");
    error.innerText = message;
}

function hasAllInput(){
    let htmlLogin = <HTMLInputElement>document.querySelector("#login");
    let htmlPassword = <HTMLInputElement>document.querySelector("#password");
    return htmlLogin.value !== "" && htmlPassword.value !== "";
}


export {};
