'use client'
import { useState, useTransition } from 'react'
import { HiEye, HiEyeOff, HiLockClosed, HiCheckCircle } from 'react-icons/hi'
import { changePassword } from './action'

interface SettingsClientProps {
    user: { name: string; email: string }
}

export default function SettingsClient({ user }: SettingsClientProps) {
    // Password form fields
    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    // Toggle password visibility for each field
    const [showCurrent, setShowCurrent] = useState<boolean>(false)
    const [showNew, setShowNew] = useState<boolean>(false)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

    // Feedback message after form submission
    const [message, setMessage] = useState<{
        text: string
        success: boolean
    } | null>(null)

    // useTransition to handle async action without blocking UI
    const [isPending, startTransition] = useTransition()

    // Validate and submit the password change form
    function handleSubmit() {
        setMessage(null)

        // Client-side validation — passwords must match
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match.', success: false })
            return
        }

        // Client-side validation — minimum password length
        if (newPassword.length < 8) {
            setMessage({
                text: 'New password must be at least 8 characters.',
                success: false,
            })
            return
        }

        startTransition(async () => {
            const result = await changePassword(currentPassword, newPassword)
            setMessage({ text: result.message, success: result.success })

            // Reset form fields on success
            if (result.success) {
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
        })
    }

    return (
        <div className="p-6  dark:bg-black w-full h-screen overflow-y-auto">
            {/* ── PAGE HEADER ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold dark:text-white mb-1">
                    Settings
                </h1>
                <p className="text-sm text-zinc-500">
                    Manage your account preferences
                </p>
            </div>

            {/* ── ACCOUNT INFO — read only ── */}
            <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 mb-6 max-w-lg">
                <h2 className="font-semibold dark:text-white mb-4 text-sm uppercase tracking-wide text-zinc-400">
                    Account Info
                </h2>
                <div className="flex flex-col gap-3">
                    {/* Display name — read only */}
                    <div>
                        <p className="text-xs text-zinc-400 mb-1">Name</p>
                        <p className="text-sm font-medium dark:text-white">
                            {user.name}
                        </p>
                    </div>
                    {/* Display email — read only */}
                    <div>
                        <p className="text-xs text-zinc-400 mb-1">Email</p>
                        <p className="text-sm font-medium dark:text-white">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── CHANGE PASSWORD FORM ── */}
            <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 max-w-lg">
                <div className="flex items-center gap-2 mb-6">
                    <HiLockClosed size={16} className="text-zinc-400" />
                    <h2 className="font-semibold dark:text-white text-sm uppercase tracking-wide text-zinc-400">
                        Change Password
                    </h2>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Current password field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold dark:text-zinc-200">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="Enter your current password"
                                className="
                                    w-full pr-10 pl-3 py-2 text-sm
                                    border border-zinc-300 dark:border-zinc-700
                                    rounded-[7px] bg-white dark:bg-neutral-800
                                    dark:text-zinc-100 placeholder:text-zinc-400
                                    focus:outline-none focus:ring-1 focus:ring-zinc-400
                                    dark:focus:ring-zinc-600
                                    transition-all duration-150
                                "
                            />
                            {/* Toggle visibility button */}
                            <button
                                onClick={() => setShowCurrent((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                {showCurrent ? (
                                    <HiEyeOff size={14} />
                                ) : (
                                    <HiEye size={14} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New password field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold dark:text-zinc-200">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                className="
                                    w-full pr-10 pl-3 py-2 text-sm
                                    border border-zinc-300 dark:border-zinc-700
                                    rounded-[7px] bg-white dark:bg-neutral-800
                                    dark:text-zinc-100 placeholder:text-zinc-400
                                    focus:outline-none focus:ring-1 focus:ring-zinc-400
                                    dark:focus:ring-zinc-600
                                    transition-all duration-150
                                "
                            />
                            <button
                                onClick={() => setShowNew((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                {showNew ? (
                                    <HiEyeOff size={14} />
                                ) : (
                                    <HiEye size={14} />
                                )}
                            </button>
                        </div>
                        {/* Password strength hint */}
                        {newPassword && newPassword.length < 8 && (
                            <p className="text-xs text-red-400">
                                At least 8 characters required
                            </p>
                        )}
                    </div>

                    {/* Confirm new password field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold dark:text-zinc-200">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm your new password"
                                className="
                                    w-full pr-10 pl-3 py-2 text-sm
                                    border border-zinc-300 dark:border-zinc-700
                                    rounded-[7px] bg-white dark:bg-neutral-800
                                    dark:text-zinc-100 placeholder:text-zinc-400
                                    focus:outline-none focus:ring-1 focus:ring-zinc-400
                                    dark:focus:ring-zinc-600
                                    transition-all duration-150
                                "
                            />
                            <button
                                onClick={() => setShowConfirm((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                {showConfirm ? (
                                    <HiEyeOff size={14} />
                                ) : (
                                    <HiEye size={14} />
                                )}
                            </button>
                        </div>
                        {/* Passwords match indicator */}
                        {confirmPassword && newPassword === confirmPassword && (
                            <div className="flex items-center gap-1 text-emerald-500">
                                <HiCheckCircle size={12} />
                                <p className="text-xs">Passwords match</p>
                            </div>
                        )}
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-400">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {/* Feedback message after submission */}
                    {message && (
                        <p
                            className={`text-sm font-medium ${message.success ? 'text-emerald-500' : 'text-red-500'}`}
                        >
                            {message.text}
                        </p>
                    )}

                    {/* Submit button — disabled when fields are empty or request is pending */}
                    <button
                        onClick={handleSubmit}
                        disabled={
                            isPending ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword
                        }
                        className="
                            mt-2 py-2.5 rounded-[7px] text-sm font-semibold
                            bg-black text-white dark:bg-white dark:text-black
                            hover:opacity-80 disabled:opacity-40
                            disabled:cursor-not-allowed
                            transition-opacity duration-150
                        "
                    >
                        {isPending ? 'Saving...' : 'Save New Password'}
                    </button>
                </div>
            </div>
        </div>
    )
}
