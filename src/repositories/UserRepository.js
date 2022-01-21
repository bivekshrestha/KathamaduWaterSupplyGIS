const resource = '/users';

export default axios => ({
    get() {
        return axios.get(`${resource}/`);
    },
    create(payload) {
        return axios.post(`${resource}/`, payload);
    },
    show(id) {
        return axios.get(`${resource}/${id}/`);
    },
    update(payload, id) {
        return axios.put(`${resource}/${id}/`, payload);
    },
    edit(payload, id) {
        return axios.patch(`${resource}/${id}/`, payload);
    },
    delete(id) {
        return axios.delete(`${resource}/${id}/`)
    }
});