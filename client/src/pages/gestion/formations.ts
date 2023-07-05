import axios from "axios";
import {API_LINK} from "../../GLOBAL";
interface Iformations  {
    nom: string,
    piece_jointe: string,
    id: string
}

function errorNom(isError : boolean) {
    if(isError){
    let error = <HTMLParagraphElement>document.querySelector("#erreur-nom")
    error.classList.remove("hidden")
    let success = <HTMLParagraphElement> document.querySelector("#success-send")
    success.classList.add("hidden")
    }else {
        let error = <HTMLParagraphElement>document.querySelector("#erreur-nom")
        error.classList.add("hidden")
        let success = <HTMLParagraphElement> document.querySelector("#success-send")
        success.classList.remove("hidden")
    }
}

function send() {
    let formData = new FormData();
    let fileInput = <HTMLInputElement>document.querySelector('#justificatif');
    if (fileInput.files) {
        formData.append('justificatif', fileInput.files[0]);
    }
    let file = formData.get("justificatif");
    let formData2 = new FormData();
    let nom = <HTMLInputElement>document.querySelector("#nom");

    if(!nom.value){
        errorNom(true)
        return
    }



    formData2.append('nom', nom.value);
    if (file !== null) {
        formData2.append('pieceJointe', file);
    }


    axios.post(`${API_LINK}/formations/formations.php`, formData2).then((res) => {
        errorNom(false)
        setTimeout(() => {
            window.location.reload();
        }, 500)
    }).catch((res) => {
        errorNom(true)
    })
}


let boutonSend = <HTMLButtonElement>document.querySelector("#btn-formation")

boutonSend.addEventListener("click", ()=> {
    send()
})

let formations : Iformations[] = []
async function main() {
    let token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../login/login.html";
    }
    axios.post(`${API_LINK}/formations/recup-formations.php`, {token}).then((res) => {
        formations = res.data.data;
        createTable(formations)
    }).catch((res) => {
    })
}

function createTable(formations: Iformations[]) {
    let table = <HTMLTableElement>document.querySelector("#table-info-admin");
    let html = ``;
    for (let i = 0; i < formations.length; i++) {
        let formation = formations[i];
        html += `<tr class="text-start text-lg ligne-info h-12 " id="${formation.id}" >
                <td>${formation.nom}</td>
                <td>
                ${(formation.piece_jointe) 
            ? `<button class="btn btn-primary underline-offset-1 underline" style="color: #2563eb" value="${formation.piece_jointe}">Télécharger</button>`
            : `<button class="btn-primary" disabled>Aucune</button>`}
                </td>
                <td class="flex justify-center"><img class="w-20 h-20 supprimer cursor-pointer" src="../../assets/icons/close-outline-red.png" alt="icone supprimer" ></td>
            </tr>`;
    }

    table.innerHTML += html;

    (table.querySelectorAll(".supprimer").forEach((icone) => {
icone.addEventListener("click", (e) => {
            let id = (e.target as HTMLImageElement).parentElement?.parentElement?.id;
            if (id) {
                deleteFormation(id);
            }
        })
    })
    );

    (table.querySelectorAll(".btn")).forEach((boutonCustom) => {
        boutonCustom.addEventListener("click",  (e) => {
            let lien_perso = (e.target as HTMLButtonElement).value;
            if (lien_perso) {
                telechargerFichier(lien_perso).then((res : any)=> {
                })
            }
        });
    });
}

async function telechargerFichier(lien: string) {
    try {
        const response = await axios.post(`${API_LINK}/formations/recup-file.php`, {lien}, {
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

function deleteFormation(id: string) {
    let token = localStorage.getItem("token");
    axios.post(`${API_LINK}/formations/supp-formations.php`, {id, token}).then((res) => {
        setTimeout(() => {
            window.location.reload();
        }, 500)
    }).catch((res) => {
    })
}

main()

export {};
