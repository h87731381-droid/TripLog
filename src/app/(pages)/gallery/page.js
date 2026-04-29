'use client';
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbPencil } from "react-icons/tb";
import { FiX, FiPlusCircle, FiDownload, FiCheck } from "react-icons/fi";
import './gallery.scss'
import axios from 'axios';

/**
 * [Main Component] S_gallery 
 * 전체 갤러리 페이지를 관리하는 메인 컴포넌트입니다.
 */
function S_gallery() {
    /* ============================================================
       1. 상태 관리 (States)
       ============================================================ */
    const [open, setOpen] = useState(false);             // 업로드 팝업창의 열림/닫힘 상태
    const [mode, setMode] = useState('등록');           // '등록'(새 폴더) 또는 '추가'(기존 폴더에 사진 추가) 구분
    const [galleries, setGalleries] = useState([]);      // API로부터 받아와 가공된 전체 갤러리 데이터
    const [uploadTitle, setUploadTitle] = useState('');  // 신규 등록 시 사용자가 입력하는 제목
    const [uploadFiles, setUploadFiles] = useState([]);  // 선택된 업로드 파일 객체들
    const [selectedImage, setSelectedImage] = useState(null); // 크게 보기 중인 현재 이미지 데이터
    const [selectedItem, setSelectedItem] = useState(null);   // 크게 보기 중인 이미지의 부모(폴더) 데이터
    const [isNoteEdit, setIsNoteEdit] = useState(false);      // 이미지 하단 메모의 수정 모드 활성화 여부

    /* ============================================================
       2. 주요 기능 함수 (Functions)
       ============================================================ */

    /**
     * [READ] 전체 갤러리 데이터를 가져와 타이틀별로 그룹화하는 함수
     */
    async function getGallery() {
        try {
            const res = await axios.get('/api/gallery');
            const rawData = res.data.result; // 서버에서 받은 순수 배열 데이터

            // 1. 중복 없는 타이틀 목록 추출
            let titles = new Set();
            rawData.forEach(item => titles.add(item.title));

            // 2. 타이틀별로 이미지들을 묶어 새로운 배열 생성 (Grouping)
            const data = [...titles].map(tit => {
                const images = rawData.filter(item => item.title === tit);
                return { title: tit, images };
            });

            setGalleries(data); // 상태 업데이트
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    }

    /**
     * [DELETE] 이미지 ID를 받아 해당 사진을 삭제하는 함수
     */
    async function handleDelete(id) {
        const ok = confirm('해당 사진을 삭제하시겠습니까?');
        if (!ok) return;
        
        await axios.delete(`/api/gallery?id=${id}`);
        getGallery(); // 삭제 후 목록 새로고침
        setSelectedImage(null); // 크게 보기 창 닫기
    }

    /**
     * [DOWNLOAD] 이미지 URL을 Blob으로 변환하여 직접 다운로드를 실행하는 함수
     * 외부 주소(imgBB 등) 이동 문제를 방지합니다.
     */
    async function downloadImage(file) {
        try {
            const response = await fetch(file.files);
            const blob = await response.blob(); // 이미지 데이터를 바이너리로 변환
            const url = window.URL.createObjectURL(blob); // 임시 다운로드 주소 생성
            
            const link = document.createElement('a');
            link.href = url;
            
            // 파일 이름 설정 (URL의 마지막 부분을 파일명으로 사용)
            const fileName = file.files.substring(file.files.lastIndexOf('/') + 1);
            link.download = fileName;

            document.body.appendChild(link);
            link.click(); // 가상 클릭 발생
            document.body.removeChild(link); // 태그 제거
            window.URL.revokeObjectURL(url); // 메모리 해제
        } catch (error) {
            console.error("다운로드 실패 (CORS 정책 등):", error);
            window.open(file.files, '_blank'); // 실패 시 새 창에서 열기
        }
    }

    // 초기 로드 시 데이터 호출
    useEffect(() => {
        getGallery();
    }, []);

    return (
        <>
            <div className='title'><h1>갤러리</h1></div>

            {/* 등록 버튼 영역 */}
            <p className='gsub_button'>
                <span>
                    <button onClick={() => { setOpen(true); setUploadTitle(''); setMode('등록') }}>
                        등록하기
                    </button>
                </span>
            </p>

            <div className='gsub_list_wrap'>
                
                {/* [상세보기] 이미지를 클릭했을 때 나타나는 오버레이 레이어 */}
                {selectedImage && (
                    <div className='gsub_clickimg'>
                        <span>
                            {/* 다운로드 버튼 */}
                            <FiDownload onClick={() => downloadImage(selectedImage)} style={{cursor:'pointer'}} />
                            {/* 닫기 버튼 */}
                            <FiX onClick={() => {
                                setSelectedImage(null);
                                setSelectedItem(null);
                                setIsNoteEdit(false);
                            }} style={{cursor:'pointer'}} />
                        </span>

                        <div className='img_box'>
                            <img src={selectedImage.files} alt="selected" />
                        </div>

                        {/* 메모 수정 버튼 영역 */}
                        <span>
                            {!isNoteEdit ? (
                                <button onClick={() => setIsNoteEdit(true)}>수정</button>
                            ) : (
                                <button onClick={async () => {
                                    setIsNoteEdit(false);
                                    // [UPDATE] 메모 내용 서버에 저장
                                    await axios.put('/api/gallery', { id: selectedImage._id, note: selectedImage.note })
                                    getGallery();
                                }}>완료</button>
                            )}
                        </span>

                        {/* 메모 입력창 */}
                        <input
                            type="text"
                            placeholder="수정버튼을 눌러 기록을 남기세요!"
                            value={selectedImage?.note || ''}
                            disabled={!isNoteEdit}
                            onChange={(e) => {
                                const newText = e.target.value;
                                // 현재 보고 있는 이미지 상태값 실시간 반영
                                setSelectedImage(prev => ({ ...prev, note: newText }));
                            }}
                            style={{
                                backgroundColor: isNoteEdit ? "#eee" : "transparent",
                                opacity: isNoteEdit ? 1 : 0.6
                            }}
                        />
                    </div>
                )}

                {/* [리스트 출력] 그룹화된 갤러리 목록을 반복문으로 출력 */}
                <div className={`gsub_list_area ${selectedImage && 'active'}`}>
                    {galleries.length === 0 ? (
                        <div className="gsub_empty">
                            <p>등록하기를 눌러 사진을 등록하세요!</p>
                        </div>
                    ) : (
                        galleries.map((item, iIndex) => (
                            <GalleryItem
                                key={iIndex}
                                item={item}
                                getGallery={getGallery}
                                handleDelete={handleDelete}
                                setMode={setMode}
                                setOpen={setOpen}
                                setSelectedItem={setSelectedItem}
                                setSelectedImage={setSelectedImage}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* [팝업] 사진 등록 및 추가를 위한 모달 창 */}
            {open && (
                <Popup
                    setMode={setMode}
                    getGallery={getGallery}
                    setOpen={setOpen}
                    uploadFiles={uploadFiles}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    mode={mode}
                    uploadTitle={uploadTitle}
                    setUploadTitle={setUploadTitle}
                    setUploadFiles={setUploadFiles}
                />
            )}
        </>
    )
}

/* ============================================================
   3. [Sub Component] GalleryItem
   각 폴더(타이틀)별 이미지 리스트와 제목 수정을 관리합니다.
   ============================================================ */
function GalleryItem({
    item, getGallery, handleDelete, setMode, setOpen, setSelectedItem, setSelectedImage
}) {
    const [title, setTitle] = useState(item.title); // 폴더 제목 수정을 위한 로컬 상태
    const [isEdit, setIsEdit] = useState(false);   // 제목 수정 모드 여부

    // 데이터가 업데이트되어 부모로부터 새로운 제목이 오면 상태 동기화
    useEffect(() => {
        setTitle(item.title);
    }, [item.title]);

    /**
     * [UPDATE] 폴더(타이틀) 이름을 일괄 변경하는 함수
     */
    async function editTitle() {
        await axios.put('/api/gallery', { lastTitle: item.title, updateTitle: title });
        getGallery();
    }

    return (
        <>
            {/* 타이틀 수정 영역 */}
            <div className='gsub_Tversion'>
                <input value={title} onChange={(e) => setTitle(e.target.value)} readOnly={!isEdit} />
                {!isEdit ?
                    <span className='pencil' onClick={() => setIsEdit(true)}><TbPencil /></span>
                    :
                    <span className='check' onClick={() => { setIsEdit(false); editTitle(); }}><FiCheck /></span>
                }
            </div>

            {/* 이미지 리스트 영역 */}
            <div className='gsub_list'>
                {item.images.map((file, i) => (
                    <div className='gsub_img' key={i}>
                        <figure>
                            <img
                                src={file.files}
                                alt="preview"
                                onClick={() => {
                                    setSelectedImage(file);
                                    setSelectedItem(item);
                                }}
                            />
                            {/* 수정 모드(연필클릭)일 때만 삭제 아이콘 표시 */}
                            {isEdit && (
                                <figcaption onClick={() => handleDelete(file._id)}>
                                    <RiDeleteBin6Line />
                                </figcaption>
                            )}
                        </figure>
                    </div>
                ))}

                {/* 해당 폴더에 사진 추가 버튼 */}
                <div className='gsub_img'>
                    <button className='gsub_add' onClick={() => {
                        setMode('추가');
                        setOpen(true);
                        setSelectedItem(item);
                    }}>
                        <FiPlusCircle />
                    </button>
                </div>
            </div>
        </>
    );
}

/* ============================================================
   4. [Sub Component] Popup
   FormData를 이용해 이미지 파일을 서버로 전송합니다.
   ============================================================ */
function Popup({
    setMode, getGallery, setSelectedItem, selectedItem, mode, setUploadTitle, setOpen, uploadTitle, setUploadFiles, uploadFiles
}) {
    /**
     * [CREATE] 사진 업로드 실행 함수
     */
    async function upload() {
        const session = JSON.parse(sessionStorage.getItem('session'));
        if(!session) return alert("로그인이 필요한 서비스입니다.");

        const formdata = new FormData();
        // 등록 모드면 직접 입력한 타이틀을, 추가 모드면 기존 폴더의 타이틀을 사용
        formdata.append('title', mode !== '추가' ? uploadTitle : selectedItem?.title);
        formdata.append('email', session.user.email);
        formdata.append('note', ''); // 초기 메모는 빈값
        
        // 여러 파일을 배열로 담아 전송
        Array.from(uploadFiles).forEach((file) => {
            formdata.append('files', file);
        });

        await axios.post('/api/gallery', formdata);

        // 등록 완료 후 상태 초기화 및 창 닫기
        setMode('등록');
        setUploadFiles([]);
        setOpen(false);
        setUploadTitle('');
        setSelectedItem(null);
        getGallery(); // 목록 새로고침
    }

    return (
        <div className='gsub_popup' onClick={() => setOpen(false)}>
            {/* stopPropagation: 클릭 이벤트가 부모(배경)로 퍼져 팝업이 닫히는 것을 방지 */}
            <form className='pop' onClick={(e) => e.stopPropagation()}>
                <span><FiX onClick={() => setOpen(false)} /></span>
                
                {mode === '추가' ?
                    <input value={selectedItem?.title || ''} readOnly />
                    :
                    <input
                        placeholder='타이틀을 입력하세요.'
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                    />
                }
                
                <input
                    type="file"
                    multiple
                    className="my-file-input"
                    onChange={(e) => setUploadFiles(e.target.files)}
                />
                
                <button type="button" onClick={upload}>등록하기</button>
            </form>
        </div>
    )
}

export default S_gallery;