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
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
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
  feedbackDetail,
  fontSize = 'base'
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

  const getFontSizeClass = useCallback((baseSize: string) => {
    const sizeMap: Record<string, Record<string, string>> = {
      'xs': { 'text-xs': 'text-xs', 'text-sm': 'text-xs', 'text-base': 'text-xs', 'text-lg': 'text-sm', 'text-xl': 'text-base', 'text-2xl': 'text-lg' },
      'sm': { 'text-xs': 'text-xs', 'text-sm': 'text-sm', 'text-base': 'text-sm', 'text-lg': 'text-base', 'text-xl': 'text-lg', 'text-2xl': 'text-xl' },
      'base': { 'text-xs': 'text-sm', 'text-sm': 'text-base', 'text-base': 'text-base', 'text-lg': 'text-lg', 'text-xl': 'text-xl', 'text-2xl': 'text-2xl' },
      'lg': { 'text-xs': 'text-sm', 'text-sm': 'text-base', 'text-base': 'text-lg', 'text-lg': 'text-xl', 'text-xl': 'text-2xl', 'text-2xl': 'text-3xl' },
      'xl': { 'text-xs': 'text-base', 'text-sm': 'text-lg', 'text-base': 'text-xl', 'text-lg': 'text-2xl', 'text-xl': 'text-3xl', 'text-2xl': 'text-4xl' }
    };
    return sizeMap[fontSize]?.[baseSize] || baseSize;
  }, [fontSize]);

  const [likeLoading, setLikeLoading] = useState(false);

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2 `}>
      <div className={`rounded-2xl px-4 py-0 max-w-[85%] md:max-w-[70%] relative ${sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'} break-words`}>
        {sender === 'user' ? (
          <div className={`${getFontSizeClass('text-sm')}`}>{chunkState.displayedText}</div>
        ) : (
          <div className="prose prose-zinc dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // Headings
                h1: ({ children, ...props }) => (
                  <h1 className={`${getFontSizeClass('text-2xl')} font-bold mt-6 mb-4 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2`} {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className={`${getFontSizeClass('text-xl')} font-semibold mt-5 mb-3 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2`} {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className={`${getFontSizeClass('text-lg')} font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-100`} {...props}>
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }) => (
                  <h4 className={`${getFontSizeClass('text-base')} font-semibold mt-3 mb-2 text-zinc-900 dark:text-zinc-100`} {...props}>
                    {children}
                  </h4>
                ),
                h5: ({ children, ...props }) => (
                  <h5 className={`${getFontSizeClass('text-sm')} font-semibold mt-3 mb-2 text-zinc-900 dark:text-zinc-100`} {...props}>
                    {children}
                  </h5>
                ),
                h6: ({ children, ...props }) => (
                  <h6 className={`${getFontSizeClass('text-xs')} font-semibold mt-3 mb-2 text-zinc-600 dark:text-zinc-400 uppercase tracking-wide`} {...props}>
                    {children}
                  </h6>
                ),
                // Paragraphs
                p: ({ children, ...props }) => (
                  <p className={`mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </p>
                ),
                // Lists
                ul: ({ children, ...props }) => (
                  <ul className={`list-disc list-inside mb-4 space-y-1 text-zinc-700 dark:text-zinc-300 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className={`list-decimal list-inside mb-4 space-y-1 text-zinc-700 dark:text-zinc-300 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="mb-1" {...props}>
                    {children}
                  </li>
                ),
                // Blockquotes
                blockquote: ({ children, ...props }) => (
                  <blockquote className={`border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 py-2 mb-4 italic bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </blockquote>
                ),
                // Links
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors ${getFontSizeClass('text-base')}`}
                    {...props}
                  >
                    {children}
                  </a>
                ),
                // Images
                img: ({ src, alt, ...props }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="max-w-full h-auto rounded-lg my-4 shadow-sm border border-zinc-200 dark:border-zinc-700"
                    {...props}
                  />
                ),
                // Code blocks and inline code
                code: ({ node, className, children, ...props }: any) => {
                  const inline = !className;
                  return !inline ? (
                    <pre className={`bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 overflow-auto ${getFontSizeClass('text-xs')} font-mono my-4 border border-zinc-200 dark:border-zinc-700`}>
                      <code className={className} {...props}>{children}</code>
                    </pre>
                  ) : (
                    <code className={`bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 ${getFontSizeClass('text-xs')} font-mono text-zinc-800 dark:text-zinc-200`} {...props}>{children}</code>
                  );
                },
                // Pre (for code blocks)
                pre: ({ children, ...props }) => (
                  <pre className={`bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 overflow-auto ${getFontSizeClass('text-xs')} font-mono my-4 border border-zinc-200 dark:border-zinc-700`} {...props}>
                    {children}
                  </pre>
                ),
                // Tables
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table className={`min-w-full border-collapse border border-zinc-300 dark:border-zinc-600 ${getFontSizeClass('text-sm')}`} {...props}>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children, ...props }) => (
                  <thead className="bg-zinc-100 dark:bg-zinc-800" {...props}>
                    {children}
                  </thead>
                ),
                tbody: ({ children, ...props }) => (
                  <tbody {...props}>
                    {children}
                  </tbody>
                ),
                tr: ({ children, ...props }) => (
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50" {...props}>
                    {children}
                  </tr>
                ),
                th: ({ children, ...props }) => (
                  <th className={`border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100 ${getFontSizeClass('text-sm')}`} {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className={`border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-zinc-700 dark:text-zinc-300 ${getFontSizeClass('text-sm')}`} {...props}>
                    {children}
                  </td>
                ),
                // Horizontal rule
                hr: ({ ...props }) => (
                  <hr className="my-6 border-t border-zinc-300 dark:border-zinc-600" {...props} />
                ),
                // Emphasis
                em: ({ children, ...props }) => (
                  <em className={`italic text-zinc-700 dark:text-zinc-300 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </em>
                ),
                strong: ({ children, ...props }) => (
                  <strong className={`font-semibold text-zinc-900 dark:text-zinc-100 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </strong>
                ),
                // Strikethrough (GFM)
                del: ({ children, ...props }) => (
                  <del className={`line-through text-zinc-500 dark:text-zinc-500 ${getFontSizeClass('text-base')}`} {...props}>
                    {children}
                  </del>
                ),
                // Task list items (GFM)
                input: ({ type, checked, ...props }) => {
                  if (type === 'checkbox') {
                    return (
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled
                        className="mr-2 rounded border-zinc-300 dark:border-zinc-600"
                        {...props}
                      />
                    );
                  }
                  return <input type={type} {...props} />;
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
