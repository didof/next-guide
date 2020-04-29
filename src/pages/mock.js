import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Mock = ({ booksList }) => {
	const [books, setBooks] = useState(booksList)

	useEffect(() => {
		async function loadBooks() {
			const url = `http://localhost:4001/books`
			const response = await fetch(url)
			const json_response = await response.json()
			setBooks(json_response)
		}

		if (booksList.length === 0) {
			loadBooks()
		}
	}, [])

	let list_books = <div>Loading</div>

	if (books.length > 0) {
		list_books = books.map(({ id, title, printed, author }) => {
			return (
				<li key={id}>
					<Link href='/books/[book]' as={`/books/${id}`}>
						<button>see</button>
					</Link>
					<p>
						{author}, {printed} - {title}
					</p>
				</li>
			)
		})
	}

	return (
		<div>
			<h1>Data Fetching - Solving delay issue</h1>
			<ul>{list_books}</ul>
		</div>
	)
}

Mock.getInitialProps = async ({ query, req }) => {
	if (!req) {
		console.log('called on the client')
		return { booksList: [] }
	}
	console.log('called on the server')

	const url = `http://localhost:4001/books`

	if (query.author) {
		url += `?author=${query.author}`
	}

	const response = await fetch(url)
	const json_response = await response.json()
	return { booksList: json_response }
}

export default Mock
