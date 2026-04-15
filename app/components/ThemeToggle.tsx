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
            className="  bg-gray-200 cursor-pointer p-2 dark:bg-zinc-800 rounded-full"
        >
            {currentTheme === 'dark' ? (
                <FaMoon className=" h-5 w-5 "></FaMoon>
            ) : (
                <FaSun className=" h-5 w-5 "></FaSun>
            )}
        </button>
    )
}
export default ThemeToggle
