import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'

function Book({ book }) {
	const { id, title, author, printed } = book

	const router = useRouter()

	if (!book) {
		return <div>Loading</div>
	}

	return (
		<div>
			{title} written by {author} on {printed}
		</div>
	)
}

Book.getInitialProps = async (ctx) => {
	const { query } = ctx

	const response = await fetch(`http://localhost:4001/books?id=${query.book}`)
	const json_response = await response.json()

	return { book: json_response[0] }
}

export default Book
