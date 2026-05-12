"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { useRef, useCallback, useEffect, useMemo, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "10px",
  border: "1px solid #A1BCE4",
};

const defaultCenter = {
  lat: 37.7469904,
  lng: 127.0499178,
};

export default function GeocoderMap({ itemMarkers }) {
  const mapRef = useRef(null);

  /** ✅ map 인스턴스 준비 상태 */
  const [mapReady, setMapReady] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
  });

  /** ✅ 마커 정제 */
  const markers = useMemo(() => {
    return (itemMarkers || [])
      .map((item) => ({
        lat: Number(item.mapy),
        lng: Number(item.mapx),
      }))
      .filter((m) => !isNaN(m.lat) && !isNaN(m.lng));
  }, [itemMarkers]);

  /** ✅ 지도 로드 완료 */
  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setMapReady(true);
  }, []);


  /** ✅ 지도 이동 로직 (완전 안전 버전) */
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !window.google) return;

    // 🔹 마커 없음 → 현재 위치
    if (markers.length === 0) {


        mapRef.current.setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        mapRef.current.setZoom(15);
/*       navigator.geolocation?.getCurrentPosition((pos) => {
        mapRef.current.setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        mapRef.current.setZoom(15);
      });
 */      
      
      return;
    }

    // 🔹 마커 1개
    if (markers.length === 1) {      
      mapRef.current.setCenter(markers[0]);
      mapRef.current.setZoom(17);
      return;
    }

    // 🔹 마커 여러개 → bounds
    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((m) => {
      bounds.extend(new window.google.maps.LatLng(m.lat, m.lng));
    });

    // 🔥 핵심: 렌더 이후 실행 (회색화면 방지 핵심)
    requestAnimationFrame(() => {
      mapRef.current.fitBounds(bounds, 80);
    });
  }, [markers, isLoaded, mapReady]);

  /** ✅ 거리 계산 */
  const totalDistance = useMemo(() => {
    if (!isLoaded || !window.google || markers.length < 2) return null;

    let total = 0;

    for (let i = 0; i < markers.length - 1; i++) {
      const origin = new window.google.maps.LatLng(
        markers[i].lat,
        markers[i].lng
      );

      const destination = new window.google.maps.LatLng(
        markers[i + 1].lat,
        markers[i + 1].lng
      );

      total +=
        window.google.maps.geometry.spherical.computeDistanceBetween(
          origin,
          destination
        );
    }

    return (total / 1000).toFixed(2);
  }, [markers, isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;

  console.log(2);
  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        defaultCenter={defaultCenter}
        defaultZoom={15}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
      >
        <Polyline
          path={markers.length >= 2 ? markers : []}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />

        {markers.map((m, idx) => (
          <Marker key={idx} position={m} />
        ))}
      </GoogleMap>

      <pre style={{ marginTop: "10px" }}>
        {totalDistance
          ? `총 이동거리(직선기준): ${totalDistance} km`
          : ""}
      </pre>
    </div>
  );
}