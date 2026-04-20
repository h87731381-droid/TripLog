"use client";

import { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

export default function GeocoderMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [markers, setMarkers] = useState([]);
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");

  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    geocoderRef.current = new window.google.maps.Geocoder();
  }, []);

  const handleGeocode = () => {
    if (!geocoderRef.current || !input) return;

    geocoderRef.current
      .geocode({ address: input })
      .then((result) => {
        const location = result.results[0].geometry.location;

        mapRef.current.panTo(location);

        setResponse(JSON.stringify(result, null, 2));
      })
      .catch((e) => {
        alert("Geocode 실패: " + e);
      });
  };

  const handleMapClick = (e) => {
    const newMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleClear = () => {
    setResponse("");
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter a location"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleGeocode}>Geocode</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
      >
        {markers.map((m, idx) => (
          <Marker
            key={idx}
            position={{ lat: m.lat, lng: m.lng }}
          />
        ))}
      </GoogleMap>

      <pre style={{ marginTop: "10px" }}>{response}</pre>
    </div>
  );
}