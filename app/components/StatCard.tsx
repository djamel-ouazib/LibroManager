import prisma from '@/lib/prisma'

const Datas = [
    { title: 'Total Books', data: '1242' },
    { title: 'Active Borrowings', data: '712' },
    { title: 'New Members (This Month)', data: '12' },
    { title: 'Overdue Books', data: '8' },
]
export default async function StatCard() {
    const [totalBooks, activeBorrowings, newMembers, overdueBooks] =
        await Promise.all([
            prisma.book.count(),
            prisma.borrowing.count({ where: { status: 'BORROWED' } }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                        ),
                    },
                    role: 'USER',
                },
            }),
            prisma.borrowing.count({ where: { status: 'OVERDUE' } }),
        ])

    const Datas = [
        { title: 'Total Books', data: totalBooks },
        { title: 'Active Borrowings', data: activeBorrowings },
        { title: 'New Members (This Month)', data: newMembers },
        { title: 'Overdue Books', data: overdueBooks },
    ]
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
