export type Message = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    files?: UploadedFile[];
  };
  
  export type UploadedFile = {
    id: number;
    file: File;
    name: string;
    size: number;
    type: string;
  };