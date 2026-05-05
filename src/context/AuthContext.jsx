import { useCallback, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authService.getCurrentUser().then((user) => {
      if (!isMounted) return;
      setCurrentUser(user?.user || null);
      setIsBootstrapping(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  /* =============================
     Login
  ============================= */

  const login = useCallback(async (credentials) => {
    const response = await authService.loginUser(credentials);
    const user = response.user;

    setCurrentUser(user);

    return user;
  }, []);

  /* =============================
     Registro
  ============================= */

  const register = useCallback(async (userData) => {
    const response = await authService.registerUser(userData);
    const user = response.user;

    setCurrentUser(user);

    return user;
  }, []);

  /* =============================
     Logout
  ============================= */

  const logout = useCallback(async () => {
    await authService.logout();

    setCurrentUser(null);
  }, []);

  /* =============================
     Actualizar usuario activo
     (foto perfil, stats, favoritos, etc)
  ============================= */

  const updateUser = useCallback(async (updatedData) => {
    if (!currentUser) return null;

    if (updatedData?.id) {
      setCurrentUser(updatedData);
      return updatedData;
    }

    const response = await authService.updateCurrentUser(updatedData);
    const savedUser = response.user;

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
      isBootstrapping,

      login,
      register,
      logout,

      updateUser, // 👈 nuevo
    }),
    [currentUser, isBootstrapping, login, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
