import db from "@/app/lib/mongodb"; 
import axios from "axios";
import { ObjectId } from "mongodb";

/**
 * [GET] 내 갤러리 목록 가져오기
 * 설명: 클라이언트에서 보낸 이메일 주소를 받아 해당 유저가 올린 사진만 필터링하여 반환합니다.
 */
export async function GET(request) {
    // 1. URL 쿼리 스트링에서 이메일 추출 (예: /api/gallery?email=test@test.com)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); 

    const client = await db();
    
    // 2. 보안 처리: 이메일 파라미터가 없으면 빈 결과를 반환하여 데이터 노출을 방지함
    if (!email) {
        return Response.json({ result: [] });
    }

    // 3. DB 조회: 'gallery' 컬렉션에서 email 필드가 일치하는 데이터만 배열로 가져옴
    const result = await client.collection('gallery').find({ email: email }).toArray();

    return Response.json({ result });
}


/**
 * [POST] 이미지 업로드 및 데이터 저장
 * 설명: 이미지를 외부 저장소(ImgBB)에 올리고, 반환된 URL과 제목, 작성자 정보를 DB에 기록합니다.
 */
export async function POST(request) { 
    const client = await db();
    const formdata = await request.formData(); // 클라이언트에서 보낸 FormData 파싱
    const key = process.env.IMGBB_API_KEY;      // 환경변수에 저장된 ImgBB API 키
    
    const files = formdata.getAll('files');    // 선택된 다중 파일들
    const title = formdata.get('title');       // 갤러리 제목(폴더명)
    const email = formdata.get('email');       // 업로드한 유저 이메일

    // 1. 여러 파일을 동시에 처리하기 위해 Promise.all 사용
    await Promise.all(
        files.map(async (obj) => {
            // 2. 파일을 Buffer로 변환 후 Base64 인코딩 (ImgBB API 요구 형식)
            const buffer = await obj.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');   
            
            // 3. ImgBB API에 이미지 업로드 요청
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${key}`, 
                new URLSearchParams({image: base64})
            );

            // 4. DB에 저장할 객체 생성
            const addData = {
                title,                  // 폴더 제목
                email,                  // 소유자 식별용 이메일
                note: '',               // 초기 메모는 빈 값
                files: res.data.data.url, // ImgBB에서 받은 이미지 URL
                date: new Date()        // 등록 날짜
            };
            
            // 5. 'gallery' 컬렉션에 최종 저장
            return await client.collection('gallery').insertOne(addData);
        })
    );
    return Response.json({ message: '성공' });
}


/**
 * [DELETE] 이미지 개별 삭제
 * 설명: 전달받은 ID값(MongoDB의 _id)을 가진 데이터를 찾아 삭제합니다.
 */
export async function DELETE(request) { 
    // 1. URL 쿼리 스트링에서 삭제할 데이터의 ID 추출
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await db();
    
    // 2. 몽고디비 고유 ID 형식인 ObjectId로 변환하여 삭제 실행
    await client.collection('gallery').deleteOne({ _id: new ObjectId(id) });
    
    return Response.json({ state: '성공' });
}


/**
 * [PUT] 데이터 수정 (제목 일괄 수정 또는 메모 개별 수정)
 * 설명: body에 id가 있으면 특정 사진의 메모를 수정하고, 없으면 해당 폴더의 제목을 전체 수정합니다.
 */
export async function PUT(request) { 
    const body = await request.json(); // 수정할 데이터를 JSON으로 받음
    const client = await db();

    if (!body.id) {
        // [CASE 1] 폴더 제목 수정 (id가 없을 때)
        // 기존 제목(lastTitle)을 가진 모든 데이터의 제목을 새로운 제목(updateTitle)으로 변경
        await client.collection('gallery').updateMany(
            { title: body.lastTitle },   
            { $set: { title: body.updateTitle } }
        );
    } else {
        // [CASE 2] 개별 사진 메모 수정 (id가 있을 때)
        // 특정 ID를 가진 사진의 note 필드만 업데이트
        await client.collection('gallery').updateOne(
            { _id: new ObjectId(body.id) },   
            { $set: { note: body.note } }
        );
    }
    
    return Response.json({ state: '성공' });
}