import { Fingerprint } from "lucide-react"
import { BaseError } from "./BaseError"

export class UnauthorizedError extends BaseError {
	constructor(message = "Unauthorized") {
		super(message)
		this.message = message
	}
	Content = (
		<div className="flex gap-2 text-warning">
			<Fingerprint size={15} />
			<span>{this.message}</span>
		</div>
	)
}
