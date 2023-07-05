import {API_LINK} from "../../GLOBAL.js";
import axios from "../../../snowpack/pkg/axios.js";
let INDEX = 0;
let token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../login/login.html";
}
class DataRetards {
  constructor() {
    this.retards = [];
  }
  async getRetards() {
    token = token;
    let config = {token, index_start: INDEX};
    await axios.post(`${API_LINK}/gestion/recup-retard.php`, config).then((res) => {
      this.retards = res.data.data;
      INDEX += 15;
    }).catch((err) => {
      //!TODO voir le message d'erreur et soit rediriger soit affiché l'erreur au client
      window.location.href = "../login/login.html";
    });
  }
}
function formatDate(dateStr) {
  const [datePart, heurePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-");
  const [heure, minute, seconde] = heurePart.split(":");
  return `le ${day}-${month}-${year} à ${heure}h${minute}`;
}
function createTable(retards) {
  let table = document.querySelector("#table-info");
  let html = ``;
  for (let i = 0; i < retards.length; i++) {
    let retard = retards[i];
    html += `<tr class="text-center text-lg ligne-info h-12 " >
                <td>${retard.nom}</td>
                <td>${retard.prenom}</td>
                <td>${retard.motif}</td>
                <td>${formatDate(retard.date_retard)}</td>
                <td>${retard.minutes_retard} minutes</td>
            </tr>`;
  }
  table.innerHTML += html;
}
async function main() {
  let data = new DataRetards();
  await data.getRetards();
  createTable(data.retards);
  let btnMore = document.getElementById("btn-more");
  btnMore.addEventListener("click", async () => {
    await data.getRetards();
    createTable(data.retards);
  });
}
main();
export {};
