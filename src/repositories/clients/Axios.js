import axios from "axios";

const baseDomain = "http://168.119.174.18:6060";
const baseURL = `${baseDomain}/apiv1`; // Incase of /api/v1;

const token = localStorage.getItem('userToken')

let headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

if (token) {
    headers.Authorization = `Token ${token}`
}

export default axios.create({
    baseURL,
    headers
});