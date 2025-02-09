import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Star, Clock, ChevronLeft } from 'lucide-react';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [placeDetails, setPlaceDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlistAndDetails = async () => {
      setIsLoading(true);
      const savedWishlist = JSON.parse(localStorage.getItem("wishList") || "[]");
      setWishlist(savedWishlist);

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
    window.addEventListener('storage', loadWishlistAndDetails);
    return () => window.removeEventListener('storage', loadWishlistAndDetails);
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
    
    const updatedDetails = { ...placeDetails };
    delete updatedDetails[placeId];
    setPlaceDetails(updatedDetails);
  };

  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      "bg-gradient-to-br from-green-400 via-cyan-500 to-blue-500",
      "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500",
      "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500",
      "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Place Explorer
              </h1>
            </div>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Star className="w-4 h-4" />
              {wishlist.length} Saved
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Sidebar */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } z-50`}
      >
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md transform transition-transform duration-300 ease-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full bg-white shadow-2xl flex flex-col">
            {/* Sidebar Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Saved Places</h2>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium">Loading your places...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">No places saved yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start exploring to add some!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {wishlist.map((placeId) => {
                    const place = placeDetails[placeId];
                    if (!place) return null;

                    return (
                      <div
                        key={placeId}
                        className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
                      >
                        <div className="relative h-40">
                          {place.photos && place.photos[0] ? (
                            <img
                              src={place.photos[0].getUrl()}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full ${getRandomGradient()}`}>
                              <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/75" />
                            </div>
                          )}
                          <button
                            onClick={() => removeFromWishlist(placeId)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{place.name}</h3>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <p className="truncate">{place.vicinity}</p>
                            </div>

                            {place.rating && (
                              <div className="flex items-center text-gray-600">
                                <Star className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                                <p>{place.rating} · {place.user_ratings_total} reviews</p>
                              </div>
                            )}

                            {place.opening_hours && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                <p className={place.opening_hours.open_now ? "text-green-600" : "text-red-600"}>
                                  {place.opening_hours.open_now ? "Open Now" : "Closed"}
                                </p>
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

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;