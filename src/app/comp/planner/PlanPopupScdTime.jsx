import dayjs, { Dayjs } from 'dayjs'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'

function PlanPopupScdTime() {
  const [startTime, setStartTime] = React.useState()
  const [endTime, setEndTime] = React.useState(/* dayjs().hour(0).minute(0) */)

  // State to control visibility of the clocks
  const [showStartTimeClock, setShowStartTimeClock] = React.useState(false)
  const [showEndTimeClock, setShowEndTimeClock] = React.useState(false)

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime)
    if (newStartTime && endTime && newStartTime.isAfter(endTime)) {
      setEndTime(newStartTime) // Adjust end time if start time moves past it
    } else if (!newStartTime) {
      setEndTime(null) // Clear end time if start time is cleared
    }
    setShowStartTimeClock(false) // Hide clock after selection
  }

  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue)
    setShowEndTimeClock(false) // Hide clock after selection
  }

/*   const shouldDisableEndTime = (timeValue, view) => {
    if (!startTime || !endTime) {
      return false // No restrictions if start or end time is not set
    }

    if (view === 'hours') {
      // Disable any hour that is strictly before the startTime's hour
      return timeValue < startTime.hour()
    }

    if (view === 'minutes') {
      // If the currently selected hour for endTime is after startTime's hour,
      // all minutes are valid.
      if (endTime.hour() > startTime.hour()) {
        return false
      }
      // If the currently selected hour for endTime is the same as startTime's hour,
      // then disable minutes that are strictly before startTime's minute.
      if (endTime.hour() === startTime.hour()) {
        return timeValue < startTime.minute()
      }
    }

    return false // Default to not disabling
  }
 */
  //DigitalClock바깥영역 누르면 없어지게
  const clockRef = useRef(null)

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (clockRef.current && !clockRef.current.contains(e.target)) {
      setShowStartTimeClock(false)
      setShowEndTimeClock(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
  }, [])

  return (
    <div className='TimeSelector'>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <div>
                <TextField
                placeholder="시작 시간"
                variant="filled"
                name='startTime'
                value={startTime ? startTime.format('HH:mm') : ''}
                inputprops={{
                readOnly: true,
                }}
                onClick={() => {setShowStartTimeClock(true)
                                setShowEndTimeClock(false)}} // Toggle visibility on click
                sx={{ mb: 2 }}
                />
                {showStartTimeClock && (
                <div 
                    ref={clockRef}
                    style={{
                        position: 'absolute',
                        top: '56px',
                        width:'145px',
                        left: 0,
                        zIndex: 10,
                        background: '#fff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                        }}>
                    <DigitalClock
                    value={startTime}
                    onChange={handleStartTimeChange}
                    />
                </div>
                )}
            </div>
            <div>~</div>
            <div>
                <TextField
                placeholder="종료 시간"
                variant="filled"
                name='endTime'
                value={endTime ? endTime.format('HH:mm') : ''}
                inputprops={{
                readOnly: true,
                }}
                onClick={() => {setShowEndTimeClock(true)
                                setShowStartTimeClock(false)
                                }} // Toggle visibility on click
                sx={{ mb: 2 }}
                />
                {showEndTimeClock && (
                <div 
                    ref={clockRef}
                    style={{
                        position: 'absolute',
                        top: '56px',
                        width:'145px',
                        right: 0,
                        zIndex: 10,
                        background: '#fff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                        }}>
                    <DigitalClock
                    value={endTime}
                    onChange={handleEndTimeChange}
                    minTime={startTime}
                    />
                </div>
                )}

            </div>
        </LocalizationProvider>
    </div>
  )
}

export default PlanPopupScdTime