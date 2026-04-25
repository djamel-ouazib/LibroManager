'use client'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useState } from 'react'

export default function SignUp() {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async () => {
        const { error } = await authClient.signUp.email(
            {
                name, // user display name //
                email, // user email address
                password, // user password -> min 8 characters by default
                callbackURL: '/dashboard', // A URL to redirect to after the user verifies their email (optional)
            },
            {
                onRequest: (ctx) => {
                    //show loading
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard or sign in page
                },
                onError: (ctx) => {
                    // display the error message
                    alert(ctx.error.message)
                },
            }
        )
    }
    async function handleGoogle() {
        await authClient.signIn.social({ provider: 'google' })
    }
    return (
        <>
            <div className="absolute top-7 left-1/3 -translate-x-1/2">
                <Link className="text-gray-600 hover:text-gray-900" href="/">
                    &#8592; Back To
                </Link>
            </div>
            <div className="absolute top-1/6 left-1/2 -translate-x-1/2">
                <div className="flex flex-col w-91.75 px-6 py-12 justify-center items-center gap-4 shadow-md border border-gray-200 rounded-[7px]">
                    <h1 className="text-xl text-pretty">
                        Sign up LibroManager
                    </h1>
                    <h3 className="text-zinc-500 mb-3 text-sm text-balance">
                        We just need a few details to get you started.
                    </h3>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor=""
                            className="font-semibold mb-0.5 text-sm"
                        >
                            Full name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            placeholder="Djamel Ouazib"
                            type="text"
                            className="border text-sm p-2 border-gray-300 py-1 rounded-[7px]"
                        />
                    </div>
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
                        SingUp
                    </button>
                    <div className="flex w-full flex-row gap-1 justify-center items-center ">
                        <span className="h-px inline-block bg-gray-400 w-full"></span>
                        <div>
                            <p className="text-zinc-500">or</p>
                        </div>
                        <span className="h-px bg-gray-400 inline-block w-full"></span>
                    </div>
                    <button
                        onClick={handleGoogle}
                        className="text-sm cursor-pointer font-semibold rounded-[7px] border w-full py-2 border-gray-300"
                    >
                        Continue with Google
                    </button>
                </div>
            </div>
        </>
    )
}
