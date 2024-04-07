import { Login } from "../../classes/login-class.mjs";

const getUsersURL = 'https://65904a96cbf74b575ecaaf60.mockapi.io';

async function getAllUsers() {
    const response = await fetch(`${getUsersURL}/users`);
    return await response.json();
}

function getRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber) + 1;
}

async function getSpecificUser(data) {
    const randomIndex = getRandomNumber(data.length);
    const specificUser = data[randomIndex - 1];
    const response = await fetch(`${getUsersURL}/users/${specificUser.id}`);
    return {
        username: specificUser.username,
        id: specificUser.id,
    };
}

async function login() {
    const errorMsgEl = document.getElementById('errorMsg');
    errorMsgEl.style.display = 'none';

    const usernameInput = document.getElementById('usernameInput').value;
    const passwordInput = document.getElementById('passwordInput').value;


    if (!usernameInput || !passwordInput) {
        errorMsgEl.style.display = 'block';
    } else {
        const userData = await getAllUsers();
        const specificUser = await getSpecificUser(userData);
        const User = new Login(specificUser);
        const isValid = User.validate();
        User.storeUser();
        location.href = '../my-playlist/my-playlist.html';
    }
}

document.getElementById('logInBtn').onclick = () => login();

let innerCard = document.getElementById('innerCard');
let signUpBtn = document.getElementById('signUpBtn');

signUpBtn.style.visibility = 'visible';

signUpBtn.addEventListener('click', function () {
    innerCard.classList.toggle('do-flip');
});