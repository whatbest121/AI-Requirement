import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, FileText, User } from 'lucide-react';
import { formatTime, formatFileSize } from '../utils/chat';
import { Message } from '../types/chat';
interface MessageBubbleProps {
    message: Message;
    index: number;
}
const MessageBubble = ({ message, index }: MessageBubbleProps) => {
    const hasFiles = (msg: any): msg is Message => Array.isArray(msg.files);

    return (
        <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
        >
            {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 border-2 border-blue-200">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="w-4 h-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-800 shadow-md border border-gray-200'
                    }`}
            >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                </div>

                {/* File attachments */}
                {hasFiles(message) && message.files && message.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {message.files.map((file) => (
                            <div
                                key={file.id}
                                className={`flex items-center gap-2 p-2 rounded-lg ${message.role === 'user'
                                    ? 'bg-blue-500/20'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium truncate">
                                        {file.name}
                                    </div>
                                    <div
                                        className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}
                                    >
                                        {formatFileSize(file.size)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div
                    className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                >
                    {formatTime(message.timestamp)}
                </div>
            </div>

            {message.role === 'user' && (
                <Avatar className="w-8 h-8 border-2 border-blue-200">
                    <AvatarFallback className="bg-blue-600 text-white">
                        <User className="w-4 h-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

export default MessageBubble;