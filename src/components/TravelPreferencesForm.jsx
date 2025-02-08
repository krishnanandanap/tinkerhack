import React, { useState } from 'react';

const TravelPreferencesForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    placeType: '',
    minDistance: 0,
    maxDistance: 50,
    customPlaceType: ''
  });
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const placeTypes = [
    'restaurant',
    'park',
    'museum',
    'shopping_mall',
    'tourist_attraction',
    'beach',
    'mountain',
    'other'
  ];

  const getLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      preferences: {
        placeType: formData.placeType === 'other' ? formData.customPlaceType : formData.placeType,
        distanceRange: {
          min: formData.minDistance * 1000, // Convert to meters for Google Maps API
          max: formData.maxDistance * 1000
        }
      },
      userLocation: location
    };
    onSubmit(submissionData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Find Places Near You
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type of Place
            </label>
            <select
              name="placeType"
              value={formData.placeType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a place type</option>
              {placeTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {formData.placeType === 'other' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Specify Place Type
              </label>
              <input
                type="text"
                name="customPlaceType"
                value={formData.customPlaceType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter place type"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Distance Range (km)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                name="minDistance"
                value={formData.minDistance}
                onChange={handleInputChange}
                min="0"
                max={formData.maxDistance}
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="number"
                name="maxDistance"
                value={formData.maxDistance}
                onChange={handleInputChange}
                min={formData.minDistance}
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={getLocation}
              className="w-full bg-gray-100 text-gray-800 p-2 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {loading ? 'Getting Location...' : 'Get My Location'}
            </button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            {location && (
              <p className="text-green-600 text-sm">
                Location acquired! 📍
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!location}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Search Places
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelPreferencesForm;