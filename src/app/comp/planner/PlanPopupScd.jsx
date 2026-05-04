'use client'
import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
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

function PlanPopupScd({isOpen,onClose,pickedPlace}) {
    
  const {tripData,setTripData}=tripStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  
  
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
  }

  useEffect(() => {
  if (open) {
    setVisible(true)
    
  } else {
    setTimeout(() => setVisible(false), 200) // 애니메이션 시간
  }
  }, [open])
  
  //교통관련 메모
  const [memo, setMemo] = useState('')
  
  //일정 추가 저장 함수
  async function saveScd(e){
    e.preventDefault();
    const formdata = new FormData(e.target);
    formdata.append('userId',session.user.email)
    formdata.append('day','1')
    const objData = Object.fromEntries(formdata);
    await axios.put('/api/planner',objData);
    
    const res = await fetch(`/api/planner?type=draft&session=${session.user.email}`);
    const data = await res.json();
    setTripData(data);
  }

  //추천 관광지 리스트 가져오기
  const [listItems, setListItems] = useState([]);

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
  

  return (
    <div className='ppsBoxContainer'>
        <div className='ppsBox'>
            <div className='ppsTitle'>
                <p>일정 추가</p>
                <div className='ppsBoxClose'>
                    <FiX onClick={onClose}/>
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
                    //value={travelTitle}
                    //onChange={(e) => setTravelTitle(e.target.value)}
                    //sx={{ mb: 2 }}
                    />
                </div>
                <div className='popupScdTime'>
                    <p>시간</p>
                    <PlanPopupScdTime/>
                </div>
                <div className='popupScdPlace'>
                    <div className='popupScdPlaceInput'>
                        <p>장소</p>
                        <TextField
                        fullWidth
                        variant="filled"
                        placeholder="방문할 장소를 선택하세요"
                        name='scdPlace'
                        inputprops={{readOnly:true}}
                        value={active?.title || ''}
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
                                {tripData?.places?.map((place)=>(
                                    <p 
                                    key={place.contentid}
                                    onClick={()=>handleClick(place)}
                                    className={active?.contentid===place.contentid? "active":""}
                                    >
                                        {place.title}
                                    </p>

                                ))}
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
                                background: '#27678E',
                                color: '#ffffff',
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
                                    setMemo('')
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
                            placeholder="메모를 추가하세요"
                            name='scdMoveMemo'
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='popupScdBtn'>
                    <button>취소</button>
                    <button type='submit'>완료</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default PlanPopupScd