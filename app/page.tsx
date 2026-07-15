'use client'
import Navbar from './components/Navbar'
import { motion, spring } from 'motion/react'

// Home page — public landing page visible before authentication
export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center bg-white dark:bg-black transition-colors duration-500">
            {/* ── STICKY NAVIGATION BAR ── */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>

            {/* ── HERO SECTION ── animated headline and subtitle */}
            <div className="text-center space-y-12 mb-24 mt-34 text-balance">
                <motion.h1
                    initial={{ opacity: 0, y: 18, filter: 'blur(15px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.4, type: spring, bounce: 0 }}
                    className="text-6xl text-balance font-semibold"
                >
                    Smart Library Management Made Simple
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 18, filter: 'blur(15px)' }}
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

            {/* ── CTA BUTTONS ── Get Started and Explore Features */}
            <div className="space-x-4 mb-24">
                <motion.button
                    initial={{ opacity: 0, filter: 'blur(15px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                        duration: 1.4,
                        type: spring,
                        bounce: 0,
                        delay: 1.2,
                    }}
                    className="py-2 px-4 text-white bg-black rounded-sm dark:text-black dark:bg-white dark:hover:bg-zinc-400 cursor-pointer hover:bg-black/60"
                >
                    Get Started
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, filter: 'blur(15px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                        duration: 2,
                        type: spring,
                        bounce: 0,
                        delay: 1,
                    }}
                    className="py-2 px-4 text-white bg-black rounded-sm dark:text-black dark:bg-white dark:hover:bg-zinc-400 cursor-pointer hover:bg-black/60"
                >
                    Explore Features
                </motion.button>
            </div>

            {/* ── FEATURES SECTION ── key features list */}
            {/* ── FEATURES SECTION ── key features list */}
            <motion.div
                className="w-full max-w-5xl m-auto px-8 space-y-8"
                initial={{ opacity: 0, filter: 'blur(15px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{
                    duration: 1.4,
                    type: spring,
                    bounce: 0,
                    delay: 1.2,
                }}
            >
                <h2 className="text-2xl text-black dark:text-zinc-50 font-serif">
                    Everything You Need to Manage Your Library
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
                    {[
                        {
                            call: '020.1',
                            title: 'Role-based access',
                            text: 'Secure authentication with separate Admin and User permissions.',
                        },
                        {
                            call: '025.3',
                            title: 'Full catalog control',
                            text: 'Browse, search, and manage your entire book collection.',
                        },
                        {
                            call: '651.2',
                            title: 'Real-time circulation',
                            text: 'Track every borrow and return the moment it happens.',
                        },
                        {
                            call: '004.6',
                            title: 'Admin dashboard',
                            text: 'Full oversight and insight into how your library is used.',
                        },
                    ].map((f) => (
                        <div
                            key={f.call}
                            className="bg-white dark:bg-black p-6"
                        >
                            <span className="font-mono text-xs text-zinc-400">
                                {f.call}
                            </span>
                            <p className="text-black dark:text-zinc-50 font-medium mt-1">
                                {f.title}
                            </p>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                                {f.text}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── HOW IT WORKS SECTION ── step by step guide */}
            <div className="w-full max-w-3xl m-auto px-8 space-y-8 mt-24">
                <h2 className="text-2xl text-black dark:text-zinc-50 font-serif">
                    How It Works
                </h2>
                <ol className="space-y-0">
                    {[
                        'Create an account or log in securely',
                        'Browse the library catalog',
                        'Borrow your favorite books',
                        "Return books easily when you're done",
                    ].map((step, i) => (
                        <li
                            key={step}
                            className="flex items-baseline gap-5 py-4 border-t border-zinc-200 dark:border-zinc-800 first:border-t-0"
                        >
                            <span className="font-mono text-sm text-zinc-400">
                                {String(i + 1).padStart(3, '0')}
                            </span>
                            <span className="text-zinc-600 dark:text-zinc-300">
                                {step}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
        </main>
    )
}
