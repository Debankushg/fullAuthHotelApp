import React from "react";

const HotelDashboard = () => {
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
              <p className="text-3xl font-bold text-violet-800">120</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-violet-600">
                Available Rooms
              </h3>
              <p className="text-3xl font-bold text-violet-800">8</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-violet-600">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-violet-800">$5,600</p>
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
                  <th className="py-2 px-4 text-left text-violet-800">Guest</th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Room Type
                  </th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Check-in
                  </th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Check-out
                  </th>
                  <th className="py-2 px-4 text-left text-violet-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">John Doe</td>
                  <td className="py-2 px-4">Deluxe Room</td>
                  <td className="py-2 px-4">2025-06-01</td>
                  <td className="py-2 px-4">2025-06-07</td>
                  <td className="py-2 px-4 text-green-500">Confirmed</td>
                </tr>
                <tr className="border-b">
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;
