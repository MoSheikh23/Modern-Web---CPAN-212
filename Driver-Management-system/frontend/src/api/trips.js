import client from "./client";

export async function listTrips(params = {}) {
  const res = await client.get("/trips", { params });
  return res.data;
}

export async function getTrip(id) {
  const res = await client.get(`/trips/${id}`);
  return res.data;
}

export async function createTrip(data) {
  const res = await client.post("/trips", data);
  return res.data;
}

export async function updateTrip(id, data) {
  const res = await client.put(`/trips/${id}`, data);
  return res.data;
}

export async function deleteTrip(id) {
  await client.delete(`/trips/${id}`);
}
