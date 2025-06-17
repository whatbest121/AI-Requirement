import axios from 'axios';
import {
    AuthResponse,
    Conversation,
    LoginCredentials,
    RegisterCredentials,
    PDFUploadResponse
} from '@/types/api';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', credentials);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const chatApi = {
    sendMessage: async (conversation: Conversation) => {
        const response = await api.post('/chat/stream', conversation);
        return response.data;
    },

    uploadPDF: async (file: File, userId: string, conversationId?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);
        if (conversationId) {
            formData.append('conversation_id', conversationId);
        }

        const response = await api.post<PDFUploadResponse>('/chat/upload-pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
}; 