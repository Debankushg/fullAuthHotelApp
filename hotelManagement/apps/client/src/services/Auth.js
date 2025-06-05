const baseUrl = import.meta.env.VITE_BASE_URL;

export const loginUser = (email, password) => {
  return fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export const registerUser = (data) => {
  return fetch(`${baseUrl}register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export const logoutUser = () => {
  return fetch(`${baseUrl}logout`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export const verifyOTP = (otp) => {
  return fetch(`${baseUrl}verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp }),
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
