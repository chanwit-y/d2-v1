import React, { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useChat } from './ChatContext';
import { Source } from './@types';

interface ChatMessageProps {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  streamingSpeed?: number;
  streamingDelay?: number;
  onStreamingComplete?: () => void;
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
  sources?: Source[];
  feedbackDetail?: {
    contentIssue: string;
    details: string;
  };
}

interface ChunkState {
  displayedText: string;
  isComplete: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  text,
  sender,
  timestamp,
  isStreaming = false,
  streamingSpeed = 2,
  streamingDelay = 50,
  onStreamingComplete,
  onFeedback,
  sources,
  feedbackDetail
}) => {
  const [feedbackID, setFeedbackID] = useState<number | null>(null);
  const [chunkState, setChunkState] = useState<ChunkState>({
    displayedText: isStreaming ? '' : text,
    isComplete: !isStreaming
  });
  const { sessionID, email, setMessageFeedback, messages } = useChat();

  const contextFeedback = messages.find((msg: any) => msg.id === id)?.feedback ?? null;

  useEffect(() => {
    if (!isStreaming || chunkState.isComplete) return;
    let currentIndex = 0;
    const totalLength = text.length;
    const streamNextChunk = () => {
      if (currentIndex >= totalLength) {
        setChunkState(prev => ({ ...prev, isComplete: true }));
        onStreamingComplete?.();
        return;
      }
      const nextIndex = Math.min(currentIndex + streamingSpeed, totalLength);
      const newDisplayedText = text.slice(0, nextIndex);
      setChunkState(prev => ({
        ...prev,
        displayedText: newDisplayedText
      }));
      currentIndex = nextIndex;
      setTimeout(streamNextChunk, streamingDelay);
    };
    const timer = setTimeout(streamNextChunk, streamingDelay);
    return () => clearTimeout(timer);
  }, [text, isStreaming, streamingSpeed, streamingDelay, onStreamingComplete, chunkState.isComplete]);

  useEffect(() => {
    setChunkState({
      displayedText: isStreaming ? '' : text,
      isComplete: !isStreaming
    });
  }, [text, isStreaming]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  

  const [likeLoading, setLikeLoading] = useState(false);

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`rounded-2xl px-4 py-2 max-w-[85%] md:max-w-[70%] relative ${sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'} break-words`}>
        {sender === 'user' ? (
          <div className="text-sm">{chunkState.displayedText}</div>
        ) : (
          <div className="prose prose-zinc dark:prose-invert text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code: ({ node, className, children, ...props }: any) => {
                  const inline = !className;
                  return !inline ? (
                    <pre className="bg-zinc-100 dark:bg-zinc-800 rounded p-2 overflow-auto text-xs font-mono my-2">
                      <code className={className} {...props}>{children}</code>
                    </pre>
                  ) : (
                    <code className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-xs font-mono" {...props}>{children}</code>
                  );
                },
              }}
            >
              {chunkState.displayedText}
            </ReactMarkdown>
          </div>
        )}
        {/* Streaming indicator */}
        {isStreaming && !chunkState.isComplete && (
          <span className="inline-block w-2 h-4 bg-zinc-400 dark:bg-zinc-200 ml-1 animate-pulse align-bottom" />
        )}
        {/* Show references only for bot messages with sources */}
        {/* {sender === 'bot' && sources && sources.length > 0 && chunkState.isComplete && (
          <div className="mt-2">
            <ChatReference sources={sources} />
          </div>
        )} */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};
