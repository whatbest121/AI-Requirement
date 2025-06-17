export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string | null;
}

export interface Conversation {
    conversation_id: string;
    messages: Message[];
}

export interface ExtractedInfo {
    COMPANY_PROFILE: string | null;
    BUSINESS_PROBLEM: string | null;
    BUDGET: string | null;
    PURPOSE_OF_PROJECTS: string | null;
}

export interface PDFUploadResponse {
    filename: string;
    user_id: string;
    conversation_id: string;
    extracted_text: string;
    extracted_info: ExtractedInfo;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    email: string;
} 