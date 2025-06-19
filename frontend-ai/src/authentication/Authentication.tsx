import { cn } from "@/lib/utils"
import type React from "react"
import { useAuth } from "./hook"
interface AuthenticationProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function Authentication() {
	return
}
Authentication.Auth = function Auth({
	children,
	className,
	...props
}: AuthenticationProps) {
	const { isAuthenticated } = useAuth()
	if (!isAuthenticated) return
	return (
		<div {...props} className={cn("flex gap-2", className)}>
			{children}
		</div>
	)
}
Authentication.NoAuth = function NoAuth({
	children,
	className,
	...props
}: AuthenticationProps) {
	const { isAuthenticated } = useAuth()
	if (isAuthenticated) return
	return (
		<div {...props} className={cn("gap-2", className)}>
			{children}
		</div>
	)
}
