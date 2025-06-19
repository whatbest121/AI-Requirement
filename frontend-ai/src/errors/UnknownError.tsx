import { BaseError } from "./BaseError"
const defaultMessage = "Unknown error"
export class UnknownError extends BaseError {
	constructor(message: string = defaultMessage) {
		super(defaultMessage)
		this.message = message
	}
}
