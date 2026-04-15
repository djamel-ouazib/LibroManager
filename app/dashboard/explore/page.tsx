'use client'
import { useEffect, useState } from 'react'

export default function Explore() {
    const [books, setBooks] = useState<any[]>([])
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch('/api/books')
                const data = await res.json()
                setBooks(data)
            } catch (error) {
                console.error(error)
            }
        }
    }, [])
    return (
        <div className="p-6 dark:bg-black w-full">
            <p>explore</p>
        </div>
    )
}
