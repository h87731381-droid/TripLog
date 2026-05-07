import db from "@/app/lib/mongodb";
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const client = await db();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const tripId = searchParams.get('tripId');

        // 이메일이 없으면 빈 데이터를 반환하여 오류 방지
        if (!email) return NextResponse.json([]);
        
        const data = await client.collection('budget')
            .find({ email, tripId }) // 로그인한 사용자의 이메일로만 검색
            .sort({ date: 1 })
            .toArray();
            
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST, DELETE, PUT 함수는 기존과 동일하게 유지됩니다.
export async function POST(req) {
    try {
        const client = await db();
        const body = await req.json();
        const newItem = {
            tripId:body.tripId,
            email: body.email,
            category: body.category,
            title: body.title,
            amount: Number(body.amount), 
            date: body.date,
            createdAt: new Date()
        };
        const result = await client.collection('budget').insertOne(newItem);
        return NextResponse.json({ ...newItem, _id: result.insertedId });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const client = await db();
        const id = new URL(req.url).searchParams.get('id');
        await client.collection('budget').deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const client = await db();
        const id = new URL(req.url).searchParams.get('id');
        const body = await req.json();
        const { _id, ...updateData } = body;
        if (updateData.amount) updateData.amount = Number(updateData.amount);
        await client.collection('budget').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}