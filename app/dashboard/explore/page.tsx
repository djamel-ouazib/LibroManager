// 'use client'
// import { useEffect, useState } from 'react'

import prisma from '@/lib/prisma'

export default async function Explore() {
    // const [books, setBooks] = useState<any[]>([])
    // useEffect(() => {
    //     const fetchBooks = async () => {
    //         try {
    //             const res = await fetch('/api/books')
    //             const data = await res.json()
    //             setBooks(data)
    //         } catch (error) {
    //             console.error(error)
    //         }
    //     }
    // }, [])
    const books = await prisma.book.findMany()
    return (
        <div className="p-6 dark:bg-black w-full">
            <p>explore</p>
            <div>
                {books.map((book, index) => (
                    <div id={index} className="border border-gray-200 ">
                        <p>Author</p>
                        <p>{book.author}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
