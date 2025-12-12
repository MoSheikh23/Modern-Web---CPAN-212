import client from "./client";

export function loginUser(data) {
  return client.post("/users/login", data);
}

export function verifyOtp(data) {
  return client.post("/users/verify-otp", data);
}

export function registerUser(data) {
  return client.post("/users/register", data);
}

