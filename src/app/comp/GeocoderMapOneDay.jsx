"use client";

import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { useState, useRef, useCallback, useEffect } from "react";
import { useMemo } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "20px",
  border: "1px solid #d4d4d4",
};

const defaultCenter = {
  lat: 37.7469904,
  lng: 127.0499178,
};


export default function GeocoderMapOneDay({ itemMarkers , selectedAddress,setMapCenter,mapCenter}) {

  const [center, setCenter] = useState(mapCenter || defaultCenter);

  
  
  
  // 마커를 여러개 찍히도록 배열로 만들기
  const markers = useMemo(() => {
    if (!Array.isArray(itemMarkers)) return [];

    return itemMarkers
    .filter(item => item?.mapx && item?.mapy)
    .map(item => ({
      lat: Number(item.mapy),
      lng: Number(item.mapx),
      order: item.order,
    }));
  }, [itemMarkers]);

  //마커추가할때마다 지도가 계속 이동하므로 삭제
  /* useEffect(() => {
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
  }, [markers]); */
  
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
  const [mapLoad,setMapLoad] = useState();

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    geocoderRef.current = new window.google.maps.Geocoder();
    setMapLoad(1)
  }, []);

  //검색하면 지도이동
  useEffect(() => {
  if (!geocoderRef.current || !selectedAddress) return;
  
  //마커 있으면 주소 이동 막기
  /* if (itemMarkers.length > 0) return; */

  
      console.log('=======34=====');
      
  geocoderRef.current
    .geocode({ address: selectedAddress })
    .then((result) => {
      const location = result.results[0].geometry.location;
      
       const newCenter = {
        lat: location.lat(),
        lng: location.lng()
      };


      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(10);
      setCenter(newCenter);
      //setMapCenter(newCenter); //부모에 저장
    })
    .catch((e) => console.error(e));

  }, [mapLoad]);

  //지역,관광지 저장이후 다시 들어가서 지역바꾸고 취소누르고 나와서 다시들어갈때 지도 위치 기존 마커 기준
  useEffect(() => {
    if (!mapRef.current || itemMarkers.length === 0) return;

    //마커 1개
    if (itemMarkers.length === 1) {
      const m = itemMarkers[0];

      mapRef.current.panTo({
        lat: Number(m.mapy),
        lng: Number(m.mapx),
      });

      mapRef.current.setZoom(12); //적당한 줌
      return;
    }

    //여러개면 bounds
    const bounds = new window.google.maps.LatLngBounds();

    itemMarkers.forEach((m) => {
      bounds.extend({
        lat: Number(m.mapy),
        lng: Number(m.mapx),
      });
    });

    mapRef.current.fitBounds(bounds, 80);
  }, [itemMarkers]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10} // 줌 기본값 (처음 지도 등장시)
        onLoad={onLoad}

        /* 스트립트 뷰 제거 */
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy", //ctrl없이 그냥 줌가능
        }}
      > 
        {/* 마커 사이 선 */}
        <Polyline
          //key={markers.length} 
          path={markers.length >= 2 ? markers : []}
          options={{
            strokeColor: "#27678E",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />

        {markers.map((m, idx) => (
          // 실제 마커가 찍히는 부분
          <Marker
            key={idx}
            position={{ lat: m.lat, lng: m.lng }}
            label={{
              text: String(m.order),
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "400",
            }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#27678E",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 14,
            }}
          />
        ))}
      </GoogleMap>

      <pre style={{ marginTop: "10px" }}>{response}</pre>
    </div>
  );
}