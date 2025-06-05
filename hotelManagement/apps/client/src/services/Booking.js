import cookies from "js-cookie";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const bookYourRoom = async (roomData) => {
  const token = cookies.get("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await fetch(`${baseUrl}booking-rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
      credentials: "include", // To include cookies if necessary
    });

    // If the response is not OK, handle the error
    if (response.status !== 201) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Error booking room");
    }

    return await response.json(); // Return the response if it's successful
  } catch (error) {
    // If there's an error with the fetch itself, throw it
    throw new Error(error.message || "Network error");
  }
};

export const fetchBookings = async (limit = 5, offset = 1, search = "") => {
  console.log(limit, offset, search);

  const token = cookies.get("token"); // Retrieve the token from cookies
  if (!token) {
    throw new Error("No token found");
  }

  // Construct the query string for limit, offset, and search only if they have values
  const queryParams = new URLSearchParams();

  if (limit) queryParams.append("limit", limit); // Add limit if provided
  if (offset) queryParams.append("offset", offset); // Add offset if provided
  if (search) queryParams.append("search", search); // Add search if provided

  try {
    const response = await fetch(
      `${baseUrl}booking-rooms?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
        },
        credentials: "include", // To include cookies if necessary
      }
    );

    // If the response is not OK, handle the error
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Error fetching bookings");
    }

    return await response.json(); // Return the response if it's successful
  } catch (error) {
    // If there's an error with the fetch itself, throw it
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw new Error(error.message || "Network error");
    }
  }
};
