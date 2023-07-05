function deleteToken() {
  localStorage.removeItem("token");
  let token = localStorage.getItem("token");
  if (!token) {
    let deco = document.querySelector("#deco");
    deco.innerHTML = `<h1 class="text-2xl font-bold">Vous avez été déconnecté</h1>`;
    setTimeout(() => {
      window.location.href = "../accueil/accueil.html";
    }, 2e3);
  }
}
deleteToken();
export {};
