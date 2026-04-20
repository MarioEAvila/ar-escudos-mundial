const USERS_KEY = "scanner_app_users";
const CURRENT_USER_KEY = "scanner_app_current_user";

function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function registerUser(userData) {
  const users = getUsers();

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === userData.username.toLowerCase()
  );

  if (usernameExists) {
    throw new Error("El nombre de usuario ya está en uso.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: userData.name,
    lastName: userData.lastName,
    username: userData.username,
    profilePhoto: userData.profilePhoto || "",
    birthday: userData.birthday,
    password: userData.password,
    createdAt: new Date().toISOString(),
    unlockedSelections: [],
    triviaResults: [],
    scanHistory: [],
  };

  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);

  return newUser;
}

function loginUser({ username, password }) {
  const users = getUsers();

  const user = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  saveCurrentUser(user);
  return user;
}

const authService = {
  getUsers,
  getCurrentUser,
  registerUser,
  loginUser,
  logout,
};

export default authService;