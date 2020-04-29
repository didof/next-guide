# Next.js

## Different approaches to routing

### Approach #1 - via <Link>

The basic way in which I can route among my pages is via the next.js provided _Link_ tag.

I create `pages/[country]/[person].js`. The basic _[person].js_ looks like:

```js
import { useRouter } from 'next/router'

export default function Person() {
	const router = useRouter()

	return (
		<h2>
			{router.query.person} lives in {router.query.country}
		</h2>
	)
}
```

In case the URL is _/italy/frank_ the `console.log(router.query)` would return `{country: "italy", person: "frank" }`.

Now I create a page containing a list from which I can access several pages, each one specific for a certain person. I create `pages/list.js` that look like below:

```js
import Link from 'next/link'

const fakeJsonResponse = [
	{ id: 1, country: 'UK', name: 'Bruno' },
	{ id: 2, country: 'Italy', name: 'Frank' },
	{ id: 3, country: 'nowhere', name: 'John' },
]

export default function List() {
	const list_link = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<Link href='/[country]/[person]' as={`/${country}/${name}`}>
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
```

This will output a different link for each person retrieved from the (in this case fake) query. The take-home message is:

> Take-home message: _Link_ tag claims two props

- **href**: is the path Next.js will use to anchor the right page. Here I am saying to Next.js - the target is in _country/_ folder, it's _person.js_ file.
- **as**: is the path as it will be visible in the url (to the user). In case of the person `{ id: 3, country: 'nowhere', name: 'John' }` the URL will be `/nowhere/John`. Consequently in _[person].js_ the _router.query_ will contain `{ country: "nowhere", person: "John" }`.

---

### Approach #2 - via custom component

I create `components/UI/Link/Active.js`. The reusable **Active** component needs two props as configuration:

- children: the link text the user will see and click
- href: the path router needs to properly connect the link to the page

```js
import { useRouter } from 'next/router'

export default function Active({ children, href, as }) {
	const router = useRouter()

	const handle_click = (e) => {
		e.preventDefault()
		router.push(href, as)
	}

	return <a onClick={handle_click}>{children}</a>
}
```

So I update the previously created `list.js` file s below:

```js
import Link from 'next/link'

import ActiveLink from '../components/UI/Link/Active'

const fakeJsonResponse = [
	{ id: 1, country: 'UK', name: 'Bruno' },
	{ id: 2, country: 'Italy', name: 'Frank' },
	{ id: 3, country: 'nowhere', name: 'John' },
]

export default function List() {
	))

	const list_activeLink = fakeJsonResponse.map(({ id, name, country }) => (
		<li key={id}>
			<ActiveLink as={`/${country}/${name}`} href='/[country]/[person]'>
				{name}
			</ActiveLink>
		</li>
	))

	return (
		<div>
			<h1>List</h1>
			<h2>Using custom component</h2>
			Navigate to:
			<ul>
			{list_activeLink}
			</ul>
		</div>
	)
}
```

> Why should I prefer this method to the previous one?

- separation of concerns + thinner code
- possibility to set style directly into component

---

### Approach #3 - via Router API

The use of this method allows to implement some more advanced features such as router event.

Directly into `list.js` file I make the following changes:

```js
import Link from 'next/link'
import Router from 'next/router'

import ActiveLink from '../components/UI/Link/Active'

const fakeJsonResponse = [
	{ id: 1, country: 'UK', name: 'Bruno' },
	{ id: 2, country: 'Italy', name: 'Frank' },
	{ id: 3, country: 'nowhere', name: 'John' },
]

export default function List() {
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

	return (
		<div>
			<h1>List</h1>
			<h2>Using Router API</h2>
			Navigate to:
			<ul>{list_routerLink}</ul>
		</div>
	)
}
```

Using `Router.push([href [, as]])` will add a new URL entry into the _history stack_. So, if I press the _go back_ button of my browser, I will land on the previous page (_list.js_). If I want to prevent this from appening I can use `Router.replace([href [, as]])`; in this case, pressing the button will redirect me to `/`.

> Why should I prefer this method over the others?

- possibility to interact with the _history stack_
- possibility to implement Router.events (see below)

#### appendix #3.1 - Router.events

The appropriate use requires that events should be registered when a component mounts, so I will use `useEffect`:

```js
import Link from 'next/link'
import Router from 'next/router'

import ActiveLink from '../components/UI/Link/Active'

const fakeJsonResponse = [
	{ id: 1, country: 'UK', name: 'Bruno' },
	{ id: 2, country: 'Italy', name: 'Frank' },
	{ id: 3, country: 'nowhere', name: 'John' },
]

export default function List() {
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
			<h2>Using Router API</h2>
			Navigate to:
			<ul>{list_routerLink}</ul>
		</div>
	)
}
```

---

## Data Fetching with getInitialProps

### Wrong Approach

I create `pages/api/getPeople.js` like so:

```js
export default (req, res) => {
	if (req.method !== 'GET') {
		return res.status(403).end()
	}

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')

	const people = [
		{ id: 1, name: 'jonathan', country: 'UK', livesIn: 'UK' },
		{ id: 3, name: 'joseph', country: 'UK', livesIn: 'USA' },
		{ id: 5, name: 'jotaro', country: 'Japan', livesIn: 'Japan' },
		{ id: 4, name: 'josuke', country: 'Japan', livesIn: 'Japan' },
		{ id: 'brando', name: 'giorno', country: 'Japan', livesIn: 'Italy' },
	]

	return res.end(JSON.stringify(people))
}
```

In a new page, `fetch.js` I use _isomorphic-unfetch_ to fetch the data from the API. I could also use _axios_ or _SWR_.

```js
import fetch from 'isomorphic-unfetch'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Fetch = () => {
	const [persons, setPersons] = useState([])

	useEffect(() => {
		async function getPersons() {
			const response = await fetch('http://localhost:3000/api/getPeople')
			const json_response = await response.json()
			setPersons(json_response)
		}

		getPersons()
	}, [])

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
		</div>
	)
}

export default Fetch
```

The output is there, I obtained a list of persons fetched from the API.

> But doing so **the fetching is appening on the client**. I can notice this refreshing the page and keeping an eye on the _Network_ tab in _devsTools_. It happens because when queryed of a page, _Next.js_ build it and send it; `useEffect()` output will be accessible in the next-time frame. Basically it will not even run in the server-side. This entails two main issues:

- client (and **SEO crawler too**) receives a blank page and needs a subsequent fetch in order to populate with content
- not taking advantage with the use of _Server-side Rendering_

### Correct Approach

```js
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
		</div>
	)
}

export default Fetch

Fetch.getInitialProps = async () => {
	const response = await fetch('http://localhost:3000/api/getPeople')
	const json_response = await response.json()
	return { persons: json_response }
}
```

What happens is that _Next.js_

- checks if there is the static method `getInitialProps`
- checks if receives a promise (**must** be _async_)
- waits for the promise to be resolved
- when this happens, passes what it's returned as props in the component

> The component render once. The page is already populated when sent.
> In the _devTools/Network_, there is no another call to fetching data. Pick _Preview_ tab and discover that Server-side Rendering is Powerfull.

## Data Fetching with filters

Now what if I want to filter the persons retrived by their country? I need to access the _context_ in the `getInitialProps` method. First of all I add in the _fetch.js_ file a link for the same API but with query params `?country=Japan`:

```html
<p>
	Press <a href="http://localhost:3000/fetch?country=Japan">here</a> the link to
	get only the Jojos that are born in Japan
</p>
```

So I implement in the API the ability to filter for the param _country_:

```js
export default (req, res) => {
	if (req.method !== 'GET') {
		return res.status(403).end()
	}

	const people = [
		{ id: 1, name: 'jonathan', country: 'UK', livesIn: 'UK' },
		{ id: 3, name: 'joseph', country: 'UK', livesIn: 'USA' },
		{ id: 5, name: 'jotaro', country: 'Japan', livesIn: 'Japan' },
		{ id: 4, name: 'josuke', country: 'Japan', livesIn: 'Japan' },
		{ id: 'brando', name: 'giorno', country: 'Japan', livesIn: 'Italy' },
	]

	let payload = people

	if (req.query && req.query['country']) {
		payload = people.filter((person) => {
			return person.country === req.query.country
		})
	}

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')

	return res.end(JSON.stringify(payload))
}
```

Finally I add the possibility to have params in the fetching made with `getInitialProps`. To achieve this result I need to access the _context_. One of its property is query:

```js
Fetch.getInitialProps = async (ctx) => {
	const { query } = ctx

	let url = 'http://localhost:3000/api/getPeople'

	if (query.country) {
		url += `?country=${query.country}`
		if (query.livesIn) {
			url += `&livesIn=${query.livesIn}`
		}
	}

	const response = await fetch(url)
	const json_response = await response.json()
	return { persons: json_response }
}
```

### Appendix - multiple params

In the `fetch.js` file:

```html
<p>
	Press <a href="http://localhost:3000/fetch">here</a> the link to get all the
	Jojos
</p>
<p>
	Press <a href="http://localhost:3000/fetch?country=Japan">here</a> the link to
	get only the Jojos that are born in Japan
</p>
<p>
	Press{' '}
	<a href="http://localhost:3000/fetch?country=Japan&livesIn=Italy">here</a>{' '}
	the link to get the only Jojo born in Japan but living in Italy
</p>
```

while in the API a little change:

```js
if (req.query && req.query['country']) {
	payload = people.filter((person) => {
		return person.country === req.query.country
	})

	if (req.query['livesIn']) {
		payload = payload.filter((person) => {
			return person.livesIn === req.query.livesIn
		})
	}
}
```

finally the `getInitialProps`:

```js
Fetch.getInitialProps = async (ctx) => {
	const { query } = ctx

	let url = 'http://localhost:3000/api/getPeople'

	if (query.country) {
		url += `?country=${query.country}`
		if (query.livesIn) {
			url += `&livesIn=${query.livesIn}`
		}
	}

	const response = await fetch(url)
	const json_response = await response.json()
	return { persons: json_response }
}
```

> This is actually a very bad way to do this. I will change this soon.

---

## Mocking-server

During the development it may be necessary to evaluate the behavior of the app in case of delays. I suggest the use of **json-server**.

> npm i -D json-server

Then just create a `db.json` file that contains something like:

```json
{
	"books": [
		{
			"id": 618,
			"title": "Trouble with lichen",
			"printed": 1973,
			"author": "John Wyndham"
		},
		{
			"id": 562,
			"title": "City pf the Clasch",
			"printed": 1971,
			"author": "Jack Vance"
		},
		{
			"id": 529,
			"title": "World without starts",
			"printed": 1969,
			"author": "Poul Andreson"
		}
	]
}
```

Finally add the _script_ to the `package.json`:

> "mock-server": "json-server --watch ./db.json -p 4001 -d 3000"
> When I call `npm run mock-server` this package will fake a server on port 4001 that responds always with a delay of 3000ms

Now I use this mock-server to pretend my real one has problems. When I click something that needs to fetch from the db, the request will be pendig for 3 seconds. I create `pages/mock.js` that contains:

```js
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
```

And I create `books/[book].js` that contains:

```js
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
```

Keeping in mind that I am mocking a server so that it takes 3 seconds per each request, when I search for `/mock` it happens:

* Server receives the request and starts to build the *mock* page.
* It checks if any static method is associated with the page
* It meets `if(!req)` but since it's server-time *req* is populated, then it moves on and fetches the books from the API and passes them as props to the component.
* The page, fully populated is sent to the client

Now I click one of the buttons and I get redirected to `/books/[theBookPicked]` after the 3 seconds delay. When I try to get back to the previous page it happens:

* [same as above] Server receives the request and starts to build the *mock* page.
* [same as above] It checks if any static method is associated with the page
* It meets `if(!req)` and since this time it's client-time *req* is **not** populated. So it follows the instruction `return { booksList: [] }`.
* So there is not the fetching to the database (reason why the delay it's not present) and the server sends the page to the client.
* In the component a simple logic checks if the prop, *booksList* is empty; if so, just render `<div>Loading</div>`.
* There is also an `useEffect()` that gets called once, when the component is mounted. It has the duty to fetch the books in order to render them. But it actually fulfill the task only if there is not already record containing books.

> Thank to this expedient it's possible to obtain a SPA feeling but without giving up the benefits arising from the use of Server-side Rendering (SEO crawlers will have at their disposal the Server-side rendered page, the one that comes full of content!)
