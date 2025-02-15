"use client"
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { useRouter } from 'next/navigation';
import Link from "next/link"


export default function () {

    return (
        <>
            <Link className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg" href="/Index">
                ゲストログイン
            </Link>
        </>
    )
}