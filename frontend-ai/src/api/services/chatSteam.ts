import { fetchWithAuth } from '@/lib/treaty'
import { safeJson } from '@/lib/utils'

interface ConversationInput {
    conversation_id?: string
    content: string
}

interface StreamChatOptions {
    conversationId?: string
    setNewConversationId: (id: string) => void
    setAiAnswering: (val: { isLoading: boolean; content: string }) => void
    setChatMessage: (val: string) => void
    chatMessage: string
    resetAiAnswer: () => void
    newConversationId: string
}

export async function streamChat({
    resetAiAnswer,
    setAiAnswering,
    setChatMessage,
    setNewConversationId,
    conversationId,
    chatMessage,
    newConversationId: newConversationIds
}: StreamChatOptions) {
    console.log("🚀 ~ conversationId:", conversationId)
    if (chatMessage === '') return

    const conversation: ConversationInput = {
        content: chatMessage,
        ...(conversationId ? { conversation_id: conversationId } : newConversationIds && { conversation_id: newConversationIds }),
    }

    setAiAnswering({ isLoading: true, content: '' })

    try {
        const res = await fetchWithAuth('/api/v1/ai/chatStream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conversation),
        })

        if (!res.body) throw new Error('No stream body returned')

        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')

        let answer = ''
        let newConversationId = ''
        let buffer = ''

        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''
            console.log(1)
            for (const line of lines) {
                const json = safeJson(line)
                if (!json) continue
                if (!newConversationId && !conversationId && json.conversation_id) {
                    newConversationId = json.conversation_id
                }
                answer += json.content ?? ''
                setAiAnswering({ isLoading: true, content: answer })
            }
        }

        if (!conversationId && newConversationId) {
            console.log(1)
            setNewConversationId(newConversationId)
        }
    } catch (error) {
        resetAiAnswer()
        setChatMessage('')
    }
}
