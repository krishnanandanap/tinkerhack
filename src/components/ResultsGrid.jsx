import React, { useState } from "react";
import { MapPin, Star, ArrowUpDown, Layout, SlidersHorizontal } from 'lucide-react';
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

  const calculateDistance = (location) => {
    if (!navigator.geolocation) return 0;
    
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

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
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
    
    const currentLocation = getCurrentLocation();
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
    <div className="space-y-8">
      {places.length > 0 && (
        <>
          <div className="sticky top-16 z-30 -mx-6 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Discovered Places
                </h2>
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {places.length} found
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-2 p-1 bg-gray-100/80 backdrop-blur-sm rounded-lg">
                  <button
                    onClick={() => handleSort('distance')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${sortBy === 'distance' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
                  >
                    <MapPin className="w-4 h-4" />
                    Distance
                    {sortBy === 'distance' && (
                      <ArrowUpDown className={`w-4 h-4 transition-transform duration-200 
                        ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort('rating')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${sortBy === 'rating' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
                  >
                    <Star className="w-4 h-4" />
                    Rating
                    {sortBy === 'rating' && (
                      <ArrowUpDown className={`w-4 h-4 transition-transform duration-200 
                        ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </div>

                <button className="p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <Layout className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
            {sortedPlaces.map((place, index) => (
              <ResultCard 
                key={place.place_id || index} 
                place={place}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ResultsGrid;