import Image from 'next/image'
import React from 'react'

export default function Footer() {
    return (
        <Image
            src="/Vectors.svg"
            alt="Background Vectors"
            className="w-full relative bottom-0"
            layout="responsive"
            width={3000}
            height={1080}
        />
    )
}
