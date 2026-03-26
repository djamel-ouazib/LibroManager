'use client'

import { useTheme } from 'next-themes'
// components/ThemeToggle.tsx

import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme() // resolvedTheme gère le mode système
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return <div className="p-2 h-10 w-10" /> // Évite le layout shift

    // On regarde resolvedTheme pour savoir si on est RÉELLEMENT en dark ou light
    const currentTheme = theme === 'system' ? resolvedTheme : theme

    return (
        <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="  bg-gray-200 dark:bg-zinc-800 rounded-full"
        >
            <FaSun className="absolute h-5 w-5 rotate-0 scale-100 dark:rotate-90 dark:scale-0"></FaSun>
            <FaMoon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100"></FaMoon>
        </button>
    )
}
export default ThemeToggle
