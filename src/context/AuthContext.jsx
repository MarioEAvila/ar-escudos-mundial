import { useCallback, useMemo, useState } from "react";
import authService from "../services/authService";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    authService.getCurrentUser()
  );

  /* =============================
     Login
  ============================= */

  const login = useCallback((credentials) => {
    const user = authService.loginUser(credentials);

    setCurrentUser(user);

    return user;
  }, []);

  /* =============================
     Registro
  ============================= */

  const register = useCallback((userData) => {
    const user = authService.registerUser(userData);

    setCurrentUser(user);

    return user;
  }, []);

  /* =============================
     Logout
  ============================= */

  const logout = useCallback(() => {
    authService.logout();

    setCurrentUser(null);
  }, []);

  /* =============================
     Actualizar usuario activo
     (foto perfil, stats, favoritos, etc)
  ============================= */

  const updateUser = useCallback((updatedData) => {
    if (!currentUser) return null;

    const updatedUser = {
      ...currentUser,
      ...updatedData,
    };

    const savedUser = authService.updateCurrentUser(updatedUser);

    setCurrentUser(savedUser);

    return savedUser;
  }, [currentUser]);

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
    [currentUser, login, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
