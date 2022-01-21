const loginURL = '/login/';
const registerURL = '/register/';
const logoutURL = '/logout/';

export default axios => ({
    login() {
        return axios.post(loginURL);
    },
    logout() {
        return axios.post(logoutURL);
    },
    register(payload) {
        return axios.post(registerURL, payload);
    },
});