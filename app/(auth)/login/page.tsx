'use client'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import router, { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const router = useRouter()
    async function handleSubmit() {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: false,
        })

        if (error) return

        if (data?.user?.role === 'ADMIN') {
            router.push('/admin/dashboard')
        } else {
            router.push('/dashboard')
        }
    }
    return (
        <div className="h-screen bg-white dark:bg-black">
            <div className="absolute top-7 left-1/3 -translate-x-1/2">
                <Link
                    className="text-gray-600 hover:text-gray-900 dark:text-zinc-50 dark:hover:text-zinc-400"
                    href="/"
                >
                    &#8592; Back To
                </Link>
            </div>
            <div className="absolute top-1/6 left-1/2 -translate-x-1/2">
                <div className="flex flex-col w-91.75 px-6 py-12 justify-center items-center gap-4 shadow-md border border-gray-200 rounded-[7px] dark:bg-neutral-900 dark:border-zinc-700">
                    <h1 className="text-xl text-pretty ">Welcome Back</h1>
                    <h3 className="text-zinc-500 mb-3 text-sm text-balance">
                        Sign in to continue to LibroManager.
                    </h3>

                    <div className="flex flex-col w-full">
                        <label
                            htmlFor=""
                            className="font-semibold mb-0.5 text-sm dark:text-zinc-200"
                        >
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            placeholder="dj.ouazib@gmail.com"
                            type="email"
                            className="dark:bg-black dark:border-zinc-700 border text-sm p-2 border-gray-300 rounded-[7px] py-1"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor=""
                            className="font-semibold mb-0.5 text-sm dark:text-zinc-200"
                        >
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            placeholder="Enter yout password"
                            type="password"
                            className="dark:bg-black border dark:border-zinc-700 text-sm p-2 border-gray-300 rounded-[7px] py-1"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-black cursor-pointer dark:hover:bg-zinc-200 dark:bg-white dark:text-black text-white w-full py-2 rounded-[7px]"
                    >
                        SingIn
                    </button>
                    <div className="flex w-full flex-row gap-1 justify-center items-center ">
                        <span className="h-px inline-block bg-gray-400 w-full"></span>
                        <div>
                            <p className="text-zinc-500">or</p>
                        </div>
                        <span className="h-px bg-gray-400 inline-block w-full"></span>
                    </div>
                    <div>
                        <Link href="/signup">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
