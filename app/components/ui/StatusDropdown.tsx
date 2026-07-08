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
                absolute z-50 w-25 -left-1/2  mt-1 rounded-[14px] p-1.5  bg-white  border border-zinc-200 
            "
            >
                <ul className="flex flex-col gap-px items-center font-bold p-0.5  list-none">
                    <li
                        onClick={() => {
                            handleChange('ACTIVE')
                        }}
                        className="text-emerald-400 w-full text-center rounded-md py-2   text-sm  cursor-pointer hover:bg-zinc-100 "
                    >
                        Active
                    </li>
                    <li className="h-px bg-white/8 mx-2" />
                    <li
                        onClick={() => {
                            handleChange('BANNED')
                        }}
                        className="text-red-400 w-full text-center rounded-md py-2   text-sm  cursor-pointer hover:bg-zinc-100 "
                    >
                        Banned
                    </li>
                    <li className="h-px bg-white/8 mx-2" />
                    <li
                        onClick={() => {
                            handleChange('PENDING')
                        }}
                        className="text-blue-400 w-full text-center rounded-md py-2   text-sm  cursor-pointer hover:bg-zinc-100 "
                    >
                        Pending
                    </li>
                </ul>
            </div>
        </>
    )
}
