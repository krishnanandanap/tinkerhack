import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Star, Clock } from 'lucide-react';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [placeDetails, setPlaceDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load wishlist and fetch place details
    const loadWishlistAndDetails = async () => {
      setIsLoading(true);
      const savedWishlist = JSON.parse(localStorage.getItem("wishList") || "[]");
      setWishlist(savedWishlist);

      // Fetch details for each place ID
      const details = {};
      for (const placeId of savedWishlist) {
        try {
          const place = await fetchPlaceDetails(placeId);
          details[placeId] = place;
        } catch (error) {
          console.error(`Error fetching details for place ${placeId}:`, error);
        }
      }
      
      setPlaceDetails(details);
      setIsLoading(false);
    };

    loadWishlistAndDetails();

    // Add event listener for storage changes
    window.addEventListener('storage', loadWishlistAndDetails);

    return () => {
      window.removeEventListener('storage', loadWishlistAndDetails);
    };
  }, []);

  const fetchPlaceDetails = async (placeId) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: placeId,
          fields: ['name', 'vicinity', 'photos', 'rating', 'user_ratings_total', 'opening_hours']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  const removeFromWishlist = (placeId) => {
    const updatedWishlist = wishlist.filter(id => id !== placeId);
    localStorage.setItem("wishList", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    
    // Remove from placeDetails
    const updatedDetails = { ...placeDetails };
    delete updatedDetails[placeId];
    setPlaceDetails(updatedDetails);
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
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Place Explorer</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Star className="w-4 h-4" />
                Saved Places ({wishlist.length})
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          {/* Sidebar */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Saved Places</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
                    <p>Loading places...</p>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No places saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((placeId) => {
                      const place = placeDetails[placeId];
                      if (!place) return null;

                      return (
                        <div
                          key={placeId}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                          {place.photos && place.photos[0] ? (
                            <img
                              src={place.photos[0].getUrl()}
                              alt={place.name}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-32 ${getRandomGradient()} flex items-center justify-center`}
                            >
                              <MapPin className="w-8 h-8 text-white opacity-75" />
                            </div>
                          )}

                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800">{place.name}</h3>
                              <button
                                onClick={() => removeFromWishlist(placeId)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <p className="truncate">{place.vicinity}</p>
                              </div>

                              {place.rating && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                  <p>{place.rating} ({place.user_ratings_total} reviews)</p>
                                </div>
                              )}

                              {place.opening_hours && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <p>{place.opening_hours.open_now ? "Open Now" : "Closed"}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;