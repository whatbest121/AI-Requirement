import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, ChevronLeft, Plus } from 'lucide-react';
import { formatDate } from '../utils/chat';
export interface ChatSidebarProps {
    isOpen: boolean;
    onToggle: (open: boolean) => void;
    conversationHistory: any[];
    conversationId: string;
    onConversationSelect: (id: string) => void;
    onNewConversation: () => void;
}
const ChatSidebar = ({
    isOpen,
    onToggle,
    conversationHistory,
    conversationId,
    onConversationSelect,
    onNewConversation
}: ChatSidebarProps) => {
    return (
        <div className={`${isOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white shadow-xl border-r border-gray-200 flex flex-col min-h-0`}>
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <History className="w-5 h-5" />
                        ประวัติการสนทนา
                    </h2>
                    <Button
                        onClick={() => onToggle(false)}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </div>
                <Button
                    onClick={onNewConversation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    บทสนทนาใหม่
                </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-120px)] flex-1 min-h-0">
                <div className="p-2">
                    {conversationHistory.map((conversation) => (
                        <div
                            key={conversation.conversation_id}
                            onClick={() => onConversationSelect(conversation.conversation_id)}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${conversationId === conversation.conversation_id
                                ? 'bg-blue-100 border-blue-300 border'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm text-gray-900 truncate">
                                        {conversation.conversation_id}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                        {conversation.messages && conversation.messages.length > 0
                                            ? conversation.messages[conversation.messages.length - 1].content
                                            : ''}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {conversation.messages ? conversation.messages.length : 0} ข้อความ
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                            {conversation.creatAt
                                                ? formatDate(typeof conversation.creatAt === 'string' ? conversation.creatAt : conversation.creatAt.toISOString())
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatSidebar;