export async function signUp() {
    const signUpErrorMsgEl = document.getElementById('signUpErrorMsg');
    signUpErrorMsgEl.style.display = 'none';

    const signUpForm = document.getElementById('signUpForm');
    const loginForm = document.getElementById('logInForm');
    const signUpSuccessMsg = document.getElementById('signUpSuccessMsg');

    const signUpFormData = new FormData(signUpForm);

    const signUpUser = {
        fullName: signUpFormData.get('fullName'),
        username: signUpFormData.get('username'),
        signInPassword: signUpFormData.get('signInPassword'),
        confirmPassword: signUpFormData.get('confirmPassword'),
    };

    if (!validateSignUp(signUpUser)) {
        signUpErrorMsgEl.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('https://65904a96cbf74b575ecaaf60.mockapi.io/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signUpUser),
        });

        if (!response.ok) {
            throw new Error('Failed to store user on the server.');
        }

        innerCard.classList.toggle('do-flip');
        signUpSuccessMsg.style.display = 'block';
    } catch (error) {
        console.error('Error during sign up:', error.message);
        signUpErrorMsgEl.style.display = 'block';
    }
}

function validateSignUp(signUpUser) {
    return (
        isValidName(signUpUser.fullName) &&
        isValidUsername(signUpUser.username) &&
        isValidPassword(signUpUser.signInPassword) &&
        signUpUser.signInPassword === signUpUser.confirmPassword
    );
}

function isValidName(name) {
    const isValid = name.trim() !== '';
    const errorMsgEl = document.getElementById('fullNameErrorMsg');

    if (!isValid) {
        errorMsgEl.style.display = 'block';
    } else {
        errorMsgEl.style.display = 'none';
    }

    return isValid;
}

function isValidUsername(username) {
    const errorMsgEl = document.getElementById('usernameErrorMsg');
    const specialCharactersAndNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    const isValid = !specialCharactersAndNumbers.some(character => username.includes(character));

    if (!isValid) {
        errorMsgEl.style.display = 'block';
    } else {
        errorMsgEl.style.display = 'none';
    }

    return isValid;
}
// function isValidUsername(username) {
//     const errorMsgEl = document.getElementById('usernameErrorMsg');

//     const hasSpecialChar = hasSpecialCharacter(username);
//     const hasNumber = hasNumbers(username);

//     const isValid = hasSpecialChar && hasNumber;

//     if (!isValid) {
//         errorMsgEl.style.display = 'block';
//     } else {
//         errorMsgEl.style.display = 'none';
//     }

//     return isValid;
// }

function isValidPassword(password) {
    const errorMsgEl = document.getElementById('passwordErrorMsg');

    const hasLowerLetter = hasLowerCase(password);
    const hasUpperLetter = hasUpperCase(password);
    const hasSpecialChar = hasSpecialCharacter(password);

    const isValid = password.length >= 10 && hasUpperLetter && hasLowerLetter && hasSpecialChar;

    if (!isValid) {
        errorMsgEl.style.display = 'block';
    } else {
        errorMsgEl.style.display = 'none';
    }

    return isValid;
}

function hasUpperCase(str) {
    return str.split('').some(char => {
        const charCode = char.charCodeAt(0);
        return charCode >= 65 && charCode <= 90;
    });
}

function hasLowerCase(str) {
    return str.split('').some(char => {
        const charCode = char.charCodeAt(0);
        return charCode >= 97 && charCode <= 122;
    });
}

function hasSpecialCharacter(str) {
    return str.split('').some(char => {
        const charCode = char.charCodeAt(0);
        return charCode >= 33 && charCode <= 47;
    });
}

function hasNumbers(str) {
    return str.split('').some(char => {
        const charCode = char.charCodeAt(0);
        return charCode >= 49 && charCode <= 57;
    });
}

document.getElementById('signInBtn').onclick = () => signUp();

let innerCard = document.getElementById('innerCard');
let loginBtn = document.getElementById('LoginBtn');
loginBtn.style.visibility = 'visible';
loginBtn.addEventListener('click', function () {
    innerCard.classList.toggle('do-flip');
});

