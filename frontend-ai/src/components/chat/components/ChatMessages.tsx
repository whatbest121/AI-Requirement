import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Message } from '../types/chat';

interface ChatMessagesProps {
    messages: Message[];
    isLoading: boolean;
}

const ChatMessages = ({
    messages,
    isLoading
}: ChatMessagesProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <ScrollArea className="flex-1 min-h-0 p-6">
            <div className="space-y-6">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        message={message}
                        index={index}
                    />
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8 border-2 border-blue-200">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="w-4 h-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    );
};

export default ChatMessages;