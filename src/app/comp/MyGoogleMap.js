"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapWithCurrentAndAddresses() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [addresses, setAddresses] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  // 현재 위치
  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, [isLoaded]);

  // 주소 → 좌표 변환
  useEffect(() => {
    if (!isLoaded || addresses.length === 0) return;

    const geocoder = new window.google.maps.Geocoder();

    Promise.all(
      addresses.map(
        (address) =>
          new Promise((resolve) => {
            geocoder.geocode({ address, region: "kr" }, (res, status) => {
              if (status === "OK") {
                const loc = res[0].geometry.location;
                resolve({ lat: loc.lat(), lng: loc.lng() });
              } else {
                console.log("주소 실패:", address);
                resolve(null);
              }
            });
          })
      )
    ).then((results) => {
      setMarkers(results.filter(Boolean));
    });
  }, [addresses, isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  // 선 연결(현재 위치 포함)
  const path = currentLocation ? [currentLocation, ...markers] : markers;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          currentLocation
        }
        zoom={14}
      >
        {/* 현재 위치 */}
        {currentLocation && (
          <Marker position={currentLocation} />
        )}

        {/* 주소 마커 */}
        {markers.map((pos, idx) => (
          <Marker key={idx} position={pos} />
        ))}

        {/* 선 */}
        {path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
        )}
      </GoogleMap>

      {/* 버튼 */}
      <button
        onClick={() =>
          setAddresses([
            ...addresses,
            "경기도 의정부시 시민로 1",
          ])
        }
      >
        경기도 의정부시 시민로 1
      </button>

      <button
        onClick={() =>
          setAddresses([
            ...addresses,
            "경기도 의정부시 의정로174번길 8",
          ])
        }
      >
        경기도 의정부시 평화로 525
      </button>
    </div>
  );
}