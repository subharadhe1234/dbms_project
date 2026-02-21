import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, logoutApi } from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  //login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await loginApi(email, password);
      // console.log(res);
      const u = normalizeUser(res.data.user);
      setUser(u);
      return u;
    } catch (error) {
      console.error("login error :", error);
    } finally {
      setLoading(false);
    }
  };
  // logout
  const logout = async () => {
    try {
      setLoading(true);
      await logoutApi();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("logout error :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const normalizeUser = (user) => ({
  id: user.id,
  email: user.email,
  departmentId: user.departmentId,
  role: user.departmentId === null ? "admin" : "manager",
});

export const useAuth = () => useContext(AuthContext);
