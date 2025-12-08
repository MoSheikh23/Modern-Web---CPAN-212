const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../../data/users.json");

function loadUsers() {
  const data = fs.readFileSync(usersPath);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

module.exports = {
  getAllUsers: () => loadUsers(),

  getUserByEmail: (email) => {
    return loadUsers().find((u) => u.email === email);
  },

  addUser: (userData) => {
    const users = loadUsers();
    userData.id = users.length + 1;
    users.push(userData);
    saveUsers(users);
    return userData;
  },

  updateUser: (email, updated) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updated };
    saveUsers(users);
    return users[idx];
  },
};
