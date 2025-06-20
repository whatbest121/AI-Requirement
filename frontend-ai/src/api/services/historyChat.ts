import { ServerError } from "@/errors"
import { fetchWithAuth } from "@/lib/treaty"
import { sleep } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { ChatHistory, ExtractedInfo } from "./history"

type  Extends = ChatHistory & ExtractedInfo
async function historyChat(conversation_id: string) {
	await sleep(500)
	try {
		const res = await fetchWithAuth('/api/v1/ai/historyChat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({conversation_id}),
		}).then<Extends>((res) => res.json());
		return res
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Failed to fetch") {
				throw new ServerError()
			}
			throw error
		}
		throw error
	}
}
export default function useHistoryChat() {
	return useMutation({
		mutationFn: historyChat,
		retry: false,
	})
}
