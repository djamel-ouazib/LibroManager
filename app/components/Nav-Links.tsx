'use client'
import Link from 'next/link'

import ThemeToggle from './ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

// 1. On définit la structure d'UN SEUL lien
interface NavLinkItem {
    name: string
    href: string
    icon: React.ReactNode
}

// 2. On définit la structure des PROPS (qui contient le tableau)
interface NavLinksProps {
    Nav_Links: NavLinkItem[]
}
async function handleLogOut() {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                redirect('/login') // redirect to login page
            },
        },
    })
}

export default function NavLinks({ Nav_Links }: NavLinksProps) {
    const { data: session } = authClient.useSession()
    return (
        <div className="w-[250] min-h-screen border-r p-6 dark:bg-neutral-900 dark:border-zinc-800 border-zinc-300 flex flex-col justify-between">
            <div>
                <span className="text-xl font-semibold tracking-wide">
                    <Link href="/dashboard">LibroManager</Link>
                </span>
            </div>
            <div>
                <p>{session?.user?.name}</p>
            </div>
            <ul className="flex flex-col  justify-center gap-6">
                {Nav_Links.map((navlink, index) => (
                    <li
                        key={index}
                        className="dark:hover:bg-zinc-700 hover:bg-zinc-100 px-2 rounded-[7px]"
                    >
                        <Link
                            href={navlink.href}
                            className="text-zinc-600 items-center  flex gap-1 text-sm w-full dark:text-zinc-400 px-4 py-2 hover:text-zinc-950 hover:dark:text-zinc-50"
                        >
                            <span className="">{navlink.icon}</span>
                            <span>{navlink.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <div>
                <ThemeToggle />
            </div>
            <div>
                <button
                    onClick={handleLogOut}
                    className="py-1 px-4 rounded-[7px] bg-red-200 text-red-600 w-full"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
