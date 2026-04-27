'use client'
import Navbar from './components/Navbar'
import { motion, spring } from 'motion/react'
export default function Home() {
    return (
        <main className="min-h-screen   flex flex-col items-center  bg-white dark:bg-black ">
            <div className="sticky   top-0  z-50 ">
                <Navbar />
            </div>
            <div className="text-center  space-y-12 mb-24 mt-34 text-balance">
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 18,
                        filter: 'blur(15px)',
                    }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.4, type: spring, bounce: 0 }}
                    className="text-6xl text-balance font-semibold"
                >
                    Smart Library Management Made Simple
                </motion.h1>
                <motion.p
                    initial={{
                        opacity: 0,
                        y: 18,
                        filter: 'blur(15px)',
                    }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                        duration: 1.4,
                        type: spring,
                        bounce: 0,
                        delay: 0.4,
                    }}
                    className="dark:text-zinc-400 text-balance mt-3 text-zinc-500"
                >
                    Manage books, users, and borrowings...
                </motion.p>
            </div>
            <div className="space-x-4 mb-24">
                <motion.button
                    initial={{
                        opacity: 0,

                        filter: 'blur(15px)',
                    }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                        duration: 1.4,
                        type: spring,
                        bounce: 0,
                        delay: 1.2,
                    }}
                    className="py-2 px-4 text-white bg-black rounded-sm dark:text-black dark:bg-white dark:hover:bg-zinc-400 cursor-pointer  hover:bg-black/60"
                >
                    Get Started
                </motion.button>
                <motion.button
                    initial={{
                        opacity: 0,

                        filter: 'blur(15px)',
                    }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                        duration: 2,
                        type: spring,
                        bounce: 0,
                        delay: 1,
                    }}
                    className="py-2 px-4 text-white bg-black rounded-sm dark:text-black dark:bg-white  dark:hover:bg-zinc-400 cursor-pointer hover:bg-black/60"
                >
                    Explore Feautures
                </motion.button>
            </div>
            <div className="w-6xl m-auto space-y-6 ">
                <h2 className="text-2xl text-black dark:text-zinc-50">
                    Everything You Need to Manage Your Library
                </h2>
                <ul className="text-zinc-400 font-semibold text-sm dark:text-zinc-400 space-y-2 px-8">
                    <li>
                        Secure authentication system with role-based access
                        (Admin & User).
                    </li>
                    <li>
                        Easily browse, search, and manage a complete collection
                        of books.
                    </li>
                    <li>
                        Allow users to borrow and return books with real-time
                        tracking.
                    </li>
                    <li>
                        Get full control and insights with a powerful
                        administrative dashboard.
                    </li>
                    <li>
                        Access your library from any device with a clean and
                        modern interface.
                    </li>
                </ul>
            </div>
            <div className="w-6xl m-auto space-y-6 ">
                <h2 className="text-2xl text-black dark:text-zinc-50">
                    How It Works
                </h2>
                <ul className="text-zinc-400 font-semibold  dark:text-zinc-400 space-y-2 px-8">
                    <li>Create an account or log in securely</li>
                    <li>Browse the library catalog</li>
                    <li>Borrow your favorite books</li>
                    <li>Return books easily when you're done</li>
                </ul>
            </div>
        </main>
    )
}
