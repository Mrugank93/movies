"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function SignInForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "test123@gmail.com",
        password: "mymovies",
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); // Reset error state before request

        try {
            const { data, status } = await axios.post("/api/auth", formData);

            if (status === 200) {
                localStorage.setItem("token", data.token);

                const moviesResponse = await fetch(`/api/movies?page=1`);
                const moviesData = await moviesResponse.json();

                router.push(moviesData.success && moviesData.data.length ? "/" : "/dashboard");
            }
        } catch (err) {
            console.error("Login Error:", err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "An error occurred during login.");
            } else {
                setError("An error occurred during login.");
            }
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-8 p-4 rounded-md shadow-md">
            <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                        className="block w-full rounded-md bg-[#224957] py-3 px-4 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                        className="block w-full rounded-md bg-[#224957] py-3 px-4 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400"
                    />
                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-white">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 bg-[#224957] border-gray-300 rounded checked:bg-green-500"
                        />
                        <span className="ml-2">Remember me</span>
                    </label>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center rounded-md bg-[#2BD17E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
