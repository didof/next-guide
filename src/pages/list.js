import Link from 'next/link'

const fakeJsonResponse = [
	{ id: 1, country: 'UK', name: 'Bruno' },
	{ id: 2, country: 'Italy', name: 'Frank' },
	{ id: 3, country: 'nowhere', name: 'John' },
]

export default function List() {
	const list_link = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<Link
                as={`/${country}/${name}`}
                href='/[country]/[person]'
            >
				<a>{name}</a>
			</Link>
		</li>
	))

	return (
		<div>
			<h1>List</h1>
			Navigate to:
			<ul>{list_link}</ul>
		</div>
	)
}