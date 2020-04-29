import fetch from 'isomorphic-unfetch'
import Link from 'next/link'

const Fetch = ({ persons }) => {
	let list_persons = persons.map(({ id, name, country, livesIn }) => {
		return (
			<li key={id}>
				<Link as={`/${country}/${name}`} href='/[country]/[person]'>
					<button>details</button>
				</Link>
				{name}: born in {country}, now lives in {livesIn}
			</li>
		)
	})

	return (
		<div>
			<h1>Data Fetching with getInitialProps</h1>
			<h2>List of persons fetched from API</h2>
			<ul>{list_persons}</ul>

			<p>
				Press <a href='http://localhost:3000/fetch'>here</a> the link
				to get all the Jojos
			</p>
			<p>
				Press <a href='http://localhost:3000/fetch?country=Japan'>here</a> the link
				to get only the Jojos that are born in Japan
			</p>
			<p>
				Press{' '}
				<a href='http://localhost:3000/fetch?country=Japan&livesIn=Italy'>here</a>{' '}
				the link to get the only Jojo born in Japan but living in Italy
			</p>
		</div>
	)
}

export default Fetch

Fetch.getInitialProps = async (ctx) => {
	const { query } = ctx

	let url = 'http://localhost:3000/api/getPeople'

	if (query.country) {
		url += `?country=${query.country}`
        if(query.livesIn) {
            url += `&livesIn=${query.livesIn}`
        }
	}

	const response = await fetch(url)
	const json_response = await response.json()
	return { persons: json_response }
}
