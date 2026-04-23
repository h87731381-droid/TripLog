'use client'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function PlanTextField({onOpen}) {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

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
            //value={travelTitle}
            //onChange={(e) => setTravelTitle(e.target.value)}
            //sx={{ mb: 2 }}
            />
          </div>
          <div className='planDates'>
            <div className='planDatesTxt'>
              <p>여행 기간</p>
              <button>초기화</button>  
            </div>
            <div className='datePick'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    //label="가는날"
                    value={start}
                    onChange={(newValue) => setStart(newValue)}
                />
                <p>~</p>
                <DatePicker
                    //label="오는날"
                    value={end}
                    onChange={(newValue) => setEnd(newValue)}
                    minDate={start}
                />
              </LocalizationProvider>

            </div>
          </div>
          <div className='planPlace'>
            <div className='planPlaceSelect'>
              <p>여행지</p>
              <TextField
              fullWidth
              variant="filled"
              placeholder="여행지 선택하기"
              onClick={onOpen}
              InputProps={{readOnly:true}}
              //value={travelTitle}
              //onChange={(e) => setTravelTitle(e.target.value)}
              //sx={{ mb: 2 }}
              />
            </div>
            <div className='planPlaceWish'>
              <p>관심있는 관광지</p>
              <TextField
              fullWidth
              variant="filled"
              placeholder="추천 관광지 중 관심있는 관광지가 표시됩니다. "
              //value={travelTitle}
              //onChange={(e) => setTravelTitle(e.target.value)}
              //sx={{ mb: 2 }}
              />
            </div>
          </div>
          <div className='planBtn'>
            <button>취소</button>
            <button>완료</button>
          </div>
        </form>
    </div>
  )
}

export default PlanTextField