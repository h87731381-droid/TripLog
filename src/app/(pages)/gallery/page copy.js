'use client';
import React, { useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbPencil } from "react-icons/tb";
import { FiX, FiPlusCircle, FiDownload, FiCheck } from "react-icons/fi";
import './gallery.scss'

function S_gallery() {
    /* ============================================================
       1. 상태 관리 (Main States)
       ============================================================ */
    const [open, setOpen] = useState(false);        // 팝업창 열림/닫힘 상태
    const [mode, setMode] = useState('등록');      // '등록'(새 폴더) 또는 '추가'(기존 폴더에 사진 추가) 모드
    const [galleries, setGalleries] = useState([]); // 전체 갤러리 데이터 배열 (id, title, images 포함)
    
    const [uploadTitle, setUploadTitle] = useState(''); // 새 갤러리 등록 시 입력하는 제목
    const [uploadFiles, setUploadFiles] = useState([]); // 업로드하기 위해 선택한 파일 객체들의 배열

    const [selectedImage, setSelectedImage] = useState(null); // 클릭해서 크게 보고 있는 현재 이미지 객체
    const [selectedItem, setSelectedItem] = useState(null);   // 현재 선택된 이미지의 부모 갤러리 객체

    const [isNoteEdit, setIsNoteEdit] = useState(false); // 이미지별 메모(note) 수정 모드 여부

    /* ============================================================
       2. 이벤트 핸들러 (Event Handlers)
       ============================================================ */
    
    // 특정 갤러리 내의 특정 이미지를 삭제하는 함수
    function handleDelete(galleryIndex, imageIndex) {
        const ok = confirm('해당 사진을 삭제하시겠습니까?');
        if (!ok) return;

        const newGalleries = [...galleries]; // 상태 불변성을 위한 복사
        newGalleries[galleryIndex].images.splice(imageIndex, 1); // 해당 인덱스 이미지 제거

        setGalleries(newGalleries);
        setSelectedImage(null); // 크게 보기 창 닫기 효과
    }

    // 이미지 다운로드 기능 (가상 링크 생성 방식)
    function downloadImage(file) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = 'image.jpg'; // 저장될 파일명
        link.click();
    }

    return (
        <>
            <div className='title'><h1>갤러리</h1></div>

            {/* 갤러리 등록 버튼 */}
            <p className='gsub_button'>
                <span>
                    <button onClick={() => { setOpen(true); setUploadTitle(''); setMode('등록')}}>
                        등록하기
                    </button>
                </span>
            </p>

            <div className='gsub_list_wrap'>

                {/* 이미지 클릭 시 나타나는 '크게 보기' 및 '메모 수정' 영역 */}
                {selectedImage && (
                    <div className='gsub_clickimg'>
                        <span>
                            {/* 다운로드 및 닫기 아이콘 */}
                            <FiDownload onClick={() => downloadImage(selectedImage)} />
                            <FiX onClick={() => {
                                setSelectedImage(null);
                                setSelectedItem(null);
                            }} />
                        </span>

                        <div>
                            <img src={selectedImage.url} alt="selected" />
                        </div>

                        {/* 메모 수정/완료 버튼 */}
                        <span>
                            {!isNoteEdit ? (
                                <button onClick={() => setIsNoteEdit(true)}>수정</button>
                            ) : (
                                <button onClick={() => setIsNoteEdit(false)}>완료</button>
                            )}
                        </span>

                        {/* 이미지별 note 입력창 (수정 모드일 때만 활성화) */}
                        <input
                            type="text"
                            placeholder="수정버튼을 눌러 기록을 남기세요!"
                            value={selectedImage?.note || ''}
                            disabled={!isNoteEdit}
                            onChange={(e) => {
                                const newText = e.target.value;

                                // 1. 전체 galleries 상태 업데이트 (깊은 복사 구조)
                                setGalleries(prev =>
                                    prev.map(g => ({
                                        ...g,
                                        images: g.images.map(img =>
                                            img.url === selectedImage.url
                                                ? { ...img, note: newText }
                                                : img
                                        )
                                    }))
                                );

                                // 2. 현재 크게 보고 있는 이미지의 note 상태도 실시간 업데이트
                                setSelectedImage(prev => ({
                                    ...prev,
                                    note: newText
                                }));
                            }}
                            style={{
                                backgroundColor: isNoteEdit ? "#eee" : "transparent",
                                opacity: isNoteEdit ? 1 : 0.6
                            }}
                        />
                    </div>
                )}

                {/* 등록된 갤러리 리스트가 표시되는 영역 */}
                <div className={`gsub_list_area ${selectedImage && 'active'}`}>
                    {galleries.length === 0 ? (
                        <div className="gsub_empty">
                            <p>등록버튼을 눌러 사진을 등록하세요!</p>
                        </div>
                    ) : (
                        galleries.map((item, iIndex) => (
                            <GalleryItem 
                                key={item.id || iIndex}
                                iIndex={iIndex}
                                item={item}
                                galleries={galleries}
                                setGalleries={setGalleries}
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

            {/* 등록/추가 팝업 컴포넌트 */}
            {open && (
                <Popup 
                    setOpen={setOpen}
                    setGalleries={setGalleries}
                    uploadFiles={uploadFiles}
                    galleries={galleries}
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
   3. 개별 갤러리 아이템 컴포넌트 (GalleryItem)
   ============================================================ */
function GalleryItem({
    item, iIndex, galleries, setGalleries, handleDelete, setMode, setOpen, setSelectedItem, setSelectedImage
}){
    const [title, setTitle] = useState(item.title); // 갤러리 제목 수정을 위한 로컬 상태
    const [isEdit, setIsEdit] = useState(false);    // 제목 수정 모드 활성화 여부

    // 변경된 제목을 전체 데이터에 반영하는 함수
    function editTitle(){
        setGalleries(
            galleries.map(obj=>{
                if(obj.id === item.id) return { ...obj, title: title };
                return obj;
            })
        );            
    }

    return<>
        {/* 갤러리 제목 영역 (수정 가능) */}
        <div className='gsub_Tversion'>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} readOnly={!isEdit}/>
            {
                !isEdit ?
                    <span className='pencil' onClick={()=>setIsEdit(true)}><TbPencil/></span>
                :
                    <span className='check' onClick={()=>{setIsEdit(false); editTitle();}}><FiCheck/></span>
            }
        </div>

        {/* 해당 갤러리의 이미지들 가로 리스트 */}
        <div className='gsub_list'>
            {
                item.images.map((file, i) => (
                    <div className='gsub_img' key={i}>
                        <figure>
                            <img
                                src={file.url}
                                alt="preview"
                                onClick={() => {
                                    setSelectedImage(file);
                                    setSelectedItem(item);
                                }}
                            />
                            {/* 제목 수정 모드(isEdit)일 때만 이미지 삭제 아이콘 노출 */}
                            {isEdit && (
                                <figcaption onClick={() => handleDelete(iIndex, i)}>
                                    <RiDeleteBin6Line />
                                </figcaption>
                            )}
                        </figure>
                    </div>
                ))
            }

            {/* 사진 추가 버튼 (+ 아이콘) */}
            <div className='gsub_img'>
                <button className='gsub_add' onClick={()=>{
                    setMode('추가');
                    setOpen(true);
                    setSelectedItem(item);
                }}>
                    <FiPlusCircle/>
                </button>
            </div>
        </div>
    </>
}

/* ============================================================
   4. 파일 업로드 팝업 컴포넌트 (Popup)
   ============================================================ */
function Popup({
    uploadFiles, galleries, setGalleries, selectedItem, setSelectedItem, mode, setUploadTitle, setOpen, uploadTitle, setUploadFiles
}){
    // '등록하기' 버튼 클릭 시 실행되는 함수
    function upload() {
        // [수정 포인트] '등록' 모드일 때만 타이틀 필수 입력 체크
        if (mode === '등록' && !uploadTitle.trim()) {
            alert('타이틀을 입력해주세요.');
            return; // 타이틀이 없으면 여기서 함수 종료 (아래 로직 실행 안 됨)
        }

        if (uploadFiles.length === 0) {
            alert('사진을 최소 1장 이상 선택하세요.');
            return;
        }
        
        // 추가 모드일 경우 기존 갤러리 찾기
        const findData = galleries.filter(obj=>obj.title === selectedItem?.title)
        
        if (findData.length) {
            // [추가 모드] 기존 이미지 배열에 새 파일들을 push
            findData[0].images.push(...uploadFiles);
            setGalleries(
                galleries.map(obj=>{
                    if(obj.id === selectedItem.id) {
                        return { ...obj, images: [...findData[0].images] };
                    }
                    return obj;
                })
            );
        }
        else {
            // [등록 모드] 새로운 갤러리 객체 생성
            const newGallery = {
                id: Date.now(),
                title: uploadTitle,
                images: uploadFiles
            };
            setGalleries(prev => [...prev, newGallery]);
        }

        // 초기화 및 닫기
        setUploadFiles([]);
        setOpen(false);
        setUploadTitle(''); // 다음 등록을 위해 타이틀 비워주기
        setSelectedItem(null);
    }

    return (
        <div className='gsub_popup' onClick={() => setOpen(false)}>
            <form className='pop' onClick={(e) => e.stopPropagation()}>
                <span><FiX  onClick={() => setOpen(false)} /></span>

                {
                    mode === '추가' ?
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
                    onChange={(e) => {
                        const fileArr = [...e.target.files].map(file => ({
                            file,
                            url: URL.createObjectURL(file),
                            note: ''
                        }));
                        setUploadFiles(fileArr);
                    }}
                />

                <button type="button" onClick={upload}>등록하기</button>
            </form>
        </div>
    )
}

export default S_gallery