import client from "./client";

export async function listDrivers(params = {}) {
  const res = await client.get("/drivers", { params });
  return res.data; 
}

export async function getDriver(id) {
  const res = await client.get(`/drivers/${id}`);
  return res.data;
}

export async function createDriver(data) {
  const res = await client.post("/drivers", data);
  return res.data;
}

export async function updateDriver(id, data) {
  const res = await client.put(`/drivers/${id}`, data);
  return res.data;
}

export async function deleteDriver(id) {
  await client.delete(`/drivers/${id}`);
}
