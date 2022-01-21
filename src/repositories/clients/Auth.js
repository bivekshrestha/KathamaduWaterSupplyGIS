import axios from 'axios';

const baseDomain = "http://168.119.174.18:6060";
const baseURL = `${baseDomain}/apiv1`; // Incase of /api/v1;

class AuthService {
    login(user) {
        return axios
            .post(baseURL + '/login/', {
                username: user.username,
                password: user.password
            })
            .then(this.handleResponse)
            .then(response => {
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    userStatus(token) {
        return axios.post(baseURL + '/userstatus/', {}, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
    }

    register(user) {
        return axios.post(baseURL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }

    handleResponse(response) {
        if (response.status === 401) {
            this.logout();
            location.reload(true);

            const error = response.data && response.data.message;
            return Promise.reject(error);
        }

        return Promise.resolve(response);
    }
}

export default new AuthService();
