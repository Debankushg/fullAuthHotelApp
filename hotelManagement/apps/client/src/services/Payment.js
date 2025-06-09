const baseUrl = import.meta.env.VITE_BASE_URL;

export const roomBookPayment = (data) => {
  return fetch(`${baseUrl}payment/create-payment`, {
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

export const getPaymentStatus = (id) => {
  return fetch(`${baseUrl}payment/user-payments/${id}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};
