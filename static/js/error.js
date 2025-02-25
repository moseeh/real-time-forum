import { logouterr } from "./api.js";

document.addEventListener("DOMContentLoad", async () => {
    const logoutbtn = document.getElementById("logout-btn")
    if (logoutbtn) {
        logoutbtn.addEventListener("click", logouterr);
    }
    console.log("logout")
});