import React, { useState } from 'react'
import { FiPlus } from "react-icons/fi";
import { FaCar, FaCircle, FaWalking } from "react-icons/fa"
import { FaBus } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { GrFormNext } from "react-icons/gr";
import GeocoderMap from '../GeocoderMap';
import PlanPopupScd from './PlanPopupScd';
import GeocoderMapOneDay from '../GeocoderMapOneDay';
import { tripStore } from '@/app/store/tripStore';
import { FaTrainSubway } from 'react-icons/fa6';
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { MdDirectionsBoat } from 'react-icons/md';


function PlanOneDayMap({onOpen,onClose,day,date,setOneDayMapAddScd,selectedDay,isOpen}) {
  const [dayPlan,setDayPlan]=useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const {tripData}=tripStore();
  const [pickedPlace,setPickedPlace]=useState([]);
  const [isPopupOpen,setIsPopupOpen]=useState(false);

  const schedules=tripData?.scd?.filter(
    scd => scd.day == selectedDay.idx + 1
  ) || [];//tripdata에서 가져온 스케쥴 배열
  
  //교통수단 아이콘 매핑 추가
  const moveIcons = {
  bus: <FaBus />,
  train: <FaTrainSubway />,
  airplane: <BiSolidPlaneAlt />,
  car: <FaCar />,
  boat: <MdDirectionsBoat />,
  walk: <FaWalking />
  };

  //일정추가 팝업 내용 초기화
  const resetForm = () => {
  setScdTitle("");
  setScdPlace("");
  setScdMove("");
  setScdMoveMemo("");
  setStartTime("");
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
                    <a href=''>일정추가<FiPlus /></a>
                    <div>
                      <p>아직 추가된 일정이 없습니다!</p>
                      <p>일정을 추가해보세요!</p>
                    </div>
                </div>
                )
                :
                (<div className='planEditOneDayBoxFilled'>
                  {
                    schedules.map((scd,idx)=>(
                      <div className='oneSchedule' key={idx}>
                        <p className='scdTime'>{scd.startTime}</p>
                        <div className='timeLine'>
                          <div className='circle'><FaCircle /></div>
                        </div>
                        <div className='scdContent'>
                          <p className='scdTitle'>{scd.scdTitle}</p>
                          <p className='scdSpot'>{scd.scdPlace}</p>
                          <div className='scdMove'>
                            <p className='scdMoveIcon'>{moveIcons[scd.scdMove]}</p>
                            <p className='scdMoveMemo'>{scd.scdMoveMemo}</p>
                          </div>
                        </div>
                      </div>

                    ))
                  }
                    
                    <a 
                      href=''
                      onClick={(e)=>{
                        e.preventDefault();
                        if(isOpen)return;
                        onOpen();
                      }}
                      style={{
                        pointerEvents:isOpen ? "none" : "auto",
                        backgroundColor:isOpen ? "#AED1E6" : "#27678E"
                      }}
                    >일정추가<FiPlus /></a>
                </div>
                )
              }
            </div>
        </div>
        <div className='planEditDayMap'>
            <GeocoderMapOneDay selectedAddress={selectedAddress}/>
        </div>
        <div className='planPopupScdBg'>
            <div className='planPopupScdBg2'> </div>
            <PlanPopupScd 
            pickedPlace={pickedPlace}
            isOpen={isPopupOpen} 
            onClose={() => setIsPopupOpen(false)}/>
        </div>
    </div>
  )
}

export default PlanOneDayMap