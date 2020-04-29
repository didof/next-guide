# Next.js

## Different approaches to routing

### Approach #1 - via <Link>

The basic way in which I can route among my pages is via the next.js provided _Link_ tag.

I create `pages/[country]/[person].js`. The basic _[person].js_ looks like:

```
import { useRouter } from 'next/router'

export default function Person() {

    const router = useRouter()

    return <h2>{router.query.person} lives in {router.query.country}</h2>
}
```

In case the URL is _/italy/frank_ the `console.log(router.query)` would return `{country: "italy", person: "frank" }`.

Now I create a page containing a list from which I can access several pages, each one specific for a certain person. I create `pages/list.js` that look like below:

```
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
                href='/[country]/[person]'
                as={`/${country}/${name}`}
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

```
import { useRouter } from 'next/router'

export default function Active({ children, href }) {
    const router = useRouter()

    const handle_click = e => {
        e.preventDefault()
        router.push(href)
    }

    return (
        <a href={href} onClick={handle_click}>
            {children}
        </a>
    )
}
```

So I update the previously created `list.js` file s below:

```
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
```

Why should I prefer this method to the previous one?
* separation of concerns + thinner code
* possibility to set style directly into component
