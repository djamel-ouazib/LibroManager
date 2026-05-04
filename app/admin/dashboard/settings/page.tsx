'use client'
import { authClient } from '@/lib/auth-client'

export default function Settings() {
    const { data: session } = authClient.useSession()
    return (
        <div className="p-6 bg-white dark:bg-neutral-800 w-full border dark:border-zinc-800 border-zinc-300 rounded-2xl">
            settings
            <div className="relative top-1/3 left-1/3">
                <div className="mb-3">
                    <p>Full Name</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {session?.user.name}
                    </p>
                </div>
                <div className="mb-3">
                    <p>email</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {session?.user.email}
                    </p>
                </div>
                <div className="mb-3">
                    <p>Role</p>
                    <p className="text-sm dark:text-zinc-400 text-zinc-600">
                        {session?.user.role}
                    </p>
                </div>
            </div>
        </div>
    )
}
