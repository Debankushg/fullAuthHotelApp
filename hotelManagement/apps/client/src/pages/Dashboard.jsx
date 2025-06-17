import React, { useEffect, useState } from "react";
import { getDashboardData } from "../services/Auth";

const HotelDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [totalAmountBooked, setTotalAmountBooked] = useState(0);
  const [totalRoomBooked, setTotalRoomBooked] = useState(0);
  const [totalPersonCount, setTotalPersonCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        setDashboardData(response?.bookings);
        setTotalAmountBooked(response.totalAmountBooked);
        setTotalRoomBooked(response.totalRoomBooked);
        setTotalPersonCount(response.totalPersonCount);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-300">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-4xl text-white font-semibold mb-8">
            Hotel Management Dashboard
          </h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-violet-600">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-violet-800">
                {totalPersonCount}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-violet-600">
                Available Rooms
              </h3>
              <p className="text-3xl font-bold text-violet-800">
                {totalRoomBooked}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-violet-600">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-violet-800">
                ${totalAmountBooked}
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-violet-600">
                New Guests
              </h3>
              <p className="text-3xl font-bold text-violet-800">15</p>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-violet-600 mb-4">
              Recent Bookings
            </h3>
            <table className="min-w-full table-auto">
              <thead className="bg-violet-100">
                <tr>
                  <th className="py-2 px-4 text-left text-violet-800">Name</th>
                  <th className="py-2 px-4 text-left text-violet-800">Email</th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Phone No
                  </th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Room Type
                  </th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.length > 0 &&
                  dashboardData?.map((booking) => (
                    <tr className="border-b">
                      <td className="py-2 px-4 capitalize font-bold">
                        {booking?.name}
                      </td>
                      <td className="py-2 px-4">{booking?.email}</td>
                      <td className="py-2 px-4">{booking?.phoneNo}</td>
                      <td className="py-2 px-4 capitalize">
                        {booking?.roomType}
                      </td>
                      <td
                        className={`py-2 px-4 font-bold ${booking?.status === "Pending" ? " text-yellow-500" : booking?.status === "Confirmed" ? "text-green-500" : " text-red-500"}`}
                      >
                        {booking?.status}
                      </td>
                    </tr>
                  ))}{" "}
                {/* <tr className="border-b">
                  <td className="py-2 px-4">Jane Smith</td>
                  <td className="py-2 px-4">Standard Room</td>
                  <td className="py-2 px-4">2025-06-05</td>
                  <td className="py-2 px-4">2025-06-10</td>
                  <td className="py-2 px-4 text-yellow-500">Pending</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Robert Brown</td>
                  <td className="py-2 px-4">Suite</td>
                  <td className="py-2 px-4">2025-06-08</td>
                  <td className="py-2 px-4">2025-06-15</td>
                  <td className="py-2 px-4 text-red-500">Cancelled</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;
