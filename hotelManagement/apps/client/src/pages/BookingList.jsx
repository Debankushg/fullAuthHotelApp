import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchBookings } from "../services/Booking";

// const bookings = [
//   {
//     name: "John Doe",
//     roomType: "Deluxe Suite",
//     checkIn: "2023-09-10 14:00",
//     amount: "$200",
//     checkOut: "2023-09-15 11:00",
//     status: "Confirmed",
//   },
//   {
//     name: "Jane Smith",
//     roomType: "Standard Room",
//     checkIn: "2023-09-12 16:00",
//     amount: "$120",
//     checkOut: "2023-09-14 12:00",
//     status: "Pending",
//   },
//   {
//     name: "Robert Brown",
//     roomType: "Single Room",
//     checkIn: "2023-09-05 18:00",
//     amount: "$90",
//     checkOut: "2023-09-06 10:00",
//     status: "Cancelled",
//   },
// ];

const BookingTable = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBookingList = async (limit, offset, search) => {
      try {
        const response = await fetchBookings(limit, offset, search);
        console.log(response.bookings, "RESPONSE");

        setBookings(response.bookings);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchBookingList();
  }, [limit, page, searchQuery]);
  return (
    <div className="min-h-[89.5vh] bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-300 p-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-semibold mb-8 text-white">Booking List</h1>
        <div>
          <input
            type="text"
            placeholder="Search by name"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 bg-violet-700 text-white rounded-lg cursor-pointer"
            onClick={() => navigate("/book_your_room")}
          >
            Book A Room
          </button>
        </div>
      </div>
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="text-white bg-violet-700">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Room Type</th>
            <th className="px-4 py-3 text-left">Check-in Date & Time</th>
            <th className="px-4 py-3 text-left">Booking Amount</th>
            <th className="px-4 py-3 text-left">Check-out Date & Time</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{booking.name}</td>
              <td className="px-4 py-2">{booking.roomType}</td>
              <td className="px-4 py-2">{booking.checkIn}</td>
              <td className="px-4 py-2">{booking.amount}</td>
              <td className="px-4 py-2">{booking.checkOut}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    booking.status === "Confirmed"
                      ? "bg-green-500"
                      : booking.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
