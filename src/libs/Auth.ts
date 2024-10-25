import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";


export async function isAuth(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return null;
        }
        const userId: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        return userId?.user;
    } catch (error) {
        return NextResponse.json({ data: error, message: "Token not verified", success: false }, { status: 401 });
    }
}