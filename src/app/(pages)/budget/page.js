'use client';
import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import './budget.scss';
import { FiCheck, FiX } from "react-icons/fi";
import { TbPencil } from "react-icons/tb";
import { authStore } from '@/app/store/authStore'; 

function Budget() {
  const { setShowLogin } = authStore(); 
  const [items, setItems] = useState([]);                   
  const [isManageMode, setIsManageMode] = useState(false);  
  const [editingId, setEditingId] = useState(null);         
  const [nValue, setNValue] = useState('');                 

  // [추가] 영수증 토글 상태 및 영역 참조
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const receiptRef = useRef(null);

  const [inputData, setInputData] = useState({
    category: '숙박비', title: '', amount: '', date: ''
  });
  const [editData, setEditData] = useState({ title: '', amount: '', date: '' });

  useEffect(() => {
    setTimeout(function(){

      const session = JSON.parse(sessionStorage.getItem('session'));
      if (session && session.user?.email) {
        fetchItems(session.user.email);
      }
    },300)
  }, []);

  // [추가] 외부 영역 클릭 시 닫기 로직 (건드리지 않고 추가만 함)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isReceiptOpen && receiptRef.current && !receiptRef.current.contains(e.target) && !e.target.closest('.receipt_btn')) {
        setIsReceiptOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isReceiptOpen]);

  const fetchItems = async (email) => {
    const targetEmail = email || JSON.parse(sessionStorage.getItem('session'))?.user?.email;
    if (!targetEmail) return;
    const res = await fetch(`/api/budget?email=${targetEmail}`);
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault(); 
    const session = JSON.parse(sessionStorage.getItem('session'));
    if (!session || !session.user) {
      setShowLogin(); 
      return;
    }
    if (!inputData.title || !inputData.amount || !inputData.date) return;
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...inputData, email: session.user.email}),
    });
    if (res.ok) {
      setInputData({ ...inputData, title: '', amount: '', date: '' }); 
      fetchItems(session.user.email); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const res = await fetch(`/api/budget?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems(); 
    }
  };

  const handleEditStart = (item) => {
    setEditingId(item._id); 
    setEditData({ category: item.category, title: item.title, amount: item.amount.toString(), date: item.date });
  };

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

  const handleAmountChange = (e, isEdit = false) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 0) val = String(Number(val)); 
    if (isEdit) setEditData({ ...editData, amount: val });
    else setInputData({ ...inputData, amount: val });
  };

  const getCategoryTotal = (cat) => {
    return items.filter(item => item.category === cat).reduce((sum, item) => sum + item.amount, 0);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const dutchPay = nValue && parseInt(nValue) > 0 ? Math.floor(totalAmount / parseInt(nValue)) : totalAmount;

  const renderList = (categoryName) => {
    return items.filter(item => item.category === categoryName).map(item => (
      <div className='list_edit' key={item._id}>
        {editingId === item._id ? (
          <form className='list_edit_form' onSubmit={(e) => e.preventDefault()}>
            <input className='form_text' type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
            <input className='form_text' type="text" value={editData.amount} onChange={(e) => handleAmountChange(e, true)} />
            <input className='form_date' type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} />
            <span className='FiCheck' onClick={() => handleEditSave(item._id)}><FiCheck /></span>
          </form>
        ) : (
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

      <button className='receipt_btn' onClick={() => setIsReceiptOpen(!isReceiptOpen)}>영수증보기</button> 
      
      <div className='wrap'>
        <div className='list'>
          {['숙박비', '교통비', '식비', '기타비용'].map(cat => (
            <div className={`list_${cat === '숙박비' ? 'stay' : cat === '교통비' ? 'fare' : cat === '식비' ? 'food' : 'other'}`} key={cat}>
              <div className='list_title'>{cat}</div>
              <div className='list_content'>{renderList(cat)}</div>
            </div>
          ))}
        </div>
        
        {/* [수정] 클래스 조건부 추가 및 Ref 연결 */}
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
  );
}

export default Budget;