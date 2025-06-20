import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';
import { formatFileSize } from '../utils/chat';
import { UploadedFile } from '../types/chat';
interface FileUploadAreaProps {
    uploadedFiles: UploadedFile[];
    onRemoveFile: (fileId: number) => void;
}
const FileUploadArea = ({
    uploadedFiles,
    onRemoveFile
}: FileUploadAreaProps) => {
    if (uploadedFiles.length === 0) return null;

    return (
        <div className="border-t border-gray-200 p-4 bg-gray-50/50">
            <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border"
                    >
                        <FileText className="w-4 h-4" />
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                                {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                            </div>
                        </div>
                        <Button
                            onClick={() => onRemoveFile(file.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUploadArea;