'use client'
import { useActionState, useEffect, useState } from 'react'
import { createBook } from '../admin/dashboard/books/action'
import SubmitButton from './submitButton'
import Toast from './ui/Toast'

// Form component for creating a new book in the admin panel
export default function BookForm() {
    // Controls toast notification visibility
    const [showToast, setShowToast] = useState<boolean>(false)

    // useActionState manages the Server Action state (success/error)
    const [state, action] = useActionState(createBook, null)

    // Show toast notification for 5 seconds when book is created successfully
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (state?.success) {
            setShowToast(true)
            setTimeout(() => setShowToast(false), 5000)
        }
    }, [state])

    return (
        <>
            {/* Toast notification — shown after successful book creation */}
            <Toast showToast={showToast} setShowToast={setShowToast} />

            <div className="w-full z-50 max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
                    Add a new book
                </h2>

                {/* Book creation form — action is the Server Action from useActionState */}
                <form className="space-y-5" action={action}>
                    {/* Title field */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            placeholder="e.g. Atomic Habits"
                            className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                        />
                    </div>

                    {/* Author field */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="author"
                            className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                        >
                            Author
                        </label>
                        <input
                            id="author"
                            name="author"
                            placeholder="e.g. James Clear"
                            className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                        />
                    </div>

                    {/* Category, ISBN, Stock and Cover URL fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="category"
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                            >
                                Category
                            </label>
                            <input
                                id="category"
                                name="category"
                                placeholder="e.g. Self-development"
                                className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="isbn"
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                            >
                                ISBN
                            </label>
                            <input
                                id="isbn"
                                name="isbn"
                                placeholder="e.g. 978-2-07-040850-4"
                                className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="totalStock"
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                            >
                                Stock
                            </label>
                            <input
                                id="totalStock"
                                name="totalStock"
                                type="number"
                                placeholder="0"
                                className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="coverUrl"
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                            >
                                Cover URL
                            </label>
                            <input
                                id="coverUrl"
                                name="coverUrl"
                                type="text"
                                placeholder="https://example.com/cover.jpg"
                                className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Description textarea */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            placeholder="Short description..."
                            className="px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/80 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white resize-none"
                        />
                    </div>

                    {/* Submit button with loading state */}
                    <SubmitButton />
                </form>
            </div>
        </>
    )
}
