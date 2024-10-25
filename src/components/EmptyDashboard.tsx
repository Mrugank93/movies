import Link from 'next/link'
import React from 'react'

export default function EmptyDashboard() {
    return (
        <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8 relative overflow-hidden bg-[#093545]">
            <div className="text-center mb-6 md:mb-10">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-semibold leading-8 md:leading-9 tracking-tight text-white">
                    Your movie list is empty
                </h2>
            </div>
            <div className="mt-6 md:mt-10 w-full md:w-auto">
                <Link
                    href={`/add`}
                    className="flex w-full md:w-auto justify-center rounded-md bg-[#2BD17E] px-6 py-3 text-sm font-bold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                    Add a new movie
                </Link>
            </div>
        </div>
    )
}
