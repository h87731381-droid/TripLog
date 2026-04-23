import getDB from '@/app/lib/mongodb'

export async function GET() {

    const db = await getDB();
    const result = await db.collection('attrantions').find().toArray();

    const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;

    const url = `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?MobileOS=etc&MobileApp=test&_type=json&pageNo=1&numOfRows=50&serviceKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data)

    return Response.json(data);
}


export async function POST() {



    return Response.json({ name: "John Doe" });
}


