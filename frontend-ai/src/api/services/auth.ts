import { ServerError } from "@/errors"
import { fetchWithAuth } from "@/lib/treaty"
import { sleep } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"

export interface UserLogin {
	username: string
	password: string
}
async function loginAuth(payload: UserLogin) {
	await sleep(500)
	try {
		const res = await fetchWithAuth('/api/v1/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then<{
			message: string,
			username: string,
			token: string
		}>((res) => res.json());
		return res
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Failed to fetch") {
				throw new ServerError()
			}
			throw error
		}
		throw error
	}
}
export default function useAuth() {
	return useMutation({
		mutationFn: loginAuth,
		retry: false,
	})
}
