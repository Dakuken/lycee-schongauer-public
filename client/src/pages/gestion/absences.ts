import {API_LINK} from "../../GLOBAL";
import axios from "axios";
let INDEX = 0;
let tableInfo = <HTMLTableElement>document.getElementById("tableInfo");
let token = localStorage.getItem("token");
if (!token) {
    window.location.href = "../login/login.html";
}

interface OneAbsence {
    nom: string,
    prenom: string,
    motif: string;
    date_debut: string;
    date_fin: string;
    heure_debut: string;
    heure_fin: string;
    lien: string;
}

class DataAbsences {
    absences: OneAbsence[] = [];

    constructor() {
    }

    async getAbsences() {
        token = <string>token;
        let config = {token, index_start : INDEX};
        await axios.post(`${API_LINK}/gestion/recup-absence.php`, config).then((res) => {
            this.absences = res.data.data;
            INDEX += 15;
        }).catch((err) => {
            window.location.href = "../login/login.html";
        });
    }

}

async function telechargerFichier(lien: string) {
    try {
        const response = await axios.post(`${API_LINK}/gestion/recup-file.php`, {lien}, {
            responseType: 'blob',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
        });
        const dispositionHeader = response.headers['content-disposition'];
        const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let fileName = dispositionHeader.split("filename=")[1];
        fileName = fileName.replaceAll(`"`, "");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
    }
}

function createTable(absences: OneAbsence[]) {
    let table = <HTMLTableElement>document.querySelector("#table-info");
    let html = ``;
    for (let i = 0; i < absences.length; i++) {
        let absence = absences[i];
        html += `<tr class="text-center text-lg ligne-info h-12 " >
                <td>${absence.nom}</td>
                <td>${absence.prenom}</td>
                <td>${absence.motif}</td>
                <td>${formatDate(absence.date_debut)} - ${formatHeure(absence.heure_debut)}</td>
                <td>${formatDate(absence.date_fin)} - ${formatHeure(absence.heure_fin)}</td>
                <td>
                ${(absence.lien) ? `<button class="btn btn-primary underline-offset-1 underline" style="color: #2563eb" value="${absence.lien}">Télécharger</button>` 
                                 : `<button class="btn-primary" disabled>Aucune</button>`}
                </td>
            </tr>`;
    }

    table.innerHTML += html;

    (table.querySelectorAll(".btn")).forEach((boutonCustom) => {
        boutonCustom.addEventListener("click",  (e) => {
            let lien_perso = (e.target as HTMLButtonElement).value;
            if (lien_perso) {
                telechargerFichier(lien_perso).then((res : any)=> {
                    console.log(res);
                })
            }
        });
    });
}
function formatHeure(heure: string): string {
    const [heureStr, minuteStr] = heure.split(':');
    const heureNum = parseInt(heureStr, 10);
    const minuteNum = parseInt(minuteStr, 10);

    const heureFormattee = heureNum >= 10 ? heureNum.toString() : `0${heureNum}`;
    const minuteFormattee = minuteNum >= 10 ? minuteNum.toString() : `0${minuteNum}`;

    return `${heureFormattee}h${minuteFormattee}`;
}

function formatDate(date : string) : string {
    const [annee, mois, jour] = date.split('-');
    return `${jour}-${mois}-${annee}`;

}


async function main() {


let data = new DataAbsences();
await data.getAbsences();
createTable(data.absences);

let btnMore = <HTMLButtonElement>document.getElementById("btn-more");
btnMore.addEventListener("click", async () => {
    await data.getAbsences();
    createTable(data.absences);
});
}

main()
export {};
