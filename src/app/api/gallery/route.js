import db from "@/app/lib/mongodb"; 
import axios from "axios";
import { ObjectId } from "mongodb";

 

export async function GET() {
    const client = await db();
    const result = await client.collection('gallery').find({}).toArray();

    return Response.json({result});
}


export async function POST(request) { 
    const client = await db();
    const formdata = await request.formData();
    const key = process.env.IMGBB_API_KEY;     
    
    const result = await Promise.all(
        formdata.getAll('files').map(async (obj)=>{
            const buffer = await obj.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');   

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${key}`, 
                new URLSearchParams({image:base64})
            );

            const addData = {
                title : formdata.get('title'),
                email : formdata.get('email'),
                note : formdata.get('note'),
                files:res.data.data.url,
                date:new Date()
            }
            
            const collection = await client.collection('gallery').insertOne(addData);
            return collection;
        })
    );

    return Response.json({ message: '성공'});
}


export async function DELETE(request) { 
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const client = await db();
    await client.collection('gallery').deleteOne({_id:new ObjectId(id)});

    return Response.json({state:'성공'});
}



export async function PUT(request) { 
    const body = await request.json();
    const client = await db();

    if(!body.id){
        //title
        await client.collection('gallery').updateMany(
            { title: body.lastTitle },   // filter
            { $set: { title:body.updateTitle } }
        );
    }else{
        //note
        await client.collection('gallery').updateOne(
            { _id: new ObjectId(body.id) },   // filter
            { $set: { note:body.note } }
        );
    }


    return Response.json({state:'성공'});
}
