import { fetchWithAuth } from '@/lib/treaty'
import { useMutation } from '@tanstack/react-query'

interface ConversationInput {
    conversation_id?: string
    messages: {
        role: string,
        content: string,
        timestamp: Date,
    }[]
}

async function streamChat(conversation: ConversationInput) {
    const res = await fetchWithAuth('/api/v1/ai/chatStream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversation),
    })


    if (!res.body) throw new Error("No stream body returned")

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    let fullMessage = ""

    while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullMessage += chunk

        // 🔁 แสดง chunk หรือ update UI (ผ่าน callback หรือ store)
        console.log("chunk:", chunk)
    }

    return fullMessage
}

const useChatStream = () => {
    return useMutation({
        mutationFn: streamChat,
    })
}
