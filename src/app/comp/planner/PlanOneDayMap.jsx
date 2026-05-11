import React, { useState } from 'react'
import { FiPlus } from "react-icons/fi";
import { FaCircle } from "react-icons/fa"
import { FiSave } from "react-icons/fi";
import { GrFormNext } from "react-icons/gr";
import GeocoderMap from '../GeocoderMap';
import PlanPopupScd from './PlanPopupScd';
import GeocoderMapOneDay from '../GeocoderMapOneDay';
import { tripStore } from '@/app/store/tripStore';
import { TbPencil } from "react-icons/tb";
import { RiDeleteBin6Line } from 'react-icons/ri';

function PlanOneDayMap({onOpen,onClose,day,date,setOneDayMapAddScd,selectedDay,isOpen,isPopupOpen,setIsPopupOpen,moveIcons}) {
  const [dayPlan,setDayPlan]=useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const {tripData,setTripData}=tripStore();
  const [pickedPlace,setPickedPlace]=useState([]);
  
  //스케줄 수정
  const [editingId, setEditingId] = useState(null);  
  const [editData, setEditData] = useState(null);

  const schedules=tripData?.scd?.filter(
    scd => scd.day == (selectedDay?.idx + 1)
  ) || [];//tripdata에서 가져온 스케쥴 배열
  console.log(schedules)
  
  //시간순으로 출력가능하게
  const sortedSchedules = [...schedules].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  //마커 찍히게 스케줄 필터
  const markers = sortedSchedules
  .filter(scd => scd.mapx && scd.mapy)
  .map((scd,idx) => ({
    mapx: scd.mapx,
    mapy: scd.mapy,
    order: idx + 1,
  }));
  
  
  //스케줄 추가 시 장소 누를때마다 마커 바로 찍히게 임시 마커 상태
  const [tempMarkers, setTempMarkers] = useState([]);
  
  //두개를 하나의 배열로 합쳐서 보내야 map돌릴때 오류안남
  const mergedMarkers = editingId
  ? markers.map((marker, idx) => {

      // 수정중인 schedule 찾기
      const editingScheduleIndex = sortedSchedules.findIndex(
        scd => scd._id === editingId
      );

      // 수정중인 위치면 tempMarker로 교체(중간에 껴있던 스케줄일때 고려)
      if (
        idx === editingScheduleIndex &&
        tempMarkers.length > 0
      ) {
        return {
          ...tempMarkers[0],
          order: marker.order,
        };
      }

      return marker;
    })
  : [...markers, ...tempMarkers];

  //스케줄 하나 수정
  const scdEditStart = (item) => {
    setEditingId(item._id); 
    setEditData({ 
      scdTitle: item.scdTitle, 
      scdPlace: item.scdPlace, 
      scdMove: item.scdMove,
      scdMoveMemo: item.scdMoveMemo,
      startTime: item.startTime,
      endTime: item.endTime, 
      contentid: item.contentid//수정할때 장소넘어올때 해당 장소 active되있게
    });
    setIsPopupOpen(true); // 팝업 열기
  };
  
  //스케줄 하나 삭제
  const scdDelete = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      await fetch(`/api/planner?id=${id}&target=scd`, 
        { method: 'DELETE' });
        // 다시 데이터 불러오기
        const res = await fetch(`/api/planner?type=draft&session=${tripData.userId}`);
        const data = await res.json();
        setTripData(data); 
      }
    };
    
    
  

  return (
    <div className='planEditContOneDay'>
        <div className='planEditOneDay'>
            <div className='planEditOneDayTxt'>
              <p>Day{day+1}</p>
              <div>
                <p>{selectedDay?.date.format('YYYY.MM.DD (ddd)')}</p>
                <a onClick={()=>{setOneDayMapAddScd(false)}}>일정 전체보기<GrFormNext/></a>
              </div>
            </div>
            <div className='planEditOneDayBox'>
              {schedules.length===0 ?
                (<div className='planEditOneDayBoxEmpty'>
                  {tripData.status==='draft' ?
                   <>
                    <a 
                      href=''
                      onClick={(e)=>{
                        e.preventDefault();
                        if(isPopupOpen)return;
                        setIsPopupOpen(true);
                        //onOpen();
                      }}
                      style={{
                        pointerEvents:isPopupOpen ? "none" : "auto",
                        backgroundColor:isPopupOpen ? "#AED1E6" : "#27678E"
                      }}
                    >일정추가<FiPlus /></a>
                    <div>
                      <p>아직 추가된 일정이 없습니다!</p>
                      <p>일정을 추가해보세요!</p>
                    </div>
                   </>
                   :<div className='completed'>
                      <p>추가된 일정이 없습니다!</p>
                    </div>
                  }
                </div>
                )
                :
                (<div className='planEditOneDayBoxFilled'>
                  {
                    sortedSchedules.map((scd,idx)=>(
                      <div className='oneSchedule' key={idx}>
                        <p className='scdTime'>{scd.startTime}</p>
                        <div className='timeLine'>
                          <div className='circle'><FaCircle /></div>
                        </div>
                        
                        <div className='scdContent'>
                          <div className='scdUpper'>
                            <p className='scdTitle'>{scd.scdTitle}</p>
                            {tripData.status==='draft' &&
                              <div className='scdCRUD'>
                                <TbPencil onClick={() => scdEditStart(scd)}/>
                                <RiDeleteBin6Line onClick={()=>scdDelete(scd._id)} />
                              </div>
                            }
                          </div>
                          <p className='scdSpot'>{scd.scdPlace}</p>
                          <div className='scdMove'>
                            <p className='scdMoveIcon'>{moveIcons[scd.scdMove]}</p>
                            <p className='scdMoveMemo'>{scd.scdMoveMemo}</p>
                          </div>
                        </div>
                          
                        
                      </div>

                    ))
                  }
                    {tripData.status==='draft' &&
                    <a 
                      href=''
                      onClick={(e)=>{
                        e.preventDefault();
                        if(isPopupOpen)return;
                        setIsPopupOpen(true);
                        //onOpen();
                      }}
                      style={{
                        pointerEvents:isPopupOpen ? "none" : "auto",
                        backgroundColor:isPopupOpen ? "#AED1E6" : "#27678E"
                      }}
                    >일정추가<FiPlus /></a>
                    }
                </div>
                )
              }
            </div>
        </div>
        <div className='planEditDayMap'>
            <GeocoderMapOneDay 
            selectedAddress={tripData.selectedAddress}
            itemMarkers={mergedMarkers}
            
            />
        </div>
        {isPopupOpen && (
          
              
              <PlanPopupScd 
              day={selectedDay.idx + 1} 
              pickedPlace={pickedPlace}
              isPopupOpen={isPopupOpen} 
              onClose={() => {
                setIsPopupOpen(false);
                setEditingId(null); // 수정모드 초기화
                setEditData(null);
                }}
              editData={editData}
              editingId={editingId}
              setTempMarkers={setTempMarkers}
              markerLength={markers.length}//기존 출력되있던 마커의 개수
              />
          

        )}
    </div>
  )
}

export default PlanOneDayMap