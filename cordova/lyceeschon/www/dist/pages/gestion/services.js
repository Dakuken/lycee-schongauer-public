import axios from "../../../snowpack/pkg/axios.js";
import {API_LINK} from "../../GLOBAL.js";
function errorNom(isError) {
  if (isError) {
    let error = document.querySelector("#erreur-nom");
    error.classList.remove("hidden");
    let success = document.querySelector("#success-send");
    success.classList.add("hidden");
  } else {
    let error = document.querySelector("#erreur-nom");
    error.classList.add("hidden");
    let success = document.querySelector("#success-send");
    success.classList.remove("hidden");
  }
}
function send() {
  let formData = new FormData();
  let fileInput = document.querySelector("#justificatif");
  if (fileInput.files) {
    formData.append("justificatif", fileInput.files[0]);
  }
  let file = formData.get("justificatif");
  let formData2 = new FormData();
  let nom = document.querySelector("#nom");
  let lien = document.querySelector("#lien");
  if (!nom.value) {
    errorNom(true);
    return;
  }
  if (!lien.value) {
    return;
  }
  formData2.append("nom", nom.value);
  formData2.append("link", lien.value);
  if (file !== null) {
    formData2.append("pieceJointe", file);
  }
  axios.post(`${API_LINK}/services/services.php`, formData2).then((res) => {
    errorNom(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }).catch((res) => {
    errorNom(true);
  });
}
let boutonSend = document.querySelector("#btn-formation");
boutonSend.addEventListener("click", () => {
  send();
});
let formations = [];
async function main() {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../login/login.html";
  }
  axios.post(`${API_LINK}/services/recup-services.php`, {token}).then((res) => {
    formations = res.data.data;
    createTable(formations);
  }).catch((res) => {
  });
}
function createTable(formations2) {
  let table = document.querySelector("#table-info-admin");
  let html = ``;
  for (let i = 0; i < formations2.length; i++) {
    let formation = formations2[i];
    const cheminOriginal = formation.photo;
    const cheminTransforme = cheminOriginal.replace("./servicesPhoto", `${API_LINK}/services/servicesPhoto`);
    html += `<tr class="text-center text-lg ligne-info h-12 " id="${formation.id}" >
                <td>${formation.nom}</td>
                <td>${formation.lien}</td>
                <td><img class="mx-auto w-32" src="${cheminTransforme}" alt="icone supprimer" ></td>
                <td class="flex justify-center"><img class="w-20 h-20 supprimer cursor-pointer" src="../../assets/icons/close-outline-red.png" alt="icone supprimer" ></td>
            </tr>`;
  }
  table.innerHTML += html;
  table.querySelectorAll(".supprimer").forEach((icone) => {
    icone.addEventListener("click", (e) => {
      let id = e.target.parentElement?.parentElement?.id;
      if (id) {
        deleteServices(id);
      }
    });
  });
}
function deleteServices(id) {
  let token = localStorage.getItem("token");
  axios.post(`${API_LINK}/services/supp-services.php`, {id, token}).then((res) => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }).catch((res) => {
  });
}
main();
export {};
