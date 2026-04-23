'use client';
import React, { useState } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import styles from './gallery_main.scss'
import { useRouter } from 'next/navigation';

// 처음 화면에 보여줄 폴더 데이터
const init = [
    { id: 0, title: '제주도' },
    { id: 1, title: '강원도' }
  ]

function M_gallery() {
  
  const [data, setData] = useState(init);
  // data = 폴더 목록
  // setData = 폴더 변경 함수 (이걸 써야 화면이 바뀜)

  return (
    <div className='gmain'>

      <h1 className='gmain_title'>갤러리</h1>

      <div className='gmain_list'>
        {
          data.map(function (obj) { //data 배열을 하나씩 꺼내서 Item으로 보냄
            return <Item obj={obj} data={data} key={obj.id} setData={setData}/>
          })
        }

        <button className='gmain_add' onClick={()=>setData([...data,{id:Date.now(),title:''}])}> 
          <FiPlusCircle />
        </button>
      </div>

    </div>
  )
}

export default M_gallery


// 폴더 하나 컴포넌트
function Item({obj,data, setData}){

  const [mode, setMode] = useState(false); // 수정 모드 (false: 읽기, true: 수정 가능)
  const router = useRouter();

  // 삭제 함수
  function del(id){
    const check = window.confirm('삭제하시겠습니까?');

    if (!check) return;

    let deleteData = data.filter(obj=>obj.id !== id);
    setData(deleteData);
    setMode(false);
  }
  return(
    <div className='gmain_folder' onClick={() => router.push('/pages/gallery_sub')}>
      <div>
        <input type="text" value={obj.title} onChange={(e)=>{
          setData(data.map((item)=>{
            if(item.id==obj.id) item.title=e.target.value;
            return item;
        }));
        }} placeholder="폴더명을 입력하세요." disabled={!mode} />
      </div>
      <p>
        {
          mode ?
            <span><button onClick={() => del(obj.id)}>삭제</button>
              <span>|</span>
              <button onClick={() => setMode(false)}>완료</button></span>
            :
            <span><button onClick={() => setMode(true)}>수정</button></span>
        }
      </p>
    </div>
  )
}