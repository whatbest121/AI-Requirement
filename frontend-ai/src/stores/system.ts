import { getStoredToken, setStoredToken } from "@/authentication/fn"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface State {
	auth: {
		token?: string | null
		user?: { username: string }
	}
	TerminalBox: {
		fontSize: number
	}
}

export interface Action {
	setSystem: (x: Partial<State> | ((x: State) => State)) => void
	setLogout: () => Promise<void>
	setLogin: (
		auth: Required<Pick<State["auth"], "token" | "user">>,
	) => Promise<void>
}

const createStore = () => {
	return create<State & Action>()(
		devtools(
			persist(
				(set) => ({
					auth: {
						token: typeof window !== 'undefined' ? getStoredToken() : null,
						user: undefined,
					},
					TerminalBox: {
						fontSize: 0.85,
					},
					setSystem: (prev) =>
						set((state) => ({
							...state,
							...(typeof prev === "function" ? prev(state) : prev),
						})),
					setLogout: async () =>
						set((state) => {
							setStoredToken(null)
							return {
								...state,
								auth: { token: undefined, user: undefined },
							}
						}),

					setLogin: async ({ token, user }) =>
						set((state) => {
							setStoredToken(token)
							return { ...state, auth: { token, user } }
						}),
				}),
				{ name: "systemStore" },
			),
		),
	)
}

export const useSystemStore = typeof window === 'undefined' ? createStore() : createStore()
