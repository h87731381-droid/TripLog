import getDB from '@/app/lib/mongodb'

export async function GET(req) {

    /* const db = await getDB();
    const result = await db.collection('planner').find().toArray(); */
  try{
      const { searchParams } = new URL(req.url);
      const placeKeyword = searchParams.get("keyword");

      if(!placeKeyword){
        return Response.json({error:"keyword 없음"},{status:400});
      }
  
      const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;
  
      const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?MobileOS=etc&MobileApp=test&keyword=${placeKeyword}&serviceKey=${apiKey}&pageNo=1&numOfRows=100&_type=json&contentTypeId=12`
  
      const res = await fetch(url);

      if(!res.ok){
        throw new Error('외부 api 실패')
      }
      const data = await res.json();
      console.log(data)
  
      return Response.json(data);

  } catch(err){
    console.error(err);
    return Response.json({error:'서버 에러'},{status:500});
  }
}


export async function POST() {



    return Response.json({ name: "John Doe" });
}
