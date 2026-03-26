const Datas = [
    { title: 'Total Books', data: '1242' },
    { title: 'Active Borrowings', data: '712' },
    { title: 'New Members (This Month)', data: '12' },
    { title: 'Overdue Books', data: '8' },
]
export default function StatCard() {
    return (
        <div className="w-full border p-4 border-gray-200 dark:border-gray-600">
            <ul className="flex  justify-between">
                {Datas.map((data, index) => (
                    <li key={index}>
                        <span className="block dark:text-zinc-300 text-sm">
                            {' '}
                            {data.title}
                        </span>
                        <span
                            className={`${data.title === 'Overdue Books' ? 'text-red-400 animate-pulse' : null} block text-[19px] font-bold`}
                        >
                            {data.data}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
