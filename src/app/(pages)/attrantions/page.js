"use client";

import GeocoderMap from '@/app/comp/GeocoderMap'
import React, { useEffect, useState } from 'react'
import style from './attrantions.module.scss'
import { FiX } from "react-icons/fi";
import { authStore } from '@/app/store/authStore';
import axios from 'axios';
import { tripStore } from '@/app/store/tripStore';
import Guide from '@/app/comp/Guide';
import Loading from '@/app/comp/Loading';
import Link from 'next/link';




/* 이현주 - 추천관광지 */

function Page() {

  const [isPlan, setIsPlan] = useState(false); // 플랜 여부⭐
  const { tripData, setTripData, isGuide } = tripStore(); // 플랜 스토어⭐
  const { session, setShowLogin } = authStore(); // 로그인 여부
  //const [samplePopup, setSamplePopup] = useState(true); // 샘플
  const [activeMenu, setActiveMenu] = useState(1); // 카테고리 기본값:1(전체)
  const [selectItem, setSelectItem] = useState(); // 선택된 아이템
  const [listItems, setListItem] = useState([]); // 리스트
  const [listItemsDetail, setListItemsDetail] = useState([]); // 아이템 정보
  const [itemMarkers, setItemMarkers] = useState([]); // 마커 온오프.
  const [showPopup, setShowPopup] = useState(false); // 팝업
  const [region, setRegion] = useState("");//⭐
  //const [tripSchedule, setTripSchedule] = useState([]);


  // 마커 생성/삭제
  const handleToggleItem = async (item) => {

    const exists = itemMarkers.find((p) => p.contentid === item.contentid);
    let changeItem = [];

    if (exists) {
      // 제거 (비활성화)
      changeItem = itemMarkers.filter((p) => p.contentid !== item.contentid);
    } else {
      // 추가 (활성화)
      changeItem = [...itemMarkers, item];
    }

    await axios.post('/api/attrantions', { userId: session?.user?.email, itemMarkers: changeItem });
    setItemMarkers(changeItem);

    setTripData({ ...tripData, places: changeItem })
  };

  

  // api 호출
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/attrantions?id=${tripData._id}`);
      const result = await res.json();

      setListItem(result.data.response.body.items.item);
      setIsPlan(true);
      setRegion(result.selectedAddress);
      //console.log(result.userAttrantions);

      setItemMarkers(result.userAttrantions)

    };

    if (session && tripData) fetchData();



    //페이지 언마운팅
    async function saveItem() {
      await axios.post('/api/attrantions', { userId: session?.user?.email, itemMarkers });

    }
    // if(navigator) window.addEventListener('focus',saveItem);

    // return function(){      
    //   window.removeEventListener('focus',saveItem)
    // }
  }, [session, tripData]);
  



  // 데이터 헨들 함수
  const handleClickItem = async (item) => {
    setShowPopup(true); // 팝업 먼저 실행하고 데이터 불러오기
    const res = await fetch(`/api/attrantions-detail?contentid=${item.contentid}&contenttypeid=${item.contenttypeid}`);
    const data = await res.json();
    setListItemsDetail(item);
    setSelectItem(data);
  };





  // 메뉴 카테고리 고유값 만들기 (json)
  const menuItems = [
    { id: 1, name: '전체' },
    { id: 2, name: '관광명소' },
    { id: 3, name: '음식점' },
    { id: 4, name: '쇼핑' },
  ]

  // 카테고리 분류
  const filterItem = listItems.filter((item) => {
    if (activeMenu === 1 && item.firstimage) return true;
    //1번은 배열이 아니니까 조건만 맞으면 전체 내보냄

    const map = {
      2: ["12", "14"], // 관광지, 문화시설
      3: ["39"], // 음식점
      4: ["38"], // 쇼핑
    };

    return map[activeMenu]?.includes(item.contenttypeid) && item.firstimage;
    //contenttypeid가 같으면서 이미지도 있는 데이터가 activeMenu(카테고리)랑 맞는 것만 내보냄
    //activeMenu가 뭔지 어떻게 아냐? -> menuItems 클릭문에서 서로 만남
    //includes : 여러 값(배열) 중 하나라도 맞는지 확인하려고 쓰는 함수
  });





  // 샘플 팝업 열릴 때 스크롤 방지
  /* useEffect(() => {
    if (samplePopup) {
      document.body.style = "overflow:hidden;";
    } else {
      document.body.style = "overflow:visible;";
    }
  }, [samplePopup]); */



  // 화면 출력 시작
  return (
    <div className={style.all}>


      {(tripData?.status==='draft' || tripData?.status==='complete') && isGuide ? (
        !isPlan ? <Loading/>:
        <div className={style.content}>

          <div className={style.attrantionsLeft}>
            <div>
              <h1 className={style.title}>추천관광지</h1>
              <div className={style.region}>
                <h3 style={{ color: "black" }}>{region}</h3>
              </div>
            </div>
            <div className={style.map}>
              <GeocoderMap itemMarkers={itemMarkers} />
            </div>
          </div>

          <div className={style.contentRight}>

            <div className={style.attrantions}>
              {menuItems.map((i) => {
                return <div key={i.id} className={style.category}>
                  <button
                    onClick={() => setActiveMenu(i.id)}
                    className={activeMenu === i.id ? style.active : style.menu} >
                    {i.name}
                  </button>
                </div>
              })}
            </div>

            <div className={style.list}>


              {filterItem.map((i) => {
                return <Item
                  key={i.contentid}
                  i={i}
                  isActive={itemMarkers.some((m) => m.contentid === i.contentid)}
                  handleToggleItem={handleToggleItem}
                  handleClickItem={handleClickItem}
                  tripData={tripData}
                />
              })}

            </div>
          </div>
        </div>

      ) : (
         <div className={style.all}>
          <div className={style.content}>

            <div className={style.attrantionsLeft}>
              <div>
                <h1 className={style.title}>추천관광지</h1>
              </div>
            </div>
          </div>

            <Guide>
              <figure className="sampleGuide">
                    <p><img src="/imgs/all/guide_attrantions.jpg" /></p>

                    <figcaption className="sampleTitle">
                        <b>어디로 갈 지 고민하지 않아도 괜찮아요!</b>

                        <div className="sampleCaption">
                            <div className="sampleNote">
                                <p>선택한 지역의 추천 관광지를 한눈에 보고, 일정에 바로 추가해보세요. 지도에서 간략한 위치와 거리도 확인할 수 있어요.</p>
                                <span>* 지도는 위치·거리 확인용이며 클릭은 지원되지 않습니다.</span>
                            </div>
                            
                                <div className="sampleButton">
                                    <Link href='/planner'>
                                        <span>일정 등록하러 가기</span>
                                        <img src='/imgs/attrantions/fluent_calendar-edit-16-regular.svg' />
                                    </Link>
                                </div>
                            
                        </div>
                    </figcaption>
                </figure>
            </Guide>
        </div>
      


      )}


      <Popup setSelectItem={setSelectItem} setShowPopup={setShowPopup} showPopup={showPopup} selectItem={selectItem} listItemsDetail={listItemsDetail} />
    </div>

  )
}

export default Page;

// 관광지 리스트
function Item({ i, tripData, isActive, handleToggleItem, handleClickItem }) {
  return (
    <div className={style.item}>
      <p
        className={`${style.thumbnail} ${isActive ? style.active : ''}`}
        onClick={() => {
          tripData.status === 'draft' && handleToggleItem(i)
        }}   // 토글
      >
        <img src={i.firstimage} />
        <span>
          <img src='/imgs/attrantions/Frame 138.svg' />
        </span>
      </p>

      <div className={style.info}>
        <b>{i.title}</b>
        <p>{i.addr1}</p>

        <button
          className={style.link}
          onClick={() => handleClickItem(i)} // 상세보기 따로
        >
          <span>자세히 보기</span>
        </button>
      </div>
    </div>
  );
}


/* 팝업 - 자세히보기 */
function Popup({ showPopup, setShowPopup, selectItem, listItemsDetail, setSelectItem }) {

  if (!showPopup) return null; //⭐

  // 데이터 잘 갖고오는지 확인 console.log(listItemsDetail);

  // return 둘 중에 하나만 실행 (데이터 가져오는데 오래걸리면 로딩중 출력)
  if (!selectItem) {
    return (
      <Loading />
    );
  }
  // 배경 div(overlay)하나 더 만들어서 배경을 클릭해도 팝업이 닫히도록 함
  // e.stopPropagation() 사용해서 팝업 열리면 다른 버튼 클릭 막음
  return (
    <div className={`${style.overlay} ${showPopup ? style.on : style.off}`} onClick={() => setShowPopup(false)}>
 
      <div className={style.popup} onClick={(e) => e.stopPropagation()}>

        <div className={style.pHeader}>
          <h3>{listItemsDetail.title}</h3>
          <button className={style.X} onClick={() => { setShowPopup(false); setSelectItem(null); }}>
            <FiX />
          </button>
        </div>
        <img src={listItemsDetail.firstimage} />

        <div className={style.popupInfo}>
          <div className={style.add}>
            <b>주소</b>
            <p>{listItemsDetail.addr1}</p>
          </div>
          {selectItem?.firstmenu && <>
            <div className={style.add}>
              <b>대표 메뉴</b>
              <p>{selectItem.firstmenu}</p>
            </div>
            <div className={style.add}>
              <b>인기 메뉴</b>
              <p>{selectItem.treatmenu}</p>
            </div>
            <div className={style.add}>
              <b>주차</b>
              <p>{selectItem.packing ? selectItem.packing : "주차 정보 미제공"}</p>
            </div>
            <div className={style.add}>
              <b>전화번호</b>
              <p>{selectItem.infocenterfood}</p>
            </div>
            <div className={style.add}>
              <b>운영시간</b>
              <p>{selectItem.opentimefood}</p>
            </div>
            <div className={style.add}>
              <b>휴무</b>
              <p>{selectItem.restdatefood}</p>
            </div>
          </>
          }
        </div>
      </div>
    </div>
  );
}
