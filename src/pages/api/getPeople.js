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

		if(req.query['livesIn']) {
			payload = payload.filter((person) => {
				return person.livesIn === req.query.livesIn
			})
		}
	}

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')

	return res.end(JSON.stringify(payload))
}
