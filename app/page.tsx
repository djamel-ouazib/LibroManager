import Image from 'next/image'
import ThemeToggle from './components/ThemeToggle'
import Navbar from './components/Navbar'

export default function Home() {
    return (
        <main className="min-h-screen pt-44 flex flex-col items-center  bg-white dark:bg-black ...">
            <div className="fixed top-0 py-4 z-50 ">
                <Navbar />
            </div>
            <div className="text-center space-y-6 mb-24">
                <h1 className="text-5xl">
                    Smart Library Management Made Simple
                </h1>
                <p className="dark:text-zinc-400">
                    Manage books, users, and borrowings...
                </p>
            </div>
            <div className="space-x-4 mb-24">
                <button className="py-2 px-2 text-white bg-black rounded-xl dark:text-black dark:bg-white dark:hover:bg-zinc-400 cursor-pointer  hover:bg-black/60">
                    Get Started
                </button>
                <button className="py-2 px-2 text-white bg-black rounded-xl dark:text-black dark:bg-white  dark:hover:bg-zinc-400 cursor-pointer hover:bg-black/60">
                    Explore Feautures
                </button>
            </div>
            <div className="w-6xl m-auto space-y-6 ">
                <h2 className="text-2xl text-black dark:text-zinc-50">
                    Everything You Need to Manage Your Library
                </h2>
                <ul className="text-zinc-400 font-semibold  dark:text-zinc-400 space-y-2 px-8">
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
