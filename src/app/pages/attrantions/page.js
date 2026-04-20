"use client";

import GeocoderMap from '@/app/comp/GeocoderMap'
import React, { useState } from 'react'

function Page() {
  const [selectedAddress, setSelectedAddress] = useState("");

  const data = [
    {
      title: '성산감자전',
      addr1: '제주도 서귀포시 성산읍 성산리 127-1'
    },
    {
      title: '가거도',
      addr1: '전라남도 진도군 조도면 가거도리'
    }
  ];

  return (
    <div>
      <GeocoderMap selectedAddress={selectedAddress} />

      {data.map((item, i) => (
        <button
          key={i}
          onClick={() => setSelectedAddress(item.addr1)}
        >
          {item.title}
        </button>
      ))}
    </div>
  )
}

export default Page;