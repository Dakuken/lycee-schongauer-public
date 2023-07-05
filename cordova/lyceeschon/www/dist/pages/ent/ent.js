import axios from "../../../snowpack/pkg/axios.js";
import {API_LINK} from "../../GLOBAL.js";
let formations = [];
async function main() {
  axios.post(`${API_LINK}/services/recup-services.php`).then((res) => {
    formations = res.data.data;
    createEnt(formations);
  }).catch((res) => {
  });
}
function createEnt(services) {
  let table = document.querySelector("#ent");
  let html = ``;
  for (let i = 0; i < services.length; i++) {
    let formation = services[i];
    const cheminOriginal = formation.photo;
    const cheminTransforme = cheminOriginal.replace("./servicesPhoto", `${API_LINK}/services/servicesPhoto`);
    html += `        <div class="col-span-1 flex items-center justify-center p-4 link-box">
                            <a target="_blank" href="${formation.lien}">
                                <img src="${cheminTransforme}" alt="Logo ${formation.nom}">
                            </a>
                        </div>`;
  }
  table.innerHTML += html;
}
main();
export {};
