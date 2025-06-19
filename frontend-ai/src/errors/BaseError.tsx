import { toast } from "@/hooks/useToast"
import { JSX } from "react"

export class BaseError extends Error {
	#toast = toast
	Icon: JSX.Element = <></>
	Content: React.ReactNode = 123
	toast() {
		return this.#toast({
			variant: "destructive",
			description: (
				<div className="flex gap-3 items-center">
					{this.Icon}
					<span className="flex flex-col">
						<span className="font-semibold">{this.name}</span>
						<div className="items-center">{this.Content}</div>
					</span>
				</div>
			),
		})
	}
}
