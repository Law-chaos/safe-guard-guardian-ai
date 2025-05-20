
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandDialog } from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import ChatbotCharacter from './chatbot-character';
import ChatbotMessages from './chatbot-messages';
import ChatbotMessageInput from './chatbot-message-input';
import ChatbotCommandList from './chatbot-command-list';
import { useChatbotProcessor } from '@/hooks/use-chatbot-processor';
import { useChatbotCommands, CommandType } from '@/lib/chatbot-commands';

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { conversation, loading, processMessage } = useChatbotProcessor();
  const commands = useChatbotCommands();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCommand = (command: CommandType) => {
    setOpen(false);
    if (command.type === 'navigation' && command.path) {
      navigate(command.path);
      toast({
        title: "Navigating",
        description: `Going to ${command.name}`,
      });
    } else if (command.type === 'action' && command.action) {
      command.action();
    }
  };

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50">
        <ChatbotCharacter 
          isExpanded={open}
          onToggleExpand={() => setOpen(!open)}
        />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-col h-[80vh]">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-safeguard-primary rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
              <h2 className="font-semibold">SafeGuard Assistant</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)}
              className="focus:outline-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ChatbotMessages conversation={conversation} loading={loading} />
          
          <ChatbotMessageInput onSendMessage={processMessage} loading={loading} />
          
          <ChatbotCommandList commands={commands} onSelectCommand={handleCommand} />
        </div>
      </CommandDialog>
    </>
  );
}
