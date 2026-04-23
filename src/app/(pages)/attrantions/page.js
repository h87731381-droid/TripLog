"use client";

import GeocoderMap from '@/app/comp/GeocoderMap'
import React, { useEffect, useState } from 'react'
import style from './attrantions.module.scss'
import { FiX } from "react-icons/fi";

function Page() {

  const [selectedAddress, setSelectedAddress] = useState("");
  const menuItems = [
    { id: 1, name: '전체' },
    { id: 2, name: '관광명소' },
    { id: 3, name: '음식점' },
    { id: 4, name: '쇼핑' },
  ]

  const [activeMenu, setActiveMenu] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isPlan, setIsPlan] = useState(true);
  const [samplePopup, setSamplePopup] = useState(true);
  const [selectItem, setSelectItem] = useState();
  const [listItems, setListItem] = useState([]);
  const [listItemsDetail, setListItemsDetail] = useState([]);

  

  // api 호출
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/attrantions");
      const data = await res.json();

      setListItem(data.response.body.items.item);
    };

    fetchData();
  }, []);
  /* console.log(listItems); */

  // 데이터 헨들 함수
  const handleClickItem = async (item) => {
    const res = await fetch(`/api/attrantions-detail?contentid=${item.contentid}&contenttypeid=${item.contenttypeid}`);
    const data = await res.json();
    setListItemsDetail(item);
    setSelectItem(data);
    setShowPopup(true);
  };


  // 카테고리 분류
  const filterItem = listItems.filter((item) => {
  if (activeMenu === 1 && item.firstimage) return true;

  const map = {
    2: "12", // 관광명소
    3: "39", // 음식점
    4: "38", // 쇼핑
  };

  return item.contenttypeid === map[activeMenu] && item.firstimage;
});

// 팝업창 열릴 때 스크롤 방지
  useEffect(() => {
    if (showPopup || samplePopup) {
      document.body.style = "overflow:hidden;";
    } else {
      document.body.style = "overflow:visible;";
    }
  }, [showPopup, samplePopup]);



  // 화면 출력 시작
  return (
    <div className={style.all}>

      {samplePopup &&
        <div className={style.SamplePopup}>
          <button className={style.sampleClose} onClick={() => setSamplePopup(false)}>
            <span>샘플 닫기</span>
            <FiX />
          </button>
          <img src='/imgs/attrantions/attSample.jpg' />
        </div>
      }

      {isPlan ? (

        <div className={style.content}>

          <div className={style.attrantionsLeft}>
            <div>
              <h1 className={style.title}>추천관광지</h1>
              <div className={style.region}>
                <h3 style={{ color: "black" }}>제주도</h3>
                <div className={style.regionCategory}>
                  <span>애월</span>
                  <span>제주시</span>
                  <span>서귀포시</span>
                </div>
              </div>
            </div>
            <div className={style.map}>
              <GeocoderMap selectedAddress={selectedAddress} />
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
                return <Item key={i.contentid} i={i}  setShowPopup={setShowPopup} setSelectItem={setSelectItem} handleClickItem={handleClickItem} />
              })}

            </div>
          </div>
        </div>

      ) : (
        <div className={style.noneAll}>
          <h1 className={style.title}>추천관광지</h1>
          <div className={style.noneContent}>
            <h2 className={style.subtitle}>여행 일정을 등록하세요!</h2>
            <button>
              <span>일정 등록하러 가기</span>
              <img src='/imgs/attrantions/fluent_calendar-edit-16-regular.svg' />
            </button>
          </div>
        </div>
      )}


      {showPopup && <Popup setShowPopup={setShowPopup} selectItem={selectItem}   listItemsDetail={listItemsDetail}/>}
    </div>

  )
}

export default Page;

// 관광지 리스트
function Item({i, handleClickItem}){
  const [activeImg, setActiveImg] = useState(false);

  return <div className={style.item} >
                  <p className={`${style.thumbnail} ${activeImg ? style.active : ''}`} onClick={() => setActiveImg(toggle => !toggle)}>
                    <img src={i.firstimage} />
                    <span><img src='/imgs/attrantions/Frame 138.svg' /></span>
                  </p>

                  <div className={style.info}>
                    <b>{i.title}</b>
                    <p>{i.addr1}</p>
                    {
                      <button
                       className={style.link} 
                       onClick={() => handleClickItem(i) }
                      >
                        <span>자세히 보기</span>
                      </button>
                    }
                  </div>
                </div>
}



/* 팝업 */
function Popup({ setShowPopup, selectItem, listItemsDetail }) {

  console.log(listItemsDetail);
  
  if (!selectItem) return null;

  return (
      <div className={style.popup}>
        <div className={style.pHeader}>
          <h3>{listItemsDetail.title}</h3>
          <button className={style.X} onClick={() => setShowPopup(false)}>
            <FiX />
          </button>
        </div>
        <img src={listItemsDetail.firstimage} />
      
        <div className={style.popupInfo}>
          <div className={style.add}>
            <b>주소</b>
            <p>{listItemsDetail.addr1}</p>
          </div>
          {selectItem.firstmenu && <>
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
              <p>{selectItem.packing}</p>
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
  );
}
