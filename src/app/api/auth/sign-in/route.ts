import connectMogoDB from "@/libs/dbConnect";
import User, { userSchemaZod } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in a user
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
 *         description: User logged in successfully
 *       404:
 *         description: Invalid inputs or user not found
 *       401:
 *         description: Password incorrect
 *       500:
 *         description: Something went wrong
 */
export async function POST(req: NextRequest) {
    try {
        await connectMogoDB();
        const { email, password } = await req.json();

        // Validate input data
        const loginData = userSchemaZod.pick({
            email: true,
            password: true,
        });
        const { success, error } = loginData.safeParse({ email, password });
        if (!success) {
            return NextResponse.json({ data: [error], message: "Invalid inputs", success: false }, { status: 404 });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Compare the password with bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ message: "Password incorrect" }, { status: 401 });
        }

        // Create a JWT token
        const token = jwt.sign(
            {
                user: user._id,
            },
            process.env.JWT_SECRET as string,
        );

        return NextResponse.json({ token: token, message: "sign-in", success: true }, { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
