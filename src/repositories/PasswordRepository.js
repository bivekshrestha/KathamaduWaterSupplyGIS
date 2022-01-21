const resource = '/password_reset';

export default axios => ({
    request(payload) {
        return axios.post(`${resource}/`, payload);
    },
    confirm(payload) {
        return axios.post(`${resource}/confirm/`, payload);
    },
    validate(payload) {
        return axios.post(`${resource}/validate_token/`, payload);
    },
});