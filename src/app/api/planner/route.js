import getDB from '@/app/lib/mongodb'
import { authStore } from '@/app/store/authStore';
import { ObjectId } from 'mongodb';

export async function GET(req) {//db데이터 가져오기

    const db = await getDB();
    const result = await db.collection('planner').find().toArray();
    try{
      const { searchParams } = new URL(req.url);
      //const { session } = authStore();//zustand 스토어 관리
    
    const type = searchParams.get("type");
    const session = searchParams.get("session");
    const keyword = searchParams.get("keyword");
    const db = await getDB();

    // 1. draft 먼저 처리
    if (type === "draft") {
      
      const draft = await db.collection("planner")
        .findOne({ 
          status: "draft",
          userId: session
         });

      return Response.json(draft || null);
    }
    

    // 2. 관광지 검색 (keyword 있을 때만)
    if (keyword) {
      const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;

      const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?MobileOS=etc&MobileApp=test&keyword=${keyword}&serviceKey=${apiKey}&pageNo=1&numOfRows=100&_type=json&contentTypeId=12`;

      const res = await fetch(url);
      const data = await res.json();

      return Response.json(data);
    }

    // 3. 둘 다 아니면 에러
    return Response.json({ error: "잘못된 요청" }, { status: 400 });

  } catch(err){
    console.error(err);
    return Response.json({error:'서버 에러'},{status:500});
  }
}


export async function POST(req) {
     try {
    const body = await req.json(); // 프론트에서 보낸 데이터 받기
    const { searchParams } = new URL(req.url);
    const db = await getDB();
  
    const result = await db.collection('planner').insertOne(body);

    return Response.json({ 
      success: true,
      insertedId: result.insertedId,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: 'DB 저장 실패' }, { status: 500 });
  }
}

//여행 일정 수정(스케쥴 추가)
export async function PUT(req) {

 try {
    const body = await req.json();
    
    console.log(body)
    const db = await getDB();
  
    const result = await db.collection('planner').updateOne({
      userId:body.userId,
      status:"draft"
    },
    {$push:{'scd':{
      _id:new ObjectId(),
      ...body
    }}});
 }catch{

 }

  return Response.json({n:0});
}
