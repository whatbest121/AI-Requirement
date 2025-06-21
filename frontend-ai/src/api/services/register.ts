import { ServerError } from "@/errors"
import { sleep } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { UserLogin } from "./auth"
import { fetchWithAuth } from "@/lib/treaty"


async function register(payload: UserLogin) {
	await sleep(500)
	try {
		const res = await fetchWithAuth('/api/v1/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then<{
			id: string,
			username: string,
			is_active: boolean,
			created_at: Date
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
export default function registerAuth() {
	return useMutation({
		mutationFn: register,
		retry: false,
	})
}
