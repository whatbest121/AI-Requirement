
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
	const token = localStorage.getItem('token')
	const headers = new Headers(options.headers || {})

	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	console.log(Array.from(headers.entries()))
	return fetch(url, {
		...options,
		headers,
	})
}
