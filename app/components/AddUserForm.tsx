'use client'
import { useState, useTransition } from 'react'
import { createUser } from '@/app/admin/dashboard/users/action'
import { HiX } from 'react-icons/hi'

export default function AddUserForm() {
    // Controls modal visibility
    const [isOpen, setIsOpen] = useState<boolean>(false)

    // Form fields
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    // Feedback message after form submission
    const [message, setMessage] = useState<{
        text: string
        success: boolean
    } | null>(null)

    // useTransition to handle async action without blocking UI
    const [isPending, startTransition] = useTransition()

    // Handle form submission
    function handleSubmit() {
        console.log('handleSubmit called')
        setMessage(null)

        // Client-side validation
        if (!name || !email || !password) {
            setMessage({ text: 'All fields are required.', success: false })
            return
        }

        if (password.length < 8) {
            setMessage({
                text: 'Password must be at least 8 characters.',
                success: false,
            })
            return
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)

        startTransition(async () => {
            console.log('calling createUser...')
            const result = await createUser(formData)
            console.log('result:', result)
            setMessage({ text: result.message, success: result.success })

            // Reset form on success
            if (result.success) {
                setName('')
                setEmail('')
                setPassword('')
                setIsOpen(false)
            }
        })
    }

    return (
        <>
            {/* Add user button — opens the modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="absolute right-5 py-2 rounded-md px-4 bg-black text-white dark:bg-white dark:text-black text-sm font-medium"
            >
                Add User
            </button>

            {/* Modal overlay — clicking backdrop closes the modal */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    {/* Modal card — stopPropagation prevents backdrop from closing */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-neutral-900 p-6 shadow-xl"
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold dark:text-white">
                                Add a Member
                            </h2>
                            {/* Close button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <HiX size={14} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Full name field */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold dark:text-zinc-200">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="
                                        px-3 py-2 text-sm rounded-[7px]
                                        border border-zinc-300 dark:border-zinc-700
                                        bg-white dark:bg-neutral-800
                                        dark:text-white placeholder:text-zinc-400
                                        focus:outline-none focus:ring-1 focus:ring-zinc-400
                                        transition-all duration-150
                                    "
                                />
                            </div>

                            {/* Email field */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold dark:text-zinc-200">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. john@example.com"
                                    className="
                                        px-3 py-2 text-sm rounded-[7px]
                                        border border-zinc-300 dark:border-zinc-700
                                        bg-white dark:bg-neutral-800
                                        dark:text-white placeholder:text-zinc-400
                                        focus:outline-none focus:ring-1 focus:ring-zinc-400
                                        transition-all duration-150
                                    "
                                />
                            </div>

                            {/* Password field */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold dark:text-zinc-200">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Min. 8 characters"
                                    className="
                                        px-3 py-2 text-sm rounded-[7px]
                                        border border-zinc-300 dark:border-zinc-700
                                        bg-white dark:bg-neutral-800
                                        dark:text-white placeholder:text-zinc-400
                                        focus:outline-none focus:ring-1 focus:ring-zinc-400
                                        transition-all duration-150
                                    "
                                />
                            </div>

                            {/* Feedback message */}
                            {message && (
                                <p
                                    className={`text-xs font-medium ${message.success ? 'text-emerald-500' : 'text-red-500'}`}
                                >
                                    {message.text}
                                </p>
                            )}

                            {/* Submit button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="
                                    mt-2 py-2.5 rounded-[7px] text-sm font-semibold
                                    bg-black text-white dark:bg-white dark:text-black
                                    hover:opacity-80 disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    transition-opacity duration-150
                                "
                            >
                                {isPending ? 'Creating...' : 'Create Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
