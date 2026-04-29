'use client'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import { FaCircle } from "react-icons/fa"
import { FaBus } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { GrFormNext } from "react-icons/gr";
import { FiArrowLeftCircle } from "react-icons/fi";
import { FiArrowRightCircle } from "react-icons/fi";

function PlanFullDay({tripData}) {
  const [dayPlan,setDayPlan]=useState(false)
  const totalDays=tripData.end.diff(tripData.start, 'day') +1;//날짜 차이 계산
  const days=Array.from({length:totalDays}).map((_,idx)=>{//한번 배열로 빼야 슬라이드 가능 
    const date=tripData.start.add(idx,'day');
    return {idx,date};
  });
  
  //좌우 페이지 슬라이드
  const pages=[];
  for(let i = 0; i < days.length; i +=3){
    pages.push(days.slice(i,i+3));
  }
  const [page,setPage]=useState(0);
  const sliderRef=useRef(null);
  const next=()=>{
    sliderRef.current.scrollBy({left:window.innerWidth, behavior:'smooth'})
  };
  const prev=()=>{
    sliderRef.current.scrollBy({left:-window.innerWidth, behavior:'smooth'})
  };

  return (
    <div className='planEditCont'>
      <div className='slider' ref={sliderRef}>
        <div className='sliderTrack'
             style={{transform:`translateX(-${page * 100}%)`}}>
             
             {pages.map((pageDays,pageIdx)=>(
              <div className='page' key={pageIdx}>

                {pageDays.map(({idx,date})=>(
                  <div className='planEditDay' key={idx}>
                    <div className='planEditDayTxt'>
                      <p>Day{idx+1}</p>
                      <p>{date.format('YYYY.MM.DD (ddd)')}</p>
                      <a href='#'>지도 보기<GrFormNext/></a>
                    </div>
                    <div className='planEditDayBox'>
                        {/* 스케줄 하나도 없는 날일때 */}
                        <div className='planEditDayBoxEmpty'>
                            <a href=''>일정추가<FiPlus /></a>
                            <div>
                              <p>아직 추가된 일정이 없습니다!</p>
                              <p>일정을 추가해보세요!</p>
                            </div>
                        </div>
                    </div>
                  </div>

                ))}
              </div>
             ))}
        </div> 
      </div>

      {/* 좌우 페이지 이동 버튼 */}
      {page > 0 && (
        <button 
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className='slideLeftBtn'
        >
          <FiArrowLeftCircle/>
        </button>
      )}
      {page < pages.length -1 && (
        <button 
          onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
          className='slideRightBtn'
        >
          <FiArrowRightCircle/>
        </button>
      )}
            
  
      
      {/* <div className='planEditDay'>
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
      </div> */}
    </div>
  )
}

export default PlanFullDay