import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAllBookings, updateBooking } from "../services/Booking";
import Pagination from "../components/Pagination";
import { convertToDateTime } from "../utils/timeConversion";

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState({}); // Object to track status by booking _id

  // Fetch bookings with a debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBookingList(limit, page, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, limit, page]);

  // Fetch booking list from API
  const fetchBookingList = async (limit, page, searchQuery) => {
    try {
      const response = await getAllBookings(limit, page, searchQuery);
      setBookings(response.bookings);
      setTotal(response.totalBookings);

      // Initialize the status state based on the fetched bookings
      const initialStatus = {};
      response.bookings.forEach((booking) => {
        initialStatus[booking._id] = booking.status;
      });
      setStatus(initialStatus); // Set initial status state for each booking
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBookingList(limit, page, searchQuery);
  }, [limit, page]);

  // Update booking status in the backend
  const updateBookingStatus = async (id, newStatus) => {
    try {
      await updateBooking(id, newStatus);
      // Re-fetch booking list after status update
      fetchBookingList(limit, page, searchQuery);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    // Update the local status state based on booking _id
    setStatus((prevStatus) => ({
      ...prevStatus,
      [id]: newStatus, // Update the status for the specific booking
    }));

    // Call the API to update the status in the backend
    updateBookingStatus(id, newStatus);
  };

  return (
    <div className="min-h-[89.5vh] bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-300 p-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-semibold mb-8 text-white">
          All Customer Booking List
        </h1>
        <div>
          <input
            type="text"
            placeholder="Search by name"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="text-white bg-violet-700">
            <th className="px-4 py-3 text-left text-sm">Name</th>
            <th className="px-4 py-3 text-left text-sm">Email</th>
            <th className="px-4 py-3 text-left text-sm">Room Type</th>
            <th className="px-4 py-3 text-left text-sm">
              Check-in Date & Time
            </th>
            <th className="px-4 py-3 text-left text-sm">Phone No</th>
            <th className="px-4 py-3 text-left text-sm">
              Check-out Date & Time
            </th>
            <th className="px-4 py-3 text-left text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id} className="border-t">
              <td className="px-4 py-2 text-sm">{booking.name}</td>
              <td className="px-4 py-2 text-sm">{booking.email}</td>
              <td className="px-4 py-2 text-sm">{booking.roomType}</td>
              <td className="px-4 py-2 text-sm">
                {convertToDateTime(booking.checkIn)}
              </td>
              <td className="px-4 py-2 text-sm">{booking.phoneNo}</td>
              <td className="px-4 py-2 text-sm">
                {convertToDateTime(booking.checkOut)}
              </td>
              <td className="px-4 py-2 text-sm">
                <select
                  value={status[booking._id] || "Pending"} // Controlled component: value is from status state
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  } // Handle status change
                  className={`px-3 py-1 rounded-full text-white ${
                    status[booking._id] === "Confirmed"
                      ? "bg-green-500"
                      : status[booking._id] === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        limit={limit}
        page={page}
        total={total}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
};

export default BookingTable;
