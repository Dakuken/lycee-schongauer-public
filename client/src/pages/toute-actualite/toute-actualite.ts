import axios from "axios";
import {API_LINK} from "../../GLOBAL";

const MOBILE_WIDTH = 700;

interface Article {
    title: string,
    link: string,
    description: string,
    creator: string,
    date: string,
    img: string
}

class DataXMLFromMBN {
    static displayArticle: Article[] = [];
    static allArticle: Article[] = [];

    static hasError: boolean = false;
    static errorMessage = "";

    constructor() {
    }

    getActualite(): Promise<void> {
        let self = this;
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const xml = xhr.responseXML;
                        // @ts-ignore
                        const items = xml.getElementsByTagName('item');

                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            const tempArticles: Article = {
                                img: '',
                                creator: '',
                                link: '',
                                date: '',
                                description: '',
                                title: '',
                            };
                            tempArticles.title = item.getElementsByTagName('title')[0].textContent!;
                            tempArticles.link = item.getElementsByTagName('link')[0].textContent!;
                            tempArticles.description = item.getElementsByTagName('description')[0].textContent!;
                            tempArticles.creator = self.capitalizeWords(item.getElementsByTagName('dc:creator')[0].textContent!);
                            tempArticles.date = self.formatDate(item.getElementsByTagName('dc:date')[0].textContent!);

                            DataXMLFromMBN.allArticle.push(tempArticles);
                        }

                        resolve();
                    }
                }
            };

            xhr.onerror = () => {
                DataXMLFromMBN.errorMessage = `
                Erreur lors de la requête. Code d'erreur : ${xhr.status} 
                <br>
                Merci de contacter l'établissement : {mettre mail de la vie scorlaire}`;


                // TODO Mettre mail de la vie scolaire
                DataXMLFromMBN.hasError = true;
                resolve();
            };

            xhr.open('GET', `${API_LINK}/toute-actualite/actualite.php`, true);
            xhr.send();
        });
    }

    async get5Actu(): Promise<void> {
        return new Promise(async (resolve) => {
            let nbArticle = DataXMLFromMBN.displayArticle.length;
            let tempArticle = DataXMLFromMBN.allArticle.slice(nbArticle, nbArticle + 5);
            for (let i = 0; i < tempArticle.length; i++) {
                await axios.get(`${API_LINK}toute-actualite/image-actualite.php?url=${tempArticle[i].link}`,).then((res) => {
                    tempArticle[i].img = res.data.message;
                });
            }

            DataXMLFromMBN.displayArticle.push(...tempArticle);
            resolve();
        });
    }

    capitalizeWords(input: string): string {
        const words = input.split(' ');

        const capitalizedWords = words.map((word) => {
            const firstLetter = word.charAt(0).toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return firstLetter + restOfWord;
        });

        return capitalizedWords.join(' ');
    }

    formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }
}

class ActualiteWeb extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        this.innerHTML = `
        <div id="actualite-wrapper" class="flex w-full justify-center pb-4">
            <div id="actualite-container" class="mx-10 flex flex-col items-start justify-start pt-10">
                ${this.createActuWeb()}
            </div>
        </div>
        `;
    }

    createActuWeb(): string {
        let final = "";

        if (DataXMLFromMBN.hasError) {
            return `<p> ${DataXMLFromMBN.errorMessage}</p>`;
        }


        DataXMLFromMBN.displayArticle.forEach(article => {
            const data = {link: article.link};
            const queryParams = new URLSearchParams(data);
            let link = `../actualite/actualite.html?${queryParams}`;
            let aWeb = `
                <a class="w-full" href="${link}">
                   <div class="mb-10 flex w-full flex-col justify-center pb-10 actualite">
                        <div class="flex max-w-7xl flex-col w-full" style="max-height: 200px; overflow-y: hidden">
                            <p class="w-auto opacity-80">${article.creator} - <span class="opacity-100" style="color: #294ED0">${article.date}</span></p>
                            <div class="flex justify-between">
                                <div>
                                    <h3 class="mb-4 text-3xl font-bold md:text-4xl">${article.title}</h3>
                                    <div class="wrapper-text-actu" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical;">
                                        <p class="text-xl">
                                            ${article.description}
                                        </p>
                                    </div>
                                </div>
                                <img class="ml-5 object-cover" src="${article.img}" alt="image de l'article" style="max-height: 200px">
                            </div>
                        </div>
                   </div>
                </a>
                `;
            final += aWeb;
        });


        return final;
    }
}

class ActualiteMobile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="actualite-wrapper" class="flex w-full justify-center pb-4">
            <div id="actualite-container" class="mx-10 flex flex-col items-start justify-start pt-5">
                ${this.createActuMobile()}
            </div>
        </div>
        `;
    }

    createActuMobile(): string {
        let final = "";
        if (DataXMLFromMBN.hasError) {

            return `<p> ${DataXMLFromMBN.errorMessage}</p>`;
        }

        DataXMLFromMBN.displayArticle.forEach(article => {
            const data = {link: article.link};
            const queryParams = new URLSearchParams(data);
            let link =`../actualite/actualite.html?${queryParams}`;

            let aMobile = `
                <a class="w-full mt-5" href="${link}">
                   <div class="flex w-full justify-center actu-mobile" style="max-width: 600px; min-height: 250px">
                        <div class="mx-3 w-full rounded-2xl bg-auto actu-mobile-container" style="background-image: url('${article.img}'); background-position: center center;">
                            <div class="flex h-full flex-col items-start justify-end rounded-2xl p-3 actu-mobile-container_shadow_wrapper">
                                <h1 class="mt-10 text-3xl font-bold text-white">${article.title}</h1>
                                <div class="wrapper-text-actu" style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                    <p class="text-lg text-white">${article.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>            
                </a>`;
            final += aMobile;
        });


        return final;
    }


}

class TouteActualite extends HTMLElement {

    actualitePerso!: TouteActualite;
    actualiteMobile!: ActualiteMobile;
    actualitePc!: ActualiteWeb;

    dataXML: DataXMLFromMBN = new DataXMLFromMBN();

    constructor() {
        super();
    }

    connectedCallback() {
        let size = window.innerWidth;

        const dataXML = new DataXMLFromMBN();
        dataXML.getActualite()
            .then(() => {
                this.innerHTML = `
                    <div class="w-full flex justify-center py-10">
                        <div role="status">
                            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                `;
                dataXML.get5Actu()
                    .then(() => {
                        this.innerHTML = `
                        <actualite-pc style="display: ${size < MOBILE_WIDTH ? "none" : "inherit"}"> </actualite-pc>
                        <actualite-mobile style="display: ${size < MOBILE_WIDTH ? "inherit" : "none"}"></actualite-mobile>
                    `;
                        this.windowResize();
                    });
            });
        let boutonLoad = <HTMLDivElement>document.querySelector('#bouton-load-actu');
        boutonLoad.addEventListener("click", () => {

            this.innerHTML += `
                    <div class="w-full flex justify-center py-10">
                        <div role="status">
                            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
            `;
            dataXML.get5Actu().then(() => {
                this.innerHTML = `
                        <actualite-pc style="display: ${size < MOBILE_WIDTH ? "none" : "inherit"}"> </actualite-pc>
                        <actualite-mobile style="display: ${size < MOBILE_WIDTH ? "inherit" : "none"}"></actualite-mobile>
                `;
            });
        });
    }

    get5Actu() {


    }

    windowResize() {
        this.actualitePerso = <TouteActualite>document.querySelector("actualite-perso");
        this.actualiteMobile = <ActualiteMobile>document.querySelector("actualite-perso > actualite-mobile");
        this.actualitePc = <ActualiteWeb>document.querySelector("actualite-perso > actualite-pc");
        window.addEventListener("resize", () => {
            if (window.innerWidth < MOBILE_WIDTH) {
                this.actualitePc.style.display = "none";
                this.actualiteMobile.style.display = "inherit";
            } else if (window.innerWidth >= MOBILE_WIDTH) {
                this.actualitePc.style.display = "inherit";
                this.actualiteMobile.style.display = "none";
            }
        });

    }
}


customElements.define("actualite-pc", ActualiteWeb);
customElements.define("actualite-mobile", ActualiteMobile);
customElements.define("actualite-perso", TouteActualite);

export {};