import { create } from "zustand"
interface State {
	conversationId: string
	newConversationId: string
}
interface Action {
	setNewConversationId: (s?: string) => void
	setConversationId: (s?: string) => void
	set: (s: State | ((s: State) => State)) => void
}

export const useConversationId = create<State & Action>()((setState) => ({
	newConversationId: "",
	conversationId: "",
	setNewConversationId: (x) => {
		return setState((state) => {
			return { ...state, newConversationId: x }
		})
	},
	setConversationId: (x) => {
		return setState((state) => {
			return { ...state, conversationId: x }
		})
	},
	set: (x) => {
		return setState((state) => {
			return typeof x === "function" ? x(state) : x
		})
	},
}))
