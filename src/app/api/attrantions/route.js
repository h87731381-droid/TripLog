import getDB from '@/app/lib/mongodb'

export async function GET() {

    //const db = await getDB();
    //const result = await db.collection('attrantions').find().toArray();
    
    const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;
    // const url = `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?MobileOS=etc&MobileApp=test&serviceKey=${apiKey}&pageNo=1&numOfRows=100&_type=json`;
    const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?MobileOS=etc&MobileApp=test&keyword=경주&serviceKey=${apiKey}&pageNo=1&numOfRows=200&_type=json`;
    

    const res = await fetch(url);
    const data = await res.json();    

    return Response.json(data);
}


export async function POST() {



    return Response.json({ name: "John Doe" });
}


