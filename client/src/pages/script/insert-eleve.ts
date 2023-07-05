import bcrypt from "bcryptjs";
import axios from "axios";
import {API_LINK} from "../../GLOBAL";

let Users: User[] = [];



interface User {
    login: string;
    password: string;
    nom: string;
    prenom: string;
    email: string;
}


const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log(Users);

for (let i = 0; i < Users.length; i++) {
    let data = Users[i]

    await axios.post(`${API_LINK}client/register-client.php`, data, config).then((res) => {
        console.log(res.data);
    }).catch((res) => {
        console.log(res);
    });
}


export {};