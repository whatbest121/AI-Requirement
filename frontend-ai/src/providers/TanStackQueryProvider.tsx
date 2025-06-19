import { ApiError, ServerError, UnauthorizedError } from "@/errors"
import { toast } from "@/hooks/useToast"
import { useSystemStore } from "@/stores/system"
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type React from "react"

interface TanStackQueryProviderProps {
	children: React.ReactNode
}

const defaultFailureCount = 0

export default function TanStackQueryProvider({
	children,
}: TanStackQueryProviderProps) {
	const { setLogout } = useSystemStore()
	const router = useRouter();
	async function logout() {
		setLogout()
		router.push("/login")
	}

	function retry(failureCount: number, error: Error) {
		if (error instanceof UnauthorizedError) {
			error.toast()
			logout()
			return false
		}
		return failureCount < defaultFailureCount
	}

	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onSuccess: () => { },
			onError: onErrorMiddleware(),
		}),
		mutationCache: new MutationCache({
			onSuccess: () => { },
			onError: onErrorMiddleware(),
		}),
		defaultOptions: {
			queries: {
				retry,
			},
			mutations: {
				retry,
			},
		},
	})
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
}

function onErrorMiddleware() {
	return (error: unknown) => {
		if (error instanceof ApiError) {
			return error.toast()
		}

		if (error instanceof ServerError) {
			return error.toast()
		}
		if (error instanceof Error) {
			return toast({
				variant: "destructive",
				title: "Error",
				description: error.message,
			})
		}
	}
}
