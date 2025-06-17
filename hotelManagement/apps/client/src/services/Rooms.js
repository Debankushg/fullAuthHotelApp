const baseUrl = import.meta.env.VITE_BASE_URL;

export const uploadRooms = async (formData) => {
  const response = await fetch(`${baseUrl}upload-rooms`, {
    method: "POST",
    body: formData, // Send FormData as the body
    credentials: "include", // To include cookies if necessary
  });
  const result = await response.json();
  return result;
};

export const getAllRooms = async (limit, offset, search) => {
  try {
    // Ensure baseUrl is correct
    const url = new URL(`${baseUrl}all-rooms`);
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);
    if (search) params.append("search", search);

    url.search = params.toString();

    // Make the fetch request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // To include cookies if necessary
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    // Log any errors for debugging
    console.error("Error fetching rooms:", error);
    // Optionally, you can return a default or error response if needed
    return { error: "Failed to fetch rooms." };
  }
};
