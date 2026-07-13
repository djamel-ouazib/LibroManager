'use client'
// Theme toggle button — switches between light and dark mode
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Wait for component to mount before rendering
    // to avoid hydration mismatch between server and client
    useEffect(() => {
        // Deferred state update to avoid hydration mismatch
        const timeout = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(timeout)
    }, [])

    // Render an empty placeholder to avoid layout shift during hydration
    if (!mounted) return <div className="p-2 h-10 w-10" />

    // Use resolvedTheme to correctly handle system theme preference
    const currentTheme = theme === 'system' ? resolvedTheme : theme

    return (
        <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="bg-gray-50 cursor-pointer p-2 dark:bg-zinc-800 rounded-full"
        >
            {/* Show moon icon in dark mode, sun icon in light mode */}
            {currentTheme === 'dark' ? (
                <FaMoon className="h-5 w-5" />
            ) : (
                <FaSun className="h-5 w-5" />
            )}
        </button>
    )
}

export default ThemeToggle
