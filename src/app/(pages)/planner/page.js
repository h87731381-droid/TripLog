'use client'
import React, {  useEffect, useState } from 'react'
import './planner.scss'
import PlanTextField from '../../comp/planner/PlanTextField';
import PlanPopupPlace from '../../comp/planner/PlanPopupPlace';
import PlanFullDay from '../../comp/planner/PlanFullDay';
import { FiSave } from "react-icons/fi";
import PlanOneDayMap from '../../comp/planner/PlanOneDayMap';
import PlanPopupScd from '../../comp/planner/PlanPopupScd';
import dayjs, { Dayjs } from 'dayjs'
import { tripStore } from '../../store/tripStore';
import { authStore } from '@/app/store/authStore';

function page() {
  const [isOpen,setIsOpen]=useState(false)
  const [selectedAddress, setSelectedAddress] = useState("");
  const [pickedPlace, setPickedPlace] = useState([]); //배열 데이터
  const [mapCenter, setMapCenter] = useState(null);
  
  const { session } = authStore();//zustand 스토어 관리
  const { tripData, setTripData } = tripStore();//zustand 스토어 관리
  //const [tripData, setTripData]=useState(null)//현재 작업중이라 수정가능한 여행(화면 분기용)

  const [tripList, setTripList]=useState([])//완료된 여행으로 보관함페이지에서 씀(수정 불가)

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await fetch(`/api/planner?type=draft&session=${session.user?.email}`);
      console.log("status:", res.status); 
      const data = await res.json();

      if (data) {
        setTripData({// DB 기준으로 화면 분기
          ...data,
          start:dayjs(data.start),
          end:dayjs(data.end),
        }); 
      }
      console.log("tripData:", data);
  };
  if(session?.user?.email) fetchDraft();
  }, [session]);
  
  //db에 저장(중간 저장이라 나의기록보관함에는 x (수정가능))
  const handleSaveDraft = async ()=>{
    //const session = JSON.parse(sessionStorage.getItem("session"));
    const userId = session?.user?.email;//sessionStorage에서 userId로 쓸 이메일 가져오기

    await fetch(`/api/planner/${tripData.id}`,{
      method:"PATCH",//id값 생겼으므로 
      headers:{
        'Content-Type':'application/json'//json데이터형식으로 보내줌
      },
      body:JSON.stringify({
        /* ...tripData를 펼쳐놓은것 */
        tripTitle:tripTitle,
        start,
        end,
        selectedAddress,
        places:pickedPlace,
        userId,
        status:'draft'
      })
    })
  }
  
  
  //db데이터 기준 여행일정 없었으면 첫 일정입력 화면으로
  if(!tripData)
  return (
    <div className='planMake'>
      <h1>여행일정</h1>
        <PlanTextField 
        onOpen={()=>setIsOpen(true)}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        pickedPlace={pickedPlace}
        setPickedPlace={setPickedPlace}
        
        //완료버튼 누르면
        onSubmit={(data)=>{
          setTripData(data);
        }}
        />

        {/* 여행지 선택 지도 팝업 */}
        <PlanPopupPlace 
        isOpen={isOpen} 
        onClose={()=>{setIsOpen(false)}}
        onSave={(data)=>{
          setSelectedAddress(data.address);
          setPickedPlace(data.places);
          setIsOpen(false);
        }}
        mapCenter={mapCenter}
        setMapCenter={setMapCenter}
        selectedAddress={selectedAddress}
        pickedPlace={pickedPlace} 
          />
    </div>
  )
  
  //db데이터 기준 여행일정(type=draft) 있었으면 일정보여주는 일정전체보기 화면(기본화면)
  return(
    <div className='planEdit'>
      <div className='planEditTitle'>
              <h1>여행일정</h1>
              <div>
                <p>{tripData?.tripTitle}</p> 
                <p>|</p> 
                <p>
                  {tripData?.start && dayjs(tripData.start).format('YYYY.MM.DD')} ~{" "}
                  {tripData?.end && dayjs(tripData.end).format('YYYY.MM.DD')} 
                </p>
              </div>
              <button onClick={handleSaveDraft}>저장<FiSave/></button>
      </div>
      <PlanFullDay tripData={tripData}/> 
      {/* <PlanOneDayMap 
      onOpen={()=>setIsOpen(true)} 
      isOpen={isOpen} 
      onClose={()=>setIsOpen(false)}
      setIsOpen={setIsOpen}/>  */}
      {/* <PlanPopupScd isOpen={isOpen} onClose={()=>setIsOpen(false)}/> */}
    </div>
  ) 
}

export default page