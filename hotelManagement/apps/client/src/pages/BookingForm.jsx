import React, { useState } from "react";
import { bookYourRoom } from "../services/Booking";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  // Form state to capture input data
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    roomType: "",
    roomCount: "",
    personCount: "",
    checkIn: "",
    email: "",
    phoneNo: "",
    address: "",
    checkOut: "",
    status: "Pending", // Default status
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const bookRoom = async (data) => {
    try {
      const response = await bookYourRoom(data); // Now we are receiving responseData

      // Check if the response contains a 'status' and proceed accordingly
      if (response.status === "success") {
        toast.success(response.message);
        navigate("/bookings_list");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    bookRoom(formData);
  };

  return (
    <div className="min-h-[89.5vh] bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-300 p-8">
      <div className="max-w-7xl  mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-violet-700 mb-6">
          Booking Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Room Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="roomType"
                  className="block text-sm font-medium text-gray-600"
                >
                  Room Type
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="standardRoom">Standard Room</option>
                  <option value="deluxeSuite">Deluxe Suite</option>
                  <option value="singleRoom">Single Room</option>
                  <option value="doubleRoom">Double Room</option>
                  <option value="tripleRoom">Triple Room</option>
                  <option value="quadRoom">Quad Room</option>
                  <option value="queenRoom">Queen Room</option>
                  <option value="kingRoom">King Room</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="roomCount"
                  className="block text-sm font-medium text-gray-600"
                >
                  No of Rooms Required
                </label>
                <input
                  id="roomCount"
                  name="roomCount"
                  value={formData.roomCount}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Check-in Date & Time */}
            <div>
              <label
                htmlFor="checkIn"
                className="block text-sm font-medium text-gray-600"
              >
                Check-in Date & Time
              </label>
              <input
                type="datetime-local"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            {/* Phone No */}
            <div>
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-600"
              >
                Phone No
              </label>
              <input
                type="text"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Check-out Date & Time */}
            <div>
              <label
                htmlFor="checkOut"
                className="block text-sm font-medium text-gray-600"
              >
                Check-out Date & Time
              </label>
              <input
                type="datetime-local"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="roomType"
                className="block text-sm font-medium text-gray-600"
              >
                Person Count
              </label>
              <input
                id="personCount"
                name="personCount"
                value={formData.personCount}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
