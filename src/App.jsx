import React, { useState, useEffect } from "react";
import TravelPreferencesForm from "./components/TravelPreferencesForm";
import ResultsGrid from "./components/ResultsGrid";
import Navbar from "./components/Navbar";

function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API failed to load.");
    }
  }, []);

  const searchNearbyPlaces = async (location, placeType, radius) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error("Google Maps API not loaded yet."));
        return;
      }

      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      const request = {
        location: new window.google.maps.LatLng(location.latitude, location.longitude),
        radius: radius,
        type: placeType.toLowerCase(),
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(new Error("Failed to fetch places"));
        }
      });
    });
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      if (!window.google || !window.google.maps || !window.google.maps.geometry) {
        throw new Error("Google Maps API not fully loaded.");
      }

      const { preferences, userLocation } = formData;
      const maxRadius = preferences.distanceRange.max;
      const results = await searchNearbyPlaces(userLocation, preferences.placeType, maxRadius);

      const filteredResults = results.filter((place) => {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude),
          place.geometry.location
        );
        return distance >= preferences.distanceRange.min;
      });

      setPlaces(filteredResults);
      console.log("Found places:", filteredResults);
    } catch (err) {
      setError(err.message);
      console.error("Error searching for places:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Places
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Find the perfect destinations near you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 ">
          <TravelPreferencesForm onSubmit={onSubmit} />
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <ResultsGrid places={places}/>
      </div>
    </div>
  );
}

export default App;