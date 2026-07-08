'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { HiChevronLeft, HiChevronRight, HiMenuAlt2, HiX } from 'react-icons/hi'

// Type definition for a single navigation link item
interface NavLinkItem {
    name: string
    href: string
    icon: React.ReactNode
}

// Props definition — no more isOpen/onClose needed from parent
interface NavLinksProps {
    Nav_Links: NavLinkItem[]
}

// Handles user sign out and redirects to login page on success
async function handleLogOut() {
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                redirect('/login')
            },
        },
    })
}

export default function NavLinks({ Nav_Links }: NavLinksProps) {
    // Get current user session data
    const { data: session } = authClient.useSession()

    // Controls the logout confirmation modal visibility
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)

    // Controls sidebar open/close on mobile (closed by default)
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)

    // Controls sidebar open/close on desktop (open by default)
    const [desktopOpen, setDesktopOpen] = useState<boolean>(true)

    // Shared sidebar content to avoid duplication between mobile and desktop
    const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
        <>
            {/* App logo */}
            <div>
                <span className="text-xl font-semibold tracking-wide whitespace-nowrap">
                    <Link href="/dashboard" onClick={onLinkClick}>
                        LibroManager
                    </Link>
                </span>
            </div>

            {/* Current user display */}
            <div className="bg-zinc-100 p-2 dark:text-black text-sm hover:bg-zinc-200 rounded-lg">
                <p className="whitespace-nowrap truncate">
                    {session?.user?.name}
                </p>
            </div>

            {/* Navigation links */}
            <ul className="flex flex-col justify-center gap-2">
                {Nav_Links.map((navlink, index) => (
                    <li
                        key={index}
                        className="dark:hover:bg-zinc-700 hover:bg-zinc-100 px-2 rounded-[7px]"
                    >
                        <Link
                            href={navlink.href}
                            onClick={onLinkClick}
                            className="text-zinc-600 items-center flex gap-2 text-sm w-full dark:text-zinc-400 px-4 py-2 hover:text-zinc-950 hover:dark:text-zinc-50"
                        >
                            <span>{navlink.icon}</span>
                            <span className="whitespace-nowrap">
                                {navlink.name}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Theme toggle */}
            <div>
                <ThemeToggle />
            </div>

            {/* Logout button — opens confirmation modal */}
            <div>
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="py-1 px-4 focus:scale-95 rounded-[7px] bg-red-200 text-red-600 w-full whitespace-nowrap"
                >
                    Logout
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* ── MOBILE HAMBURGER BUTTON ── fixed top left, hidden on desktop */}
            <button
                onClick={() => setMobileOpen(true)}
                className="
                    fixed top-4 left-4 z-50
                    flex items-center justify-center
                    w-8 h-8 rounded-[7px]
                    text-zinc-500 hover:text-zinc-900
                    dark:text-zinc-400 dark:hover:text-zinc-100
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition-colors duration-150
                    lg:hidden
                "
            >
                <HiMenuAlt2 size={20} />
            </button>

            {/* ── MOBILE SIDEBAR ────────────────────────────────────────── */}

            {/* Dark overlay — closes sidebar when clicking outside */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                />
            )}

            {/* Sidebar panel — slides in from the left */}
            <div
                className={`
                fixed top-0 left-0 z-40 h-screen w-62.5
                border-r p-6
                dark:bg-neutral-900 dark:border-zinc-800 border-zinc-300
                bg-white flex flex-col justify-between
                transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:hidden
            `}
            >
                {/* Close button inside the mobile sidebar */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="
                        absolute top-4 right-4
                        flex items-center justify-center
                        w-7 h-7 rounded-[7px]
                        text-zinc-400 hover:text-zinc-700
                        dark:hover:text-zinc-200
                        hover:bg-zinc-100 dark:hover:bg-zinc-700
                        transition-colors duration-150
                    "
                >
                    <HiX size={16} />
                </button>

                <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </div>

            {/* ── DESKTOP SIDEBAR ───────────────────────────────────────── */}
            <aside
                className={`
                hidden lg:flex flex-col justify-between relative
                h-screen border-r
                dark:bg-neutral-900 dark:border-zinc-800 border-zinc-300
                transition-all duration-300 ease-in-out
                ${desktopOpen ? 'w-62.5 p-6' : 'w-0 overflow-hidden border-r-0'}
            `}
            >
                <SidebarContent />

                {/* Notion-style collapse button — top right edge of the sidebar */}
                <button
                    onClick={() => setDesktopOpen(false)}
                    className="
                        absolute top-5 right-3
                        flex items-center justify-center
                        w-5 h-5 rounded-sm
                        text-zinc-400 hover:text-zinc-700
                        dark:hover:text-zinc-200
                        hover:bg-zinc-100 dark:hover:bg-zinc-700
                        transition-colors duration-150
                    "
                >
                    <HiChevronLeft size={16} />
                </button>
            </aside>

            {/* Re-open button — appears at top left when desktop sidebar is closed */}
            {!desktopOpen && (
                <button
                    onClick={() => setDesktopOpen(true)}
                    className="
                        hidden lg:flex
                        fixed top-4 left-3 z-50
                        items-center justify-center
                        w-5 h-5 rounded-sm
                        text-zinc-400 hover:text-zinc-700
                        dark:hover:text-zinc-200
                        hover:bg-zinc-100 dark:hover:bg-zinc-700
                        transition-colors duration-150
                    "
                >
                    <HiChevronRight size={16} />
                </button>
            )}

            {/* ── LOGOUT MODAL ──────────────────────────────────────────── */}
            {showLogoutModal && (
                // Backdrop — clicking outside closes the modal
                <div
                    onClick={() => setShowLogoutModal(false)}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                >
                    {/* Modal card — stopPropagation prevents backdrop from firing */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 rounded-[27px] px-8 py-8 flex flex-col items-center gap-4 w-80"
                        style={{
                            boxShadow:
                                '0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 2px 4px 0px rgba(9, 9, 11, 0.04)',
                        }}
                    >
                        <h2 className="text-lg font-semibold dark:text-zinc-100">
                            Confirm Logout
                        </h2>
                        <p className="text-sm text-zinc-500 text-center">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex gap-3 w-full">
                            {/* Cancel — closes modal without logging out */}
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2 rounded-[7px] border border-gray-300 dark:border-zinc-700 text-sm dark:text-zinc-200"
                            >
                                Cancel
                            </button>
                            {/* Confirm — triggers logout */}
                            <button
                                onClick={() => {
                                    setShowLogoutModal(false)
                                    handleLogOut()
                                }}
                                className="flex-1 py-2 rounded-[7px] bg-red-200 text-red-600 text-sm font-semibold"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
