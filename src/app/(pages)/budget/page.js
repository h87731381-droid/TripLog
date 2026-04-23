import React from 'react'
import styles from './budget.scss'
import { FiCheck } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { TbPencil } from "react-icons/tb";

function budget() {
  return (
    <>
    <h1 className='budget_title'>여행경비</h1>

    <div className='background'></div>

    <div className="category">
        <form>
            <select name="" id="">
                <option>숙박비</option>
                <option>교통비</option>
                <option>식비</option>
                <option>기타비용</option>
            </select>

            <input type="text" placeholder="타이틀"></input>
            <input type="text" placeholder="금액"></input>
            <input type="calender" placeholder="날짜"></input>
            <input type="submit" value="추가" />
            <input type="submit" value="수정" />
            <input type="submit" value="완료" />
        </form>
    </div>

    <div className='wrap'>
      <div className='list'>

        <div className='list_stay'>
          <div className='list_title'>숙박비</div>
          <div className='list_content'>
            <div>
              <div>☆☆호텔</div>
              <div>300.000</div>
              <div>원</div>
              <span>2025.04.14</span>
            </div>
            <form>
              <input type="text" placeholder="타이틀"></input>
              <input type="text" placeholder="금액"></input>
              <input type="calender" placeholder="날짜"></input>
              <span><FiCheck /></span><span><FiX /><TbPencil /></span>           
            </form>
          </div>
        </div>

        <div className='list_fare'>
          <div className='list_title'>교통비</div>
          <div className='list_content'>
            <div>
              <div>☆☆호텔</div>
              <div>300.000</div>
              <div>원</div>
              <span>2025.04.14</span>
            </div>
            <form>
              <input type="text" placeholder="타이틀"></input>
              <input type="text" placeholder="금액"></input>
              <input type="calender" placeholder="날짜"></input>
              <span><FiCheck /></span><span><FiX /><TbPencil /></span>                
            </form>
          </div>
        </div>

        <div className='list_food'>
          <div className='list_title'>식비</div>
          <div className='list_content'>
            <div>
              <div>☆☆호텔</div>
              <div>300.000</div>
              <div>원</div>
              <span>2025.04.14</span>
            </div>
            <form>
              <input type="text" placeholder="타이틀"></input>
              <input type="text" placeholder="금액"></input>
              <input type="calender" placeholder="날짜"></input>
              <span><FiCheck /></span><span><FiX /><TbPencil /></span>                
            </form>
          </div>
        </div>
        
        <div className='list_other'>
          <div className='list_title'>기타비용</div>
          <div className='list_content'>
            <div>
              <div>☆☆호텔</div>
              <div>300.000</div>
              <div>원</div>
              <span>2025.04.14</span>
            </div>
            <form>
              <input type="text" placeholder="타이틀"></input>
              <input type="text" placeholder="금액"></input>
              <input type="calender" placeholder="날짜"></input>
              <span><FiCheck /></span><span><FiX /><TbPencil /></span>                
            </form>
          </div>
        </div>
      </div>
      
      <div className='Receipt'>
        <h3>Receipt</h3>
        <span>
          <p>숙박비<span>35,000</span>원</p>
          <p>교통비<span>35,000</span>원</p>
          <p>식비<span>35,000</span>원</p>
          <p>기타비용<span>35,000</span>원</p>
        </span>
        <div>
          <span>Total</span>
          <span>/<input type="text" placeholder='N'/></span>
        </div>
      </div>
    </div>
    </>
  )
}

export default budget
