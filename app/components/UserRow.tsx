'use client'
import { useState } from 'react'
import StatusDropdown from './ui/StatusDropdown'

type User = {
    id: string
    name: string | null
    email: string
    status: string
}

export default function UserRow({ user }: { user: User }) {
    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <ul className="py-2 px-1   relative justify-between text-sm flex border-b border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700">
            <li>{user.name}</li>
            <li className="text-blue-600 font-mono">{user.email}</li>
            <li
                className=" relative text-xs font-bold cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <p
                    className={
                        user.status === 'ACTIVE'
                            ? 'text-emerald-400'
                            : user.status === 'BANNED'
                              ? 'text-red-600'
                              : 'text-blue-600'
                    }
                >
                    {user.status}
                </p>
                {showDropdown && (
                    <StatusDropdown
                        onClose={() => setShowDropdown(false)}
                        userId={user.id}
                    />
                )}
            </li>
        </ul>
    )
}
