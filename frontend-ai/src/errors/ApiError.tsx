import { FaFrown } from "react-icons/fa"
import { BaseError } from "./BaseError"

export class ApiError extends BaseError {
	Icon = <FaFrown size={30} />
	Content = this.message
}
