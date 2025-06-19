import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  Upload, 
  Paperclip, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  File,
  X
} from 'lucide-react';

const ChatDashboard = () => {
  const [messages, setMessages] = useState([
    {
      "role": "user",
      "content": "hi",
      "timestamp": "2025-06-20T00:35:56.426846"
    },
    {
      "role": "assistant",
      "content": "สวัสดีครับ/ค่ะ! ยินดีช่วยเหลือคุณครับ รบกวนแจ้งข้อมูลเพิ่มเติมเกี่ยวกับโครงการของคุณ เช่น\n\n- ข้อมูลบริษัท (ลักษณะธุรกิจ, ขนาดบริษัท)\n- ปัญหาหรือความท้าทายทางธุรกิจที่ต้องการแก้ไข\n- งบประมาณที่มีสำหรับโครงการ\n- วัตถุประสงค์หรือเป้าหมายของโครงการ\n\nเพื่อที่ผม/ฉันจะได้ช่วยวิเคราะห์และให้คำแนะนำที่เหมาะสมได้ครับ/ค่ะ",
      "timestamp": "2025-06-20T00:36:01.353168"
    },
    {
      "role": "user",
      "content": "ขอบคุณครับ ผมสนใจเรื่องการใช้ AI ในธุรกิจ",
      "timestamp": "2025-06-20T00:36:11.381998"
    },
    {
      "role": "assistant",
      "content": "ดีมากครับ! การใช้ AI ในธุรกิจเป็นเทรนด์ที่กำลังเติบโตอย่างรวดเร็ว มีหลายด้านที่สามารถนำมาประยุกต์ใช้ได้ เช่น:\n\n• การจัดการข้อมูลลูกค้า (Customer Data Management)\n• ระบบแชทบอทสำหรับการบริการลูกค้า\n• การวิเคราะห์พฤติกรรมผู้บริโภค\n• การคาดการณ์ยอดขายและความต้องการ\n\nคุณสนใจด้านไหนเป็นพิเศษครับ?",
      "timestamp": "2025-06-20T00:36:15.361826"
    }
  ]);
  
  const [conversationHistory, setConversationHistory] = useState([
    {
      "conversation_id": "a1957567-0fc5-41eb-bfb8-640ed8c434b6",
      "user_id": "68541d50aaa21ca46521be34",
      "title": "การใช้ AI ในธุรกิจ",
      "last_message": "คุณสนใจด้านไหนเป็นพิเศษครับ?",
      "timestamp": "2025-06-20T00:36:15.361826",
      "message_count": 4
    },
    {
      "conversation_id": "b2846789-1ab2-42cd-8def-123456789abc",
      "user_id": "68541d50aaa21ca46521be34",
      "title": "ปรึกษาเรื่องการตลาดออนไลน์",
      "last_message": "ขอบคุณสำหรับคำแนะนำครับ",
      "timestamp": "2025-06-19T14:25:30.123456",
      "message_count": 12
    },
    {
      "conversation_id": "c3957890-2bc3-43de-9fgh-234567890def",
      "user_id": "68541d50aaa21ca46521be34",
      "title": "วิเคราะห์ข้อมูลขาย",
      "last_message": "รายงานนี้มีประโยชน์มากครับ",
      "timestamp": "2025-06-18T09:15:45.987654",
      "message_count": 8
    },
    {
      "conversation_id": "d4068901-3cd4-44ef-afhi-345678901ghi",
      "user_id": "68541d50aaa21ca46521be34",
      "title": "สอบถามระบบ CRM",
      "last_message": "ได้ข้อมูลครบแล้วครับ",
      "timestamp": "2025-06-17T16:40:20.456789",
      "message_count": 6
    }
  ]);

  const [currentConversationId, setCurrentConversationId] = useState("a1957567-0fc5-41eb-bfb8-640ed8c434b6");
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'วันนี้';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'เมื่อวาน';
    } else {
      return date.toLocaleDateString('th-TH', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <File className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;

    let messageContent = newMessage;
    
    // Add file attachments info to message
    if (uploadedFiles.length > 0) {
      const fileNames = uploadedFiles.map(f => f.name).join(', ');
      messageContent += `\n\n📎 ไฟล์แนบ: ${fileNames}`;
    }

    const userMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setUploadedFiles([]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = 'ขอบคุณสำหรับคำถามครับ! ฉันจะช่วยตอบคำถามของคุณให้ดีที่สุด';
      
      if (userMessage.files && userMessage.files.length > 0) {
        responseContent += `\n\nฉันได้รับไฟล์ที่คุณส่งมาแล้ว (${userMessage.files.length} ไฟล์) กำลังประมวลผล...`;
      }
      
      responseContent += '\n\nมีอะไรอื่นที่อยากทราบเพิ่มเติมไหมครับ?';

      const assistantMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleConversationSelect = (conversationId) => {
    setCurrentConversationId(conversationId);
    // In real app, you would load messages for this conversation
    // For demo, we'll keep current messages
  };

  const handleNewConversation = () => {
    const newConversationId = Date.now().toString();
    setCurrentConversationId(newConversationId);
    setMessages([]);
    // Add new conversation to history
    const newConversation = {
      conversation_id: newConversationId,
      user_id: "68541d50aaa21ca46521be34",
      title: "บทสนทนาใหม่",
      last_message: "",
      timestamp: new Date().toISOString(),
      message_count: 0
    };
    setConversationHistory(prev => [newConversation, ...prev]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white shadow-xl border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5" />
              ประวัติการสนทนา
            </h2>
            <Button
              onClick={() => setSidebarOpen(false)}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleNewConversation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            บทสนทนาใหม่
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-2">
            {conversationHistory.map((conversation) => (
              <div
                key={conversation.conversation_id}
                onClick={() => handleConversationSelect(conversation.conversation_id)}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                  currentConversationId === conversation.conversation_id
                    ? 'bg-blue-100 border-blue-300 border'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conversation.last_message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {conversation.message_count} ข้อความ
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDate(conversation.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button
                onClick={() => setSidebarOpen(true)}
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
                {messages.length} ข้อความ
              </Badge>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-hidden">
          <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0 h-full flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
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
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-800 shadow-md border border-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        
                        {/* File attachments */}
                        {message.files && message.files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.files.map((file) => (
                              <div
                                key={file.id}
                                className={`flex items-center gap-2 p-2 rounded-lg ${
                                  message.role === 'user' 
                                    ? 'bg-blue-500/20' 
                                    : 'bg-gray-200'
                                }`}
                              >
                                {getFileIcon(file.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">
                                    {file.name}
                                  </div>
                                  <div className={`text-xs ${
                                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    {formatFileSize(file.size)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div
                          className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
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
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8 border-2 border-blue-200">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border"
                      >
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFile(file.id)}
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
              )}
              
              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                <div className="flex gap-3 items-end">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="p-2"
                    disabled={isTyping}
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
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="พิมพ์ข้อความของคุณ..."
                      className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && uploadedFiles.length === 0) || isTyping}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  กด Enter เพื่อส่งข้อความ • Shift + Enter เพื่อขึ้นบรรทัดใหม่ • คลิก 📎 เพื่อแนบไฟล์
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;