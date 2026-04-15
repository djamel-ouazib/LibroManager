'use client'
import BookForm from '@/app/components/BookForm'
import { useState } from 'react'

import Table from '@/app/components/Table'

export default function Book() {
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <div className="p-6 bg-white dark:bg-neutral-800 w-full border dark:border-zinc-800 border-zinc-300 rounded-2xl">
            BookInventory
            <button
                onClick={() => {
                    setShowModal(!showModal)
                }}
                className=" mt-4 py-2.5 px-4 cursor-pointer rounded-lg bg-black text-white text-sm font-medium hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 absolute right-3   active:scale-93"
            >
                Add Book
            </button>
            <Table />
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <div onClick={(e) => e.stopPropagation()} className="z-50">
                        <BookForm />
                    </div>
                </div>
            )}
        </div>
    )
}
