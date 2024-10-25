import connectMogoDB from "@/libs/dbConnect";
import User, { userSchemaZod } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";



/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       404:
 *         description: Invalid inputs
 *       500:
 *         description: Something went wrong
 */
export async function POST(req: NextRequest) {
    try {
        await connectMogoDB();
        const { email, password } = await req.json();
        const loginData = userSchemaZod.pick({
            email: true,
            password: true,
        });
        const { success, error } = loginData.safeParse({ email, password });
        if (!success) {
            return NextResponse.json({ data: [error], message: "Invalid inputs", success: false }, { status: 404 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.password !== password) {
            return NextResponse.json({ message: "Password incorrect" }, { status: 401 });
        }
        const token = jwt.sign(
            {
                user: user._id,
            },
            process.env.JWT_SECRET as string,
        );
        return NextResponse.json({ token: token, message: "sign-in", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
