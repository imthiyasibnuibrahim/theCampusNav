import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

export default function MapContainer() {
  const [locations, setLocations] = useState([]);
  const location = useLocation();

  // Parse the query parameters to see if a specific location was requested
  const queryParams = new URLSearchParams(location.search);
  const targetPolygonId = queryParams.get('location');

  // Example fetch to demonstrate connection
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/locations`);
        setLocations(response.data);
      } catch (err) {
        console.error("Failed to load map locations");
      }
    };
    fetchLocations();
  }, []);

  // Construct the Mappedin URL dynamically based on the requested location
  // If targetPolygonId exists, append &location=... otherwise load default
  const baseUrl = "https://app.mappedin.com/map/65fbc2aa7c0c4fe5b4cc4683/directions?floor=m_22a17a3554c0daa4";
  const iframeSrc = targetPolygonId ? `${baseUrl}&location=${targetPolygonId}` : baseUrl;

  return (
    <div className="relative h-full w-full bg-gray-100 flex flex-col">
      {/* Embedded Digital Twin Map using user's specific URL */}
      {/* We use an iframe since this is a compiled web-app URL rather than an API configuration */}
      <iframe
        key={iframeSrc} // Force iframe to remount when URL changes
        src={iframeSrc}
        title="Campus Digital Twin Map"
        className="w-full flex-1 border-none"
        style={{ height: 'calc(100vh - 4rem)' }}
        allow="geolocation"
      />
    </div>
  );
}
