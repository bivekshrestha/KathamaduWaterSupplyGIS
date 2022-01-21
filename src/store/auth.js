const token = localStorage.getItem('userToken')
const tokenExpiry = localStorage.getItem('tokenExpiry')
const isStaff = localStorage.getItem('isStaff') === 'true'
const username = localStorage.getItem('username')
const email = localStorage.getItem('email')
const photo = localStorage.getItem('photo')

import Auth from "../repositories/clients/Auth";

export default {
    namespaced: true,
    name: "auth",
    state: {
        isLoggedIn: !!token,
        token: token,
        tokenExpiry: tokenExpiry,
        isStaff: isStaff,
        username: username,
        email: email,
        photo: photo,
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },
        UPDATE_LOGIN_STATUS(state, status) {
            state.isLoggedIn = status;
        },
        UPDATE_TOKEN_EXPIRY_TIME(state, time) {
            state.tokenExpiry = time;
        }
    },
    actions: {
        login({commit}, payload) {
            Auth.login(payload)
                .then(res => {
                    commit('SET_TOKEN', res.token);
                    commit('UPDATE_TOKEN_EXPIRY_TIME', res.expiry);
                    commit('UPDATE_LOGIN_STATUS', true);
                    localStorage.setItem('userToken', res.token);
                    localStorage.setItem('tokenExpiry', res.expiry);

                    Auth.userStatus(res.token)
                        .then(res => {
                            localStorage.setItem('isStaff', res.data[0].is_staff);
                            localStorage.setItem('username', res.data[0].username);
                            localStorage.setItem('email', res.data[0].email);
                            localStorage.setItem('photo', res.data[0].profile.photo);
                        })
                        .finally(() => {
                            window.location.reload();
                        })

                })
        },
        isTokenExpired({state}) {
            const now = new Date();
            const expiryTime = state.tokenExpiry ? new Date(state.tokenExpiry) : null;
            if (expiryTime && expiryTime < now) {
                localStorage.removeItem('userToken')
                localStorage.removeItem('tokenExpiry')
                localStorage.removeItem('username')
                localStorage.removeItem('email')
                localStorage.removeItem('isStaff')
                localStorage.removeItem('photo')
                return true;
            } else {
                return false;
            }
        },
        logout({commit}) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('tokenExpiry')
            localStorage.removeItem('username')
            localStorage.removeItem('email')
            localStorage.removeItem('isStaff')
            localStorage.removeItem('photo')
            commit('SET_TOKEN', null);
            commit('UPDATE_TOKEN_EXPIRY_TIME', null);
            commit('UPDATE_LOGIN_STATUS', null);

            window.location.reload();
        }
    }
}