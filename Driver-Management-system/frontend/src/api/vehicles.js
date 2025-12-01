import client from "./client";

export async function listVehicles(params = {}) {
  const res = await client.get("/vehicles", { params });
  return res.data;
}

export async function getVehicle(id) {
  const res = await client.get(`/vehicles/${id}`);
  return res.data;
}

export async function createVehicle(data) {
  const res = await client.post("/vehicles", data);
  return res.data;
}

export async function updateVehicle(id, data) {
  const res = await client.put(`/vehicles/${id}`, data);
  return res.data;
}

export async function deleteVehicle(id) {
  await client.delete(`/vehicles/${id}`);
}
