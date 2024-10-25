"use client";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";
import Loading from "./Loading";
import EmptyDashboard from "./EmptyDashboard";

export default function DashBoard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const totalPages = Math.ceil(totalData / 8);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/movies?page=${currentPage}`, {
                    method: "GET",
                });
                const data = await res.json();
                if (data.success) {
                    setMovies(data.data);
                    setTotalData(data.totalData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [currentPage]);

    interface Movie {
        _id: string;
        image: string;
        title: string;
        year?: string;
    }

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8 relative overflow-hidden bg-[#093545]">
                <Loading />
            </div>
        )
    }

    if (!movies.length) {
        return <EmptyDashboard />;

    }

    return (
        <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8  ">
            <div className="w-full max-w-5xl">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))
                    }
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={setCurrentPage}
            />
        </div>
    );
}
