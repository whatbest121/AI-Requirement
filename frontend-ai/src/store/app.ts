import { create } from "zustand"
interface State {
	aiAnswering: {
		content: string
		isLoading: boolean

	}
	chatMessage: string
}
interface Action {
	setChatMessage: (s: string) => void
	setAiAnswering: (
		s:
			| State["aiAnswering"]
			| ((s: State["aiAnswering"]) => State["aiAnswering"]),
	) => void
	set: (s: State | ((s: State) => State)) => void
}

export const useAppStore = create<State & Action>()((setState) => ({
	aiAnswering: {
		isLoading: false,
		content: "",
	},
	chatMessage: "",

	setChatMessage: (x) => {
		return setState((state) => {
			return { ...state, chatMessage: x }
		})
	},
	setAiAnswering: (x) => {
		return setState((state) => {
			return {
				...state,
				aiAnswering: typeof x === "function" ? x(state.aiAnswering) : x,
			}
		})
	},
	set: (x) => {
		return setState((state) => {
			return typeof x === "function" ? x(state) : x
		})
	},
}))
