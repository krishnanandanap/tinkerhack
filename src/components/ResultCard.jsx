import { MapPin, Star, Clock, Phone, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";

function ResultCard({ place }) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Load and check if current place is in wishlist
    const wishList = JSON.parse(localStorage.getItem("wishList") || "[]");
    const isPlaceInWishlist = wishList.some(item => item.place_id === place.place_id);
    setIsInWishlist(isPlaceInWishlist);
  }, [place.place_id]);

  const handleClick = () => {
    // Get current wishlist
    const currentWishList = JSON.parse(localStorage.getItem("wishList") || "[]");
    let newWishList;

    if (isInWishlist) {
      // Remove from wishlist if already present
      newWishList = currentWishList.filter(item => item.place_id !== place.place_id);
    } else {
      // Add to wishlist if not present
      newWishList = [...currentWishList, place.place_id];
    }

    // Update localStorage and state
    localStorage.setItem("wishList", JSON.stringify(newWishList));
    setIsInWishlist(!isInWishlist);
  };

  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-r from-blue-500 to-purple-500",
      "bg-gradient-to-r from-green-400 to-blue-500",
      "bg-gradient-to-r from-purple-500 to-pink-500",
      "bg-gradient-to-r from-yellow-400 to-orange-500",
      "bg-gradient-to-r from-pink-500 to-red-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {place.photos && place.photos[0] ? (
          <img
            src={place.photos[0].getUrl()}
            alt={place.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div
            className={`w-full h-48 ${getRandomGradient()} flex items-center justify-center`}
          >
            <MapPin className="w-12 h-12 text-white opacity-75" />
          </div>
        )}
        <button
          onClick={handleClick}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isInWishlist 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Star className="w-5 h-5" fill={isInWishlist ? "white" : "none"} />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {place.name}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <p className="text-sm">{place.vicinity}</p>
          </div>

          {place.rating && (
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <p className="text-sm">
                {place.rating} ({place.user_ratings_total} reviews)
              </p>
            </div>
          )}

          {place.opening_hours && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <p className="text-sm">
                {place.opening_hours.open_now ? "Open Now" : "Closed"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;