import 'hammerjs';
import axios from "axios";
import {API_LINK} from "../../GLOBAL";

const COLORS = "#294ED0";
const BACKGROUND = "#F9FAFB";
const MOBILE_WIDTH = 700;

class UserData {
    static nom: string = "";
    static prenom: string = "";
    static email: string = "";
    static isAdmin: boolean = false;

    constructor() {

    }

    async getData(): Promise<void> {
        return new Promise(async (res, rej) => {
            let token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_LINK}/client/info-client.php`, {token}).then((response) => {
                    let data = response.data.data;
                    UserData.nom = data.nom;
                    UserData.prenom = data.prenom;
                    UserData.email = data.email;
                    if (data.est_admin === 1) {
                        UserData.isAdmin = true;
                    }
                    res();

                }).catch((response) => {
                    console.log(response.response.data.success === false && response.response.data.message === "Token invalide");
                    console.log(response.response.data.message, response.response.data.success);
                    if (response.response.data.success === false && response.response.data.message === "Token invalide") {
                        localStorage.removeItem('token');
                        window.location.href = "../login/login.html";
                    }
                })
            }
            res();
        });
    }

}

class NavBarWeb extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `    
             <nav class="flex w-full items-center justify-between p-3 navbar sm:relative" style="height: 60px; background-color: ${BACKGROUND}; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
                <div class="sm:w-1/3">
                    <a href="../accueil/accueil.html">                
                        <img src="../../assets/logo.png" style="max-height: 50px" alt="logo du lycée Schongauer">
                    </a>
                </div>
                <div class="flex items-center">
                    <div class="mx-4 flex items-center justify-center p-4" style="height: 60px; background-color: ${COLORS}">
                        <a href="../ent/ent.html"><p class="font-bold text-white" >ENT</p></a>
                    </div>
                    ${this.gestionOrVieScolaire()}
                <div class="relative">
                
                <div id="infoBox">
                    <img src="../../assets/icons/person-outline.svg" type="image/svg+xml" style="max-height: 50px; width: 50px; fill: blue" class="icon-person"  alt="icon login/ info">
                </div>
            </nav>
        `;

        this.loginOrBoxInfo();
    }

    gestionOrVieScolaire() {
        if (UserData.isAdmin) {
            return ` <a href="../gestion/gestion.html"><p class="text-black underline underline-offset-4" style="text-decoration-color: rgba(0,0,0,0.5)">Gestion</p></a>`;
        } else {
            return ` <a href="../contact-vie-scolaire/contact-vie-scolaire.html"><p class="text-black underline underline-offset-4" style="text-decoration-color: rgba(0,0,0,0.5)">Vie scolaire</p></a>`;
        }
    }

    loginOrBoxInfo() {
        let infoBox = <HTMLDivElement>document.querySelector('#infoBox');
        let token = localStorage.getItem('token');
        infoBox.addEventListener('click', () => {
            if (token) {
                if (infoBox.children.length > 1) {
                    infoBox.removeChild(infoBox.children[1]);
                } else {
                    let info = <InfoPersoPC>document.createElement('info-perso');
                    info.setAttribute("nom", UserData.nom);
                    info.setAttribute("prenom", UserData.prenom);
                    info.setAttribute("email", UserData.email);
                    infoBox.appendChild(info);
                }
            } else {
                window.location.href = "../login/login.html";
            }
        });
    }
}

class NavBarMobile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `    
                <nav class="sticky top-0 w-full px-2 navbar" style="height: 60px; box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0; background-color: ${BACKGROUND}">   
                    <div class="flex w-full items-center justify-between navbar" style="height: 60px">                
                        <div class="sm:w-1/3">
                            <a href="../accueil/accueil.html">       
                                <img src="../../assets/logo.png" style="max-height: 50px" alt="logo du lycée Schongauer">
                            </a>
                        </div>
                        
                        <div class="relative ml-4 flex items-center" id="icon-menu-container">
                            <div class="icon-menu-wrapper">
                                <img src="../../assets/icons/menu-outline.svg" alt="icon menu" style="max-height: 50px; width: 50px;" class="icon-menu">
                            </div>        
                        </div>
                     </div>
                </nav>
                
                <div id="mobile-menu-wrapper" class="absolute top-0 h-screen w-full flex flex-row-reverse" style=" display: none; top:0; z-index: 50">
                 
                     <div id="menu-mobile" class="flex flex-col justify-start rounded-l-2xl fixed top-0 right-0 h-screen " style="background-color: ${BACKGROUND};  transition: transform 0.2s; ;transform: translate(300px); width: 300px;border: 1px solid rgba(0,0,0,0.2);">
                        <div class="mt-1 mr-1 flex justify-end icon-menu-wrapper">
                            <img src="../../assets/icons/close-outline.svg" alt="icon menu" style="max-height: 50px; width: 50px;" class="icon-menu">
                        </div> 
                        <div class="mt-20 flex flex-col items-start justify-center">
                         ${this.connected()}
                            
                            
                            <div class="mt-2 w-full p-4 text-xl font-bold" style="background-color: ${COLORS}">
                                <p> <a href="../ent/ent.html" class="text-white">ENT</a></p>
                            </div>
                             ${this.gestionOrVieScolaire()}
                        </div>
                     </div>
                 </div>
        `;


        let mobileMenuWrapper = <HTMLDivElement>document.querySelector('#mobile-menu-wrapper');
        mobileMenuWrapper.addEventListener('click', (event) => {
            let a = event.target as HTMLDivElement;
            if (a.id === "mobile-menu-wrapper") {
                if (menu.classList.contains("isOpen")) {
                    menu.classList.remove("isOpen");
                    menu.style.transform = "translate(400px,0px)";
                    setTimeout(() => {
                        mobileMenuWrapper.style.display = "none";
                    }, 100);
                }
            }

        });

        let iconMenu = document.querySelectorAll('.icon-menu-wrapper');
        let menu = <HTMLDivElement>document.getElementById('menu-mobile');
        iconMenu.forEach((element) => {

            element.addEventListener('click', () => {
                if (menu.classList.contains("isOpen")) {
                    menu.classList.remove("isOpen");
                    menu.style.transform = "translate(200px,0px)";

                    setTimeout(() => {
                        mobileMenuWrapper.style.display = "none";
                    }, 100);
                } else {
                    mobileMenuWrapper.style.display = "flex";
                    setTimeout(() => {
                        menu.classList.add("isOpen");
                        menu.style.transform = "translate(0px,0px)";
                    }, 10);
                }

            });

        });

        const body = <HTMLBodyElement>document.querySelector("body");

        const hammer = new Hammer(body);
        hammer.on("swipeleft", () => {
            if (!menu.classList.contains("isOpen")) {
                mobileMenuWrapper.style.display = "inherit";
                menu.classList.add("isOpen");
                setTimeout(() => {
                    menu.style.transform = "translate(0px,0px)";
                }, 10);
            }
        });

        const hammer2 = new Hammer(mobileMenuWrapper);
        hammer2.on("swiperight", () => {
            if (menu.classList.contains("isOpen")) {
                menu.classList.remove("isOpen");
                menu.style.transform = "translate(200px,0px)";
                setTimeout(() => {
                    mobileMenuWrapper.style.display = "none";
                }, 100);
            }
        });
    }

    connected() {
        let token = localStorage.getItem("token");
        if (token) {
            return `<div class="mt-2 flex flex-col items-start justify-center">
                        <p class="mx-4 mt-2 text-xl text-black">Bonjour !<br> Burnel Justin</p>
                        <p class="mx-4 mt-2 text-xl text-black">justin.burnel@gmail.com</p>
                        
                        <a href="../deconnexion/deconnexion.html"><p class="mx-4 mt-2 text-xl text-black underline decoration-1 underline-offset-4 under">Déconnexion</p></a>
                    </div>`;
        } else {
            return ` <a href="../login/login.html">
                    <div class="flex flex-row items-center">
                        <img src="../../assets/icons/person-outline.svg" type="image/svg+xml" class="icon-person" style="max-height: 50px; width: 50px; filter: chroma(${COLORS})"  alt="logo profil">
                        <p class="text-black underline underline-offset-4">Connexion</p>
                    </div>
                 </a>`;
        }
    }

    gestionOrVieScolaire() {
        if (UserData.isAdmin) {
            return ` <a href="../gestion/gestion.html"><p class="mx-4 mt-2 text-xl text-black underline decoration-1 underline-offset-4 under">Gestion</p></a>`;
        } else {
            return `<a href="../contact-vie-scolaire/contact-vie-scolaire.html"><p class="mx-4 mt-2 text-xl text-black underline decoration-1 underline-offset-4 under">Vie scolaire</p></a>`;
        }
    }



}

export class NavBar extends HTMLElement {

    navbarPerso!: NavBar;
    navbarMobile!: NavBarMobile;
    navbarPc!: NavBarWeb;

    constructor() {
        super();
    }


    connectedCallback() {
        let size = window.innerWidth;
        myData.getData().then(() => {
            this.innerHTML = `
                <navbar-pc style="display: ${size < MOBILE_WIDTH ? "none" : "inherit"}" ></navbar-pc>
                <navbar-mobile class="w-full flex justify-end flex-col"  style="display: ${size < MOBILE_WIDTH ? "flex" : "none"}"></navbar-mobile>
                `;

            this.windowResize();

        });
    }

    windowResize() {
        this.navbarPerso = <NavBar>document.querySelector("navbar-perso");
        this.navbarMobile = <NavBarMobile>document.querySelector("navbar-perso > navbar-mobile");
        this.navbarPc = <NavBarWeb>document.querySelector("navbar-perso > navbar-pc");
        window.addEventListener("resize", () => {
            if (window.innerWidth < MOBILE_WIDTH) {
                this.navbarPc.style.display = "none";
                this.navbarMobile.style.display = "inherit";
            } else if (window.innerWidth >= MOBILE_WIDTH) {
                this.navbarPc.style.display = "inherit";
                this.navbarMobile.style.display = "none";
            }
        });

    }
}


class InfoPersoPC extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {


        this.innerHTML = `
        <div style="z-index: 90" class="w-screen h-screen fixed left-0 top-0" id="pouet">
            <div class="absolute top-16 right-2 border border-gray-400 rounded-2xl px-2 py-1" style="z-index: 200; background-color: #FFFFFF; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;">
                <p class="ml-3 text-black">${this.getAttribute("prenom")}</p>
                <p class="ml-3 text-black">${this.getAttribute("nom")}</p>
                <p class="ml-3 text-black">${this.getAttribute("email")}</p>
                
                <div class="flex flex-row items-center ml-1.5 mt-0.5">
                    <img class="w-8 h-8" src="../../assets/icons/log-out-outline.svg" alt="Icone de déconnexion">
                    <a class="text-black " href="../deconnexion/deconnexion.html">deconnexion</a>
                </div>
            </div>
        </div>
        `;

    }
}

let myData = new UserData();
customElements.define("navbar-pc", NavBarWeb);
customElements.define("navbar-mobile", NavBarMobile);
customElements.define("navbar-perso", NavBar);
customElements.define("info-perso", InfoPersoPC);

export {};
