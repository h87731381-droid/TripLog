"use client";

import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { useState, useRef, useCallback, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "10px",
  border: "1px solid #A1BCE4",
};

const center = {
  lat: 37.7469904,
  lng: 127.0499178,
};


export default function GeocoderMap({ selectedAddress }) {
  useEffect(() => {
    if (!geocoderRef.current || !selectedAddress) return;

    geocoderRef.current
      .geocode({ address: selectedAddress })
      .then((result) => {
        const location = result.results[0].geometry.location;

        const newMarker = {
          lat: location.lat(),
          lng: location.lng(),
        };

        mapRef.current.panTo(location);

        setMarkers((prev) => [...prev, newMarker]);
        setPath((prev) => [...prev, newMarker]);

        setPath((prev) => [...prev, newMarker]);
      })
      .catch((e) => console.error(e));
  }, [selectedAddress]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "places"],
  });

  const [path, setPath] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");

  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  const getDistance = (p1, p2) => {
    if (!window.google?.maps?.geometry) {
      console.warn("geometry not loaded yet");
      return null;
    }

    const point1 = new window.google.maps.LatLng(p1.lat, p1.lng);
    const point2 = new window.google.maps.LatLng(p2.lat, p2.lng);

    return window.google.maps.geometry.spherical.computeDistanceBetween(
      point1,
      point2
    );
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    geocoderRef.current = new window.google.maps.Geocoder();
  }, []);

  const handleGeocode = () => {
    if (!isLoaded) return;
    if (!geocoderRef.current || !input) return;

    geocoderRef.current
      .geocode({ address: input })
      .then((result) => {
        const location = result.results[0].geometry.location;

        const newMarker = {
          lat: location.lat(),
          lng: location.lng(),
        };

        mapRef.current.panTo(location);

        setMarkers((prev) => {
          const updated = [...prev, newMarker];

          setPath(updated.map((p) => ({ lat: p.lat, lng: p.lng })));

          if (updated.length >= 2) {
            const d = getDistance(
              updated[updated.length - 2],
              updated[updated.length - 1]
            );

            if (d !== null) {
              console.log("두 점 거리(m):", Math.round(d));
            }
          }

          return updated;
        });
      })
      .catch((e) => {
        alert("Geocode 실패: " + e);
      });
  };

  const handleClear = () => {
    setResponse("");
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {/* <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter a location"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleGeocode}>Geocode</button>
        <button onClick={handleClear}>Clear</button>
      </div> */}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        
        /* 스트립트 뷰 제거 */
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
      >
        {path.length >= 2 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

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