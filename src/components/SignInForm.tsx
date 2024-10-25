"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { setCookie } from "cookies-next";


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
                setCookie("token", data.token, {
                    path: "/",
                    maxAge: 60 * 60 * 24,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                });
                router.push("/");
            }
        } catch (err) {
            console.error("Login Error:", err);
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message || "An error occurred during login."
                );
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
                        className="input-field"
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
                        className="input-field"
                    />
                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                </div>
                <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 appearance-none bg-input checked:bg-green-500 focus:ring-green-400 rounded checked:border-transparent cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="body-small">
                            Remember me
                        </label>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center rounded-md bg-primary py-3 body-regular shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
