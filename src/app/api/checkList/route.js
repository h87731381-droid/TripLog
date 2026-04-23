import db from "@/app/lib/mongodb"; 
import { NextResponse } from "next/server";

const TEMP_USER_ID = "temp-user-123"; // test ID ㄱ
// const session = await getServerSession(authOptions); 
// const userEmail = session.user.email; 

// [GET] DB에서 기존 체크리스트 데이터 호출
export async function GET() {
  try {
    const client = await db();
    const result = await client.collection('checkList').findOne({ userId: TEMP_USER_ID });
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

    // 유저별 업데이트(번들위치포함 data.checklist 저장)
    await client.collection('checkList').updateOne(
      { userId: TEMP_USER_ID },
      { 
        $set: { 
          items: data.checklist, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "체크리스트가 저장되었습니다!✨" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "저장 실패" }, { status: 500 });
  }
}