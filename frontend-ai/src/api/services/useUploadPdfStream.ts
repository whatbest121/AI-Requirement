import { useAppStore } from '@/store/app'
import { useConversationId } from '@/store/conversationID'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadPdfStream } from './uploadPdfStream'
import { useCallback } from 'react'
import { QKey } from './history'

export const useUploadPdfStream = () => {
    const queryClient = useQueryClient()
    const { conversationId, setNewConversationId } = useConversationId()
    const { chatMessage, setChatMessage, setAiAnswering } = useAppStore()
    const resetAiAnswer = useCallback(
        () => setAiAnswering({ isLoading: false, content: '' }),
        [setAiAnswering]
    )

    return useMutation({
        mutationFn: (file: File) =>
            uploadPdfStream({
                file,
                content: chatMessage,
                conversationId,
                setNewConversationId,
                setAiAnswering,
                setChatMessage,
                resetAiAnswer,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QKey] })
        },
    })
} 