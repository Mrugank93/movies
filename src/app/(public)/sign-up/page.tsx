import SignInForm from '@/components/SignInForm'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8 relative overflow-hidden bg-[#093545]">
                <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-sm w-full">
                    <h2 className="text-center text-[48px] sm:text-[64px] font-bold leading-9 tracking-tight text-white">
                        Sign Up
                    </h2>
                    <SignInForm />
                </div>
            </div>
        </div>
    )
}
