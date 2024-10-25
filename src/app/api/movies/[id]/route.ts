import { isAuth } from "@/libs/Auth";
import connectMogoDB from "@/libs/dbConnect";
import Movie, { movieSchemaZod } from "@/models/movie";
import { NextRequest, NextResponse } from "next/server";


/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags:
 *       - Movie
 *     summary: Get a movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Something went wrong
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = await isAuth(req)
    if (!userId) {
        return NextResponse.json({ data: null, message: "Unauthorized You Must Login First", success: false }, { status: 401 });
    }
    try {
        const { id } = await params;
        await connectMogoDB();
        const movie = await Movie.findById(id);
        if (!movie) {
            return NextResponse.json({ data: null, message: "Movie not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ data: movie, message: "Movie found", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ data: error, message: "Something went wrong", success: false }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/movies/{id}:
 *   patch:
 *     tags:
 *       - Movie
 *     summary: Update a movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie Updated successfully
 *       404:
 *         description: Invalid inputs
 *       500:
 *         description: Something went wrong
 */
export async function PATCH(req: NextRequest, { params }: { params: any }) {
    const userId = await isAuth(req)
    if (!userId) {
        return NextResponse.json({ data: null, message: "Unauthorized You Must Login First", success: false }, { status: 401 });
    }
    try {
        await connectMogoDB();
        const { id } = params;
        const { title, year, image } = await req.json();
        const movieData = movieSchemaZod.pick({
            title: true,
            year: true,
        });
        const { success, error } = movieData.safeParse({ title, year });
        if (!success) {
            return NextResponse.json({ data: [error], message: "Invalid inputs", success: false }, { status: 404 });
        }
        await Movie.findByIdAndUpdate(id, { title, year, image });
        return NextResponse.json({ data: { title, year, image }, message: "Movie Updated successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ data: error, message: "Something went wrong", success: false }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     tags:
 *       - Movie
 *     summary: Delete a movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Something went wrong
 */
export async function DELETE(req: NextRequest, { params }: { params: any }) {
    const userId = await isAuth(req)
    if (!userId) {
        return NextResponse.json({ data: null, message: "Unauthorized You Must Login First", success: false }, { status: 401 });
    }
    try {
        const { id } = params;
        await connectMogoDB();
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) {
            return NextResponse.json({ data: null, message: "Movie not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ data: movie, message: "Movie deleted successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ data: error, message: "Something went wrong", success: false }, { status: 500 });
    }
}
