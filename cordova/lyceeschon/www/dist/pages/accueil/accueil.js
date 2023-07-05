import axios from "../../../snowpack/pkg/axios.js";
import {API_LINK} from "../../GLOBAL.js";
const MOBILE_WIDTH = 700;
let formations = [];
let services = [];
async function main() {
  await axios.post(`${API_LINK}/formations/recup-formations.php`).then((res) => {
    formations = res.data.data;
  }).catch((res) => {
  });
  await axios.post(`${API_LINK}/services/recup-services.php`).then((res) => {
    services = res.data.data;
  }).catch((res) => {
  });
}
const _RecupActu = class {
  constructor() {
  }
  static async getActu() {
    let req = await axios.get(`${API_LINK}/toute-actualite/actualite-accueil.php`).then((res) => {
      _RecupActu.actualites = res.data.data;
    }).catch((e) => {
      if (e.response) {
        _RecupActu.error = String(e.response.data);
      } else {
        _RecupActu.error = "Une erreur s'est produite lors de la requête.";
      }
    });
  }
};
let RecupActu = _RecupActu;
RecupActu.actualites = [];
RecupActu.currentActu = 0;
RecupActu.error = ``;
class AccueilPc extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
<div id="brand" class="mt-2 flex w-full justify-center">
        <div id="brand-container-web" class="mt-10 flex w-full max-w-7xl flex-row justify-center">
        </div>
</div>

<div id="actu" class="mt-6 flex w-full flex-col items-center justify-center overflow-x-hidden">
    <div id="actu-container" class="flex justify-center w-screen overflow-x-hidden" style="height: 400px">
        ${this.actualiteCarroussel()}
    </div>

    <div id="actu-choice" class="mt-10 flex flex-row justify-between">
        <div id="actu-choice_1" class="mx-5 actu-choice_button active lg:mx-10"></div>
        <div id="actu-choice_2" class="mx-5 actu-choice_button lg:mx-10" ></div>
        <div id="actu-choice_3" class="mx-5 actu-choice_button lg:mx-10"></div>
        <div id="actu-choice_4" class="mx-5 actu-choice_button lg:mx-10"></div>
    </div>
</div>

<div id="formations" class="my-12 flex flex-row justify-center">
    <div id="formation-container" class="flex w-full flex-wrap gap-4 max-w-7xl flex-row justify-center px-5">
    </div>
</div>
`;
  }
  actualiteCarroussel() {
    if (RecupActu.error !== ``) {
      return `<p>Il y a eu une erreur lors de la récupération des articles. <br> Merci de recharger la page ou de contacter la vie scolaire.</p>`;
    }
    return `
        <div class="flex w-screen max-w-7xl flex-row justify-center px-5 uneActu ">
            <div id="actu-left_container" class="flex w-2/3 flex-col justify-between">
                <a id="actu-web-container_text" href="../actualite/actualite.html?link=${RecupActu.actualites[0].link}">
                    <div id="actu-left_text" class="mb-3" style="max-height: 300px;">
                        <h1 id="titleWeb" class="mb-4 text-5xl font-bold">${RecupActu.actualites[0].title}</h1>
                        <div class="text-lg" style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 7; -webkit-box-orient: vertical;">
                            <p id="corpsWeb" class="opacity-90">${RecupActu.actualites[0].corps}</p>
                        </div>
                    </div>
                </a>
                
                
                <div id="actu-left_button">
                        <a href="../toute-actualite/toute-actualite.html">
                   <button class="rounded-2xl px-4 py-1 font-bold text-white" style="background-color: #294ED0">Voir toutes les actus</button>
                        </a>
                </div>
            </div>
            <div id="actu-right_container" class="ml-5 w-1/3" style="height: 300px">
                <img id="actu-right_picture" src="${RecupActu.actualites[0].image}" alt="temp" class="w-full object-cover h-full imageWeb" style="max-height: 300px">
            </div>
        </div>`;
  }
}
class AccueilMobile extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
<div id="wrapper" class="flex w-full justify-center pb-4">
    <div id="mobile">

        <div id="brand" class="mt-2 flex w-full justify-center">
            </div>
            <div id="brand-container-mobile" class="mt-4 flex w-full max-w-7xl flex-row justify-center">
        </div>


        <div id="actu-mobile" class="mt-3 flex w-full justify-center">
            ${this.actualiteCarroussel()}
        </div>

        <div id="bouton-all-actu-mobile-container" class="mt-5 flex w-full justify-center">
            <a href="../toute-actualite/toute-actualite.html">
                <div id="bouton-all-actu-mobile" class="mx-3 flex w-auto justify-center rounded-3xl px-2" style="background-color: #294ED0; min-width: 180px">
                   <p class="m-2 text-center text-sm font-bold">Voir toutes les actualités</p>
                </div>
            </a> 
        </div>
        
        

        <div id="formation-mobile-container" class="mt-3 flex w-full flex-col items-center justify-center px-3">
        </div>
    </div>
</div>
`;
  }
  actualiteCarroussel() {
    if (RecupActu.error !== ``) {
      return `<p class="text-black">Il y a eu une erreur lors de la récupération des articles. <br> Merci de recharger la page ou de contacter la vie scolaire.</p>`;
    }
    return `
                    <div id="actu-mobile-container" class="imageMobile mx-3 w-full rounded-2xl bg-cover bg-no-repeat bg-center"  style="background-image: url('${RecupActu.actualites[0].image}')">
                        <div id="actu-mobile-container_shadow_wrapper" class="flex h-full flex-col items-start justify-end p-3">
                            <a id="actu-mobile-container_text" href="../actualite/actualite.html?link=${RecupActu.actualites[0].link}">
                                <h1 id="titleMobile" class="text-3xl font-bold">${RecupActu.actualites[0].title}</h1>
                                <p id="corpsMobile">${RecupActu.actualites[0].corps}</p>
                            </a>

                            <div id="actu-choice" class="mt-5 flex w-full flex-row justify-between">
                                <div id="actu-choice_1_mobile" class="actu-choice_button_mobile active"></div>
                                <div id="actu-choice_2_mobile" class="actu-choice_button_mobile"></div>
                                <div id="actu-choice_3_mobile" class="actu-choice_button_mobile"></div>
                                <div id="actu-choice_4_mobile" class="actu-choice_button_mobile"></div>
                            </div>
                        </div>
                    </div>
        `;
  }
}
class Accueil extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    let size = window.innerWidth;
    RecupActu.getActu().then(() => {
      main().then(() => {
        this.innerHTML = `
        <accueil-pc style="display: ${size < MOBILE_WIDTH ? "none" : "inherit"}" ></accueil-pc>
        <accueil-mobile style="display: ${size < MOBILE_WIDTH ? "inherit" : "none"}"></accueil-mobile>
        `;
        this.showServices();
        this.showFormation();
        this.windowResize();
        this.selectorCarroussel();
      });
    });
  }
  showServices() {
    let servicesContainerWeb = document.querySelector("#brand-container-web");
    let servicesContainerMobile = document.querySelector("#brand-container-mobile");
    let html = ``;
    let htmlMobile = ``;
    services.length = 5;
    services.forEach((service, index) => {
      const cheminOriginal = service.photo;
      const cheminTransforme = cheminOriginal.replace("./servicesPhoto", `${API_LINK}/services/servicesPhoto`);
      html += `
                     <div class="mx-5 w-1/6"><a class="w-auto flex" target="_blank" href="${service.lien}"><img class="h-20 w-auto object-contain" src="${cheminTransforme}" alt="logo ${service.nom}"></a></div>
            `;
      if (index < 2) {
        htmlMobile += `
                <div class="mx-3 w-1/2"><a class="w-auto flex" target="_blank" href="${service.lien}"><img class="h-20 w-auto object-contain" src="${cheminTransforme}" alt="logo ${service.nom}"></a></div>
            `;
      }
    });
    servicesContainerWeb.innerHTML = html;
    servicesContainerMobile.innerHTML = htmlMobile;
  }
  showFormation() {
    let formationContainer = document.querySelector("#formation-container");
    let formationMobile = document.querySelector("#formation-mobile-container");
    let html = ``;
    let htmlMobile = ``;
    formations.forEach((formation) => {
      const cheminOriginal = formation.piece_jointe;
      const cheminTransforme = cheminOriginal.replace("./formationsFlyer", `${API_LINK}/formations/formationsFlyer`);
      html += `
                        <a target="_blank" href="${cheminTransforme}" class="formationLink">
                            <div class="relative flex h-full flex-col justify-start font-bold formation-container_info">
                                <p class="z-10 mx-1 mb-3 flex flex-col items-center justify-end text-center text-xs formation-text lg:text-base 2xl:text-lg">${formation.nom}</p>
                                <div class="formation-effect"></div>
                            </div>
                        </a>
                `;
      htmlMobile += `
                            <a class="mt-3 flex w-full items-center justify-center text-center formation-mobile_item formationLink" href="${cheminTransforme}" target="_blank">
                                <div class="">
                                    <p class="font-semibold text-black">${formation.nom}</p>
                                </div>
                            </a>
                `;
    });
    formationContainer.innerHTML = html;
    formationMobile.innerHTML = htmlMobile;
  }
  windowResize() {
    this.accueilPerso = document.querySelector("accueil-perso");
    this.accueilMobile = document.querySelector("accueil-perso > accueil-mobile");
    this.accueilPc = document.querySelector("accueil-perso > accueil-pc");
    window.addEventListener("resize", () => {
      if (window.innerWidth < MOBILE_WIDTH) {
        this.accueilPc.style.display = "none";
        this.accueilMobile.style.display = "inherit";
      } else if (window.innerWidth >= MOBILE_WIDTH) {
        this.accueilPc.style.display = "inherit";
        this.accueilMobile.style.display = "none";
      }
    });
  }
  selectorCarroussel() {
    let titleWeb = document.querySelector("#titleWeb");
    let corpsWeb = document.querySelector("#corpsWeb");
    let imageWeb = document.querySelector(".imageWeb");
    let aWeb = document.querySelector("#actu-web-container_text");
    let titleMobile = document.querySelector("#titleMobile");
    let corpsMobile = document.querySelector("#corpsMobile");
    let imageMobile = document.querySelector(".imageMobile");
    let aMobile = document.querySelector("#actu-mobile-container_text");
    const choiceButtons = document.querySelectorAll(".actu-choice_button");
    const choiceButtonsMobile = document.querySelectorAll(".actu-choice_button_mobile");
    function updateContent(index) {
      const currentActu = RecupActu.actualites[index];
      titleWeb.innerText = currentActu.title;
      corpsWeb.innerText = currentActu.corps;
      imageWeb.src = currentActu.image;
      aWeb.href = `../actualite/actualite.html?link=${currentActu.link}`;
      titleMobile.innerText = currentActu.title;
      corpsMobile.innerText = currentActu.corps;
      imageMobile.style.backgroundImage = `url(${currentActu.image})`;
      aMobile.href = `../actualite/actualite.html?link=${currentActu.link}`;
    }
    choiceButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        if (RecupActu.error !== ``) {
          return;
        }
        if (index !== RecupActu.currentActu) {
          choiceButtonsMobile[RecupActu.currentActu].classList.remove("active");
          choiceButtons[RecupActu.currentActu].classList.remove("active");
          choiceButtonsMobile[index].classList.add("active");
          choiceButtons[index].classList.add("active");
          RecupActu.currentActu = index;
          updateContent(index);
        }
      });
    });
    choiceButtonsMobile.forEach((button, index) => {
      button.addEventListener("click", () => {
        if (RecupActu.error !== ``) {
          return;
        }
        if (index !== RecupActu.currentActu) {
          choiceButtonsMobile[RecupActu.currentActu].classList.remove("active");
          choiceButtons[RecupActu.currentActu].classList.remove("active");
          choiceButtonsMobile[index].classList.add("active");
          choiceButtons[index].classList.add("active");
          RecupActu.currentActu = index;
          updateContent(index);
        }
      });
    });
  }
}
customElements.define("accueil-pc", AccueilPc);
customElements.define("accueil-mobile", AccueilMobile);
customElements.define("accueil-perso", Accueil);
export {};
