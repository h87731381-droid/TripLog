'use client'
import { TextField } from '@mui/material'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

function PlanPopupScd({isOpen,onClose}) {
  const [value,setValue]=useState(null);
  const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

  return (
    <div className='ppsBoxContainer'>
        <div className='ppsBox'>
            <div className='ppsTitle'>
                <p>일정 추가</p>
                <div className='ppsBoxClose'>
                    <FiX onClick={onClose}/>
                </div>
            </div>
            <form>
                <div className='popupScdTitle'>
                    <p>일정 제목</p>
                    <TextField
                    fullWidth
                    variant="filled"
                    placeholder="표시될 제목을 입력해주세요"
                    //value={travelTitle}
                    //onChange={(e) => setTravelTitle(e.target.value)}
                    //sx={{ mb: 2 }}
                    />
                </div>
                <div className='popupScdTime'>
                    <p>시간</p>
                    <div className='TimeSelector'>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <TextField
                                    label="Selected Time"
                                    value={value ? value.format('HH:mm') : ''} // Format the Dayjs object to a string
                                    /* InputProps={{
                                        readOnly: true, // Make the input read-only
                                    }} */
                                    /* sx={{ mb: 2 }} // Add some bottom margin for spacing */
                                    />
                                    <DigitalClock
                                    value={start}
                                    onChange={(newValue) => setValue(newValue)}
                                    />
                            </LocalizationProvider>
                        </div>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <TextField
                                    label="Selected Time"
                                    value={value ? value.format('HH:mm') : ''} // Format the Dayjs object to a string
                                    /* InputProps={{
                                        readOnly: true, // Make the input read-only
                                    }} */
                                    /* sx={{ mb: 2 }} // Add some bottom margin for spacing */
                                    />
                                    <DigitalClock
                                    value={end}
                                    onChange={(newValue) => setValue(newValue)}
                                    />
                            </LocalizationProvider>
                        </div>

                    </div>
                </div>
                <div className='popupScdPlace'>
                    <div className='popupScdPlaceInput'>
                        <p>장소</p>
                        <TextField/>
                    </div>
                    <div className='popupScdPlaceSelect'>
                        <div className='popupScdPlaceWish'>
                            <p>관심있는 관광지</p>

                        </div>
                        <div className='popupScdPlaceList'>
                            <p>거리순 추천 관광지</p>

                        </div>

                    </div>
                </div>
                <div className='popupScdMove'>
                    <p>교통</p>
                    <div className='popupScdMoveSelect'>

                    </div>   

                </div>
                <div className='popupScdBtn'>
                    <button>취소</button>
                    <button>완료</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default PlanPopupScd