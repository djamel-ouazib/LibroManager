'use client'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    async function handleSubmit() {
        const { error } = await authClient.signIn.email(
            {
                /**
                 * The user email
                 */
                email,
                /**
                 * The user password
                 */
                password,
                /**
                 * A URL to redirect to after the user verifies their email (optional)
                 */
                callbackURL: '/dashboard',
                /**
                 * remember the user session after the browser is closed.
                 * @default true
                 */
                rememberMe: false,
            },
            {
                //callbacks
            }
        )
    }
    return (
        <>
            <div className="absolute top-1/6 left-1/2 -translate-x-1/2">
                <div className="flex flex-col w-91.75 px-6 py-12 justify-center items-center gap-4 shadow-md border border-gray-200 rounded-[7px]">
                    <h1 className="text-xl text-pretty">Welcome Back</h1>
                    <h3 className="text-zinc-500 mb-3 text-sm text-balance">
                        Sign in to continue to LibroManager.
                    </h3>

                    <div className="flex flex-col w-full">
                        <label
                            htmlFor=""
                            className="font-semibold mb-0.5 text-sm"
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
                            className="border text-sm p-2 border-gray-300 rounded-[7px] py-1"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor=""
                            className="font-semibold mb-0.5 text-sm"
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
                            className="border text-sm p-2 border-gray-300 rounded-[7px] py-1"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-black cursor-pointer  text-white w-full py-2 rounded-[7px]"
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
        </>
    )
}
