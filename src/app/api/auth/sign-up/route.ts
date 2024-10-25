import connectMogoDB from "@/libs/dbConnect";
import User, { userSchemaZod } from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/signup:
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
 *       400:
 *         description: Invalid inputs
 *       409:
 *         description: User already exists
 *       500:
 *         description: Something went wrong
 */
export async function POST(req: NextRequest) {
    try {
        await connectMogoDB();
        const { email, password } = await req.json();

        // Validate input data
        const signUpData = userSchemaZod.pick({
            email: true,
            password: true,
        });

        const { success, error } = signUpData.safeParse({ email, password });
        if (!success) {
            return NextResponse.json({ data: [error], message: "Invalid inputs", success: false }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Optionally create a token for the new user
        const token = jwt.sign(
            {
                user: newUser._id,
            },
            process.env.JWT_SECRET as string,
        );

        return NextResponse.json({ token: token, message: "User created successfully", success: true }, { status: 200 });
    } catch (error) {
        console.error("Sign Up Error:", error);
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
    }
}
