"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { setCookie } from "cookies-next";
import Link from "next/link";

export default function SignUpForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); // Reset error state before request

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const { data, status } = await axios.post("/api/auth/sign-up", {
                email: formData.email,
                password: formData.password,
            });

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
            console.error("Sign Up Error:", err);
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message || "An error occurred during sign up."
                );
            } else {
                setError("An error occurred during sign up.");
            }
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-8 p-4 rounded-md shadow-md">
            <form className="space-y-6" onSubmit={handleSignUp}>
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
                </div>
                <div>
                    <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                        className="input-field"
                    />
                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                </div>
                <div className="flex justify-between">
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
                    <Link
                        href="/sign-in"
                        className="body-small hover:underline hover:text-green-500"
                    >
                        SignIn
                    </Link>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center rounded-md bg-primary py-3 body-regular shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}
