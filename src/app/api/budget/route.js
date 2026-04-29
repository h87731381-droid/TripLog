import db from "@/app/lib/mongodb";
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

/**
 * [GET] 전체 항목 조회
 * 이미 있는 db() 함수를 실행하여 'budget' 컬렉션에 접근합니다.
 */
export async function GET() {
    try {
        const client = await db();
        const data = await client.collection('budget').find({}).sort({ date: +1 }).toArray();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

/**
 * [POST] 항목 추가
 */
export async function POST(req) {
    try {
        const client = await db();
        const body = await req.json();
        
        const newItem = {
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

/**
 * [DELETE] 항목 삭제
 */
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

/**
 * [PUT] 항목 수정
 */
export async function PUT(req) {
    try {
        const client = await db();
        const id = new URL(req.url).searchParams.get('id');
        const body = await req.json();
        
        // _id는 수정 대상이 아니므로 나머지 데이터만 추출
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