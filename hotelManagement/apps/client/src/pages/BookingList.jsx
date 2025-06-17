import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchBookings } from "../services/Booking";
import Pagination from "../components/Pagination";
import { convertToDateTime } from "../utils/timeConversion";
import PaymentModal from "../components/PaymentModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const BookingTable = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentModalShow, setPaymentModalShow] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const stripePromise = loadStripe(
    import.meta.env.VITE_API_STRIPE_PUBLISHABLE_KEY
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBookingList(limit, page, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, limit, page]);

  const fetchBookingList = async (limit, page, searchQuery) => {
    try {
      const response = await fetchBookings(limit, page, searchQuery);
      setBookings(response.bookings);
      setTotal(response.totalBookings);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBookingList(limit, page, searchQuery);
  }, [limit, page]);

  const handlePayments = (booked) => {
    setPaymentModalShow(true);
    console.log(booked, "BOOK");
    const { userId, roomType, amount } = booked;
    setSelectedBooking({
      userId,
      roomType,
      amount,
    });
  };

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
            <th className="px-4 py-3 text-left text-sm">Name</th>
            <th className="px-4 py-3 text-left text-sm">Email</th>
            <th className="px-4 py-3 text-left text-sm">Room Type</th>
            <th className="px-4 py-3 text-left text-sm">
              Check-in Date & Time
            </th>
            <th className="px-4 py-3 text-left text-sm">phone No</th>
            <th className="px-4 py-3 text-left text-sm">
              Check-out Date & Time
            </th>
            <th className="px-4 py-3 text-left text-sm">Status</th>
            <th className="px-4 py-3 text-left text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings?.map((booking, index) => (
            <tr key={index} className="border-t">
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
              <td className="px-4 py-2 text-sm">
                <button
                  className={`px-3 py-2 w-[100px] text-white rounded-lg ${booking.isBooked ? "cursor-pointer  bg-violet-700" : "cursor-not-allowed bg-violet-300"} `}
                  onClick={() => handlePayments(booking)}
                  disabled={!booking.isBooked}
                >
                  Book Room {booking.amount ? `(${booking.amount})` : ""}
                </button>
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
      <Elements stripe={stripePromise}>
        <PaymentModal
          paymentModalShow={paymentModalShow}
          setPaymentModalShow={setPaymentModalShow}
          selectedRoom={selectedBooking}
        />
      </Elements>
    </div>
  );
};

export default BookingTable;
