import { useMutation } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import { Conversation, PDFUploadResponse, Message } from '@/types/api';

type ErrorResponse = Error & {
    response?: {
        data?: {
            detail?: string
        }
    }
};

export function useSendMessage() {
    return useMutation<Message, ErrorResponse, Conversation>({
        mutationFn: chatApi.sendMessage,
    });
}

export function useUploadPDF(userId: string, conversationId?: string) {
    return useMutation<PDFUploadResponse, ErrorResponse, File>({
        mutationFn: (file: File) => chatApi.uploadPDF(file, userId, conversationId),
    });
} 