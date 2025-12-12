import client from "./client";

export async function listTrips(params = {}) {
  const res = await client.get("/api/trips", { params });
  return res.data;
}

export async function getTrip(id) {
  const res = await client.get(`/api/trips/${id}`);
  return res.data;
}

export async function createTrip(data) {
  const res = await client.post("/api/trips", data);
  return res.data;
}

export async function updateTrip(id, data) {
  const res = await client.put(`/api/trips/${id}`, data);
  return res.data;
}

export async function deleteTrip(id) {
  const res = await client.delete(`/api/trips/${id}`);
  return res.data;
}
