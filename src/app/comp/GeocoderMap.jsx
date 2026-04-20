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

  const [marker, setMarker] = useState(null);
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
        setMarker({
          lat: location.lat(),
          lng: location.lng(),
        });

        setResponse(JSON.stringify(result, null, 2));
      })
      .catch((e) => {
        alert("Geocode 실패: " + e);
      });
  };

  const handleMapClick = (e) => {
    if (!geocoderRef.current) return;

    geocoderRef.current
      .geocode({ location: e.latLng })
      .then((result) => {
        const location = result.results[0].geometry.location;

        setMarker({
          lat: location.lat(),
          lng: location.lng(),
        });

        setResponse(JSON.stringify(result, null, 2));
      });
  };

  const handleClear = () => {
    setMarker(null);
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
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>

      <pre style={{ marginTop: "10px" }}>{response}</pre>
    </div>
  );
}