import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json({message: 'let me know if you see this message'}, {status: 200});
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json({message: 'let me know if you see this message'}, {status: 200});
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json({message: 'let me know if you see this message'}, {status: 200});
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if(!id) {
        return NextResponse.json({ message: "Missing post ID" }, { status: 400 });
    }
    const { published } = await request.json();
    if (published === undefined) {
        return NextResponse.json({ message: "Missing published field" }, { status: 400 });
    }
    if(typeof published !== 'boolean') {
        return NextResponse.json({ message: "Published must be a boolean" }, { status: 400 });
    }
    try {
        const post = await prisma.post.update({
            where: { id },
            data: { published }
        });
        return NextResponse.json(post, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}