'use client'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import { FaCircle } from "react-icons/fa"
import { FaBus } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { GrFormNext } from "react-icons/gr";

function PlanFullDay() {
  const [dayPlan,setDayPlan]=useState(false)

  return (
    <div className='planEditCont'>
      <div className='planEditDay'>
        <div className='planEditDayTxt'>
          <p>Day1</p>
          <p>2025.02.02 월</p>
          <a href='#'>지도 보기<GrFormNext/></a>
        </div>
        <div className='planEditDayBox'>
          {dayPlan ? 
            (<div className='planEditDayBoxEmpty'>
                <a href=''>일정추가<FiPlus /></a>
                <div>
                  <p>아직 추가된 일정이 없습니다!</p>
                  <p>일정을 추가해보세요!</p>
                </div>
            </div>
            )
            :
            (<div className='planEditDayBoxFilled'>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <a href=''>일정추가<FiPlus /></a>
            </div>
            )
          }
        </div>
      </div>
      <div className='planEditDay'>
        <div className='planEditDayTxt'>
          <p>Day2</p>
          <p>2025.02.03 월</p>
          <a href='#'>지도 보기<GrFormNext/></a>
        </div>
        <div className='planEditDayBox'>
          {dayPlan ? 
            (<div className='planEditDayBoxEmpty'>
                <a href=''>일정추가<FiPlus /></a>
                <div>
                  <p>아직 추가된 일정이 없습니다!</p>
                  <p>일정을 추가해보세요!</p>
                </div>
            </div>
            )
            :
            (<div className='planEditDayBoxFilled'>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <a href=''>일정추가<FiPlus /></a>
            </div>
            )
          }
        </div>
      </div>
      <div className='planEditDay'>
        <div className='planEditDayTxt'>
          <p>Day3</p>
          <p>2025.02.04 월</p>
          <a href='#'>지도 보기<GrFormNext/></a>
        </div>
        <div className='planEditDayBox'>
          {dayPlan ? 
            (<div className='planEditDayBoxEmpty'>
                <a href=''>일정추가<FiPlus /></a>
                <div>
                  <p>아직 추가된 일정이 없습니다!</p>
                  <p>일정을 추가해보세요!</p>
                </div>
            </div>
            )
            :
            (<div className='planEditDayBoxFilled'>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                  </div>
                </div>
                <div className='oneSchedule'>
                  <p className='scdTime'>11:30</p>
                  <div className='timeLine'>
                    <div className='circle'><FaCircle /></div>
                  </div>
                  <div className='scdContent'>
                    <p className='scdTitle'>출발하고 밥먹고 가기</p>
                    <p className='scdSpot'>의정부역</p>
                    <div className='scdMove'>
                      <p className='scdMoveIcon'><FaBus/></p>
                      <p>공항철도</p>
                    </div>
                  </div>
                </div>
                <a href=''>일정추가<FiPlus /></a>
            </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default PlanFullDay