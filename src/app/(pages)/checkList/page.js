'use client'

import "./checkList.scss";
import Draggable from "react-draggable";
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { LuCirclePlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbPencil } from "react-icons/tb";
import { authStore } from '@/app/store/authStore';
import { tripStore } from "@/app/store/tripStore";
import { useRouter } from "next/navigation";
import Loading from "@/app/comp/Loading";
import Guide from "@/app/comp/Guide";

function Check() {
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const {session, setShowLogin} = authStore();
  const {tripData, setTripData} = tripStore();
  const nodeRefs = useRef({});
  const router = useRouter();
  // [GET] 페이지 로드 시 DB 데이터 호출
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        // 저장 내용 O

        const defaultId = Date.now();
        const defaultBundle = {
          id: defaultId,
          category: "세면용품",
          subItems: [
            { id: Date.now() + 1, text: "치약/칫솔", checked: false },
            { id: Date.now() + 2, text: "폼클렌저", checked: false },
            { id: Date.now() + 3, text: "샴푸", checked: false },
            { id: Date.now() + 4, text: "수건", checked: false },
            { id: Date.now() + 5, text: "스킨케어", checked: false }
          ],
          isEditing: false
        };

        nodeRefs.current[defaultId] = React.createRef();
        setItems([defaultBundle]);


        if (session && tripData) {
          const response = await fetch(`/api/checkList?tripId=${tripData._id}`);
          const data = await response.json();
          if(data.checklist && data.checklist.length > 0 ){
            // 불러온 데이터의 id마다 ref(번들정보) 생성
            data.checklist.forEach(item => {
              if (!nodeRefs.current[item.id]) {
                nodeRefs.current[item.id] = React.createRef();
              }
            });
            setItems(data.checklist);
          }
        }
        // 저장 내용 X : 추천리스트
       
      } catch (error) { console.error("데이터 로드 실패:", error); }
    };
    fetchChecklist();
    resize();
  }, [session]);

  // [번들위치] 드래그가 멈추면 해당 번들의 좌표 저장
  const handleStop = (id, e, data) => {
    const changeItems = items.map(
      item => item.id === id ? { ...item, position: { x: data.x, y: data.y } } : item
    );    
    setItems(changeItems);
  };

  // [SAVE] DB로 현재 상태(위치 포함) 저장 / 저장 성공여부 팝업
  const saveItems = async () => {
    
    
    if(!session){ setShowLogin(); return; }
    if(!tripData){
      alert('여행지를 작성하세요.'); 
      router.push('/planner')
      return;
    } 


    setIsSaving(true);
    try {
      const response = await fetch("/api/checkList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checklist: items, tripId:tripData._id, userId:session.user.email}),
      });

      if (response.ok) {
        setShowModal(true);
        setModalMessage("저장 성공");
      } else { throw new Error("저장 실패"); }
    }
    catch (error) { setModalMessage("저장 실패"); setShowModal(true); }
    finally { setIsSaving(false); setTimeout(() => setShowModal(false), 1500); }
  };

  // 버튼 클릭 시 새로운 항목 추가 함수
  const addItem = () => {
    if(!session){ setShowLogin(); return; }

    if(!tripData){
      alert('여행지를 작성하세요.'); 
      router.push('/planner')
      return;
    } 

    const newId = Date.now();
    const deactivatedItems = items.map(item => ({ ...item, isEditing: false }));
    const x = (window.innerWidth * 0.75 / 2) - 110;
    const y = (window.innerHeight * 0.75 / 2) - 250
    
    let newItem = {
      id: newId,
      category: "",
      position: { x, y }, // 초기 위치값 지정
      subItems: [{ id: Date.now() + 1, text: "", checked: false }],
      isEditing: true
    };
    nodeRefs.current[newId] = React.createRef();
    setItems([...deactivatedItems, newItem]);
  };

  // 편집 모드 토글
  const toggleEdit = (id, e) => {     
    if(!session){ setShowLogin(); return; } 
    e.stopPropagation(); // 부모 클릭시 이벤트 방지    
    const changeItems = items.map(
      item => item.id === id ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }
    );
    setItems(changeItems);    
  };

  // 편집 모드 해제 
  const disableAllEdit = () => {
    const changeItems = items.map(item => ({ ...item, isEditing: false }))
    setItems(changeItems);
  };

  // 번들 삭제
  const deleteBundle = (id) => {
    if(!session){ setShowLogin(); return; }
    const changeItems = items.filter(bundle => bundle.id !== id);
    setItems(changeItems);
  };

  // input 실시간 동기화
  const handleInputChange = (id, field, value) => {
    const changeItems = items.map(bundle => bundle.id === id ? { ...bundle, [field]: value } : bundle)
    setItems(changeItems);
  };

  // 아이템 목록 삭제
  const deleteSubItem = (bundleId, subId) => {
    const changeItems = items.map(bundle => {
      if (bundle.id === bundleId) {
        return { 
          ...bundle,
          subItems: bundle.subItems.filter(sub => sub.id !== subId) 
        };
      }
      return bundle;
    })
    setItems(changeItems);
  };

  // 아이템 추가
  const addSubItem = (bundleId) => {
    const changeItems = items.map(bundle => {
      if (bundle.id === bundleId) {
        return {
          ...bundle,
          subItems: [...bundle.subItems, { id: Date.now(), text: "", checked: false }]
        };
      }
      return bundle;
    });
    setItems(changeItems);
  };

  // 아이템명 input
  const handleSubInputChange = (bundleId, subId, value) => {
    const changeItems = items.map(bundle => {
      if (bundle.id === bundleId) {
        return {
          ...bundle,
          subItems: bundle.subItems.map(sub =>
            sub.id === subId ? { ...sub, text: value } : sub
          )
        };
      }
      return bundle;
    });
    setItems(changeItems);
  };

  // 체크박스 핸들러 
  const toggleCheck = (bundleId, subId) => {
    if(!session){ setShowLogin(); return; }
    console.log("toggleCheck");
    const changeItems = items.map(bundle => {
      if (bundle.id === bundleId && !bundle.isEditing) { // 비활성화일 때 가능
        return {
          ...bundle,
          subItems: bundle.subItems.map(
            sub => sub.id === subId ? { ...sub, checked: !sub.checked } : sub
          )
        };
      }
      return bundle;
    });
    setItems(changeItems);
  };

  // 번들위치 재정렬용
  const [isResize, setResize] = useState(false);
  function resize() {
    window.addEventListener('resize', function () {
      if (window.innerWidth < 1280) {setResize(true);} 
      else {setResize(false);}
    })
  }

  

  return (
    <section className="checklist" onClick={disableAllEdit}>
      <div className="title">

        {
        tripData?.status==='draft' ?
        <>
          <div className="title2">
            <h1>체크리스트</h1>
            
            <span onClick={(e) => { e.stopPropagation(); addItem(); }} style={{ cursor: 'pointer' }}>
              <LuCirclePlus />
            </span>
            
          </div>
          <h3 onClick={saveItems} style={{ cursor: 'pointer' }}>
            {isSaving ? "저장중" : "저장하기"} <span>✔</span>
          </h3>
        </>
        :
          <div className="title2">
            <h1>체크리스트</h1>
          </div>
        }
      </div>

      {
        tripData?.status==='draft' || tripData?.status==='complete' ?
          <div className={`list ${isResize ? 'active' : ''}`}>
            {items.map((bundle) => (
              <Draggable key={bundle.id}
                disabled={isResize} // pc외에 Draggable 막기
                //cancel=".edit-btn, .del-sub-btn, .add-btn"
                nodeRef={nodeRefs.current[bundle.id]}
                bounds="parent"
                defaultPosition={bundle.position}  // DB에서 가져온 위치값 로드
                position={isResize ? {x:0,y:0} :bundle.position}
                onStop={(e, data) => handleStop(bundle.id, e, data)} // 새로운 위치값 업로드
              >
                <div ref={nodeRefs.current[bundle.id]}
                  className={`bundle ${bundle.isEditing ? 'editing' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border">
                    <div className="category">
                      <span className="hidden-text">{bundle.category || "카테고리"}</span>
                      <input
                        type="text"
                        readOnly={!bundle.isEditing}
                        placeholder="카테고리"
                        value={bundle.category}
                        maxLength={7}
                        onChange={(e) => handleInputChange(bundle.id, 'category', e.target.value)}
                      />
                    </div>
                    {
                      tripData?.status==='draft' &&
                      <span className="edit-btn" onClick={(e) => 
                        bundle.isEditing ? deleteBundle(bundle.id) : toggleEdit(bundle.id, e)
                      }>
                        {bundle.isEditing ? <RiDeleteBin6Line /> : <TbPencil />}
                      </span>
                    }
                  </div>

                  <div className="item-list">
                    {bundle.subItems.map((sub) => (
                      <div key={sub.id} className="item">
                        
                          <input className="check-box" type="checkbox" checked={sub.checked}
                            onChange={() => toggleCheck(bundle.id, sub.id)} disabled={bundle.isEditing} />
                        
                        <input
                          className={`check-text ${sub.checked ? "done" : ""}`}
                          type="text"
                          readOnly={!bundle.isEditing}
                          placeholder="아이템"
                          value={sub.text}
                          maxLength={8}
                          onChange={(e) => handleSubInputChange(bundle.id, sub.id, e.target.value)}
                        />
                        <span className="del-sub-btn" onClick={() => 
                          deleteSubItem(bundle.id, sub.id)} style={{ cursor: 'pointer' }
                        }>
                          <RiDeleteBin6Line />
                        </span>
                      </div>
                    ))}
                  </div>
                  {bundle.isEditing &&
                    <span className="add-btn" onClick={() => addSubItem(bundle.id)}>
                      <LuCirclePlus />
                    </span>
                  }
                </div>
              </Draggable>
            ))}
          </div>
        :
        <Guide />
      }

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalMessage.includes("성공") ? (
              <p>체크리스트가 저장되었습니다✨<br />여행일정은 완성됐나요?</p>
            ) : (
              <p>저장 실패😥<br />다시 시도해주세요</p>
            )}
          </div>
        </div>
      )}

    </section>
  )
}

export default Check;
