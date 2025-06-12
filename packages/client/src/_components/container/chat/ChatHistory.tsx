"use client";

import React, { useState, useEffect } from 'react';
import { Box, Text, ScrollArea, Button, Flex, Separator } from '@radix-ui/themes';
import { PlusIcon, ChatBubbleIcon, TrashIcon } from '@radix-ui/react-icons';
import { useChat } from './ChatContext';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistoryProps {
  width?: string;
  height?: string;
}

export function ChatHistory({ width = "100%", height = "100%" }: ChatHistoryProps) {
  const { sessionID, nextSession, messages } = useChat();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(sessionID);

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Update current session when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const sessionTitle = messages.length > 0 
        ? messages[0].text.slice(0, 30) + (messages[0].text.length > 30 ? '...' : '')
        : 'New Chat';

      setSessions(prev => {
        const existingIndex = prev.findIndex(s => s.id === currentSessionId);
        const updatedSession: ChatSession = {
          id: currentSessionId,
          title: sessionTitle,
          lastMessage: lastMessage.text.slice(0, 50) + (lastMessage.text.length > 50 ? '...' : ''),
          timestamp: new Date(),
          messageCount: messages.length
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedSession;
          return updated;
        } else {
          return [updatedSession, ...prev];
        }
      });
    }
  }, [messages, currentSessionId]);

  // Update current session ID when sessionID changes
  useEffect(() => {
    setCurrentSessionId(sessionID);
  }, [sessionID]);

  const handleNewChat = () => {
    nextSession();
  };

  const handleSessionClick = (session: ChatSession) => {
    // For now, just create a new session. In a real app, you'd load the session data
    setCurrentSessionId(session.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // If deleting current session, create a new one
    if (sessionId === currentSessionId) {
      nextSession();
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
    <Box width={width} height={height} className="flex flex-col text-xs">
      <Box className="p-4 border-b border-zinc-700">
        <Button 
          onClick={handleNewChat}
          className="w-full"
          variant="outline"
          size="2"
        >
          <PlusIcon width="16" height="16" />
          New Chat
        </Button>
      </Box>

      <ScrollArea className="flex-1 max-h-[calc(80vh-3rem)]">
        <Box className="p-2">
          {Object.entries(groupedSessions).map(([dateGroup, sessionsInGroup]) => (
            <Box key={dateGroup} className="mb-4">
              <Text size="1" weight="medium" className="text-zinc-400 px-2 py-1 block">
                {dateGroup}
              </Text>
              <Box className="space-y-1">
                {sessionsInGroup.map((session) => (
                  <Box key={session.id}>
                    <Button
                      variant={session.id === currentSessionId ? "solid" : "ghost"}
                      className="w-full justify-start text-left p-2 h-auto min-h-[3rem]"
                      onClick={() => handleSessionClick(session)}
                    >
                      <Flex direction="column" width="100%" align="start" className="min-w-0">
                        <Flex align="center" justify="between" width="100%">
                          <Flex align="center" gap="2" className="min-w-0 flex-1">
                            <ChatBubbleIcon width="14" height="14" className="flex-shrink-0" />
                            <Text size="2" weight="medium" className="truncate">
                              {session.title}
                            </Text>
                          </Flex>
                          <Button
                            variant="ghost"
                            size="1"
                            className="opacity-0 group-hover:opacity-100 flex-shrink-0"
                            onClick={(e) => handleDeleteSession(session.id, e)}
                          >
                            <TrashIcon width="12" height="12" />
                          </Button>
                        </Flex>
                        <Text size="1" className="text-zinc-500 truncate w-full text-left">
                          {session.lastMessage}
                        </Text>
                        <Text size="1" className="text-zinc-600">
                          {session.messageCount} messages
                        </Text>
                      </Flex>
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
          
          {sessions.length === 0 && (
            <Box className="p-4 text-center">
              <Text size="2" className="text-zinc-500">
                No chat history yet. Start a new conversation to see it here.
              </Text>
            </Box>
          )}
        </Box>
      </ScrollArea>
    </Box>
  );
} 