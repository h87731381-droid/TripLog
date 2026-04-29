'use client'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')
import { MdCancel } from "react-icons/md";

function PlanTextField({onOpen,selectedAddress,setSelectedAddress,pickedPlace,setPickedPlace,onSubmit}) {
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs().add(1,'day'));
  const [tripTitle, setTripTitle] = useState("");

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
  return (
    <div className='planMakeBox'>
        <p>여행 일정 만들기</p>
        <form>
          <div className='planTitle'>
            <p>여행 제목</p>
            <TextField
            fullWidth
            variant="filled"
            placeholder="표시될 제목을 입력해주세요"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
            //sx={{ mb: 2 }}
            />
          </div>
          <div className='planDates'>
            <div className='planDatesTxt'>
              <p>여행 기간</p>
              <button type='button' onClick={resetDate}>초기화</button>  
            </div>
            <div className='datePick'>
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
              onClick={onOpen}
              inputprops={{readOnly:true}}
              value={selectedAddress}
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
            onClick={()=>{
              onSubmit({
                tripTitle:tripTitle,
                start:start,
                end:end
              })
            }}
            >완료</button>
          </div>
        </form>
    </div>
  )
}

export default PlanTextField