import db from "@/app/lib/mongodb"; 
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const TEMP_USER_ID = "temp-user-123"; // test ID ㄱ
// const session = await getServerSession(authOptions); 
// const userEmail = session.user.email; 

// [GET] DB에서 기존 체크리스트 데이터 호출
export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const tripId = searchParams.get('tripId');
  
  try {
    const client = await db();
    const result = await client.collection('checkList').findOne({ tripId });
    // const result = await client.collection('checkList').findOne({ userId: userEmail });
    
    return NextResponse.json({ checklist: result?.items || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "DB 로드 에러" }, { status: 500 });
  }
}

// [POST] 유저가 수정한 내용 DB에 저장/업데이트
export async function POST(request) {
  try {
    const data = await request.json();
    const client = await db();


    const result = await client.collection('checkList').findOne({ userId: data.userId });

    if(result){
      // 유저별 업데이트(번들위치포함 data.checklist 저장)
      await client.collection('checkList').updateOne(
        { tripId:data.tripId },
        { 
          $set: { 
            items: data.checklist, 
            updatedAt: new Date() 
          } 
        },
        { upsert: true }
      );
    }else{
       await client.collection('checkList').insertOne({
            tripId:data.tripId,
            userId:data.userId,
            items: data.checklist, 
            updatedAt: new Date() 
       })
    }

    return NextResponse.json({ message: "체크리스트가 저장되었습니다!✨" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "저장 실패" }, { status: 500 });
  }
}