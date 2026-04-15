'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full cursor-pointer mt-4 active:scale-95 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {pending ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                </div>
            ) : (
                'Add Book'
            )}
        </button>
    )
}
