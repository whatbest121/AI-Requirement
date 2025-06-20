import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip } from 'lucide-react';
import FileUploadArea from './FileUploadArea';
import { UploadedFile } from '../types/chat';
export interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    uploadedFiles: UploadedFile[];
    onFileUpload: (files: File[]) => void;
    onRemoveFile: (fileId: number) => void;
    isLoading: boolean;
}
const ChatInput = ({
    value,
    onChange,
    onSend,
    uploadedFiles,
    onFileUpload,
    onRemoveFile,
    isLoading
}: ChatInputProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        onFileUpload(files);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <>
            <FileUploadArea
                uploadedFiles={uploadedFiles}
                onRemoveFile={onRemoveFile}
            />

            <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                <div className="flex gap-3 items-end">
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                        className="p-2"
                        disabled={isLoading}
                    >
                        <Paperclip className="w-4 h-4" />
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <div className="flex-1">
                        <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="พิมพ์ข้อความของคุณ..."
                            className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        onClick={onSend}
                        disabled={(!value.trim() && uploadedFiles.length === 0) || isLoading}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                    กด Enter เพื่อส่งข้อความ • Shift + Enter เพื่อขึ้นบรรทัดใหม่ • คลิค 📎 เพื่อแนบไฟล์
                </div>
            </div>
        </>
    );
};

export default ChatInput;