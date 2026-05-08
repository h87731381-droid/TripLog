import getDB from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb';

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const db = await getDB();
    const result = await db.collection('planner').find({_id:new ObjectId(id)}).toArray();

    const selectedAddress = result[0].selectedAddress;
    const userAttrantions = result[0].places;
    
    
    const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;
    // const url = `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?MobileOS=etc&MobileApp=test&serviceKey=${apiKey}&pageNo=1&numOfRows=100&_type=json`;
    const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?MobileOS=etc&MobileApp=test&keyword=${selectedAddress}&serviceKey=${apiKey}&pageNo=1&numOfRows=200&_type=json`;
    

    const res = await fetch(url);
    const data = await res.json();    

    return Response.json({data,selectedAddress,userAttrantions});
}


export async function POST(req) {
    const {userId,itemMarkers} = await req.json();

    const db = await getDB();
    await db.collection('planner').updateOne({userId,status:'draft'},{$set:{places:itemMarkers}});


    return Response.json({ name: "John Doe" });
}


