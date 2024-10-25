/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        year: "",
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeyear = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setFormData({
                ...formData,
                [e.target.name]: value,
            });
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
        if (!base64Image) {
            setImageError("Image is required");
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = {
                ...formData,
                image: base64Image,
                year: parseInt(formData.year),
            };

            const res = await fetch("/api/movies", {
                method: "POST",
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
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8 relative overflow-hidden bg-[#093545]">
            <div className="max-w-6xl w-full p-4 sm:p-12">
                <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-white text-center sm:text-left">
                    Create a new movie
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-8"
                >
                    <div className="w-full sm:w-1/2 flex flex-col justify-center items-center border-2 border-dashed border-white h-60 sm:h-96 rounded-lg bg-[#224957] relative">
                        <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
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
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 transition"
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
                                    <span className="text-white text-lg">Drop an image here</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
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
                            className="bg-[#224957] text-white px-5 py-3 rounded-lg outline-none text-lg"
                        />
                        <input
                            name="year"
                            placeholder="Publishing Year"
                            value={formData.year}
                            onChange={handleChangeyear}
                            required
                            pattern="\d{4}"
                            maxLength={4}
                            className="bg-[#224957] text-white px-5 py-3 rounded-lg outline-none text-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/2"
                        />

                        <div className="flex justify-center gap-4 mt-8">
                            <Link href="/"
                                className="bg-transparent text-white border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition text-lg"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="bg-[#2BD17E] text-white px-6 py-3 rounded-lg hover:bg-[#28a76d] transition text-lg flex justify-center items-center"
                            >
                                {loading ? (
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5 text-white animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                                        ></path>
                                    </svg>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
