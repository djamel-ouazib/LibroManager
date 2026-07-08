import { getAllBooks, getCategories } from './actions'
import ExploreClient from './ExploreClient'

export default async function Explore() {
    // Fetch books and categories in parallel for better performance
    const [books, categories] = await Promise.all([
        getAllBooks(),
        getCategories(),
    ])

    return (
        // Pass server data down to the client component
        <ExploreClient books={books} categories={categories} />
    )
}
