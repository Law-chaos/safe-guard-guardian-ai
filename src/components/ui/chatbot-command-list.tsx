
import React from 'react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { CommandType } from '@/lib/chatbot-commands';

interface ChatbotCommandListProps {
  commands: CommandType[];
  onSelectCommand: (command: CommandType) => void;
}

const ChatbotCommandList: React.FC<ChatbotCommandListProps> = ({ 
  commands, 
  onSelectCommand 
}) => {
  return (
    <div className="border-t">
      <h3 className="px-3 py-2 text-sm font-medium">Quick Actions</h3>
      <Command>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {commands
              .filter(cmd => cmd.type === 'navigation')
              .map((command) => (
                <CommandItem
                  key={command.name}
                  onSelect={() => onSelectCommand(command)}
                >
                  {command.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    {command.description}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            {commands
              .filter(cmd => cmd.type === 'action')
              .map((command) => (
                <CommandItem
                  key={command.name}
                  onSelect={() => onSelectCommand(command)}
                >
                  {command.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    {command.description}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default ChatbotCommandList;
