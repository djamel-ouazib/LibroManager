'use client'

import { updateUserStatus } from '@/app/admin/dashboard/users/action'

type Props = {
    onClose: () => void
    userId: string
}

export default function StatusDropdown({ onClose, userId }: Props) {
    const handleChange = async (status: 'ACTIVE' | 'BANNED' | 'PENDING') => {
        await updateUserStatus(userId, status)
        onClose()
    }
    return (
        <>
            {/* overlay invisible pour fermer en cliquant dehors */}
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="
                absolute z-50 w-25 -left-1/2  mt-1 rounded-[14px] p-1.5  bg-white/20 backdrop-blur-2xl saturate-190 border-[0.5px] border-white/18  shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_0.5px_0_rgba(255,255,255,0.25)]
            "
            >
                <ul className="flex flex-col gap-px items-center p-2 list-none">
                    <li
                        onClick={() => {
                            handleChange('ACTIVE')
                        }}
                        className="text-emerald-400 px-3.5 py-2 border-b-2 border-gray-200 text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors "
                    >
                        Active
                    </li>
                    <li className="h-px bg-white/8 mx-2" />
                    <li
                        onClick={() => {
                            handleChange('BANNED')
                        }}
                        className="text-red-400 px-3.5 border-b-2 py-2 border-gray-200 text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors"
                    >
                        Banned
                    </li>
                    <li className="h-px bg-white/8 mx-2" />
                    <li
                        onClick={() => {
                            handleChange('PENDING')
                        }}
                        className="text-blue-400 px-3.5 py-2 border-b-2 border-gray-200 text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors"
                    >
                        Pending
                    </li>
                </ul>
            </div>
        </>
    )
}
