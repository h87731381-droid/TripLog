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

    // 1. draft 먼저 처리
    if (type === "draft") {
      
      const draft = await db.collection("planner")
        .findOne({ 
          status: "draft",
          userId: session
         });

      return Response.json(draft || null);
    }

     // 1-2.complete (완료된 여행 여러개)
    if (type === "complete") {
      const completeList = await db
        .collection("planner")
        .find({
          status: "complete",
          userId: session,
        })
        .sort({ _id: -1 }) // 최신순
        .toArray();

      return Response.json(completeList);
    }
    
    
    // 2. 전체 여행 조회
    if (session && !type) {

      const allTrips = await db
        .collection("planner")
        .find({
          userId: session
        })
        .sort({ _id: -1 })
        .toArray();

      return Response.json(allTrips);
    }

    // 3. 관광지 검색 (keyword 있을 때만)
    if (keyword) {
      const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;

      const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?MobileOS=etc&MobileApp=test&keyword=${keyword}&serviceKey=${apiKey}&pageNo=1&numOfRows=100&_type=json&contentTypeId=12`;

      const res = await fetch(url);
      const data = await res.json();

      return Response.json(data);
    }

    // 4. 둘 다 아니면 에러
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
    const db = await getDB();

    // 수정
    if (body.editingId) {

      if (body.type === "complete") {
        const completeList = await db
          .collection("planner")
          .updateOne(
            {_id: new ObjectId(body.editingId)},
            {$set:{status: "complete"}}
          );
      }
      else{
        await db.collection('planner').updateOne(
          {
            userId: body.userId,
            status: "draft",
            "scd._id": new ObjectId(body.editingId)
          },
          {
            $set: { //배열 안 특정 요소만 수정
              "scd.$.scdTitle": body.scdTitle,
              "scd.$.scdPlace": body.scdPlace,
              "scd.$.scdMove": body.scdMove,
              "scd.$.scdMoveMemo": body.scdMoveMemo,
              "scd.$.startTime": body.startTime,
              "scd.$.endTime": body.endTime,
              "scd.$.mapx": body.mapx,
              "scd.$.mapy": body.mapy,
              "scd.$.contentid": body.contentid
            }
          }
        );
      }

    } else {
      // 추가
      await db.collection('planner').updateOne(
        {
          userId: body.userId,
          status: "draft"
        },
        {
          $push: {
            scd: {
              _id: new ObjectId(),
              scdTitle: body.scdTitle,
              scdPlace: body.scdPlace,
              scdMove: body.scdMove,
              scdMoveMemo: body.scdMoveMemo,
              startTime: body.startTime,
              endTime: body.endTime,
              day: body.day,
              mapx: body.mapx,
              mapy: body.mapy,
              contentid: body.contentid
            }
          }
        }
      );
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: '서버 에러' }, { status: 500 });
  }
}

//여행 일정 (스케줄) 삭제
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const db = await getDB();

    await db.collection('planner').updateOne(
      { "scd._id": new ObjectId(id) },
      {
        $pull: {
          scd: { _id: new ObjectId(id) }//배열 안에서 해당 요소 제거
        }
      }
    );

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: '삭제 실패' }, { status: 500 });
  }
}
