import { fetchWithAuth } from '@/lib/treaty'

interface UploadPdfOptions {
    file: File
    content: string
    conversationId?: string
    setNewConversationId: (id: string) => void
    setAiAnswering: (val: { isLoading: boolean; content: string }) => void
    setChatMessage: (val: string) => void
    resetAiAnswer: () => void
}

export async function uploadPdfStream({
    file,
    content,
    conversationId,
    setNewConversationId,
    setAiAnswering,
    setChatMessage,
    resetAiAnswer,
}: UploadPdfOptions) {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('content', content)
    formData.append('conversation_id', conversationId || '')
    setAiAnswering({ isLoading: true, content: '' })

    try {
        const res = await fetchWithAuth('/api/v1/ai/upload-pdf/', {
            method: 'POST',
            body: formData,
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
            for (const line of lines) {
                try {
                    const json = JSON.parse(line)
                    if (!newConversationId && !conversationId && json.conversation_id) {
                        newConversationId = json.conversation_id
                    }
                    answer += json.content ?? ''
                    setAiAnswering({ isLoading: true, content: answer })
                } catch { }
            }
        }
        setAiAnswering({ isLoading: false, content: answer })

        if (!conversationId && newConversationId) {
            setNewConversationId(newConversationId)
        }
    } catch (error) {
        resetAiAnswer()
        setChatMessage('')
    }
} 