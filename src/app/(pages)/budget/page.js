'use client';
import React, { useState, useEffect } from 'react';
import './budget.scss';
import { FiCheck, FiX } from "react-icons/fi";
import { TbPencil } from "react-icons/tb";

function Budget() {
  /* ============================================================
     1. 상태 관리 (State)
     ============================================================ */
  const [items, setItems] = useState([]);                   // DB에서 불러온 리스트 저장소
  const [isManageMode, setIsManageMode] = useState(false);  // 관리모드(수정/삭제 버튼 노출) 여부
  const [editingId, setEditingId] = useState(null);         // 현재 수정 중인 항목의 _id 보관
  const [nValue, setNValue] = useState('');                 // 더치페이 인원수 입력값

  // [입력 상태] 새 항목 추가용 폼 데이터
  const [inputData, setInputData] = useState({
    category: '숙박비',
    title: '',
    amount: '',
    date: ''
  });

  // [수정 상태] 기존 항목 수정 시 사용할 임시 데이터
  const [editData, setEditData] = useState({ title: '', amount: '', date: '' });

  /* ============================================================
     2. API 연동 및 데이터 처리 (Logic)
     ============================================================ */
  
  // [초기 로딩] 컴포넌트가 처음 나타날 때 DB에서 데이터를 가져옴
  useEffect(() => {
    fetchItems();
  }, []);

  console.log(inputData)

  // [GET 요청] 서버에서 최신 목록을 가져와 상태(items)를 업데이트
  const fetchItems = async () => {
    const res = await fetch('/api/budget');
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
  };

  // [POST 요청] 새로운 경비를 DB에 추가
  const handleAdd = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
     const session = JSON.parse(sessionStorage.getItem('session'));
    if (!inputData.title || !inputData.amount || !inputData.date) return;
    
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...inputData,email:session.user.email}),
    });

    if (res.ok) {
      setInputData({ ...inputData, title: '', amount: '', date: '' }); // 입력 필드 비우기
      fetchItems(); // 추가된 내역을 포함해 목록 새로고침
    }
  };

  // [DELETE 요청] 특정 항목 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const res = await fetch(`/api/budget?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems(); // 삭제 후 목록 새로고침
    }
  };

  // [수정 시작] 해당 항목의 값을 수정용 입력창(editData)에 세팅
  const handleEditStart = (item) => {
    setEditingId(item._id); // 몽고디비의 고유 ID인 _id를 기준으로 잡음
    setEditData({ 
      category: item.category, 
      title: item.title, 
      amount: item.amount.toString(), 
      date: item.date 
    });
  };

  // [PUT 요청] 수정한 내용을 DB에 저장
  const handleEditSave = async (id) => {
    const res = await fetch(`/api/budget?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      setEditingId(null); // 수정 모드 해제
      fetchItems();       // 수정된 목록 새로고침
    }
  };

  /* ============================================================
     3. 기타 헬퍼 및 연산 (Utilities)
     ============================================================ */

  // 금액 입력 시 숫자만 남기고 세자리 콤마 표시를 돕는 함수
  const handleAmountChange = (e, isEdit = false) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 0) val = String(Number(val)); // 앞자리 0 제거
    if (isEdit) setEditData({ ...editData, amount: val });
    else setInputData({ ...inputData, amount: val });
  };

  // 특정 카테고리(숙박비, 식비 등)의 금액 합계를 계산
  const getCategoryTotal = (cat) => {
    return items
      .filter(item => item.category === cat)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  // 전체 경비 총합 및 더치페이(N분의 1) 결과 계산
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const dutchPay = nValue && parseInt(nValue) > 0 ? Math.floor(totalAmount / parseInt(nValue)) : totalAmount;

  /* ============================================================
     4. 화면 렌더링 (View)
     ============================================================ */
  const renderList = (categoryName) => {
    return items.filter(item => item.category === categoryName).map(item => (
      <div className='list_edit' key={item._id}>
        {/* 수정 모드인 경우: input 창 노출 */}
        {editingId === item._id ? (
          <form className='list_edit_form' onSubmit={(e) => e.preventDefault()}>
            <input className='form_text' type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
            <input className='form_text' type="text" value={editData.amount} onChange={(e) => handleAmountChange(e, true)} />
            <input className='form_date' type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} />
            <span className='FiCheck' onClick={() => handleEditSave(item._id)}><FiCheck /></span>
          </form>
        ) : (
          /* 일반 모드인 경우: 텍스트 노출 */
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

  return (
    <>
      <div className='title'><h1>여행경비</h1></div>
      <div className='budget_background'></div>

      {/* [상단 섹션] 입력 및 모드 전환 */}
      <div className="budget_button">
        <form onSubmit={handleAdd}>
          <select value={inputData.category} onChange={(e) => setInputData({...inputData, category: e.target.value})}>
            <option>숙박비</option><option>교통비</option><option>식비</option><option>기타비용</option>
          </select>
          <input type="text" placeholder="타이틀" value={inputData.title} onChange={(e) => setInputData({...inputData, title: e.target.value})} />
          <input type="text" placeholder="금액" value={inputData.amount ? Number(inputData.amount).toLocaleString() : ''} onChange={(e) => handleAmountChange(e, false)} />
          <input type="date" value={inputData.date} onChange={(e) => setInputData({...inputData, date: e.target.value})} style={{color: "#AEAEAE", fontFamily: "Pretendard, sans-serif"}}/>
          <input type="submit" value="추가" />
          
          {items.length > 0 && (
            <input type="button" value={isManageMode ? "완료" : "수정"} className='edit_button' 
              onClick={() => { setIsManageMode(!isManageMode); setEditingId(null); }} />
          )}
        </form>
      </div>

      {/* [메인 섹션] 리스트와 영수증 합계 */}
      <div className='wrap'>
        <div className='list'>
          {['숙박비', '교통비', '식비', '기타비용'].map(cat => (
            <div className={`list_${cat === '숙박비' ? 'stay' : cat === '교통비' ? 'fare' : cat === '식비' ? 'food' : 'other'}`} key={cat}>
              <div className='list_title'>{cat}</div>
              <div className='list_content'>{renderList(cat)}</div>
            </div>
          ))}
        </div>
        
        {/* [영수증 섹션] 합계 및 더치페이 계산 */}
        <div className='Receipt'>
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
  );
}

export default Budget;