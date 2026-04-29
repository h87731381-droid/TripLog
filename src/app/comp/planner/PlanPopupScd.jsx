'use client'
import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import PlanPopupScdTime from './PlanPopupScdTime'
import { FaBus } from "react-icons/fa";
import { FaTrainSubway } from "react-icons/fa6";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { MdDirectionsBoat } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { FaWalking } from "react-icons/fa";
import { Button} from "@mui/material";
function PlanPopupScd({isOpen,onClose}) {
  const [active, setActive] = useState(null)

  const handleClick = (type) => {
    setActive(prev => (prev === type ? null : type))
  }

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

  const [visible, setVisible] = useState(false)

  useEffect(() => {
  if (open) {
    setVisible(true)
    
  } else {
    setTimeout(() => setVisible(false), 200) // 애니메이션 시간
  }
  }, [open])
  
  //교통관련 메모
  const [memo, setMemo] = useState('')

  return (
    <div className='ppsBoxContainer'>
        <div className='ppsBox'>
            <div className='ppsTitle'>
                <p>일정 추가</p>
                <div className='ppsBoxClose'>
                    <FiX onClick={onClose}/>
                </div>
            </div>
            <form>
                <div className='popupScdTitle'>
                    <p>일정 제목</p>
                    <TextField
                    fullWidth
                    variant="filled"
                    placeholder="표시될 제목을 입력해주세요"
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
                        />
                    </div>
                    <div className='popupScdPlaceTab'>
                        <div className='popupScdPlaceWish'>
                            <p>관심있는 관광지</p>

                        </div>
                        <div className='popupScdPlaceList'>
                            <p>거리순 추천 관광지</p>

                        </div>

                    </div>
                    <div className='popupScdPlaceTabItem'>
                        <div className='popupScdPlaceWishItem'>
                             <p onClick={()=> handleClick('start')}
                                className={active === 'start' ? 'active' : ''}>
                                    한라산</p>
                             <p>산방산</p>
                             <p>한라수목원</p>
                             <p>성산일출봉</p>
                             <p>ㅇㅇ박물관</p>
                             <p>제주전통시장</p>
                        </div>
                        <div className='popupScdPlaceListItem'>

                        </div>


                    </div>
                </div>
                <div className='popupScdMove'>
                    <p>교통</p>
                    <div className='popupScdMoveCont'>
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
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='popupScdBtn'>
                    <button>취소</button>
                    <button>완료</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default PlanPopupScd