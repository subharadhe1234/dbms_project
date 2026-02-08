import api from "./api";
// Login
export const loginApi = (email, password) =>
  api.post("/auth/login", {
    email,
    password,
  });

// Logout
export const logoutApi = () => api.post("/auth/logout");
