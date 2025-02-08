import React from "react";
import { MapPin, Star, Clock, Phone } from 'lucide-react';

function ResultsGrid({ places }) {
    const getRandomGradient = () => {
        const gradients = [
          'bg-gradient-to-r from-blue-500 to-purple-500',
          'bg-gradient-to-r from-green-400 to-blue-500',
          'bg-gradient-to-r from-purple-500 to-pink-500',
          'bg-gradient-to-r from-yellow-400 to-orange-500',
          'bg-gradient-to-r from-pink-500 to-red-500'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
      };
  return (
    <>
      {places.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Discovered Places
            </h2>
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
              {places.length} found
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <div
                key={place.place_id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
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
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ResultsGrid;
