import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-violet-800 p-6 text-white">
      <h2 className="text-2xl font-bold mb-8 text-center">Hotel Admin</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="text-lg hover:text-violet-400">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/bookings_list" className="text-lg hover:text-violet-400">
            Bookings
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/rooms" className="text-lg hover:text-violet-400">
            Rooms
          </Link>
        </li>
        {/* <li className="mb-4">
          <a href="#" className="text-lg hover:text-violet-400">
            Guests
          </a>
        </li>
        <li className="mb-4">
          <a href="#" className="text-lg hover:text-violet-400">
            Reports
          </a>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
