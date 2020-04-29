import Link from 'next/link'
import Router from 'next/router'
import { useEffect } from 'react'

import ActiveLink from '../components/UI/Link/Active'

const fakeJsonResponse = [
	{ id: 1, country: 'UK', name: 'Bruno' },
	{ id: 2, country: 'Italy', name: 'Frank' },
	{ id: 3, country: 'nowhere', name: 'John' },
]

export default function List() {
	const list_link = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<Link as={`/${country}/${name}`} href='/[country]/[person]'>
				<a>{name}</a>
			</Link>
		</li>
	))

	const list_activeLink = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<ActiveLink as={`/${country}/${name}`} href='/[country]/[person]'>
				{name}
			</ActiveLink>
		</li>
	))

	const handle_route = (name, country) => {
		return () => {
			const href = '/[country]/[person]'
			const as = `/${country}/${name}`

			return Router.push(href, as)
		}
	}

	const list_routerLink = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<span onClick={handle_route(name, country)}>{name}</span>
		</li>
	))

	useEffect(() => {
		const handle_routeChangeStart = (url) => {
			console.log('> App is changing to:', url)
		}

		const handle_routeChangeComplete = (url) => {
			console.log('> Successfully redirected to:', url)
		}

		Router.events.on('routeChangeStart', handle_routeChangeStart)
		Router.events.on('routeChangeComplete', handle_routeChangeComplete)

		return () => {
			Router.events.off('routeChangeStart', handle_routeChangeStart)
			Router.events.off('routeChangeComplete', handle_routeChangeComplete)
		}
	})

	return (
		<div>
			<h1>List</h1>
			<h2>Using Link tag</h2>
			Navigate to:
			<ul>{list_link}</ul>
			<hr />
			<h2>Using custom component</h2>
			Navigate to:
			<ul>{list_activeLink}</ul>
			<hr />
			<h2>Using Router API</h2>
			Navigate to:
			<ul>{list_routerLink}</ul>
		</div>
	)
}
