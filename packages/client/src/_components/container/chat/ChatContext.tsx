import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type FeedbackDetail = {
	contentIssue: string;
	details: string;
}

interface Message {
	id: string;
	text: string;
	sender: 'user' | 'bot';
	timestamp: Date;
	isStreaming?: boolean;
	sources?: any[];
	feedback?: 'like' | 'dislike' | null;
	feedbackDetail?: FeedbackDetail;
}

type ChatContextType = {
	email: string
	sessionID: string
	messages: Message[]
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>
	nextSessionID: () => void
	nextSession: () => void
	setMessageFeedback: (id: string, feedback: 'like' | 'dislike' | null) => void
	setMessageFeedbackDetail: (id: string, feedbackDetail: FeedbackDetail) => void
}

const ChatContext = createContext<ChatContextType>({
	email: "",
	sessionID: crypto.randomUUID(),
	messages: [],
	setMessages: () => { },
	nextSessionID: () => { },
	nextSession: () => { },
	setMessageFeedback: () => { },
	setMessageFeedbackDetail: () => {},
})

type ChatProviderProps = {
	children: React.ReactNode
	email: string
	getAccessToken: () => Promise<string>
}

export default function ChatProvider({ children, email, getAccessToken }: ChatProviderProps) {
	const [sessionID, setSessionID] = useState(crypto.randomUUID())
	const [messages, setMessages] = useState<Message[]>([])


	const nextSessionID = useCallback(() => {
		setSessionID(crypto.randomUUID())
		setMessages([])
	}, [])
	const nextSession = useCallback(() => {
		setSessionID(crypto.randomUUID())
		setMessages([])
	}, [])

	const setMessageFeedback = useCallback((id: string, feedback: 'like' | 'dislike' | null) => {
		setMessages(prev => prev.map(msg =>
			msg.id === id ? { ...msg, feedback } : msg
		));
	}, [])

	const setMessageFeedbackDetail = useCallback((id: string, feedbackDetail: FeedbackDetail) => {
		setMessages(prev => prev.map(msg =>
			msg.id === id ? { ...msg, feedbackDetail } : msg
		));
	}, [])

	return (
		<ChatContext.Provider value={{
			email,
			sessionID,
			messages,
			setMessages,
			nextSessionID,
			nextSession,
			setMessageFeedback,
			setMessageFeedbackDetail,
		}}>
			{children}
		</ChatContext.Provider>
	)
}

export const useChat = () => {
	return useContext(ChatContext)
}
