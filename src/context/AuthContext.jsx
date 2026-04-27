import { createContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  /* =============================
     Cargar usuario guardado
  ============================= */

  useEffect(() => {
    const savedUser = authService.getCurrentUser();

    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  /* =============================
     Login
  ============================= */

  const login = (credentials) => {
    const user = authService.loginUser(credentials);

    setCurrentUser(user);

    return user;
  };

  /* =============================
     Registro
  ============================= */

  const register = (userData) => {
    const user = authService.registerUser(userData);

    setCurrentUser(user);

    return user;
  };

  /* =============================
     Logout
  ============================= */

  const logout = () => {
    authService.logout();

    setCurrentUser(null);
  };

  /* =============================
     Actualizar usuario activo
     (foto perfil, stats, favoritos, etc)
  ============================= */

  const updateUser = (updatedData) => {
    if (!currentUser) return null;

    const updatedUser = {
      ...currentUser,
      ...updatedData,
    };

    const savedUser = authService.updateCurrentUser(updatedUser);

    setCurrentUser(savedUser);

    return savedUser;
  };

  /* =============================
     Context value
  ============================= */

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,

      login,
      register,
      logout,

      updateUser, // 👈 nuevo
    }),
    [currentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}