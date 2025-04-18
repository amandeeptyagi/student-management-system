import API from "./axios";

export const login = async (email, password, role) => {
  const response = await API.post("/auth/login", { email, password, role });
  return response.data;
};
