export class Login {
    constructor(params) {
        this.username = params.username;
        this.id = params.id;
    }

    validate() {
        return !!this.username && !!this.id;
    }

    storeUser() {
        const userData = {
            username: this.username,
            id: this.id,
        };

        localStorage.setItem('user', JSON.stringify(userData));
    }

    static isLoggedIn() {
        return !!localStorage.getItem('user');
    }
}