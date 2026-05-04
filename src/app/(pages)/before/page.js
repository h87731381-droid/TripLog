"use client";

import React from 'react'
import style from './before.module.scss';

function page() {
  return (
    <div>
      <section className={style.listSection}>
        <h1 className={style.title}>나의 기록</h1>
        <div className={style.tirpBox}>
          <article className={style.contents}>
            <div className={style.trip}>
              <b>강원도 3박4일 여행</b>
              <p>2026.05.06 ~ 2026.05.08</p>
            </div>
            <button className={style.detail}>
              <span>자세히 보기</span>
              <img src='/imgs/before/grommet-icons_next.svg' />
            </button>
          </article>
          <article className={style.contents}>
            <div className={style.trip}>
              <b>강원도 3박4일 여행</b>
              <p>2026.05.06 ~ 2026.05.08</p>
            </div>
            <button className={style.detail}>
              <span>자세히 보기</span>
              <img src='/imgs/before/grommet-icons_next.svg' />
            </button>
          </article>
          <article className={style.contents}>
            <div className={style.trip}>
              <b>강원도 3박4일 여행</b>
              <p>2026.05.06 ~ 2026.05.08</p>
            </div>
            <button className={style.detail}>
              <span>자세히 보기</span>
              <img src='/imgs/before/grommet-icons_next.svg' />
            </button>
          </article>
          <article className={style.contents}>
            <div className={style.trip}>
              <b>강원도 3박4일 여행</b>
              <p>2026.05.06 ~ 2026.05.08</p>
            </div>
            <button className={style.detail}>
              <span>자세히 보기</span>
              <img src='/imgs/before/grommet-icons_next.svg' />
            </button>
          </article>
        </div>
      </section>


      <section className={style.detailSection}>
        <div className={style.contentsDetail}>
          <h1 className={style.title}>나의 기록</h1>
          <div>
            <div className={style.planName}>
              <span>강원도 3박4일 여행</span>
              <span>2026.05.06 ~ 2026.05.08</span>
            </div>
            <img src='/imgs/before/material-symbols_arrow-back.svg' />
          </div>
        </div>
        <div className={style.menu}>
          <button>여행일정</button>
          <button>체크리스트</button>
          <button>여행경비</button>
          <button>갤러리</button>
        </div>
        <div className={style.schedule}>
          <div className={style.planHeader}>
            <div className={style.date}>
              <b>Day 1</b>
              <p>2026.05.06 월</p>
            </div>
            <button className={style.view}>
              <span>지도보기</span>
              <img src='/imgs/before/grommet-icons_next.svg' />
            </button>
          </div>
          <div className={style.planList}>
            <ul className={style.planData}>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
            <ul>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
            <ul>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
            <ul>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
            <ul>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
            <ul>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
            <ul>
              <li>11:30</li>
              <li>출발</li>
              <li>의정부역</li>
            </ul>
            <p>공항철도</p>
          </div>
        </div>
      </section>


    </div>
  )
}

export default page