import { Dispatch, SetStateAction } from 'react'

type Props = {
    showToast: boolean
    setShowToast: Dispatch<SetStateAction<boolean>>
}
export default function ToastDeleteConf({ showToast, setShowToast }: Props) {
    return (
        <div
            className={`absolute ${showToast ? 'opacity-100 -translate-y-[calc(0%)]' : 'opacity-0 -translate-y-[calc(100%+4px)]'} transition duration-300 ease-out px-3 py-1 right-1 flex flex-col top-1 z-50 w-94 h-20 rounded-md bg-blue-600`}
        >
            <button
                onClick={() => setShowToast(false)}
                className="text-white self-end p-1 h-8 w-8 rounded-full cursor-pointer hover:bg-blue-700"
            >
                X
            </button>
            <p className="text-white mx-2">Book added successfully</p>
        </div>
    )
}
