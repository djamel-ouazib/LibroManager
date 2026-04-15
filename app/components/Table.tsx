import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Table() {
    const [books, setBooks] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)

            try {
                const res = await fetch('/api/books')
                const data = await res.json()
                setBooks(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    return (
        <div>
            {loading ? (
                <div className=" flex items-center justify-center min-h-screen w-full  py-5">
                    <div className="w-6 h-6 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-zinc-200"></div>

                        <div className="absolute inset-0 rounded-full border-2 border-t-gray-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    </div>
                </div>
            ) : (
                <div className="mt-8">
                    {/* HEADER */}
                    <div className="grid grid-cols-5 py-2 font-bold border-b p-1">
                        <p>Author</p>
                        <p>Title</p>
                        <p>Category</p>
                        <p>Total Stock</p>
                        <p>Available Stock</p>
                    </div>

                    {/* ROWS */}
                    {books.map((book: any) => (
                        <Link
                            key={book.id} // ✅ La key va ici, sur l'élément parent du map
                            href={`/admin/dashboard/books/${book.id}`}
                            className="block group" // "block" pour que toute la ligne soit cliquable
                        >
                            <div className="grid grid-cols-5 py-4 px-2 border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-zinc-600 dark:text-zinc-400 text-sm items-center">
                                {/* Auteur avec une graisse de police légèrement différente */}
                                <p className="font-medium text-zinc-900 dark:text-zinc-200 truncate pr-4">
                                    {book.author}
                                </p>

                                {/* Titre qui ressort un peu plus */}
                                <p className="truncate pr-4 italic">
                                    {book.title}
                                </p>

                                {/* Catégorie avec un style discret */}
                                <p className="text-xs uppercase tracking-wider">
                                    {book.category}
                                </p>

                                {/* Stock Total */}
                                <p className="text-center md:text-left">
                                    {book.totalStock}
                                </p>

                                {/* Stock Disponible avec une couleur dynamique */}
                                <p
                                    className={`font-bold ${book.availableStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}
                                >
                                    {book.availableStock}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
