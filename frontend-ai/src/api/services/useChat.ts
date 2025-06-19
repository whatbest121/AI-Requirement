import { useAppStore } from '@/store/app'
import { useConversationId } from '@/store/conversationID'
import { useMutation } from '@tanstack/react-query'
import { streamChat } from './chatSteam'
import { useCallback } from 'react'

export const useChatStream = () => {
    const { conversationId, setNewConversationId, newConversationId } = useConversationId()
    const { chatMessage, setChatMessage, setAiAnswering } = useAppStore()
    const resetAiAnswer = useCallback(
        () => setAiAnswering({
            isLoading: false,
            content: "",
        }),
        [setAiAnswering],
    )
    return useMutation({
        mutationFn: () =>
            streamChat(
                {
                    newConversationId,
                    resetAiAnswer,
                    chatMessage,
                    conversationId,
                    setNewConversationId,
                    setAiAnswering,
                    setChatMessage,
                }
            ),
    })
}