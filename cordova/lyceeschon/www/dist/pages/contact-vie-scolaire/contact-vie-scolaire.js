import axios from "../../../snowpack/pkg/axios.js";
import {API_LINK} from "../../GLOBAL.js";
let REQUETE_EN_COURS = false;
class Formulaire {
  constructor() {
    this.date = [];
    this.heure = [];
    this.dateRetard = "";
    this.formData = new FormData();
    this.textAutre = "";
    this.duree = "";
    this.nom = UserData.nom;
    this.prenom = UserData.prenom;
    this.motif = this.getMotif();
    this.etat = this.getEtat();
    if (this.etat === "absence") {
      this.getDate();
    } else {
      this.getDuree();
    }
    this.getFile();
    let verification = this.verif();
    console.log(verification, "on verifie");
    if (verification) {
      this.send().then(() => {
      });
    } else {
      REQUETE_EN_COURS = false;
    }
  }
  verif() {
    if (!this.etat) {
      return false;
    }
    if (this.etat === "absence") {
      if (this.date.length != 2) {
        return false;
      }
      if (this.heure.length != 2) {
        return false;
      }
    }
    if (this.etat === "retard") {
      if (!this.duree) {
        return false;
      }
      if (!this.dateRetard) {
        return false;
      }
    }
    if (!this.motif) {
      return false;
    }
    if (this.motif === "Autre") {
      if (!this.textAutre) {
        return false;
      }
    }
    if (!this.nom) {
      return false;
    }
    if (!this.prenom) {
      return false;
    }
    return true;
  }
  getMotif() {
    let motif = document.querySelector("#motif").value;
    let erreurAutre = document.querySelector("#erreur-autre");
    if (motif === "Autre") {
      this.textAutre = document.querySelector("#autreInput").value;
      if (this.textAutre === "") {
        erreurAutre.classList.remove("hidden");
        return "";
      } else {
        erreurAutre.classList.add("hidden");
        return this.textAutre;
      }
    }
    erreurAutre.classList.add("hidden");
    return motif;
  }
  getEtat() {
    const absenceRadio = document.getElementById("absence");
    if (absenceRadio.checked) {
      return "absence";
    }
    return "retard";
  }
  getDate() {
    let date1 = document.querySelector("#date-choice_date1");
    let date2 = document.querySelector("#date-choice_date2");
    let heure1 = document.querySelector("#date-choice_heure1");
    let heure2 = document.querySelector("#date-choice_heure2");
    let erreurDate1 = document.querySelector("#erreur-date-1");
    let erreurDate2 = document.querySelector("#erreur-date-2");
    const regexDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    const regexHeure = /^([01]\d|2[0-3]):[0-5]\d$/;
    let erreurFormat = "L'année doit être supérieur ou égal à 2023";
    let erreurNonRemplieDebut = "Merci de remplir la date et l'heure du début de l'absence.";
    let erreurNonRemplieFin = "Merci de remplir la date et l'heure de fin de l'absence.";
    if (regexDate.test(date1.value) && regexHeure.test(heure1.value)) {
      if (Number(date1.value.split("-")[0]) < 2023) {
        erreurDate1.innerText = erreurFormat;
        erreurDate1.classList.remove("hidden");
      } else {
        erreurDate1.classList.add("hidden");
        this.date.push(date1.value);
        this.heure.push(heure1.value);
      }
    } else {
      erreurDate1.innerText = erreurNonRemplieDebut;
      erreurDate1.classList.remove("hidden");
    }
    if (regexDate.test(date2.value) && regexHeure.test(heure2.value)) {
      if (Number(date2.value.split("-")[0]) < 2023) {
        erreurDate2.innerText = erreurFormat;
        erreurDate2.classList.remove("hidden");
      } else {
        erreurDate2.classList.add("hidden");
        this.date.push(date2.value);
        this.heure.push(heure2.value);
      }
    } else {
      erreurDate2.innerText = erreurNonRemplieFin;
      erreurDate2.classList.remove("hidden");
    }
  }
  getDuree() {
    let dateRetard = document.querySelector("#date-choice_retardDate").value;
    let dateRetardError = document.querySelector("#erreur-date-retard");
    if (dateRetard) {
      dateRetardError.classList.add("hidden");
      this.dateRetard = dateRetard;
    } else {
      dateRetardError.classList.remove("hidden");
      this.dateRetard = "";
    }
    let dureeErreur = document.querySelector("#erreur-duree-retard");
    let selectDuree = document.querySelector("#retardSelect");
    let retardValue = selectDuree.value;
    if (retardValue === "15" || retardValue === "10" || retardValue === "5") {
      dureeErreur.classList.add("hidden");
      this.duree = selectDuree.value;
      return;
    }
    dureeErreur.classList.remove("hidden");
    this.duree = "";
  }
  getFile() {
    let fileInput = document.querySelector("#justificatif");
    if (fileInput.files) {
      this.formData.append("justificatif", fileInput.files[0]);
    }
  }
  async send() {
    if (this.etat === "absence") {
      let file = this.formData.get("justificatif");
      let formData = new FormData();
      formData.append("dateDeb", this.date[0]);
      formData.append("dateFin", this.date[1]);
      formData.append("motif", this.motif);
      formData.append("utilisateur_id", UserData.utilisateur_id);
      formData.append("heureDeb", this.heure[0]);
      formData.append("heureFin", this.heure[1]);
      if (file !== null) {
        formData.append("pieceJointe", file);
      }
      console.log("graouuuu");
      await axios.post(`${API_LINK}/absence/absences.php`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        let validationText = document.querySelector("#validation-text");
        validationText.classList.add("text-green-600");
        validationText.innerText = "Absence envoyée";
        console.log(res);
        setTimeout(() => {
          window.location.href = "../accueil/accueil.html";
        }, 1500);
      }).catch((err) => {
        console.log(err);
        console.log("erreur");
        let validationText = document.querySelector("#validation-text");
        validationText.classList.add("text-red-600");
        validationText.innerText = "Erreur lors de l'envoie de l'absence";
        REQUETE_EN_COURS = false;
      });
    } else {
      let formData = new FormData();
      formData.append("dateRetard", this.dateRetard);
      formData.append("minuteRetard", this.duree);
      formData.append("utilisateur_id", UserData.utilisateur_id);
      formData.append("motif", this.motif);
      await axios.post(`${API_LINK}/retard/retards.php`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        let validationText = document.querySelector("#validation-text");
        validationText.classList.remove("text-red-600");
        validationText.classList.add("text-green-600");
        validationText.innerText = "Retard envoyé";
        setTimeout(() => {
          window.location.href = "../accueil/accueil.html";
        }, 1500);
      }).catch((err) => {
        console.log(err);
        let validationText = document.querySelector("#validation-text");
        validationText.classList.remove("text-green-600");
        validationText.classList.add("text-red-600");
        validationText.innerText = "Erreur lors de l'envoi du retard";
        REQUETE_EN_COURS = false;
      });
    }
  }
}
function autreMotif() {
  let select = document.querySelector("#motif");
  let autreInput = document.querySelector("#autreInput");
  select.addEventListener("change", () => {
    if (select.value === "Autre") {
      autreInput.classList.remove("hidden");
    } else {
      autreInput.classList.add("hidden");
    }
  });
}
function retard() {
  const retardRadio = document.getElementById("retard");
  retardRadio.addEventListener("click", () => {
    switchAbsenceRetard(dateTitle, dateWrapperForm, retardTitle, retardWrapperForm, true);
  });
}
function absence() {
  const absenceRadio = document.getElementById("absence");
  absenceRadio.addEventListener("click", () => {
    switchAbsenceRetard(retardTitle, retardWrapperForm, dateTitle, dateWrapperForm, false);
  });
}
function switchAbsenceRetard(oldTitle, oldWrapper, newTitle, newWrapper, hiddingFile) {
  let justificatifLabel = document.querySelector("#justificatifLabel");
  if (hiddingFile) {
    justificatifLabel.classList.add("hidden");
  } else {
    justificatifLabel.classList.remove("hidden");
  }
  oldTitle.classList.add("hidden");
  newTitle.classList.remove("hidden");
  newWrapper.classList.remove("hidden");
  newWrapper.classList.add("flex");
  oldWrapper.classList.remove("flex");
  oldWrapper.classList.add("hidden");
}
const dateTitle = document.getElementById("date-title");
const dateWrapperForm = document.getElementById("date-wrapper-form");
const retardTitle = document.getElementById("retard-title");
const retardWrapperForm = document.getElementById("retard-wrapper-form");
let boutonValider = document.querySelector("#bouton-valider");
boutonValider.addEventListener("click", (e) => {
  e.preventDefault();
  if (REQUETE_EN_COURS) {
    console.log("degage pd");
    return;
  }
  console.log("on passe");
  REQUETE_EN_COURS = true;
  let formulaire = new Formulaire();
});
async function recupInfo() {
  return new Promise((resolve) => {
    let token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../login/login.html";
    }
    axios.post(`${API_LINK}/client/info-client.php`, {token}).then((res) => {
      let data = res.data.data;
      resolve(data);
    }).catch(() => {
      window.location.href = "../login/login.html";
    });
  });
}
class UserData {
}
UserData.nom = "";
UserData.prenom = "";
UserData.utilisateur_id = "";
recupInfo().then((res) => {
  let data = res;
  let nom = document.querySelector("#nom");
  let prenom = document.querySelector("#prenom");
  UserData.nom = data.nom;
  UserData.prenom = data.prenom;
  UserData.utilisateur_id = data.id;
  nom.innerHTML = UserData.nom;
  prenom.innerHTML = UserData.prenom;
  retard();
  absence();
  autreMotif();
});
export {};
