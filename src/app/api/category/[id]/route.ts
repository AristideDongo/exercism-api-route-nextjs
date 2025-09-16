import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
    
    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });
        
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        
        return NextResponse.json({
            data: category,
            message: "Category fetched successfully"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
    
    try {
        const { name } = await request.json();
        
        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }
        
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });
        
        if (!existingCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        
        const categoryWithSameName = await prisma.category.findUnique({
            where: { name }
        });
        
        if (categoryWithSameName && categoryWithSameName.id !== id) {
            return NextResponse.json({ message: "Another category with the same name already exists" }, { status: 400 });
        }
        
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name }
        });
        
        return NextResponse.json({
            data: updatedCategory,
            message: "Category updated successfully"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
    
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });
        
        if (!existingCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        
        await prisma.category.delete({
            where: { id }
        });
        
        return NextResponse.json({
            message: "Category deleted successfully"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}