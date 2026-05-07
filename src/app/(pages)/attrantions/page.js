"use client";

import GeocoderMap from '@/app/comp/GeocoderMap'
import React, { useEffect, useState } from 'react'
import style from './attrantions.module.scss'
import './loadingLoof.css'
import { FiX } from "react-icons/fi";
import { authStore } from '@/app/store/authStore';
import axios from 'axios';

//import { tripStore } from '../../store/tripStore';



/* 이현주 - 추천관광지 */




function Page() {
  
  const [isPlan, setIsPlan] = useState(false); // 플랜 여부⭐
  // const { tripData, setTripData } = tripStore(); // 플랜 스토어⭐
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
        changeItem =  itemMarkers.filter((p) => p.contentid !== item.contentid);
      } else {
        // 추가 (활성화)
        changeItem =  [...itemMarkers, item];
      }

    await axios.post('/api/attrantions',{userId:session?.user?.email, itemMarkers:changeItem});
    setItemMarkers(changeItem);
  };



  // api 호출
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/attrantions?userId=${session.user.email}`);
      const result = await res.json();

      setListItem(result.data.response.body.items.item);
      setIsPlan(true);
      setRegion(result.selectedAddress);
      //console.log(result.userAttrantions);
      
      setItemMarkers(result.userAttrantions)
      
    };

    if(session) fetchData();



    //페이지 언마운팅
    async function saveItem(){
      await axios.post('/api/attrantions',{userId:session?.user?.email, itemMarkers});
      
    }    
    // if(navigator) window.addEventListener('focus',saveItem);

    // return function(){      
    //   window.removeEventListener('focus',saveItem)
    // }
  }, [session]);
  



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

      {/* {samplePopup &&
        <div className={style.SamplePopup}>
          <button className={style.sampleClose} onClick={() => setSamplePopup(false)}>
            <span>샘플 닫기</span>
            <FiX />
          </button>

          <picture>
            <source srcSet="/imgs/attrantions/attSample-1900.jpg" media="(min-width: 1920px)" />
            <source srcSet="/imgs/attrantions/attSample-1024.jpg" media="(min-width: 1024px)" />
            <source srcSet="/imgs/attrantions/attSample-951.jpg" media="(min-width: 951px)" />
            <source srcSet="/imgs/attrantions/attSample-481.jpg" media="(min-width: 481px)" />
            <source srcSet="/imgs/attrantions/attSample-360.jpg" media="(min-width: 360px)" />
            <img src="attSample-360.jpg" alt="이미지" />
          </picture>

          <div className={style.SampleGuide}>

            <div className={style.guideRegion}>
              <div></div>
              <p>여행지를 확인하세요.</p>
            </div>

            <div className={style.guideMap}>
              <div>
                <img src='/imgs/attrantions/bxs_map.svg' />
              </div>
              <p>내가 등록한 관광명소의 위치를 확인할 수 있어요.</p>
            </div>

            <div className={style.guideDetile}>
              <div></div>
              <p>자세히 보기를 통해 상세정보를 확인하세요.</p>
            </div>

            <div className={style.guideUpdate}>
              <div></div>
              <p>여행일정에 등록한 관광명소를 추가하거나 삭제할 수 있어요.</p>
            </div> 

          </div>

        </div>
      } */}

      {isPlan ? (

        <div className={style.content}>

          <div className={style.attrantionsLeft}>
            <div>
              <h1 className={style.title}>추천관광지</h1>
              <div className={style.region}>
                <h3 style={{ color: "black" }}>{region}</h3>
                {/* <div className={style.regionCategory}>
                  <span>애월</span>
                  <span>제주시</span>
                  <span>서귀포시</span>
                </div> */}
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
                />
              })}

            </div>
          </div>
        </div>

      ) : (
        <div className={style.noneAll}>
          <h1 className={style.title}>추천관광지</h1>
          <div className={style.noneContent}>
            <h2 className={style.subtitle}>여행 일정을 등록하세요!</h2>
            <a href='/planner'>
              <span>일정 등록하러 가기</span>
              <img src='/imgs/attrantions/fluent_calendar-edit-16-regular.svg' />
            </a>
          </div>
        </div>
      )}


      <Popup setSelectItem={setSelectItem} setShowPopup={setShowPopup} showPopup={showPopup} selectItem={selectItem} listItemsDetail={listItemsDetail} />
    </div>

  )
}

export default Page;

// 관광지 리스트
function Item({ i, isActive, handleToggleItem, handleClickItem }) {
  return (
    <div className={style.item}>
      <p
        className={`${style.thumbnail} ${isActive ? style.active : ''}`}
        onClick={() => handleToggleItem(i)}   // 토글
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
      <div className={`loading ${showPopup ? 'on' : ''}`}>
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="50px"
          height="50px"
          viewBox="0 0 40 40"
          xmlSpace="preserve"
        >
          <path
            opacity="0.2"
            fill="#000"
            d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
          c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
          />
          <path
            fill="#000"
            d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
          C22.32,8.481,24.301,9.057,26.013,10.047z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <span className='loadingText'>로딩중...</span>
      </div>
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
