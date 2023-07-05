import {API_LINK} from "../../GLOBAL";
import axios from "axios";

let INDEX_ADMIN = 0;
let INDEX_ELEVE = 0;
let token = localStorage.getItem("token");
if (!token) {
    window.location.href = "../login/login.html";
}

interface Administrateur {
    nom: string,
    prenom: string,
    mail: string
}

interface Eleves extends Administrateur {
    userId: string;
}

class DataUser {
    administrateurs: Administrateur[] = [];
    eleves: Eleves[] = [];
    nom = <HTMLInputElement>document.querySelector("#nom");
    prenom = <HTMLInputElement>document.querySelector("#prenom");


    async getDataEleve() {
        token = <string>token;
        let nom = this.nom.value;
        let prenom = this.prenom.value;
        let config = {token, index_start: INDEX_ELEVE, eleveOrAdmin: 'eleve', nom, prenom};
        await axios.post(`${API_LINK}/gestion/recup-users.php`, config).then((res) => {
            let data = res.data.data;
            this.eleves = data;
            INDEX_ELEVE += 15;
        }).catch((err) => {
            //!TODO voir le message d'erreur et soit rediriger soit affiché l'erreur au client
            window.location.href = "../login/login.html";
        });
    }

    async getDataAdmin() {
        token = <string>token;
        let nom = this.nom.value;
        let prenom = this.prenom.value;
        let config = {token, index_start: INDEX_ADMIN, eleveOrAdmin: 'admin', nom, prenom};
        await axios.post(`${API_LINK}/gestion/recup-users.php`, config).then((res) => {
            let data = res.data.data;
            this.administrateurs = data;
            INDEX_ADMIN += 15;
        }).catch((err) => {
            //!TODO voir le message d'erreur et soit rediriger soit affiché l'erreur au client
            window.location.href = "../login/login.html";
        });
    }

    createTableAdmin() {
        let table = <HTMLTableElement>document.querySelector("#table-info-admin");
        let html = ``;
        for (let i = 0; i < this.administrateurs.length; i++) {
            let admin = this.administrateurs[i];
            html += `<tr class="text-center text-lg ligne-info h-12 " >
                <td>${admin.nom}</td>
                <td>${admin.prenom}</td>
                <td>${admin.mail}</td>
            </tr>`;
        }

        table.innerHTML += html;
    }

    createTableEleve() {
        let table = <HTMLTableElement>document.querySelector("#table-info-eleve");
        let html = ``;
        for (let i = 0; i < this.eleves.length; i++) {
            let eleve = this.eleves[i];
            html += `<tr class="text-center text-lg ligne-info h-12 " id="${eleve.userId}" >
                <td>${eleve.nom}</td>
                <td>${eleve.prenom}</td>
                <td>${eleve.mail}</td>
            </tr>`;
        }

        table.innerHTML += html;

    }

    searchPrepare() {
        let self = this;
        let btnSearch = <HTMLButtonElement>document.querySelector("#btn-search");
        btnSearch.addEventListener("click", async () => {
            let nom = self.nom.value;
            let prenom = self.prenom.value;
            let erreurSearch = <HTMLParagraphElement>document.querySelector("#erreur-search");
            if (nom === "" && prenom === "") {
                erreurSearch.classList.remove("hidden");
                return;
            }

            this.resetTable();
            erreurSearch.classList.add("hidden");
            await this.getDataAdmin();
            await this.getDataEleve();
            this.createTableAdmin();
            this.createTableEleve();
        });
    }

    deleteUser(id: string) {
        let token = localStorage.getItem("token");
        if(!token){
            location.href = "../login/login.html";
        }
        axios.post(`${API_LINK}/gestion/supp-eleves.php`, {id, token}).then((res) => {
            setTimeout(() => {
                window.location.reload();
            }, 500)
        }).catch((res) => {
        })
    }

    resetTable() {
        let tableAdmin = <HTMLTableElement>document.querySelector("#table-info-admin");
        let tableEleve = <HTMLTableElement>document.querySelector("#table-info-eleve");
        tableAdmin.innerHTML = `<tr class="text-center text-lg ligne-info h-12 ">
                <th>Nom</th>
                <th>Prénom</th>
                <th>Mail</th>
            </tr>`;
        tableEleve.innerHTML = `<tr class="text-center text-lg ligne-info h-12 ">
                <th>Nom</th>
                <th>Prénom</th>
                <th>Mail</th>
            </tr>`;

        INDEX_ADMIN = 0;
        INDEX_ELEVE = 0;

    }
}

async function main() {
    let data = new DataUser();
    await data.getDataAdmin();
    await data.getDataEleve();
    data.createTableAdmin();
    data.createTableEleve();
    data.searchPrepare();

    let btnMoreAdmin = <HTMLButtonElement>document.querySelector("#btn-more-admin");
    let btnMoreEleve = <HTMLButtonElement>document.querySelector("#btn-more-eleve");
    btnMoreAdmin.addEventListener("click", async () => {
        await data.getDataAdmin();
        data.createTableAdmin();
    });
    btnMoreEleve.addEventListener("click", async () => {
        await data.getDataEleve();
        data.createTableEleve();
    });

    let userSend = new DataUserSend();
    let btnSend = <HTMLButtonElement>document.querySelector("#btn-envoie-eleve");
    btnSend.addEventListener("click", async () => {
        await userSend.sendData();
    });

}

class DataUserSend {
    nom = <HTMLInputElement>document.querySelector("#nomEnvoie");
    prenom = <HTMLInputElement>document.querySelector("#prenomEnvoie");
    mail = <HTMLInputElement>document.querySelector("#mail");
    password = <HTMLInputElement>document.querySelector("#password");
    login = <HTMLInputElement>document.querySelector("#login");

    erreur = <HTMLParagraphElement>document.querySelector("#erreurAjoutEleve");

    isAdmin = '0';

    constructor() {

    }

    getIsAdmin() {
        const ouiAdmin = document.getElementById('Oui') as HTMLInputElement;
        if (ouiAdmin.checked) {
            return '1';
        }
        return '0';
    }

    async sendData() {
        this.isAdmin = this.getIsAdmin();
        let nom = this.nom.value;
        let prenom = this.prenom.value;
        let mail = this.mail.value;
        let password = this.password.value;
        let login = this.login.value;
        let config = {login, nom, prenom, mail, password, est_admin: this.isAdmin};
        await axios.post(`${API_LINK}/gestion/add-eleves.php`, config).then((res) => {
            this.erreur.classList.remove("text-red-500");
            this.erreur.classList.add("text-green-500");
            this.erreur.innerHTML = res.data.message;
            window.location.reload();
        }).catch((err) => {
            this.erreur.innerHTML = err.response.data.message;

        });
    }
}

main();

export {};
