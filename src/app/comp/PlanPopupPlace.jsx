'use client'
import { TextField } from '@mui/material';
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi';
import GeocoderMap from './GeocoderMap';

function PlanPopupPlace({isOpen,onClose}) {
    const [savedDates, setSavedDates]=useState();
    const [selectedAddress, setSelectedAddress] = useState("");
    const [region, setRegion]=useState('');

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
                placeholder="여행지 지역을 입력해주세요(예: 제주도 / 경주시)"
                value={savedDates}
                //onChange={(e) => setTravelTitle(e.target.value)}
                //sx={{ mb: 2 }}
            />
            <div className='pppContents'>
                <div className='pppMap'>
                    <GeocoderMap selectedAddress={selectedAddress} />
                </div>
                {!region ? 
                    (<div className='pppListEmpty'>
                        <p>입력된 여행지의 추천 관광명소가 표시됩니다.</p>
                        <p>관광지와 문화시설이 추천됩니다.</p>
                    </div>
                    ) 
                    : 
                    (<div className='pppList'>
                        <div className='pppListTxt'>
                            <p><span>'{region}제주도'</span> 추천 관광명소</p>
                            <p>관심있는 관광명소를 미리 찜해보세요!</p>
                        </div>
                        <ul>
                            <li>
                               <img src='./imgs/bgimg.jpg' alt=''/>
                               <div>
                                  <p>한라산</p>
                                  <p>서울특별시 은평구 대서문길 36</p>
                               </div>
                            </li>
                            <li>
                               <img src='./imgs/bgimg.jpg' alt=''/>
                               <div>
                                  <p>한라산</p>
                                  <p>서울특별시 동대문구 고산자로38길 19</p>
                               </div>
                            </li>
                            <li>
                               <img src='./imgs/bgimg.jpg' alt=''/>
                               <div>
                                  <p>한라산</p>
                                  <p>서울특별시 은평구 대서문길 36</p>
                               </div>
                            </li>
                            <li>
                               <img src='./imgs/bgimg.jpg' alt=''/>
                               <div>
                                  <p>한라산</p>
                                  <p>서울특별시 은평구 대서문길 36</p>
                               </div>
                            </li>
                            <li>
                               <img src='./imgs/bgimg.jpg' alt=''/>
                               <div>
                                  <p>한라산</p>
                                  <p>서울특별시 은평구 대서문길 36</p>
                               </div>
                            </li>
                        </ul>
                    </div>
                    )
                }
            </div>
            <div className='pppBtn'>
                <button onClick={onClose}>취소</button>
                <button>완료</button>
            </div>
        </div>
    </div>
    
  )
}

export default PlanPopupPlace