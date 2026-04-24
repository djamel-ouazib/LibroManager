import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const Nav_Links = [
        { name: 'Features', href: '/features' },
        { name: 'Docs', href: '/Docs' },
        { name: 'Pricing ', href: '/pricing' },
        { name: 'Contact', href: '/contact' },
    ]
    return (
        <nav className="  w-6xl  flex  p-2 py-4 items-center  justify-between bg-white dark:bg-black">
            <div className="flex-1">
                <h1 className="text-3xl  font-semibold text-black dark:text-zinc-50">
                    LibroManager
                </h1>
            </div>
            <ul className="flex flex-3 justify-center gap-6">
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
            <div className="  flex-1 gap-1 flex justify-center items-center">
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

                <div className="p-2 ">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
