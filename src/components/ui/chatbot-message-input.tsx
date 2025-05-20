
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotMessageInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const ChatbotMessageInput: React.FC<ChatbotMessageInputProps> = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="border-t p-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message SafeGuard Assistant..."
        />
        <Button type="submit" disabled={!input.trim() || loading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatbotMessageInput;
