import { z } from "zod"
import { ApiError } from "./ApiError"
import { ServerError } from "./ServerError"
import { UnauthorizedError } from "./UnauthorizedError"
import { UnknownError } from "./UnknownError"
const errorSchema = z.object({
	status: z.number(),
	value: z.object({
		name: z.string(),
		message: z.string(),
	}),
})
interface AutoErrorProps {
	status: unknown
	value: unknown
}
export class AutoError {
	constructor(error: AutoErrorProps) {
		const result = errorSchema.safeParse(error)
		if (result.error) throw new UnknownError()

		const { status, value } = result.data
		if (status >= 400) {
			if (status === 401) throw new UnauthorizedError(value.message)
			throw new ApiError(value.message)
		}
		if (status >= 500) throw new ServerError(value.message)

		throw new UnknownError()
	}
}
