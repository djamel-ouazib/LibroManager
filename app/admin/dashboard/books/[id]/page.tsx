import deletBook, { getBookById } from '../action'
import Link from 'next/link'

// Props — params is a Promise in Next.js 16 App Router
interface PageProps {
    params: Promise<{ id: string }>
}

// Admin page showing full details of a single book with edit and delete actions
export default async function BookDetailsPage({ params }: PageProps) {
    // Await params as required by Next.js 16 App Router
    const { id } = await params

    // Fetch book details from the database
    const book = await getBookById(id)

    // Bind the delete action to the book ID for the form submission
    const deleteAction = deletBook.bind(null, id)

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Back button — returns to the books inventory list */}
            <Link
                href="/admin/dashboard/books"
                className="text-sm text-zinc-500 hover:text-black mb-6 inline-block"
            >
                &larr; Back to inventory
            </Link>

            <div className="flex flex-col md:flex-row gap-12 mt-4">
                {/* ── BOOK COVER IMAGE ── */}
                <div className="w-full md:w-1/3">
                    <div className="aspect-2/3 relative rounded-2xl overflow-hidden shadow-2xl border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                        {book?.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            // Fallback when no cover image is available
                            <div className="flex items-center justify-center h-full text-zinc-400">
                                No cover available
                            </div>
                        )}
                    </div>
                </div>

                {/* ── BOOK DETAILS ── */}
                <div className="flex-1">
                    {/* Category badge */}
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-full uppercase">
                        {book?.category}
                    </span>

                    {/* Title and author */}
                    <h1 className="text-4xl font-black mt-4 text-zinc-900 dark:text-zinc-100">
                        {book?.title}
                    </h1>
                    <p className="text-xl text-zinc-500 mt-2">
                        by{' '}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {book?.author}
                        </span>
                    </p>

                    {/* ISBN and availability stats */}
                    <div className="grid grid-cols-2 gap-6 mt-8 py-6 border-y border-zinc-100 dark:border-zinc-800">
                        <div>
                            <p className="text-xs text-zinc-400 uppercase font-bold">
                                ISBN
                            </p>
                            <p className="font-mono text-zinc-700 dark:text-zinc-300">
                                {book?.isbn}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400 uppercase font-bold">
                                Availability
                            </p>
                            {/* Color changes based on available stock */}
                            <p
                                className={`font-bold ${(book?.availableStock ?? 0) > 0 ? 'text-emerald-500' : 'text-red-500'}`}
                            >
                                {book?.availableStock ?? 0} of{' '}
                                {book?.totalStock ?? 0} copies
                            </p>
                        </div>
                    </div>

                    {/* Book description */}
                    <div className="mt-8">
                        <h2 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                            Summary
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {book?.description ||
                                'No description available for this book.'}
                        </p>
                    </div>

                    {/* ── ACTION BUTTONS — edit and delete ── */}
                    <div className="mt-10 flex gap-4">
                        {/* Edit button — navigates to edit form */}
                        <button className="px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-xl font-bold hover:opacity-80 transition">
                            Edit book
                        </button>

                        {/* Delete form — triggers Server Action with book ID bound */}
                        <form action={deleteAction}>
                            <button
                                type="submit"
                                className="px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition"
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
