import React from "react";

const Rooms = () => {
  const room = [
    {
      name: "Luxury Suite",
      image: "https://via.placeholder.com/250",
      price: 150,
      ratings: 4.5,
    },
    {
      name: "Ocean View Room",
      image: "https://via.placeholder.com/250",
      price: 200,
      ratings: 4.8,
    },
  ];
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
      <img
        src={room.image}
        alt={room.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-violet-700 mb-2">
          {room.name}
        </h3>
        <p className="text-lg text-violet-600 mb-2">Price: ${room.price}</p>
        <p className="text-md text-violet-500 mb-4">
          Ratings: {room.ratings} ★
        </p>
        <button className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Rooms;
