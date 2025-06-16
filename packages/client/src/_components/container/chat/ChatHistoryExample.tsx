"use client";

import React, { useState, useEffect } from 'react';
import { Box, Text, ScrollArea, Button, Flex } from '@radix-ui/themes';
import { PlusIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { FileText, Trash2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistoryExampleProps {
  width?: string;
  height?: string;
}

// Mock data for demonstration
const createMockSessions = (): ChatSession[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'How to implement authentication in React?',
      lastMessage: 'Thanks for the detailed explanation about JWT tokens and secure storage practices.',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      messageCount: 8
    },
    {
      id: '2',
      title: 'Best practices for API design',
      lastMessage: 'What about rate limiting and versioning strategies?',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      messageCount: 12
    },
    {
      id: '3',
      title: 'Database optimization techniques',
      lastMessage: 'The indexing strategy you suggested improved performance by 40%!',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
      messageCount: 15
    },
    {
      id: '4',
      title: 'React state management comparison',
      lastMessage: 'When should I choose Redux over Zustand?',
      timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000), // Yesterday
      messageCount: 6
    },
    {
      id: '5',
      title: 'TypeScript advanced patterns',
      lastMessage: 'The conditional types example was very helpful.',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      messageCount: 10
    },
    {
      id: '6',
      title: 'Docker containerization guide',
      lastMessage: 'Multi-stage builds reduced image size significantly.',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      messageCount: 7
    },
    {
      id: '7',
      title: 'GraphQL vs REST API',
      lastMessage: 'The performance comparison was eye-opening.',
      timestamp: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      messageCount: 9
    },
    {
      id: '8',
      title: 'Machine Learning basics for developers',
      lastMessage: 'Can you recommend some beginner-friendly datasets?',
      timestamp: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      messageCount: 20
    }
  ];
};

export function ChatHistoryExample({ width = "100%", height = "100%" }: ChatHistoryExampleProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(createMockSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: 'Start a new conversation...',
      timestamp: new Date(),
      messageCount: 0
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSessionClick = (session: ChatSession) => {
    setCurrentSessionId(session.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));

    // If deleting current session, select the first remaining session
    if (sessionId === currentSessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: Record<string, ChatSession[]> = {};

    sessions.forEach(session => {
      const dateKey = formatDateGroup(session.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    return groups;
  };

  const formatDateGroup = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (sessionDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else if (now.getTime() - sessionDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return 'Previous 7 days';
    } else if (now.getTime() - sessionDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return 'Previous 30 days';
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
  };

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <Box className="flex flex-col bg-zinc-900 text-white h-[calc(80vh-3rem)] w-full rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-4 mb-2 border-b border-zinc-700">
        <Text size="3" weight="bold" className="mb-3 block">
          Chat History
        </Text>
        <Button
          onClick={handleNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700"
          variant="solid"
          size="2"
        >
          <FileText width="16" height="16" />
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea type="always" scrollbars="vertical" className="flex-1">
        <Box className="">
          {Object.entries(groupedSessions).map(([dateGroup, sessionsInGroup]) => (
            <Box key={dateGroup} className="mb-2">
              <Text className="text-zinc-400 text-[0.5rem] font-semibold px-2 py-1  block uppercase tracking-wider">
                {dateGroup}
              </Text>
              <div className="w-[95%] wrap-anywhere ">
                {sessionsInGroup.map((session) => (
                  <div key={session.id} className={` cursor-pointer  justify-start text-left mx-4  mb-2  p-2 h-auto min-h-[4rem] rounded-lg transition-all 
                    ${session.id === currentSessionId
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-zinc-700'}
                  `}>
                    <div className="flex items-center justify-start gap-2 mb-0.5">
                      <ChatBubbleIcon width="16" height="16" className="flex-shrink-0 text-zinc-400" />
                      <Text className="text-[13px] truncate tracking-wider">
                        {`${session.title}`}
                      </Text>
                      <div className='flex-1' />
                      <Button
                        variant="ghost"
                        size="1"
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 "
                        onClick={(e) => handleDeleteSession(session.id, e)}
                      >
                        <Trash2 width="12" height="12" />
                      </Button>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-1 ">
                      {session.lastMessage}
                    </p>
                    <Flex align="center" justify="between" width="100%" className='text-[9px]'>
                      <Text  className="text-zinc-400">
                        {session.messageCount} messages
                      </Text>
                      <Text size="1" className="text-zinc-400">
                        {session.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </Flex>

                  </div>
                ))}
              </div>
            </Box>
          ))}
        </Box>
      </ScrollArea>

    
    </Box>
  );
} 