import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getAllRooms } from "../services/Rooms";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const Rooms = () => {
  const user = Cookies.get("user");
  const navigate = useNavigate();
  const userObject = JSON.parse(user || "{}");
  const userType = userObject?.type;
  const [rooms, setRooms] = useState([]);
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAllRooms(limit, offset, search);
        setRooms(response?.rooms);
        setTotal(response?.totalRooms);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, [limit, offset, search]);

  return (
    <div className="m-10 text-center">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-semibold text-violet-600 mb-4 text-center w-full">
          Welcome to Hotels of Tourisium
        </h1>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 mr-1"
        />
        {userType === "employee" && (
          <button
            className="w-40 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition duration-300 cursor-pointer "
            onClick={() => navigate(`/upload_rooms`)}
          >
            Add Room
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-h-[400px] ">
        {rooms?.length > 0 ? (
          rooms?.map((rooms) => (
            <div
              className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200"
              key={rooms._id}
            >
              <img
                src={rooms.image}
                alt={rooms.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-violet-700 mb-2">
                  {rooms.name}
                </h3>
                <p className="text-lg text-violet-600 mb-2">
                  Price:
                  <span className="font-bold text-violet-950 ml-2">
                    ${rooms.price}
                  </span>
                </p>
                <p className="text-md text-violet-50 mb-4 bg-violet-950 p-2">
                  Ratings:{" "}
                  <span className="font-bold text-amber-300">
                    {rooms.ratings}
                  </span>{" "}
                  ★
                </p>
                <button
                  className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/book_your_room`)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full  text-3xl font-semibold text-violet-900 mb-4 text-center w-full flex items-center justify-center">
            No Rooms Found
          </div>
        )}
      </div>
      <Pagination
        limit={limit}
        page={offset}
        total={total}
        onPageChange={setOffset}
        onLimitChange={setLimit}
      />
    </div>
  );
};

export default Rooms;
