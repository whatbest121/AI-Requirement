import { ServerError } from "@/errors"
import { fetchWithAuth } from "@/lib/treaty"
import { sleep } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"

export type Message = {
	role: 'user' | 'assistant';
	content: string;
	timestamp: string; // ISO datetime string
};

export type ExtractedInfo = {
	COMPANY_PROFILE: string | null;
	BUSINESS_PROBLEM: string | null;
	BUDGET: string | null;
	PURPOSE_OF_PROJECTS: string | null;
};

export type ChatHistory = {
	id: string;
	user_id: string;
	conversation_id: string;
	messages: Message[];
	creatAt: Date
};
export const QKey = "useHistory"
async function History() {
	await sleep(500)
	try {
		const res = await fetchWithAuth('/api/v1/ai/historyConversation', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}).then<ChatHistory[]>((res) => res.json());
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
export default function useHistory() {
	return useQuery({
		queryKey: [QKey],
		queryFn: () => History(),
		refetchOnWindowFocus: true

	})
}
