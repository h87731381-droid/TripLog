'use client';
import React, { useState, useEffect, useRef } from 'react';
import './budget.scss';
import { FiCheck, FiX } from "react-icons/fi";
import { TbPencil } from "react-icons/tb";
import { authStore } from '@/app/store/authStore'; 
import { tripStore } from '@/app/store/tripStore';
import Loading from '@/app/comp/Loading';
import Guide from '@/app/comp/Guide';

function Budget() {
  /** 1. 상태 관리 (State) 및 초기화 **/
  const { tripData } = tripStore();
  const { session, setShowLogin } = authStore(); // 로그인 세션 및 로그인 모달 제어 함수
  const [items, setItems] = useState(null);       // DB에서 가져온 전체 경비 내역 목록
  const [isManageMode, setIsManageMode] = useState(false);  // '수정' 버튼 클릭 시 아이콘 노출 여부
  const [editingId, setEditingId] = useState(null);         // 현재 행 수정 중인 항목의 고유 ID
  const [nValue, setNValue] = useState('');                 // 더치페이 계산을 위한 인원수 입력값

  // 영수증(Receipt) UI 제어를 위한 상태 및 참조(Ref)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const receiptRef = useRef(null);

  // 입력/수정 폼 데이터 상태
  const [inputData, setInputData] = useState({
    category: '숙박비', title: '', amount: '', date: ''
  });
  const [editData, setEditData] = useState({ title: '', amount: '', date: '' });

  /** 2. 데이터 조회 및 이벤트 효과 (Side Effects) **/
  
  // 로그인 세션이 확인되면 해당 유저의 데이터를 서버에서 가져옴
  useEffect(() => {
      if (session && session.user?.email && tripData) {
        fetchItems(session.user.email);
      }
  }, [session, tripData]);

  

  // 영수증 영역 외부 클릭 시 자동으로 닫히는 로직
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 영수증이 열려있고, 클릭한 대상이 영수증 영역이나 열기 버튼이 아닐 경우 닫음
      if (isReceiptOpen && receiptRef.current && !receiptRef.current.contains(e.target) && !e.target.closest('.receipt_btn')) {
        setIsReceiptOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isReceiptOpen]);

  /** 3. API 통신 함수 (CRUD) **/

  // 데이터 조회 (GET)
  const fetchItems = async (email) => {

    
    const targetEmail = email || session?.user?.email;
    if (!targetEmail) return;
    const res = await fetch(`/api/budget?email=${targetEmail}&tripId=${tripData?._id}`);
    const data = await res.json();
    
    if (Array.isArray(data)) setItems(data);
  };

  // 데이터 추가 (POST)
  const handleAdd = async (e) => {
    e.preventDefault(); 
    if (!session || !session.user) {
      setShowLogin(); // 로그인 안 되어 있으면 로그인창 띄움
      return;
    }
    if (!inputData.title || !inputData.amount || !inputData.date) return;
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...inputData, email: session.user.email,tripId:tripData._id}),
    });
    if (res.ok) {
      setInputData({ ...inputData, title: '', amount: '', date: '' }); // 입력폼 초기화
      fetchItems(session.user.email); // 목록 새로고침
    }
  };

  // 데이터 삭제 (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const res = await fetch(`/api/budget?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems(); 
    }
  };

  // 수정 모드 진입: 선택한 항목의 값을 수정용 state에 복사
  const handleEditStart = (item) => {
    setEditingId(item._id); 
    setEditData({ category: item.category, title: item.title, amount: item.amount.toString(), date: item.date });
  };

  // 수정 내용 저장 (PUT)
  const handleEditSave = async (id) => {
    const res = await fetch(`/api/budget?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setEditingId(null); 
      fetchItems();       
    }
  };

  /** 4. 유틸리티 함수 (계산 및 포맷팅) **/

  // 금액 입력 시 숫자만 남기고 처리
  const handleAmountChange = (e, isEdit = false) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 0) val = String(Number(val)); 
    if (isEdit) setEditData({ ...editData, amount: val });
    else setInputData({ ...inputData, amount: val });
  };

  // 카테고리별 합계 금액 계산
  const getCategoryTotal = (cat) => {
    return items.filter(item => item.category === cat).reduce((sum, item) => sum + item.amount, 0);
  };

  // 전체 총합 및 1인당 금액(더치페이) 계산
  const totalAmount = items?.reduce((sum, item) => sum + item.amount, 0);
  const dutchPay = nValue && parseInt(nValue) > 0 ? Math.floor(totalAmount / parseInt(nValue)) : totalAmount;

  /** 5. 렌더링 도우미 (JSX 리스트) **/
  const renderList = (categoryName) => {
    return items.filter(item => item.category === categoryName).map(item => (
      <div className='list_edit' key={item._id}>
        {editingId === item._id ? (
          /* [수정 모드 UI] */
          <form className='list_edit_form' onSubmit={(e) => e.preventDefault()}>
            <input className='form_text' type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
            <input className='form_text' type="text" value={editData.amount} onChange={(e) => handleAmountChange(e, true)} />
            <input className='form_date' type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} />
            <span className='FiCheck' onClick={() => handleEditSave(item._id)}><FiCheck /></span>
          </form>
        ) : (
          /* [일반 조회 모드 UI] */
          <div className='list_edit_div'>
            <div>{item.title}</div>
            <div>{item.amount.toLocaleString()}</div>
            <div>원</div>
            <span>{item.date}</span>
            {isManageMode && (
              <span className="manage_icons">
                <FiX onClick={() => handleDelete(item._id)} />
                <TbPencil onClick={() => handleEditStart(item)} />
              </span>
            )}
          </div>
        )}
      </div>
    ));
  };

  /** 6. 최종 출력 화면 (Render) **/
  return (
    <>
      <div className='title'><h1>여행경비</h1></div>
      <div className='budget_background'></div>

      {/* 상단 입력 영역 */}
      {
        tripData?.status === 'draft' || tripData?.status==='complete' ? 
          !items ? <Loading/> :
          <>
          {
            tripData?.status === 'draft' &&
            <div className="budget_button">
              <form onSubmit={handleAdd}>
                <select value={inputData.category} onChange={(e) => setInputData({...inputData, category: e.target.value})}>
                  <option>숙박비</option><option>교통비</option><option>식비</option><option>기타비용</option>
                </select>
                <input type="text" placeholder="타이틀" value={inputData.title} onChange={(e) => setInputData({...inputData, title: e.target.value})} />
                {/* 금액 표시는 콤마(,) 포함, 값 변경 시에는 숫자만 추출 */}
                <input type="text" placeholder="금액" value={inputData.amount ? Number(inputData.amount).toLocaleString() : ''} onChange={(e) => handleAmountChange(e, false)} />
                <input type="date" value={inputData.date} onChange={(e) => setInputData({...inputData, date: e.target.value})} style={{color: "#AEAEAE", fontFamily: "Pretendard, sans-serif"}}/>
                <input type="submit" value="추가" />
                
                {items.length > 0 && (
                  <input type="button" value={isManageMode ? "완료" : "수정"} className='edit_button' 
                    onClick={() => { setIsManageMode(!isManageMode); setEditingId(null); }} />
                )}          
              </form>  
            </div>
          }
      

            {/* 영수증 보기 버튼 */}
            <button className='receipt_btn' onClick={() => setIsReceiptOpen(!isReceiptOpen)}>영수증보기</button> 
            
            {/* 하단 리스트 및 영수증 레이아웃 */}
            <div className='wrap'>
              <div className='list'>
                {/* 각 카테고리별 섹션 순회 렌더링 */}
                {['숙박비', '교통비', '식비', '기타비용'].map(cat => (
                  <div className={`list_${cat === '숙박비' ? 'stay' : cat === '교통비' ? 'fare' : cat === '식비' ? 'food' : 'other'}`} key={cat}>
                    <div className='list_title'>{cat}</div>
                    <div className='list_content'>{renderList(cat)}</div>
                  </div>
                ))}
              </div>
              
              {/* 우측 영수증 결과 영역 (isReceiptOpen 상태에 따라 active 클래스 부여) */}
              <div className={`Receipt ${isReceiptOpen ? 'active' : ''}`} ref={receiptRef}>
                <h3>Receipt</h3>
                <span>
                  <p>숙박비<span>{getCategoryTotal('숙박비').toLocaleString()}</span>원</p>
                  <p>교통비<span>{getCategoryTotal('교통비').toLocaleString()}</span>원</p>
                  <p>식비<span>{getCategoryTotal('식비').toLocaleString()}</span>원</p>
                  <p>기타비용<span>{getCategoryTotal('기타비용').toLocaleString()}</span>원</p>
                </span>
                <div className='total_section'>
                  <span>Total </span>
                  <span>
                    {dutchPay.toLocaleString()} / 
                    <input type="text" placeholder='N' value={nValue} onChange={(e) => setNValue(e.target.value.replace(/[^0-9]/g, ''))} />
                  </span>
                </div>
              </div>
            </div>
          </>
        :
          <Guide />
      }
    </>
  );
}

export default Budget;