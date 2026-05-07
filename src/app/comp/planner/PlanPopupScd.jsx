'use client'
import { TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'
import PlanPopupScdTime from './PlanPopupScdTime'
import { FaBus } from "react-icons/fa";
import { FaCircleCheck, FaTrainSubway } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { MdDirectionsBoat } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { FaWalking } from "react-icons/fa";
import { Button} from "@mui/material";
import axios from 'axios'
import { authStore } from '@/app/store/authStore'
import { tripStore } from '@/app/store/tripStore'
import dayjs from 'dayjs';
import { GrFormNext } from 'react-icons/gr'

function PlanPopupScd({day,isPopupOpen,onClose,pickedPlace,editData,editingId,setTempMarkers}) {
  if (!isPopupOpen) return null;
  const {tripData,setTripData}=tripStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  //스케줄 수정
  const [scdTitle, setScdTitle] = useState('');
  const [scdPlace, setScdPlace] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  //추천 관광지 리스트 가져오기
  const [listItems, setListItems] = useState([]);
  
  //교통수단 선택하면 커서 바로 깜빡이게
  const memoRef = useRef(null);

  //editData 들어오면 값 세팅
  useEffect(() => {
  if (editData) {
    setScdTitle(editData.scdTitle || '');
    setScdPlace(editData.scdPlace || '');
    setSelected(editData.scdMove || null);
    setScdMoveMemo(editData.scdMoveMemo || '');
    
    // 시간 추가
    setStartTime(editData.startTime ? dayjs(editData.startTime, 'HH:mm') : null);
    setEndTime(editData.endTime ? dayjs(editData.endTime, 'HH:mm') : null);

    /* setActive({//listItems가 아직없는데 실행해버려서 체크가 안되는 문제..
      title: editData.scdPlace,
      contentid: editData.contentid
    }); */
  }
  }, [editData]);
  
  //active 세팅
  useEffect(() => {
  if (!editData) return;

  // 추천 관광지 먼저 찾기
  if (listItems.length > 0) {
    const found = listItems.find(
      (item) => item.title === editData.scdPlace
    );

    if (found) {
      setActive(found);
      setTab('recommend'); // 탭도 맞춰줘야 체크 보임
      return;
    }
  }

  // 관심 관광지에서 찾기
  if (tripData?.places?.length > 0) {
    const found = tripData.places.find(
      (item) => item.title === editData.scdPlace
    );

    if (found) {
      setActive(found);
      setTab('wish');
    }
  }
  }, [editData, listItems, tripData]);

  const transports = [ 
    {type: 'bus', icon: <FaBus />},
    {type: 'train', icon: <FaTrainSubway />},
    {type: 'airplane', icon: <BiSolidPlaneAlt />},
    {type: 'car', icon: <FaCar />},
    {type: 'boat', icon: <MdDirectionsBoat />},
    {type: 'walk', icon: <FaWalking />},
    ];
  const selectedItem = transports.find(t => t.type === selected)
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState('wish'); 
  const [visible, setVisible] = useState(false)
  const {session} = authStore()
  const selectedPlace=tripData?.places?.find(
    (p)=>p.contentid===active
  );
  

  const handleClick=(place)=>{
    setActive((prev)=>(prev?.contentid===place.contentid? null :place))
    console.log(place)//안에 스케줄에 장소를 추가하기위해 선택한 관광지 정보

    if(place.mapx && place.mapy){
        setTempMarkers([
            {
                mapx:place.mapx,
                mapy:place.mapy
            }
        ]);
    }
  }

  useEffect(() => {
  if (open) {
    setVisible(true)
    
  } else {
    setTimeout(() => setVisible(false), 200) // 애니메이션 시간
  }
  }, [open])
  
  //교통관련 메모
  const [scdMoveMemo, setScdMoveMemo] = useState('')
  
  //일정추가 팝업 내용 초기화
  const resetForm = () => {
  setScdTitle("");
  setScdPlace("");
  //setScdMove("");
  setSelected(null);
  setScdMoveMemo("");
  setStartTime(null);
  setEndTime(null);
  setActive(null);//장소 초기화
  };
  
  //팝업닫고 내용 초기화
  const popupClose = () => {
  resetForm();
  onClose();
  setTempMarkers([]);
  };
  
  //선택한 장소 초기화
  const resetPlace=()=>{
    setTempMarkers([]);
    setActive(null);
  }

  //일정 (스케줄) 추가에서 필수 항목 작성시 완료버튼 활성화
  const isValid =
  scdTitle.trim() !== '' &&
  //startTime !== null && 시간미정인 경우 비워뒀다가 추후 수정시 추가
  active !== null;

  //일정 추가 저장 함수
  async function saveScd(e){
    e.preventDefault();
    const formdata = new FormData(e.target);
    formdata.append('userId',session.user.email)
    //formdata.append('day','1')
    formdata.set('day', day)//이걸해야 day2껀 day2에 day3껀 day3에 저장

    formdata.append('startTime', startTime?.format('HH:mm') || '');
    formdata.append('endTime', endTime?.format('HH:mm') || '');
    formdata.append('scdPlace', active?.title || '');
    
    // 저장할때 지도 관련값 보내주기
    formdata.append('mapx', active?.mapx || '');
    formdata.append('mapy', active?.mapy || '');
    formdata.append('contentid', active?.contentid || '');

    // 수정이면 id 추가
    if(editingId){
        formdata.set('editingId', editingId);/* append보다 set이 값 덮어쓰기 더 안전 */
    }

    const objData = Object.fromEntries(formdata);
    await axios.put('/api/planner',objData);
    
    const res = await fetch(`/api/planner?type=draft&session=${session.user.email}`);
    const data = await res.json();
    setTripData(data);

    resetForm();
    onClose();
    setTempMarkers([]);
  }

  useEffect(() => {
    if (!tripData?.selectedAddress) return;

    const fetchData = async () => {
        const res = await fetch(`/api/planner?keyword=${tripData.selectedAddress}`);
        const data = await res.json();
        const items = data?.response?.body?.items?.item || [];
        setListItems(items);
  };

    fetchData();
  }, [tripData]);
  
  const places = tripData?.places || [];
    
    //교통수단 선택하면 바로 커서 깜빡이게
    useEffect(() => {
    if (selected) {
        memoRef.current?.focus();
    }
  }, [selected]);

  return (
    <div className='ppsBoxContainer'>
        <div className='ppsBox'>
            <div className='ppsTitle'>
                <p>일정 추가</p>
                <div className='ppsBoxClose'>
                    <FiX onClick={popupClose}/>
                </div>
            </div>
            <form onSubmit={saveScd}>
                <div className='popupScdTitle'>
                    <p>일정 제목</p>
                    <TextField
                    fullWidth
                    variant="filled"
                    placeholder="표시될 제목을 입력해주세요"
                    name='scdTitle'
                    value={scdTitle}
                    onChange={(e) => setScdTitle(e.target.value)}
                    autoComplete="off"
                    //sx={{ mb: 2 }}
                    />
                </div>
                <div className='popupScdTime'>
                    <p>시간</p>
                    <PlanPopupScdTime
                        startTime={startTime}
                        endTime={endTime}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                    />
                </div>
                <div className='popupScdPlace'>
                    <div className='popupScdPlaceInput'>
                        <div>
                            <p>장소</p>
                            <button type='button' onClick={resetPlace}>초기화</button>  

                        </div>
                        <TextField
                        fullWidth
                        variant="filled"
                        placeholder="방문할 장소를 선택하세요"
                        name='scdPlace'
                        inputprops={{readOnly:true}}
                        value={active?.title || ''}
                        autoComplete="off"
                        />
                    </div>
                    <div className='popupScdPlaceTab'>
                        <div 
                        className={`popupScdPlaceWish ${tab==='wish' ? "active" : ''}`}
                        onClick={()=>setTab('wish')}
                         >
                            <p>관심있는 관광지</p>

                        </div>
                        <div 
                        className={`popupScdPlaceList ${tab==='recommend' ? "active" : ''}`}
                        onClick={()=>setTab('recommend')}
                         >
                            <p>추천 관광지</p>

                        </div>

                    </div>
                    <div className='popupScdPlaceTabItem'>

                        {/* 관심있는 관광지 */}
                        {tab==='wish' && (                            
                            <div className='popupScdPlaceWishItem'>
                                {places.length===0 ? 
                                  (<div className='popupScdPlaceWishItemEmpty'>
                                      <div>
                                        <p>관심있는 관광지가 없습니다.</p>
                                        <p>관심있는 관광지를 미리 찜해보세요!</p>
                                      </div>
                                      <a href='http://localhost:3000/attrantions'>찜하러가기<GrFormNext/></a>
                                   </div>

                                  )
                                  :
                                  (<div className='popupScdPlaceWishItemFilled'>
                                    {tripData?.places?.map((place)=>(
                                        <p 
                                        key={place.contentid}
                                        onClick={()=>handleClick(place)}
                                        className={active?.contentid===place.contentid? "active":""}
                                        >
                                            {place.title}
                                        </p>
                                    ))}
                                  </div>
                                  )
                                }
                                {/* <p onClick={()=> handleClick('start')}
                                    className={active === 'start' ? 'active' : ''}>
                                    한라산</p>
                                    */}
                            </div>
                        )}

                        {/* 추천 관광지 */}
                        {tab==='recommend'&&(
                            <div className='popupScdPlaceListItem'>
                                <ul>
                                    {listItems?.map((place)=>(
                                        <li 
                                        key={place.contentid}
                                        onClick={()=>handleClick(place)}
                                        className={active?.contentid===place.contentid? "active":""}
                                        >
                                         {place.firstimage && <img src={place.firstimage} alt='' />}
                                         <FaCircleCheck />
                                        <div>
                                            <p>{place.title}</p>
                                            <p>{place.addr1}</p>
                                        </div>
                                        </li>
                                    ))}

                                </ul>
                            </div>

                        )}


                    </div>
                </div>
                <div className='popupScdMove'>
                    <p>교통</p>
                    <div className='popupScdMoveCont'>
                        {/* 교통수단 선택 hidden input */}
                        <input type="hidden" name="scdMove" value={selected || ''} />
                        <div className='popupScdMoveSelect'>
                            {/* 메인 버튼 (아이콘) */}
                            <div className='MainMoveIcon'
                                onClick={() => {
                                if (!open) {
                                    setVisible(true)     // 먼저 DOM 생성
                                    setTimeout(() => setOpen(true), 10) // 그 다음 애니메이션
                                } else {
                                    setOpen(false)       // 먼저 애니메이션
                                    setTimeout(() => setVisible(false), 200) // 끝나고 제거
                                }
                                }}
                                style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: selected ? '#27678E' : '#ffffff',
                                color: selected ? '#ffffff' : '#d3d3d3',
                                border: selected ? 'none' : '1px solid #ebebeb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                                }}
                            >
                                {selectedItem ? selectedItem.icon : <FaCar />} {/* 기본 아이콘 */}
                            </div>

                            {/* 펼쳐지는 아이콘 리스트 */}
                            {visible && (
                            <div
                                style={{
                                display: 'flex',
                                gap: '8px',
                                transform: open ? 'translateX(0)' : 'translateX(-10px)',
                                opacity: open ? 1 : 0,
                                transition: 'all 0.2s ease',
                                pointerEvents: open ? 'auto' : 'none'
                                        }}
                            >
                                {transports.map(item => (
                                <div
                                    key={item.type}
                                    onClick={() => {
                                    setSelected(prev => (prev === item.type ? null : item.type))
                                    setOpen(false)
                                    setScdMoveMemo('')
                                    }}
                                    style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    border:'1px solid #ebebeb',
                                    background: selected === item.type ? '#27678E' : '#ffffff',
                                    color: selected === item.type ? '#fff' : '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    marginTop:'3px',
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 10px'
                                    }}
                                >
                                    {item.icon}
                                </div>
                                ))}
                            </div>
                            )}

                        </div>   
                        <div className='popupScdMoveMemo'>
                            <TextField
                            fullWidth
                            variant="filled"
                            placeholder= {selected ? "메모를 입력하세요" : "교통수단을 먼저 선택하세요"}
                            name='scdMoveMemo'
                            value={scdMoveMemo}
                            onChange={(e) => setScdMoveMemo(e.target.value)}
                            disabled={!selected}
                            autoComplete="off"
                            inputRef={memoRef}
                            />
                        </div>
                    </div>
                </div>
                <div className='popupScdBtn'>
                    <button type='button' onClick={onClose}>취소</button>
                    <button 
                    type='submit'
                    disabled={!isValid}
                    style={{
                        backgroundColor:!isValid ? "#AED1E6" : "#27678E",
                        pointerEvents:!isValid ? "none" : "auto",
                        
                        //cursor: isValid ? 'pointer' : 'not-allowed',
                    }}
                    >완료</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default PlanPopupScd