import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ChevronRight } from 'lucide-react';
interface ChatHeaderProps {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
    messageCount: number;
}
const ChatHeader = ({
    sidebarOpen,
    onToggleSidebar,
    messageCount
}: ChatHeaderProps) => {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
                {!sidebarOpen && (
                    <Button
                        onClick={onToggleSidebar}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <MessageCircle className="text-blue-600" />
                    Chat Dashboard
                </h1>
                <div className="ml-auto">
                    <Badge variant="outline" className="text-sm">
                        {messageCount} ข้อความ
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;