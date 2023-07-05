import axios from "../../../snowpack/pkg/axios.js";
import {API_LINK} from "../../GLOBAL.js";
let Users = [];
const config = {
  headers: {
    "Content-Type": "application/json"
  }
};
console.log(Users);
for (let i = 0; i < Users.length; i++) {
  let data = Users[i];
  await axios.post(`${API_LINK}client/register-client.php`, data, config).then((res) => {
    console.log(res.data);
  }).catch((res) => {
    console.log(res);
  });
}
export {};
