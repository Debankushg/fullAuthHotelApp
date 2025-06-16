import React, { useState } from "react";

const UploadForm = () => {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [ratings, setRatings] = useState("");

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages(selectedFiles);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Images:", images);
    console.log("Price:", price);
    console.log("Ratings:", ratings);
  };

  return (
    <div className="min-h-[93vh] bg-gradient-to-r from-purple-300 via-indigo-400 to-blue-300 p-8">
      <div className="min-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-10">
        <h2 className="text-3xl font-bold text-violet-700 text-center mb-6">
          Upload Product Details
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label
              className="block text-violet-600 font-semibold mb-2"
              htmlFor="name"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter the product name"
              required
            />
          </div>

          {/* Image Upload with Preview */}
          <div className="mb-4">
            <label
              className="block text-violet-600 font-semibold mb-2"
              htmlFor="image"
            >
              Upload Images
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md cursor-pointer text-violet-700"
              accept="image/*"
              multiple
              required
            />
            <div className="mt-4 flex space-x-4">
              {images.length > 0 &&
                images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index}`}
                    className="w-32 h-32 object-cover rounded-md border-2 border-violet-500"
                  />
                ))}
            </div>
          </div>

          {/* Price Input */}
          <div className="mb-4">
            <label
              className="block text-violet-600 font-semibold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter the product price"
              required
            />
          </div>

          {/* Ratings Input */}
          <div className="mb-4">
            <label
              className="block text-violet-600 font-semibold mb-2"
              htmlFor="ratings"
            >
              Ratings
            </label>
            <input
              type="number"
              id="ratings"
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter the product ratings (1-5)"
              min="1"
              max="5"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition duration-300"
          >
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
