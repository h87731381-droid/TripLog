'use client';
import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbPencil } from "react-icons/tb";
import { FiX } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import styles from './gallery_sub.scss'
import { useParams } from 'next/navigation';

function S_gallery() {
    const { id } = useParams();

    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [files, setFiles] = React.useState([]);

    function upload() {
        console.log("title:", title);
        console.log("files:", files);

        setOpen(false);
        setTitle('');
        setFiles([]);
    }

  return (
    <>
    <h1 className='gsub_title'>갤러리</h1>

    <p className='gsub_button'>
        <span><button>수정하기</button></span>
        <span><button>완료</button><button>취소</button></span>
    </p>

    <div className='gsub_list'>
        <div className='gsub_clickimg'>
            <span>
                <FiDownload /><FiX />
            </span>
            <div><img src='/imgs/gallery/galleryEmptyFold.png'/></div>
            <span><button>수정</button><button>완료</button></span>
            <input type="text" placeholder="기록을 남기세요."/>
        </div>

        <div className='gsub_contents'>
            <div className='gsub_Tversion'>
                <input type="text" placeholder="타이틀을 수정하세요." />
                <TbPencil />
            </div>

            <div className='gsub_images'>
                <div className='gsub_img'>
                    <figure>
                        <img src='/imgs/gallery/galleryEmptyFold.png'/>
                        <figcaption><RiDeleteBin6Line /></figcaption>
                    </figure>                   
                </div>
               
                <button className='gsub_add' onClick={() => setOpen(true)}> <FiPlusCircle /> </button>
            </div>
        </div>
    </div>

    {open && (
        <div className='gsub_popup' onClick={() => setOpen(false)}>
            <form className='pop' onClick={(e) => e.stopPropagation()}>
                <span onClick={() => setOpen(false)}><FiX /></span>
                <input type="text" placeholder="타이틀을 입력하세요." onChange={(e) => setTitle(e.target.value)} />
                <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
                <button type="button" onClick={upload}>등록하기</button>
            </form>
        </div>
    )}
    
    </> 
  )
} 

export default S_gallery