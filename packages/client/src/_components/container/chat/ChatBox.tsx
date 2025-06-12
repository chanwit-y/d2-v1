'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Source } from './@types';
import { useChat } from './ChatContext';
import { chat } from '@/app/_server/chat';

interface Message {
	id: string;
	text: string;
	sender: 'user' | 'bot';
	timestamp: Date;
	isStreaming?: boolean;
	sources?: Source[];
}

interface ChatBoxProps {
	width?: number | string;
	height?: number | string;
	onMessageSend?: (message: string) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
	width = 400,
	height = 500,
	onMessageSend,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const { sessionID, email, messages, setMessages } = useChat();

	// Scroll to bottom function
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	// Auto-scroll when messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	// Auto-scroll during streaming (more frequent updates)
	useEffect(() => {
		const hasStreamingMessage = messages.some((msg: Message) => msg.isStreaming);
		if (hasStreamingMessage) {
			const interval = setInterval(() => {
				scrollToBottom();
			}, 100);
			return () => clearInterval(interval);
		}
	}, [messages, scrollToBottom]);

	// Auto-dismiss error after 5 seconds
	useEffect(() => {
		if (error) {
			setIsLoading(false)
			const timer = setTimeout(() => {
				setError(null)
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error, setError, setIsLoading]);

	const handleFeedback = useCallback((messageId: string, feedback: 'like' | 'dislike') => {
		// Implement feedback logic if needed
	}, []);

	const handleSendMessage = useCallback(async (messageText: string) => {
		const newMessage: Message = {
			id: Date.now().toString(),
			text: messageText,
			sender: 'user',
			timestamp: new Date()
		};
		setMessages((prev: Message[]) => [...prev, newMessage]);
		onMessageSend?.(messageText);
		setIsLoading(true);
		try {

			const data = await chat(messageText);
			// console.log('data', data);

			// const data = await api.chatAmigo({
			// 	question: messageText,
			// 	userID: email,
			// 	sessionID: sessionID,
			// });
			setTimeout(() => {
				// const fullResponse = get(data, '[0]');
				const fullResponse = {
					id: 1,
					answer: data,
					sources: [
						// {
						// 	title: 'Source 1',
						// 	url: 'https://www.google.com',
						// 	content: 'Content 1',
						// 	path: 'path1',
						// 	media_type: 'text/plain',
						// 	relevance_score: 0.9
						// }
					]
				};
				const botResponse: Message = {
					id: String(fullResponse.id),
					text: fullResponse.answer || '',
					sender: 'bot',
					timestamp: new Date(),
					isStreaming: true,
					sources: fullResponse.sources || []
				};
				setMessages((prev: Message[]) => [...prev, botResponse]);
			}, 1000);
			setError(null);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else if (typeof error === 'string') {
				setError(error);
			} else {
				setError('Something went wrong.');
			}
		}
		finally {
			setIsLoading(false);
		}
	}, [onMessageSend, sessionID, email, setMessages]);

	return (
		<TooltipProvider>
			<div
				className="flex flex-col overflow-hidden rounded-md shadow-lg bg-white dark:bg-zinc-900 relative"
				style={{ width, height, minWidth: 300, maxWidth: '100%' }}
			>
				{/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}
				<div
					ref={scrollContainerRef}
					className="flex-1 p-4 pb-4 overflow-y-auto flex flex-col gap-2"
					style={{ height: 'calc(100% - 140px)' }}
				>
					{messages.length === 0 ? (
						<div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
							<span className="text-base">Start a conversation with ChatBot AI</span>
						</div>
					) : (
						messages.map((message: Message) => (
							<ChatMessage
								key={message.id}
								id={message.id}
								text={message.text}
								sender={message.sender}
								timestamp={message.timestamp}
								isStreaming={message.isStreaming}
								streamingSpeed={3}
								streamingDelay={40}
								sources={message.sources}
								onStreamingComplete={() => {
									setMessages((prev: Message[]) =>
										prev.map((msg: Message) =>
											msg.id === message.id
												? { ...msg, isStreaming: false }
												: msg
										)
									);
									setIsLoading(false);
								}}
								onFeedback={handleFeedback}
							/>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
				{error && (
					<div className="mx-4 mb-2 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded flex items-center justify-between">
						<span>{error}</span>
						<button
							className="ml-2 p-1 rounded hover:bg-red-200 dark:hover:bg-red-800"
							onClick={() => setError(null)}
							aria-label="Close error"
							type="button"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
						</button>
					</div>
				)}
				<div className="px-4 pb-4">
					<ChatInput onSend={handleSendMessage} loading={isLoading} autoFocus={true} />
				</div>
			</div>
		</TooltipProvider>
	);
};
