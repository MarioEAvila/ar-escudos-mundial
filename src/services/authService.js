const USERS_KEY = "scanner_app_users";
const CURRENT_USER_KEY = "scanner_app_current_user";

/* =============================
   Obtener lista de usuarios
============================= */

function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

/* =============================
   Guardar lista de usuarios
============================= */

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* =============================
   Guardar usuario actual
============================= */

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/* =============================
   Obtener usuario actual
============================= */

function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

/* =============================
   Cerrar sesión
============================= */

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/* =============================
   Registrar usuario nuevo
============================= */

function registerUser(userData) {
  const users = getUsers();

  const usernameExists = users.some(
    (user) =>
      user.username.toLowerCase() === userData.username.toLowerCase()
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

    /* datos del sistema Mundial FC */

    unlockedSelections: [],
    triviaResults: [],
    scanHistory: [],
    favorites: [],
    likedPosts: [],
    comments: [],
    posts: [],
  };

  users.push(newUser);

  saveUsers(users);
  saveCurrentUser(newUser);

  return newUser;
}

/* =============================
   Login usuario
============================= */

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

/* =============================
   Actualizar usuario actual
============================= */

function updateCurrentUser(updatedUserData) {
  const users = getUsers();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("No hay usuario autenticado.");
  }

  const updatedUser = {
    ...currentUser,
    ...updatedUserData,
  };

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? updatedUser : user
  );

  saveUsers(updatedUsers);
  saveCurrentUser(updatedUser);

  return updatedUser;
}

/* =============================
   Export del servicio
============================= */

const authService = {
  getUsers,
  getCurrentUser,
  registerUser,
  loginUser,
  logout,
  updateCurrentUser,
};

export default authService;