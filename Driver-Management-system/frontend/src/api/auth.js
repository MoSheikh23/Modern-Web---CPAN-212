import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", 
});


export function loginUser(data) {
  return API.post("/users/login", data);
}

export function verifyOtp(data) {
  return API.post("/users/verify-otp", data);
}

export function registerUser(data) {
  return API.post("/users/register", data);
}

export default API;
