import client from "./client";

export async function listVehicles(params = {}) {
  const res = await client.get("/api/vehicles", { params });
  return res.data;
}

export async function getVehicle(id) {
  const res = await client.get(`/api/vehicles/${id}`);
  return res.data;
}

export async function createVehicle(data) {
  const res = await client.post("/api/vehicles", data);
  return res.data;
}

export async function updateVehicle(id, data) {
  const res = await client.put(`/api/vehicles/${id}`, data);
  return res.data;
}

export async function deleteVehicle(id) {
  const res = await client.delete(`/api/vehicles/${id}`);
  return res.data;
}
