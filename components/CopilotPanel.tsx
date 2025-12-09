
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Send, Bot, User, Loader2, Sparkles, Eraser } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

interface CopilotPanelProps {
  onClose: () => void;
}

const CopilotPanel: React.FC<CopilotPanelProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: '你好！我是图钉 AI 助手。有什么我可以帮你的吗？我可以协助你进行数据查询、规则解释或流程诊断。' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      const prompt = inputValue;

      // Optimistic update for streaming placeholder
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isStreaming: true }]);

      const result = await ai.models.generateContentStream({
        model: model,
        contents: [
            { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
            systemInstruction: "You are an intelligent assistant for a spatial data production platform called '图钉AI' (Tuding AI). You help users with map data production, pipeline management, and quality assurance tasks. Be concise, professional, and helpful."
        }
      });

      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        // Update the specific message in state
        setMessages(prev => prev.map(m => 
            m.id === botMsgId ? { ...m, text: fullText } : m
        ));
      }
      
      // Mark streaming as done
      setMessages(prev => prev.map(m => 
        m.id === botMsgId ? { ...m, isStreaming: false } : m
      ));

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '抱歉，我现在无法连接到大脑。请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 duration-200">
      {/* Header */}
      <div className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between px-4 shrink-0 shadow-sm">
        <div className="flex items-center text-white">
          <Sparkles size={16} className="mr-2" />
          <span className="font-bold text-sm">AI Copilot</span>
        </div>
        <div className="flex items-center space-x-1">
            <button 
                onClick={() => setMessages([])} 
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                title="清空对话"
            >
                <Eraser size={14} />
            </button>
            <button 
                onClick={onClose} 
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
                <X size={16} />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mx-2 mt-1 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100 text-blue-600'}`}>
                {msg.role === 'user' ? <User size={12} className="text-slate-500" /> : <Bot size={14} />}
              </div>
              <div className={`p-2.5 text-xs leading-relaxed rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none border border-gray-100' 
                  : 'bg-blue-600 text-white rounded-tl-none'
              }`}>
                {msg.text}
                {msg.isStreaming && <span className="inline-block w-1.5 h-3 ml-1 align-middle bg-white/50 animate-pulse"></span>}
              </div>
            </div>
          </div>
        ))}
        {isLoading && !messages.some(m => m.isStreaming) && (
             <div className="flex justify-start">
                 <div className="flex max-w-[85%] flex-row">
                     <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mx-2 bg-blue-100 text-blue-600">
                         <Bot size={14} />
                     </div>
                     <div className="p-2.5 text-xs rounded-2xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center text-slate-500">
                         <Loader2 size={12} className="animate-spin mr-2" /> 思考中...
                     </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入指令或询问..."
            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-xs text-slate-800"
            disabled={isLoading && !messages.some(m => m.isStreaming)}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="text-[9px] text-center text-slate-300 mt-1.5">
            Powered by Gemini 2.5 Flash
        </div>
      </div>
    </div>
  );
};

export default CopilotPanel;
