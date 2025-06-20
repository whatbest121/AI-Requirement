import { useAppStore } from '@/store/app'
import { useConversationId } from '@/store/conversationID'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { streamChat } from './chatSteam'
import { useCallback } from 'react'
import { QKey } from './history'

export const useChatStream = () => {
    const queryClient = useQueryClient()

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
        onSuccess: () => {
            console.log(11111111)
            queryClient.invalidateQueries({ queryKey: [QKey] })
        },

    })
}



