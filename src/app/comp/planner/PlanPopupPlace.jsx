'use client'
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi';
import GeocoderMap from '../GeocoderMap';
import { FaCircleCheck } from "react-icons/fa6";
import GeocoderMapPlanPopup from '../GeocoderMapPlanPopup';


function PlanPopupPlace({
    isOpen,
    onClose,
    onSave,
    mapCenter,
    setMapCenter,
    selectedAddress: parentAddress,
    pickedPlace: parentPicked,
    }) {
    const [savedDates, setSavedDates]=useState();
    const [selectedAddress, setSelectedAddress] = useState("");//실제 검색용
    const [region, setRegion]=useState('');
    const [listItems, setListItem] = useState([]);
    const [isClick, setIsClick] = useState(false);
    const [pickedPlace,setPickedPlace]=useState([]);
    const [inputValue, setInputValue] = useState("");//입력용


    // api 호출
    useEffect(() => {
     if(!selectedAddress) return;

     const fetchData = async () => {
       const res = await fetch(`/api/planner?keyword=${selectedAddress}`);
       console.log(res);
       if(!res.ok){
        console.error("api 실패",res.status);
        return;
       }
       const data = await res.json();
    
       const items=data?.response?.body?.items?.item || [];
       setListItem(items);
     };
     fetchData();
    }, [selectedAddress]);

    //추천관광지 찜 토글함수
    const handlePick=(place)=>{
        setPickedPlace((prev)=>{
            const exists=prev.find((v)=>v.contentid===place.contentid);
            
            //이미 찜되있는거면 찜해제
            if(exists){
                return prev.filter((v)=>v.contentid!==place.contentid);
             //아니면 찜
            }else{
                return [...prev,place];
            }
        });
    };

    /* listItems.filter((item)=>{

        //데이터들 중 관광명소만 나오게
        const map={
            2:'12'}
        
        //입력한 지역명이 데이터 주소에 포함되어있다면
         const matchAddress =
        !selectedAddress || item.addr1.includes(selectedAddress);

        return item.contenttypeid===map 
    }) */
    
    //초기화 버튼
    const resetPlace = () => {
      setPickedPlace([]);
      }
    
    //팝업닫히면 모두 자동초기화
    useEffect(() => {
        if (isOpen) {
            setInputValue(parentAddress || ""); //parentAddress 저장된 값
            setSelectedAddress(parentAddress || "");
            setPickedPlace(parentPicked || []);
        }
        }, [isOpen,parentPicked, parentAddress]);

    if(!isOpen) return null; 
  return (
    <div className={`pppBoxContainer ${isOpen ? "active" : ""}`}>
        <div className='pppBoxBg' onClick={onClose}></div>
        <div className='pppBox'>
            <div className='pppTitle'>
                <p>어디로 여행하실 예정인가요?</p>
                <div className='pppBoxClose'>
                    <FiX onClick={onClose}/>
                </div>
            </div>
            <TextField 
                fullWidth
                variant="filled"
                placeholder="여행지 지역 한 곳을 입력해주세요(예: 제주도 / 경주시)"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    
                    //입력창 빈값이면 마커 초기화
                    if (e.target.value.trim() === "") {
                        setPickedPlace([]);   // 마커 제거
                        setSelectedAddress('')//관광지리스트 제거
                    }
                 }}
                
                //엔터를 쳐야 검색실행되며 
                onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                        setSelectedAddress(inputValue);
                    }
                }}
                //sx={{ mb: 2 }}
                //value={inputValue}
            />
            <div className='pppContents'>
                <div className='pppMap'>
                    <GeocoderMapPlanPopup 
                    selectedAddress={selectedAddress} //검색용
                    itemMarkers={pickedPlace} //마커용
                    mapCenter={mapCenter}
                    setMapCenter={setMapCenter}

                    
                     />
                </div>
                {!selectedAddress ? 
                    (<div className='pppListEmpty'>
                        <p>입력된 여행지의 추천 관광명소가 표시됩니다.</p>
                        <p>관광지와 문화시설이 추천됩니다.</p>
                    </div>
                    ) 
                    : 
                    (<div className='pppList'>
                        <div className='pppListTxt'>
                            <div>
                                <p className='pppListTxt1'><span>'{selectedAddress}'</span> 추천 관광명소</p>
                                <button type='button' onClick={resetPlace}>초기화</button>
                            </div>
                            <p className='pppListTxt2'>관심있는 관광명소를 미리 찜해보세요!</p>
                        </div>
                        <ul>
                        { 
                         listItems.map(function(place){
                            const isActive=pickedPlace.some(
                                (v)=>v.contentid===place.contentid
                            );
                            return <li 
                                key={place.contentid}
                                className={`pppListCont ${isActive ? "active" : ""}`} 
                                onClick={()=>handlePick(place)}>
                               {place.firstimage && <img src={place.firstimage} alt='' />}
                               {/* <span><img src='/imgs/attrantions/Frame 138.svg' /></span> */}
                               <FaCircleCheck />
                               <div>
                                  <p>{place.title}</p>
                                  <p>{place.addr1}</p>
                               </div>
                            </li>
                         })
                            
                        }
                        </ul>
                    </div>
                    )
                }
            </div>
            <div className='pppBtn'>
                <button onClick={onClose}>취소</button>
                <button onClick={()=>{
                    onSave({
                        address:selectedAddress,
                        places:pickedPlace
                    })}}>저장</button>
            </div>
        </div>
    </div>
    
  )
}

export default PlanPopupPlace