'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSendMessage, useUploadPDF } from '@/services/chat';
import { Message, Conversation } from '@/types/api';

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [conversationId] = useState(uuidv4());
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const userId = 'user_id'; // TODO: replace with real user id from auth

    const sendMessageMutation = useSendMessage();
    const uploadPDFMutation = useUploadPDF(userId, conversationId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, newMessage]);

        const conversation: Conversation = {
            conversation_id: conversationId,
            messages: [...messages, newMessage],
        };

        sendMessageMutation.mutate(conversation, {
            onSuccess: (data) => {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
            },
        });
        setInput('');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadPDFMutation.mutate(file, {
                onSuccess: (data) => {
                    // หลังอัปโหลด PDF สำเร็จ ส่งข้อความไป chatStream
                    const conversation: Conversation = {
                        conversation_id: conversationId,
                        messages: [
                            {
                                role: 'user',
                                content: `I've uploaded a PDF file: ${data.filename}. Please analyze it.`,
                            },
                        ],
                    };
                    sendMessageMutation.mutate(conversation, {
                        onSuccess: (data) => {
                            setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
                        },
                    });
                },
            });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex-1 p-4">
                <Card className="h-full">
                    <ScrollArea ref={scrollRef} className="h-[calc(100vh-200px)] p-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${message.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadPDFMutation.isPending}
                    >
                        {uploadPDFMutation.isPending ? 'Uploading...' : 'Upload PDF'}
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={sendMessageMutation.isPending}>
                        {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                    </Button>
                </form>
            </div>
        </div>
    );
} 