import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name } = await req.json();
    if(!name) {
        return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }
    
    const existingCatgeiry = await prisma.category.findUnique({
        where: { name }
    })

    if(existingCatgeiry) {
        return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
        data: { name }
    })

    return NextResponse.json({
        data: newCategory,
        message: "Category created successfully"
    }, { status: 201 });
}

export async function GET() {
    const categories = await prisma.category.findMany({
        orderBy: { id: 'desc' }
    });

    return NextResponse.json({
        data: categories,
        message: "Categories fetched successfully"
    }, { status: 200 });
}