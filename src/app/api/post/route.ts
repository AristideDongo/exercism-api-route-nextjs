import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { title, content, categoryId, published } = await request.json();
    if (!title || !content || !categoryId) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if(title.length > 100) {
        return NextResponse.json({ message: "Title too long" }, { status: 400 });
    }

    if(content.length > 10000) {
        return NextResponse.json({ message: "Content too long" }, { status: 400 });
    }

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published || false,
                category: { connect: { id: categoryId } }
            }
        });
        return NextResponse.json(post, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { id: 'desc' },
            include: { 
                category: {
                    select: {
                        name: true
                    }
                }
             }
        });
        return NextResponse.json(posts, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}