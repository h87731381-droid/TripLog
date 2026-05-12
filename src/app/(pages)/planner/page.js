'use client'
import React, {  useEffect, useState } from 'react'
import './planner.scss'
import PlanTextField from '../../comp/planner/PlanTextField';
import PlanPopupPlace from '../../comp/planner/PlanPopupPlace';
import PlanFullDay from '../../comp/planner/PlanFullDay';
import { FiCheck, FiSave, FiX } from "react-icons/fi";
import PlanOneDayMap from '../../comp/planner/PlanOneDayMap';
import PlanPopupScd from '../../comp/planner/PlanPopupScd';
import dayjs, { Dayjs } from 'dayjs'
import { tripStore } from '../../store/tripStore';
import { authStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import { FiCalendar } from "react-icons/fi";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Guide from '@/app/comp/Guide';
import Link from 'next/link';

function page() {
  const [isOpen,setIsOpen]=useState(false)
  const [selectedAddress, setSelectedAddress] = useState("");
  const [pickedPlace, setPickedPlace] = useState([]); //배열 데이터
  const [mapCenter, setMapCenter] = useState(null);
  
  const { session, setShowLogin } = authStore();//zustand 스토어 관리
  const { tripData, setTripData, isGuide } = tripStore();//zustand 스토어 관리
  //const [tripData, setTripData]=useState(null)//현재 작업중이라 수정가능한 여행(화면 분기용)

  const [tripList, setTripList]=useState([])//완료된 여행으로 보관함페이지에서 씀(수정 불가)
  const router = useRouter();

  //여행 기간 수정
  const [isDateEdit, setIsDateEdit] = useState(false);
  const [start, setStart] = useState(
  tripData?.start ? dayjs(tripData.start) : null
  );

  const [end, setEnd] = useState(
    tripData?.end ? dayjs(tripData.end) : null
  );

  const handleStartChange = (newValue) => {
    setStart(newValue);
  };
  
  useEffect(() => {
  if (tripData) {
    setStart(
      tripData?.start ? dayjs(tripData.start) : null
    );

    setEnd(
      tripData?.end ? dayjs(tripData.end) : null
    );
  }
  }, [tripData]);
  
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

  //로그인 전 각 항목 클릭시 로그인창 뜨게
  const handleAdd = async () => {
    //e.preventDefault(); 
    if (!session || !session.user) {
      setShowLogin(); 
      return;
    }
  };

  // 여행 완료 버튼
  const handleComplete = async () => {

    const ok = window.confirm(
      "완료된 여행은 '나의 기록'에 보관되며 더이상 수정이 불가합니다. 정말 완료하시겠습니까?"
    );
    
    // 취소 눌렀으면 종료
    if (!ok) return false;
    await fetch(`/api/planner`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editingId: tripData._id,
        type: "complete",
      }),
    });
    setTripData(null);
    return true;
  };
  
  if(!session || !isGuide){
    return(
      <div className='planEdit'>
        <div className='planEditTitle'>
          <h1>여행일정</h1>
        </div>
        <div>
          <Guide>
            <figure className="sampleGuide">
                  <p><img src="/imgs/all/guide_planner.jpg" /></p>

                  <figcaption className="sampleTitle">
                      <b>내가 만드는 여행 가이드!</b>

                      <div className="sampleCaption">
                          <div className="sampleNote">
                              <p>자유롭게 일정을 추가하고 여행을 계획해보세요. 미리 찜해둔 장소는 물론, 선택한 지역의 다양한 명소도 함께 추천해드려요. 지도에서 위치까지 한눈에 확인할 수 있어요.</p>
                              <span>* 지도는 위치 확인용이며 클릭은 지원되지 않습니다.</span>
                          </div>

                          <div className="sampleButton">
                            {
                              !session &&
                                <Link href='/planner' onClick={()=>handleAdd()}>
                                    <span onClick={()=>handleAdd}>로그인하러 가기</span>
                                    {/* <img src='/imgs/attrantions/fluent_calendar-edit-16-regular.svg' /> */}
                                </Link>
                            }
                          </div>
                      </div>
                  </figcaption>
              </figure>
          </Guide>       
        </div>
      </div>
    )
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
                <div>
                  <p>{tripData?.tripTitle}</p> 
                  <p>|</p> 
                  <div className='tripDate'>
                    {!isDateEdit ? (
                      <>
                        {tripData?.start && dayjs(tripData.start).format('YYYY.MM.DD')} ~{" "}
                        {tripData?.end && dayjs(tripData.end).format('YYYY.MM.DD')} 
                        <div>
                          <FiCalendar 
                          className='calendarEditBtn'
                          onClick={() => setIsDateEdit(true)} />
                        </div>
                      </>
                    ):(
                      <div className='dateEditBox'>
                        <LocalizationProvider 
                          dateAdapter={AdapterDayjs}
                          adapterLocale="ko">
                          <DatePicker
                            value={start}
                            onChange={handleStartChange}
                            format="YYYY.MM.DD (ddd)"
                            slotProps={{
                              textField: {
                                sx: {
                                  width: '175px',
                                  fontSize:'10px',
                                  '@media(max-width:870px)':{
                                    width:'60px',
                                  },

                                  '& .MuiInputBase-root': {
                                    height: '40px',
                                    borderRadius: '10px',
                                    backgroundColor: '#fff',
                                  },

                                  '& .MuiPickersSectionList-root': {
                                    width: '120px !important',
                                  },

                                  '& input': {
                                    padding: '8px 14px',
                                    fontSize: '14px',
                                    fontFamily: 'Pretendard, sans-serif',
                                  },

                                  '& fieldset': {
                                   
                                  },
                                },
                              },
                            }}
                          />

                          <span>~</span>

                          <DatePicker
                            value={end}
                            onChange={(newValue) => setEnd(newValue)}
                            minDate={start}
                            format="YYYY.MM.DD (ddd)"
                            slotProps={{
                              textField:{
                                sx:{
                                  width:'175px',
                                  '@media(max-width:870px)':{
                                    width:'60px',
                                  },
                                }
                              }
                            }}
                          />

                          <FiCheck
                            className='dateCheckBtn'
                            onClick={async () => {
                            const updatedStart = start
                              ? start.format("YYYY-MM-DD")
                              : null;

                            const updatedEnd = end
                              ? end.format("YYYY-MM-DD")
                              : null;

                             // 새 객체 생성
                            const updatedTripData = {
                              ...tripData,
                              start: updatedStart,
                              end: updatedEnd
                            };
                            
                            //화면 즉시 반영
                            setTripData(updatedTripData);

                            // DB 저장
                            await fetch('/api/planner', {
                              method:'PUT',
                              headers:{
                                'Content-Type':'application/json'
                              },
                              body:JSON.stringify({
                                editingId: tripData._id,
                                type:'dateEdit',
                                start: updatedStart,
                                end: updatedEnd
                              })
                            });
                              setIsDateEdit(false);
                            }}
                          />

                          <FiX
                            className='dateCancelBtn'
                            onClick={() => {

                              // 원래값 복구
                              setStart(
                                tripData?.start ? dayjs(tripData.start) : null
                              );

                              setEnd(
                                tripData?.end ? dayjs(tripData.end) : null
                              );

                              setIsDateEdit(false);
                            }}
                          />
                        </LocalizationProvider>
                      </div>

                    )}
                  </div>
                </div>
                {tripData.status==='draft' && 
                  <button 
                    onClick={async () => {
                    const success = await handleComplete();
                    if (success) {
                      router.push('/before');
                    }
                  }}
                  >
                  여행완료<FiCheck /></button> 
                }

              </div>
      </div>
      <PlanFullDay 
        tripData={tripData}
        setTripData={setTripData}
      /> 
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