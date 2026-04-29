"use client";

import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { useState, useRef, useCallback, useEffect } from "react";
import { useMemo } from "react";

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

  const [center, setCenter] = useState(defaultCenter);

  // 마커를 여러개 찍히도록 배열로 만들기
  const markers = useMemo(() => {
    return (itemMarkers || []).map((item) => ({
      lat: Number(item.mapy),
      lng: Number(item.mapx),
    })).filter(m => !isNaN(m.lat) && !isNaN(m.lng));
  }, [itemMarkers]);

  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((m) => {
      bounds.extend(new window.google.maps.LatLng(m.lat, m.lng));
    });

    if (markers.length === 1) {
      mapRef.current.setCenter(markers[0]);
      mapRef.current.setZoom(19); // 단일 마커(첫 마커) 줌 조절
      return;
    }

    mapRef.current.fitBounds(bounds, 80); // 지도가 마커 따라감 + 패딩으로 과한 줌인 방지
  }, [markers]);

  useEffect(() => {
    if (!mapRef.current) return;
  }, [markers]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "places"],
  });


  const [response, setResponse] = useState("");
  /* const [input, setInput] = useState(""); */

  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const distanceServiceRef = useRef(null);

  const [isMapReady, setIsMapReady] = useState(false); // 거리계산 변수

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    geocoderRef.current = new window.google.maps.Geocoder();
    distanceServiceRef.current = new window.google.maps.DistanceMatrixService(); // 구글 거리계산 가져오기

    setIsMapReady(true);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        /* console.log("현재 위치:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }); */

        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("위치 실패", error);
      }
    );
  }, []);


  // 거리계산
  useEffect(() => {
  if (markers.length < 2){
    setResponse(""); // 마커 2개 이하면 초기화
    return;
  }

  let totalDistance = 0;

  for (let i = 0; i < markers.length - 1; i++) {
    const origin = new window.google.maps.LatLng(
      markers[i].lat,
      markers[i].lng
    );

    const destination = new window.google.maps.LatLng(
      markers[i + 1].lat,
      markers[i + 1].lng
    );

    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        origin,
        destination
      );

    totalDistance += distance;
  }

  const km = (totalDistance / 1000).toFixed(2);

  setResponse(`총 이동거리(직선기준): ${km} km`); // 출력 문구
}, [markers]);

  //거리계산 콘솔확인
  /* useEffect(() => {
    if (!window.google) return;
    console.log("google loaded");
  }, []); */


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
        zoom={15} // 줌 기본값 (처음 지도 등장시)
        onLoad={onLoad}

        /* 스트립트 뷰 제거 */
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
          // 실제 마커가 찍히는 부분
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