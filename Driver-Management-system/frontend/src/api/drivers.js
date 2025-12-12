import client from "./client";

export async function listDrivers(params = {}) {
  const res = await client.get("/api/drivers", { params });
  return res.data; 
}

export async function getDriver(id) {
  const res = await client.get(`/api/drivers/${id}`);
  return res.data;
}

export async function createDriver(data) {
  const res = await client.post("/api/drivers", data);
  return res.data;
}

export async function updateDriver(id, data) {
  const res = await client.put(`/api/drivers/${id}`, data);
  return res.data;
}

export async function deleteDriver(id) {
  const res = await client.delete(`/api/drivers/${id}`);
  return res.data;
}
