import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: Request) {
  const { email, password } = await request.json();
    if (!email || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const findUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!findUser) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 400 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, findUser.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

    const token = jwt.sign({
        id: findUser.id,
        email: findUser.email
    }, JWT_SECRET!, { expiresIn: '1h' })

    const { password: _, ...userWithoutPassword } = findUser;

    return NextResponse.json({
        access_token: token,
        data: userWithoutPassword,
        message: "User logged in successfully"
    }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}