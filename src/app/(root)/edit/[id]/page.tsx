/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Movie {
    title: string;
    year: string | number;
    image: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [formData, setFormData] = useState<Movie>({
        title: "",
        year: "",
        image: "",
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchMovies = async () => {
        try {
            const res = await fetch(`/api/movies/${id}`);
            const data = await res.json();
            if (res.ok) {
                setFormData(data.data);
                setImagePreview(data.data.image);
            } else {
                throw new Error("Failed to fetch movie data");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [id]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleChangeyear = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setFormData((prevData) => ({ ...prevData, [e.target.name]: value }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                setBase64Image(base64String);
                setImagePreview(base64String);
                setImageError(null);
            };

            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImagePreview(null);
        setBase64Image(null);
        setImageError(null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formDataToSend = {
                ...formData,
                image: base64Image || formData.image,
                year: parseInt(formData.year as string),
            };

            const res = await fetch(`/api/movies/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataToSend),
            });

            if (!res.ok) {
                throw new Error("Failed to submit the form");
            }

            router.push("/");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center items-center lg:px-8 relative overflow-hidden bg">
            <div className="max-w-6xl w-full">
                <h2 className="heading-two pb-24">
                    {id === "new" ? "Add Movie" : "Edit"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-20">
                    <div className="w-full max-w-md sm:w-1/2 flex flex-col justify-center items-center border-2 border-dashed border-white h-72 sm:h-96 rounded-lg bg-[#224957] relative">
                        <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer relative">
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Selected"
                                        className="object-cover h-full w-full rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 pb-1 pt-1 hover:bg-red-700 transition"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-8 w-8 text-white mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    <span className="body-small ">Drop an image here</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}
                        </label>
                        {imageError && (
                            <span className="text-red-500 text-sm mt-2">{imageError}</span>
                        )}
                    </div>

                    <div className="w-full sm:w-1/2 flex flex-col gap-6">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input-field max-w-md"
                        />
                        <input
                            type="text"
                            name="year"
                            placeholder="Publishing Year"
                            value={formData.year}
                            onChange={handleChangeyear}
                            required
                            maxLength={4}
                            pattern="\d*"
                            className="input-field max-w-xs sm:w-3/4 md:w-1/2 lg:w-1/2"
                        />

                        <div className="flex justify-center gap-6 w-full sm:w-1/2">
                            <Link href="/" className="bg-transparent text-white border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition text-lg">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className={`${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#2BD17E] hover:bg-[#28a76d]"
                                    } text-white px-6 py-3 rounded-lg transition text-lg`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6 text-white animate-spin"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                ) : (
                                    "Update"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
