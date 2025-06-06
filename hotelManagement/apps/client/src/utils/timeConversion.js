export const convertToDateTime = (dateString) => {
  const date = new Date(dateString);

  // Format date using options for day, month, and year
  const options = {
    day: "numeric", // Day without leading zero
    month: "long", // Full month name
    year: "numeric", // Full year
  };

  // Format the date part (e.g., 5 August 2025)
  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  // Format time (e.g., 04:45 PM)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hour12}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;

  // Combine the date and time to get the final format: 5 August 2025, 04:45 PM
  return `${formattedDate}, ${formattedTime}`;
};

// Example usage
const dateStr = "2025-08-05T16:45";
const result = convertToDateTime(dateStr);
console.log(result); // Output: "5 August 2025, 04:45 PM"
