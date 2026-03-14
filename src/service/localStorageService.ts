export const KEY_TOKEN = "accessToken";

// SET ACCESS TOKEN 
export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
};

// GET ACCESS TOKEN 
export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// REMOVE ACCESS TOKEN 
export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
}