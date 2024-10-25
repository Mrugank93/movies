import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Movie {
    _id: string;
    image: string;
    title: string;
    year?: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {

    return (
        <div>
            <div
                key={movie._id}
                className="bg-[#092C39] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 "
            >
                <Link href={`/movie/${movie._id}`}
                    className="relative  sm:h-60 hover:cursor-pointer"
                >
                    <Image
                        src={movie.image}
                        alt={movie.title}
                        width={300}
                        height={100}
                        className="rounded-t-lg h-[400px] w-[266px] object-cover"
                    />
                </Link>
                <div className="p-4">
                    <h2 className="text-white text-lg sm:text-xl font-semibold">
                        {movie.title}
                    </h2>
                    <p className="text-gray-400">{movie.year}</p>
                </div>
            </div>
        </div>
    )
}
