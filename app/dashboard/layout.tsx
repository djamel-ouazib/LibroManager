import type { Metadata } from 'next'

import '../globals.css'
import { ThemeProvider } from 'next-themes'
import NavLinks from '../components/Nav-Links'
import { FaBook, FaCog, FaHeart, FaHome, FaSearch } from 'react-icons/fa'

const Nav_Links = [
    { name: 'Home', href: '/dashboard', icon: <FaHome /> }, // Souvent le dashboard est sur /dashboard
    { name: 'Explore', href: '/dashboard/explore', icon: <FaSearch /> },
    { name: 'My Loans', href: '/dashboard/loans', icon: <FaBook /> },
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: <FaHeart /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <FaCog /> },
]
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-full flex flex-row">
            <aside>
                <NavLinks Nav_Links={Nav_Links} />
            </aside>
            {children}
        </div>
    )
}
