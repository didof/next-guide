import Link from 'next/link'

import ActiveLink from '../components/UI/Link/Active'

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

	const list_activeLink = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<ActiveLink href={`/${country}/${name}`}>{name}</ActiveLink>
		</li>
	))

	return (
		<div>
			<h1>List</h1>
			<h2>Using Link tag</h2>
			Navigate to:
			<ul>{list_link}</ul>
			<hr />
			<h2>Using custom component</h2>
			Navigate to:
			<ul>
			{list_activeLink}
			</ul>
		</div>
	)
}