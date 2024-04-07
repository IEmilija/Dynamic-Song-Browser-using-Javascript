import { Login } from "../classes/login-class.mjs";

export function checkForLoginUser() {
    if(!Login.isLoggedIn()) {
        location.href = 'http://localhost:5500/login/login.html';
    }
}

