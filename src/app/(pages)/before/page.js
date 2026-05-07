"use client";

import React, { useEffect, useState } from 'react'
import style from './before.module.scss';
import { authStore } from '@/app/store/authStore';
import dayjs, { Dayjs } from 'dayjs'
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { tripStore } from '@/app/store/tripStore';
import { FiArrowLeftCircle, FiArrowRightCircle, FiPlus } from 'react-icons/fi';

function page() {
  const {tripData, setTripData} = tripStore();
  const [tripList, setTripList] = useState([]);
  const { session } = authStore();
  const userId = session?.user?.email;
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(0);
  const router = useRouter();
  
  //데이터 가져오는 함수
  const getCompleteTrips = async () => {
    const res = await fetch(`/api/planner?session=${userId}`);
    const result = await res.json();
    setTripList(result);
  };
  
  useEffect(() => {
    if (!userId) return;
    getCompleteTrips();
  }, [userId]);
  console.log(tripData);
  
  //전체,진행중,완료 탭버튼 필터링
  const filterData = Array.isArray(tripList)
   ? tripList.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'draft') return item.status === 'draft';
    if (activeTab === 'complete') return item.status === 'complete';
    
    return false;
  })
  : [];
  
  //2줄 6개가 최대이고 그이상 넘어가면 페이지 이동
  const pages = [];
  for (let i = 0; i < filterData.length; i += 6) {
    pages.push(filterData.slice(i, i + 6));
  }

  return (
    <div>
      <section className={style.listSection}>
        <div className={style.upper}>
          <div>
            <h1 className={style.title}>나의 기록</h1>
            <div className={style.tabBtn}>
              <button
                onClick={() => setActiveTab('all')} 
                className={`${style.tabBtn} ${activeTab === 'all' ? style.active : ''}`}
                >
                  전체
              </button>
              <button 
                onClick={() => setActiveTab('draft')} 
                className={`${style.tabBtn} ${activeTab === 'draft' ? style.active : ''}`}
                >
                  진행중인 여행
              </button>
              <button 
                onClick={() => setActiveTab('complete')} 
                className={`${style.tabBtn} ${activeTab === 'complete' ? style.active : ''}`}
                >
                  완료된 여행
              </button>
            </div>
          </div>
          {tripList?.length > 0 &&
           tripList.every(item => item.status === 'complete') && (
            <button onClick={() => {router.push('/planner'); setTripData(null);}}>
              새 일정 만들기
              <FiPlus />
            </button>
          )}
        </div>
        <div className={style.tripBox}>
          {filterData.length === 0 ? (
            <div className={style.emptyBox}>
            
              {activeTab === 'all' && (
                <p>아직 기록된 여행이 없어요!</p>
              )}

              {activeTab === 'draft' && (
                <p>진행중인 여행이 없어요!</p>
              )}

              {activeTab === 'complete' && (
                <p>아직 완료된 여행이 없어요!</p>
              )}
            </div>
          ) : (
            pages[page]?.map((complete)=>(
            <article 
              className={`${style.contents} ${
                complete.status === 'draft'
                  ? style.draftContainer
                  : style.completeContainer
              }`}
              key={complete._id}
              >
              <span
                className={`${style.status} ${
                  complete.status === 'draft'
                    ? style.draft
                    : style.complete
                }`}
              >
                {complete.status === 'draft' ? '진행중인 여행' : '완료된 여행 ✓'}
              </span>
              <div className={style.trip}>
                <b>{complete.tripTitle}</b>
                <p>{complete?.start && dayjs(complete.start).format('YYYY.MM.DD')} ~{" "}
                   {complete?.end && dayjs(complete.end).format('YYYY.MM.DD')} 
                </p>
              </div>
              <button className={style.detail}  onClick={()=>{setTripData(complete); router.push('/planner');}}>
                <span>
                  {complete.status === 'draft'
                  ? '이어서 수정하기'
                  : '이동하기'
                  }</span>
                <img src='/imgs/before/grommet-icons_next.svg' />
              </button>
            </article>
            ))

          )
          }
        </div>

        {/* 좌우 페이지 이동 버튼 */}
          {page > 0 && (
            <button 
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className={style.slideLeftBtn}
            >
              <FiArrowLeftCircle/>
            </button>
          )}
          {page < pages.length -1 && (
            <button 
              onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
              className={style.slideRightBtn}
            >
              <FiArrowRightCircle/>
            </button>
          )}
      </section>


      {/* <section className={style.detailSection}>
        <div className={style.contentsDetail}>
          <h1 className={style.title}>나의 기록</h1>
          <div className={style.planName}>
            <div>
              <p>ㅌㅌㅌㅌ{tripData?.tripTitle}</p> 
              <p>|</p> 
              <p>
                ㅌㅌㅌㅌ{tripData?.start && dayjs(tripData.start).format('YYYY.MM.DD')} ~{" "}
                ㅌㅌㅌㅌ{tripData?.end && dayjs(tripData.end).format('YYYY.MM.DD')} 
              </p>
            </div>
            <img src='/imgs/before/material-symbols_arrow-back.svg' />
          </div>
        </div>
        <nav>
          <div className={style.menu}>
            <Link href="/planner" className={pathname === '/planner' ? 'active' : ''}>여행일정</Link>
            <Link href="/budget" className={pathname === '/budget' ? 'active' : ''}>여행경비</Link>
            <Link href="/checkList" className={pathname === '/checkList' ? 'active' : ''}>체크리스트</Link>
            <Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>갤러리</Link>
          </div>
        </nav>
        
        <div className={style.schedule}>
          <div className={style.planHeader}>
            <div className={style.date}>
              <b>Day 1</b>
              <p>2026.05.06 월</p>
            </div>
            <button className={style.view}>
              <span>지도보기</span>
              <img src='/imgs/before/grommet-icons_next.svg' />
            </button>
          </div>
          <div className={style.planList}>
            <ul className={style.planData}>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
          </div>
        </div>
      </section> */}


    </div>
  )
}

export default page