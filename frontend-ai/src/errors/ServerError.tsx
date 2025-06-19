import { ServerCrash } from "lucide-react"
import { BaseError } from "./BaseError"

const defaultMessage = "Server not working, please contact administrator."

export class ServerError extends BaseError {
	constructor(message: string = defaultMessage) {
		super(message)
		this.message = message
	}
	Icon = <ServerCrash size={30} />
	Content = this.message
}
