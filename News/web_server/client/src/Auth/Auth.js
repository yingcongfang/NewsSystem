class Auth {
    /**
     * Authenticate a user. Save token string in localStorage
     * @param {string} token
     * @param {string} email
     */
    static authenticateUser(token, email) {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    }

    /**
     * Check if a user is Authenticated, aka, if a token is saved in localStorage
     * @returns {boolean}
     */
    static isUserAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    /**
     * Deauthenticate a user. Remove token and email from localStorage
     */
    static deauthenticateUser() {
        let token = localStorage.getItem('token')
        console.log(token)
        localStorage.removeItem('token');
        localStorage.removeItem('email');
    }

    /**
     * Get a token value
     * 
     * @returns {string}
     */
    static getToken() {
        console.log(localStorage.getItem('token'));
        return localStorage.getItem('token');
    }

    /**
     * Get email
     * 
     * @returns {string}
     */
    static getEmail() {
        return localStorage.getItem('email');
    }
}

export default Auth;