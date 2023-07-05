import axios from "axios";
import {API_LINK} from "../../GLOBAL";

const MOBILE_WIDTH = 700;

class DataOneActu {
    static link: string;
    static title: string;
    static infoPublication: string;
    static bandeau: string;
    static contenue: string;


    constructor() {
    }

    static setLink() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('link'));
        DataOneActu.link = urlParams.get('link') ?? '';
    }
    static async getData() {
        await axios.post(`${API_LINK}/toute-actualite/one-actualite.php?url=${DataOneActu.link}`).then((res) => {
            let data = res.data.data;
            DataOneActu.title = data.title;
            DataOneActu.infoPublication = data.infoPublication;
            DataOneActu.bandeau = data.bandeau;
            DataOneActu.contenue = data.contenue;
        }).catch((err) => {
            console.log(err);
        });
    }
}


class OneActuWeb extends HTMLElement {
    constructor() {
        super();
    }
}


class OneActuMobile extends HTMLElement {
    constructor() {
        super();
    }
}


class OneActu extends HTMLElement {


    constructor() {
        super();
    }

    connectedCallback() {
        DataOneActu.setLink();
        DataOneActu.getData().then(() => {
            this.innerHTML = `
                <div class="mt-10 flex w-full flex-col items-center justify-center px-5 sm:px-10" id="actu-container">
                    <div class="w-full max-w-7xl deco-pc"></div>
                    <div class="mt-5 flex w-full max-w-7xl flex-col justify-start" id="actu-wrapper">
                        <div class="mb-5 title">
                            <h1 class="text-5xl font-bold">${this.titleFormating()}</h1>
                        </div>
                        <div class="mb-7 info">
                            ${this.infoFormating()}
                        </div>
                        
                        <div class="flex flex-col-reverse content sm:flex-row">
                        
                            <div class="w-full sm:w-1/2">
                                <div class="text-lg corps">
                                    ${this.contenueFormating()}
                                </div>   
                            </div>
                            
                            <div class="sm:ml-4 w-full sm:w-1/2">
                                ${this.bandeauFormating()}
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    }

    formating() {
        let infoFormatted = this.infoFormating();
    }

    infoFormating() {
        let info = DataOneActu.infoPublication;
        console.log(DataOneActu.infoPublication);
        let tempTab = info.split(",");
        let span = "<span style='color: #294ED0'>";
        let spanClose = "</span>";
        return [tempTab[0], span, tempTab[1], spanClose].join('');
    }

    bandeauFormating() {
        let info = DataOneActu.bandeau;
        return info;
    }

    titleFormating() {
        let info = DataOneActu.title;
        return info;
    }

    contenueFormating() {
        let info = DataOneActu.contenue;
        return info;
    }
}


customElements.define("actu-pc", OneActuWeb);
customElements.define("actu-mobile", OneActuMobile);
customElements.define("actu-perso", OneActu);



export {};