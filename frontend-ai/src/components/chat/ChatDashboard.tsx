import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import useHistory, { ChatHistory } from '@/api/services/history';
import useHistoryChat from '@/api/services/historyChat';
import { useChatStream } from '@/api/services/useChat';
import { useAppStore } from '@/store/app';
import { useConversationId } from '@/store/conversationID';
import { useUploadPdfStream } from '@/api/services/useUploadPdfStream';
import { File, FileText } from 'lucide-react';
// Components
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';

// Types
import { Message, UploadedFile } from './types/chat';

const ChatDashboard = () => {
    // API Hooks
    const { data } = useHistory();
    const { mutate } = useHistoryChat();
    const { mutate: sentMutate } = useChatStream();
    const { mutate: uploadPdfMutate } = useUploadPdfStream();


    // Store Hooks
    const { setChatMessage, aiAnswering } = useAppStore();
    const { conversationId, setConversationId } = useConversationId();

    // Local State
    const [conversationHistory, setConversationHistory] = useState<ChatHistory[]>(data ?? []);
    const [newMessage, setNewMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    // Effects
    useEffect(() => {
        if (data) {
            setConversationHistory(data);
        }
    }, [data]);

    useEffect(() => {
        if (historyMessages.length > 0) {
            setAllMessages(historyMessages);
        } else {
            setAllMessages([]);
        }
    }, [historyMessages]);

    useEffect(() => {
        if (aiAnswering.isLoading && aiAnswering.content) {
            setAllMessages(prev => {
                if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
                    return [
                        ...prev.slice(0, -1),
                        { ...prev[prev.length - 1], content: aiAnswering.content }
                    ];
                }
                return [
                    ...prev,
                    {
                        role: 'assistant',
                        content: aiAnswering.content,
                        timestamp: new Date().toISOString()
                    }
                ];
            });
        }
    }, [aiAnswering.content, aiAnswering.isLoading]);

    // Handlers
    const handleFileUpload = (files: File[]) => {
        const newFiles = files.map((file: File) => ({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const handleRemoveFile = (fileId: number) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() && uploadedFiles.length === 0) return;

        let messageContent = newMessage;
        if (uploadedFiles.length > 0) {
            const fileNames = uploadedFiles.map(f => f.name).join(', ');
            messageContent += `\n\n📎 ไฟล์แนบ: ${fileNames}`;
        }

        setAllMessages(prev => [
            ...prev,
            {
                role: 'user',
                content: messageContent,
                timestamp: new Date().toISOString(),
                files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
            }
        ]);

        setChatMessage(messageContent);
        setConversationId(conversationId);

        if (uploadedFiles.length > 0) {
            uploadPdfMutate(uploadedFiles[0].file);
        } else {
            sentMutate();
        }

        setNewMessage('');
        setUploadedFiles([]);
    };

    const handleConversationSelect = (cid: string) => {
        setConversationId(cid);
        mutate(cid, {
            onSuccess: (data) => {
                setHistoryMessages(data.messages || []);
            },
        });
    };

    const handleNewConversation = () => {
        setConversationId("");
        setHistoryMessages([]);
        const newConversation: ChatHistory = {
            id: "",
            conversation_id: "",
            user_id: "",
            messages: [],
            creatAt: new Date(),
        };
        setConversationHistory(prev => [newConversation, ...prev]);
    };

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Sidebar */}
            <ChatSidebar
                isOpen={sidebarOpen}
                onToggle={setSidebarOpen}
                conversationHistory={conversationHistory}
                conversationId={conversationId}
                onConversationSelect={handleConversationSelect}
                onNewConversation={handleNewConversation}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <ChatHeader
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={handleToggleSidebar}
                    messageCount={allMessages.length}
                />

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-hidden min-h-0">
                    <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm flex flex-col min-h-0">
                        <CardContent className="p-0 h-full flex flex-col min-h-0">
                            <ChatMessages
                                messages={allMessages}
                                isLoading={aiAnswering.isLoading}
                            />

                            <ChatInput
                                value={newMessage}
                                onChange={setNewMessage}
                                onSend={handleSendMessage}
                                uploadedFiles={uploadedFiles}
                                onFileUpload={handleFileUpload}
                                onRemoveFile={handleRemoveFile}
                                isLoading={aiAnswering.isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ChatDashboard;