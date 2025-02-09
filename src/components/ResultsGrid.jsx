import React, { useState } from "react";
import { MapPin, Star, Clock, Phone, ArrowUpDown } from 'lucide-react';
import ResultCard from "./ResultCard";

function ResultsGrid({ places }) {
  const [sortBy, setSortBy] = useState('none');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDirection('asc');
    }
  };

  

  // Calculate distance from current location
  const calculateDistance = (location) => {
    if (!navigator.geolocation) return 0;
    
    // Get current location from browser
    const getCurrentLocation = () => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => resolve(null)
        );
      });
    };

    // Haversine formula to calculate distance
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };
    const currentLocation = getCurrentLocation()
    return getDistanceFromLatLonInKm(
      location.lat(),
      location.lng(),
      currentLocation?.lat || 0,
      currentLocation?.lng || 0
    );
  };
  const sortedPlaces = [...places].sort((a, b) => {
    if (sortBy === 'distance') {
      const distanceA = calculateDistance(a.geometry.location);
      const distanceB = calculateDistance(b.geometry.location);
      return sortDirection === 'asc' ? distanceA - distanceB : distanceB - distanceA;
    } else if (sortBy === 'rating') {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return sortDirection === 'asc' ? ratingA - ratingB : ratingB - ratingA;
    }
    return 0;
  });

  return (
    <>
      {places.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Discovered Places
            </h2>
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                {places.length} found
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('distance')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${sortBy === 'distance' 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <MapPin className="w-4 h-4" />
                  Distance
                  {sortBy === 'distance' && (
                    <ArrowUpDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('rating')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${sortBy === 'rating' 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Star className="w-4 h-4" />
                  Rating
                  {sortBy === 'rating' && (
                    <ArrowUpDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedPlaces.map((place, index) => (
              <ResultCard key={index} place={place}/>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ResultsGrid;