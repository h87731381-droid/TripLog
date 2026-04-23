'use client'
import React, { useState } from 'react'
import './planner.scss'
import PlanTextField from '../../comp/PlanTextField';
import PlanPopupPlace from '../../comp/PlanPopupPlace';
import PlanFullDay from '../../comp/PlanFullDay';
import { FiSave } from "react-icons/fi";
import PlanOneDayMap from '../../comp/PlanOneDayMap';
import PlanPopupScd from '../../comp/PlanPopupScd';

function page() {
  const [isOpen,setIsOpen]=useState(false)
  const [tripData,setTripData]=useState(false)

  if(!tripData===0)
  return (
    <div className='planMake'>
      <h1>여행일정</h1>
        <PlanTextField onOpen={()=>setIsOpen(true)}/>
        <PlanPopupPlace isOpen={isOpen} onClose={()=>setIsOpen(false)} />
    </div>
  )
  return(
    <div className='planEdit'>
      <div className='planEditTitle'>
              <h1>여행일정</h1>
              <div>
                <p>제주도 2박3일 가족여행</p> 
                <p>|</p> 
                <p>2025.02.02 ~ 2025.02.05</p>
              </div>
              <button>저장<FiSave/></button>
      </div>
      {/* <PlanFullDay/> */}
      <PlanOneDayMap onOpen={()=>setIsOpen(true)}/>
      {/* <PlanPopupScd isOpen={isOpen} onClose={()=>setIsOpen(false)}/> */}
    </div>
  ) 
}

export default page