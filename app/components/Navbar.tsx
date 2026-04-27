'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { FaBars, FaClosedCaptioning, FaX } from 'react-icons/fa6'
import { useState } from 'react'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const Nav_Links = [
        { name: 'Features', href: '/features' },
        { name: 'Docs', href: '/Docs' },
        { name: 'Pricing ', href: '/pricing' },
        { name: 'Contact', href: '/contact' },
    ]
    return (
        <nav className="  lg:w-6xl sm:w-3xl  flex  p-2 py-4 items-center  justify-between bg-white dark:bg-black">
            <div className="flex-1">
                <h1 className="text-3xl  sm:text-2xl font-semibold text-black dark:text-zinc-50">
                    LibroManager
                </h1>
            </div>
            <ul className="lg:flex hidden  flex-3 justify-center gap-6">
                {Nav_Links.map((navlink, index) => (
                    <li key={index}>
                        <Link
                            href={navlink.href}
                            className="hover:bg-zinc-50 rounded-sm text-sm dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-4 py-2 hover:text-zinc-950 hover:dark:text-zinc-50"
                        >
                            {navlink.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="  flex-1 gap-1   flex justify-end  items-center">
                <div className="space-x-4">
                    <Link href="/signup">
                        <button className="cursor-pointer hover:bg-zinc-50 rounded-sm text-sm dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-4 py-2 hover:text-zinc-950 hover:dark:text-zinc-50">
                            Sign up
                        </button>
                    </Link>
                    <Link href="/login">
                        <button className="py-2 px-4 rounded-sm cursor-pointer  dark:bg-white text-sm dark:text-black bg-black text-zinc-50">
                            Log In
                        </button>
                    </Link>
                </div>

                <div className="p-2 sm:hidden">
                    <ThemeToggle />
                </div>
                <button
                    onClick={() => {
                        setIsMenuOpen(true)
                    }}
                    className="lg:hidden cursor-pointer p-2 rounded-full"
                >
                    <FaBars></FaBars>
                </button>
                {isMenuOpen ? (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-xl">
                        <ul className="space-y-6 top-8 left-1 absolute">
                            {Nav_Links.map((navlink, index) => (
                                <li key={index}>
                                    <Link
                                        href={navlink.href}
                                        className="rounded-sm text-xl  sm:font-semibold  text-zinc-700 dark:text-zinc-400 px-4 py-2 hover:text-zinc-950 hover:dark:text-zinc-50"
                                    >
                                        {navlink.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false)
                            }}
                            className=" cursor-pointer absolute right-8 top-6 p-2"
                        >
                            {' '}
                            <FaX></FaX>
                        </button>
                    </div>
                ) : null}
            </div>
        </nav>
    )
}
