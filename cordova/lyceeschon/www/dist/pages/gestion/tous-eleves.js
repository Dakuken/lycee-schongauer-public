import {API_LINK} from "../../GLOBAL.js";
import axios from "../../../snowpack/pkg/axios.js";
let INDEX_ADMIN = 0;
let INDEX_ELEVE = 0;
let token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../login/login.html";
}
class DataUser {
  constructor() {
    this.administrateurs = [];
    this.eleves = [];
    this.nom = document.querySelector("#nom");
    this.prenom = document.querySelector("#prenom");
  }
  async getDataEleve() {
    token = token;
    let nom = this.nom.value;
    let prenom = this.prenom.value;
    let config = {token, index_start: INDEX_ELEVE, eleveOrAdmin: "eleve", nom, prenom};
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
    token = token;
    let nom = this.nom.value;
    let prenom = this.prenom.value;
    let config = {token, index_start: INDEX_ADMIN, eleveOrAdmin: "admin", nom, prenom};
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
    let table = document.querySelector("#table-info-admin");
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
    let table = document.querySelector("#table-info-eleve");
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
    let btnSearch = document.querySelector("#btn-search");
    btnSearch.addEventListener("click", async () => {
      let nom = self.nom.value;
      let prenom = self.prenom.value;
      let erreurSearch = document.querySelector("#erreur-search");
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
  deleteUser(id) {
    let token2 = localStorage.getItem("token");
    if (!token2) {
      location.href = "../login/login.html";
    }
    axios.post(`${API_LINK}/gestion/supp-eleves.php`, {id, token: token2}).then((res) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }).catch((res) => {
    });
  }
  resetTable() {
    let tableAdmin = document.querySelector("#table-info-admin");
    let tableEleve = document.querySelector("#table-info-eleve");
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
  let btnMoreAdmin = document.querySelector("#btn-more-admin");
  let btnMoreEleve = document.querySelector("#btn-more-eleve");
  btnMoreAdmin.addEventListener("click", async () => {
    await data.getDataAdmin();
    data.createTableAdmin();
  });
  btnMoreEleve.addEventListener("click", async () => {
    await data.getDataEleve();
    data.createTableEleve();
  });
  let userSend = new DataUserSend();
  let btnSend = document.querySelector("#btn-envoie-eleve");
  btnSend.addEventListener("click", async () => {
    await userSend.sendData();
  });
}
class DataUserSend {
  constructor() {
    this.nom = document.querySelector("#nomEnvoie");
    this.prenom = document.querySelector("#prenomEnvoie");
    this.mail = document.querySelector("#mail");
    this.password = document.querySelector("#password");
    this.login = document.querySelector("#login");
    this.erreur = document.querySelector("#erreurAjoutEleve");
    this.isAdmin = "0";
  }
  getIsAdmin() {
    const ouiAdmin = document.getElementById("Oui");
    if (ouiAdmin.checked) {
      return "1";
    }
    return "0";
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
