'use client';

import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbPencil } from "react-icons/tb";
import { FiX, FiPlusCircle, FiDownload, FiCheck } from "react-icons/fi";
import './gallery.scss';
import axios from 'axios';
import { authStore } from '@/app/store/authStore'; 

/**
 * [메인 컴포넌트] S_gallery
 */
function S_gallery() {
    // 1. 상태 및 스토어 설정
    const { setShowLogin } = authStore();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('등록');
    const [galleries, setGalleries] = useState([]);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadFiles, setUploadFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isNoteEdit, setIsNoteEdit] = useState(false);

    // --- 프리뷰 팝업 관련 상태 추가 ---
    const [showPreview, setShowPreview] = useState(false);

    /**
     * [조회] getGallery
     */
    async function getGallery() {
        setTimeout(async ()=>{
            try {
                const sessionData = sessionStorage.getItem('session');
                if (!sessionData) {
                    setGalleries([]);
                    return;
                }
    
                const session = JSON.parse(sessionData);
                const userEmail = session.user?.email;
    
                if (!userEmail) {
                    setGalleries([]);
                    return;
                }
    
                const res = await axios.get(`/api/gallery?email=${userEmail}`);
                const rawData = res.data.result || [];
    
                let titles = new Set();
                rawData.forEach(item => { if(item.title) titles.add(item.title) });
    
                const data = [...titles].map(tit => {
                    const images = rawData.filter(item => item.title === tit);
                    return { title: tit, images };
                });
    
                setGalleries(data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }            
        }, 300);
    }

    /**
     * [등록 버튼] handleOpenUpload
     */
    const handleOpenUpload = () => {
        const session = sessionStorage.getItem('session');
        if (!session) {
            setShowLogin();
            return;
        }
        setOpen(true);
        setUploadTitle('');
        setMode('등록');
    };

    /**
     * [삭제] handleDelete
     */
    async function handleDelete(id) {
        if (!confirm('삭제하시겠습니까?')) return;
        await axios.delete(`/api/gallery?id=${id}`);
        getGallery();
        setSelectedImage(null);
    }

    /**
     * [다운로드] downloadImage
     */
    async function downloadImage(file) {
        try {
            const response = await fetch(file.files);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "gallery_image";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) { window.open(file.files, '_blank'); }
    }

    // 마운트 시 최초 데이터 로드 및 프리뷰 자동 실행
    useEffect(() => {
        getGallery();
        // 메뉴 진입 시 프리뷰 자동 노출
        setShowPreview(true);
    }, []);

    return (
        <>
            {/* --- 반응형 프리뷰 팝업 추가 --- */}
            {showPreview && (
                <div className="preview_overlay">
                    <div className="preview_content">
                        <button className="preview_close" onClick={() => setShowPreview(false)}>
                            샘플 닫기<FiX />
                        </button>
                        <div className='preview_pic'>
                        </div>
                    </div>
                </div>
            )}

            {/* 상단 타이틀 구역 */}
            <div className='gallery_title'>
                <h1>갤러리</h1>
                <p className='gsub_button'>
                    <span>
                        <button onClick={handleOpenUpload}>등록하기</button>
                    </span>
                </p>
            </div>            

            <div className='gsub_list_wrap'>
                {/* 1. 이미지 상세보기 모달 */}
                {selectedImage && (
                    <div className='gsub_clickimg'>
                        <span>
                            <FiDownload onClick={() => downloadImage(selectedImage)} style={{cursor:'pointer'}} />
                            <FiX onClick={() => { setSelectedImage(null); setIsNoteEdit(false); }} style={{cursor:'pointer'}} />
                        </span>
                        <div className='img_box'><img src={selectedImage.files} alt="" /></div>
                        <span>
                            {!isNoteEdit ? (
                                <button onClick={() => setIsNoteEdit(true)}>수정</button>
                            ) : (
                                <button onClick={async () => {
                                    setIsNoteEdit(false);
                                    await axios.put('/api/gallery', { id: selectedImage._id, note: selectedImage.note })
                                    getGallery();
                                }}>완료</button>
                            )}
                        </span>
                        <input
                            type="text"
                            placeholder='수정버튼을 눌러 내용을 남기세요!'
                            value={selectedImage?.note || ''}
                            disabled={!isNoteEdit}
                            onChange={(e) => setSelectedImage(prev => ({ ...prev, note: e.target.value }))}
                            style={{ backgroundColor: !isNoteEdit ? '#ffffff' : '#f0f0f0', transition: 'background-color 0.3s ease'}}
                        />
                    </div>
                )}

                {/* 2. 갤러리 리스트 구역 */}
                <div className={`gsub_list_area ${selectedImage && 'active'}`}>
                    {galleries.length === 0 ? (
                        <div className="gsub_empty">
                            <p>등록하기를 눌러 사진을 등록하세요!</p>
                        </div>
                    ) : (
                        galleries.map((item, idx) => (
                            <GalleryItem
                                key={idx}
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

            {/* 3. 등록/추가 팝업 모달 */}
            {open && (
                <Popup
                    setMode={setMode}
                    getGallery={getGallery}
                    setOpen={setOpen}
                    selectedItem={selectedItem}
                    mode={mode}
                    uploadTitle={uploadTitle}
                    setUploadTitle={setUploadTitle}
                    setUploadFiles={setUploadFiles}
                    uploadFiles={uploadFiles}
                />
            )}

            <div>
                <span></span>
            </div>
        </>
    )
}

/**
 * [서브 컴포넌트] GalleryItem
 */
function GalleryItem({ item, getGallery, handleDelete, setMode, setOpen, setSelectedItem, setSelectedImage }) {
    const [title, setTitle] = useState(item.title);
    const [isEdit, setIsEdit] = useState(false);

    async function editTitle() {
        await axios.put('/api/gallery', { lastTitle: item.title, updateTitle: title });
        getGallery();
    }

    return (
        <>
            <div className='gsub_Tversion'>
                <input value={title} onChange={(e) => setTitle(e.target.value)} readOnly={!isEdit} />
                {!isEdit ? 
                    <span className='pencil' onClick={() => setIsEdit(true)}><TbPencil /></span> : 
                    <span className='check' onClick={() => { setIsEdit(false); editTitle(); }}><FiCheck /></span>
                }
            </div>
            <div className='gsub_list'>
                {item.images.map((file, i) => (
                    <div className='gsub_img' key={i}>
                        <figure>
                            <img src={file.files} onClick={() => setSelectedImage(file)} alt="" />
                            {isEdit && <figcaption onClick={() => handleDelete(file._id)}><RiDeleteBin6Line /></figcaption>}
                        </figure>
                    </div>
                ))}
                <div className='gsub_img'>
                    <button className='gsub_add' onClick={() => { setMode('추가'); setSelectedItem(item); setOpen(true); }}>
                        <FiPlusCircle />
                    </button>
                </div>
            </div>
        </>
    );
}

/**
 * [서브 컴포넌트] Popup
 */
function Popup({ setMode, getGallery, selectedItem, mode, setOpen, uploadTitle, setUploadTitle, setUploadFiles, uploadFiles }) {
    async function upload() {
        const session = JSON.parse(sessionStorage.getItem('session'));
        if(!session) return alert("세션이 만료되었습니다.");

        const formdata = new FormData();
        formdata.append('title', mode === '추가' ? selectedItem.title : uploadTitle);
        formdata.append('email', session.user.email);
        formdata.append('note', '');
        Array.from(uploadFiles).forEach(file => formdata.append('files', file));

        await axios.post('/api/gallery', formdata);
        setOpen(false);
        setUploadFiles([]);
        getGallery();
    }

    return (
        <div className='gsub_popup' onClick={() => setOpen(false)}>
            <form className='pop' onClick={(e) => e.stopPropagation()}>
                <FiX className='Fix' onClick={() => setOpen(false)} />
                <input 
                    value={mode === '추가' ? selectedItem?.title : uploadTitle} 
                    onChange={(e) => setUploadTitle(e.target.value)} 
                    placeholder="타이틀 입력"
                    readOnly={mode === '추가'}
                />
                <input type="file" multiple onChange={(e) => setUploadFiles(e.target.files)} />
                <button type="button" onClick={upload}>등록하기</button>
            </form>
        </div>
    )
}

export default S_gallery;