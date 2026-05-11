'use client'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')
import { MdCancel } from "react-icons/md";
import { authStore } from '@/app/store/authStore';
import { tripStore } from '@/app/store/tripStore';

function PlanTextField({onOpen,selectedAddress,setSelectedAddress,pickedPlace,setPickedPlace,onSubmit}) {
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs().add(1,'day'));
  const [tripTitle, setTripTitle] = useState("");
  const { session,setShowLogin } = authStore();//zustand 스토어 관리
  const { tripData, setTripData } = tripStore();//zustand 스토어 관리

  const handleStartChange = (newValue) => {
  setStart(newValue)

  // 오는날이 가는날보다 이전이면 자동 보정
  if (newValue && end && newValue.isAfter(end)) {
    setEnd(newValue.add(1, 'day'))
  }
  }
  
  //여행기간 초기화
  const resetDate = () => {
  const today = dayjs()
  setStart(today)
  setEnd(today.add(1,'day'))
  }

  //관심있는 관광지 삭제
  const handleRemove=(id)=>{
    setPickedPlace((prev)=>
    prev.filter((p)=>p.contentid !==id)
   );
  };
  
  //여행지,관심있는 관광지 전체 초기화
  const resetPlace=()=>{
    setSelectedAddress('')
    setPickedPlace([])
  }

  //완료버튼 누르면 db에 저장(여행일정 전체 틀)
  const createTrip = async ()=>{
    //const session = JSON.parse(sessionStorage.getItem("session"));
    const userId = session?.user?.email;//sessionStorage에서 userId로 쓸 이메일 가져오기

    console.log(userId);
    
    const res = await fetch('/api/planner',{//아직 id값 없음
      method:"POST",
      headers:{
        'Content-Type':'application/json'//json데이터 형식으로 보낸다
      },
      body:JSON.stringify({
        tripTitle:tripTitle,
        start,
        end,
        selectedAddress,
        places:pickedPlace,
        userId,
        status:'draft',
        createAt:new Date(),
        scd:[]
      })
    });
    
    const res2 = await fetch(`/api/planner?type=draft&session=${userId}`)
    const data = await res2.json();

    setTripData(data);//화면 전환
  }
  
  //제목,여행지 입력되야 완료버튼 활성화
  const isValid =
      tripTitle.trim() !== '' &&
      selectedAddress.trim() !== '';
  
  //로그인 전 각 항목 클릭시 로그인창 뜨게
  const handleAdd = async (e) => {
    e.preventDefault(); 
    if (!session || !session.user) {
      setShowLogin(); 
      return;
    }
  };

  //여행지 선택 input창 클릭시 로그인 전 후 분기
  const handlePlaceClick = (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      handleAdd(e);
      return;
    }
    onOpen();
  };

  return (
    <div className='planMakeBox'>
        <p>여행 일정 만들기</p>
        <form>
          <div className='planTitle'>
            <p>여행 제목</p>
            <TextField
            fullWidth
            variant="filled"
            placeholder="표시될 제목을 입력해주세요(최대 13자)"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value.slice(0, 13))}
            autoComplete="off"
            //sx={{ mb: 2 }}
            onClick={handleAdd}
            slotProps={{
              htmlInput: {
                maxLength: 13,
              },
            }}
            />
          </div>
          <div className='planDates'>
            <div className='planDatesTxt'>
              <p>여행 기간</p>
              <button type='button' onClick={resetDate}>초기화</button>  
            </div>
            <div className='datePick' onClick={handleAdd}>
              
              <LocalizationProvider 
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ko">
                <DatePicker
                    //label="가는날"
                    value={start}
                    onChange={handleStartChange}
                    format="YYYY.MM.DD (ddd)"
                    slotProps={{
                      textField:{
                        InputProps:{
                          sx:{'& .MuiInputBase-input':{
                            fontFamily: 'Pretendard, sans-serif',
                            color:'#db5656 !important',
                            fontSize:'10px'
                          }}

                        }

                      }
                    }}
                />
                <p>~</p>
                <DatePicker
                    //label="오는날"
                    value={end}
                    onChange={(newValue) => setEnd(newValue)}
                    minDate={start}
                    format="YYYY.MM.DD (ddd)"
                />
              </LocalizationProvider>

            </div>
          </div>
          <div className='planPlace'>
            <div className='planPlaceSelect'>
              <div className='planPlaceSelectTxt' >
                <p>여행지</p>
                <button type='button' onClick={resetPlace}>초기화</button>  
              </div>
              <TextField
              fullWidth
              variant="filled"
              placeholder="여행지 선택하기"
              onClick={handlePlaceClick}
              inputprops={{readOnly:true}}
              value={selectedAddress}
              autoComplete="off"
              //onChange={(e) => setTravelTitle(e.target.value)}
              //sx={{ mb: 2 }}
              />
            </div>
            <div className='planPlaceWish'>
              <p>관심있는 관광지</p>
              <div className='planPlaceWishCont'>
                {pickedPlace.length===0 ? (
                  <span className='placeWishTxt'>
                    추천 관광지 중 관심있는 관광지가 표시됩니다.
                  </span>
                ) : (
                  pickedPlace.map((place)=>(
                    <div className='placeWishList' key={place.contentid}>
                      <span>{place.title}</span>
                      <button 
                      type='button'
                      onClick={(e)=>{
                        e.stopPropagation();//부모 클릭막기
                        handleRemove(place.contentid)
                      }}
                      ><MdCancel/></button>
                    </div>
                  ))
                )
                }

              </div>
              {/* <TextField
              fullWidth
              variant="filled"
              placeholder="추천 관광지 중 관심있는 관광지가 표시됩니다. "
              value={pickedPlace.map(p=>p.title).join(", ")}
              //onChange={(e) => setTravelTitle(e.target.value)}
              //sx={{ mb: 2 }}
              /> */}
            </div>
          </div>
          <div className='planBtn'>
            <button>취소</button>
            <button 
            type='button'
            disabled={!isValid}
            className={!isValid ? 'disabledBtn' : ''}
            style={{
                    backgroundColor:!isValid ? "#AED1E6" : "#27678E",
                    pointerEvents:!isValid ? "none" : "auto",                    
                    //cursor: isValid ? 'pointer' : 'not-allowed',
                    }}
            onClick={()=>{
              createTrip()
            }}
            >완료</button>
          </div>
        </form>
    </div>
  )
}

export default PlanTextField