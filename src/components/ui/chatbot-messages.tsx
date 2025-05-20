
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotMessagesProps {
  conversation: Message[];
  loading: boolean;
}

const ChatbotMessages: React.FC<ChatbotMessagesProps> = ({ conversation, loading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {conversation.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? 'bg-safeguard-primary text-white'
                : 'bg-gray-100'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatbotMessages;
