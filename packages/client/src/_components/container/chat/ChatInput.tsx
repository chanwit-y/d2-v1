import { useState, useCallback, type ChangeEvent, type KeyboardEvent, type FormEvent, useEffect, useRef } from 'react';
import { Send, FileText, X, Loader2, Menu, ChevronDown, BotMessageSquare } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useChat } from './ChatContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/_components/common/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/_components/common/dropdown-menu';
import { Button } from '@/_components/common/button';

interface ChatInputProps {
	placeholder?: string;
	onSend: (message: string) => void;
	initialValue?: string;
	maxWidth?: string | number;
	backgroundColor?: string;
	textColor?: string;
	placeholderColor?: string;
	iconColor?: string;
	disabled?: boolean;
	loading?: boolean;
	maxLength?: number;
	minRows?: number;
	maxRows?: number;
	showCharacterCount?: boolean;
	autoFocus?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
	placeholder = "Ask anything",
	onSend,
	initialValue = "",
	maxWidth = "700px",
	backgroundColor = "bg-zinc-900",
	textColor = "text-zinc-100",
	placeholderColor = "placeholder-zinc-400",
	iconColor = "text-zinc-400",
	disabled = false,
	loading = false,
	maxLength,
	minRows = 1,
	maxRows = 4,
	showCharacterCount = false,
	autoFocus = false,
}) => {
	const { nextSession } = useChat();
	const [inputValue, setInputValue] = useState<string>(initialValue);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		if (loading) return;
		const newValue = event.target.value;
		if (!maxLength || newValue.length <= maxLength) {
			setInputValue(newValue);
		}
	}, [maxLength, loading]);

	const handleSend = useCallback(() => {
		const trimmedValue = inputValue.trim();
		if (trimmedValue && !disabled && !loading) {
			onSend(trimmedValue);
			setInputValue('');
		}
	}, [inputValue, onSend, disabled, loading]);

	const handleKeyPress = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (loading) {
			event.preventDefault();
			return;
		}
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}, [handleSend, loading]);

	const handleClear = useCallback(() => {
		setInputValue('');
	}, []);

	const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleSend();
	}, [handleSend]);

	const isSubmitDisabled = !inputValue.trim() || disabled || loading;
	const characterCount = inputValue.length;
	const isOverLimit = maxLength ? characterCount > maxLength : false;

	const handleNewSession = useCallback(() => {
		nextSession();
		inputRef.current?.focus();
	}, [nextSession, inputRef]);

	return (
		<form
			className={`flex flex-col w-full h-full max-w-[${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth}] p-2 bg-zinc-900 border border-zinc-700 rounded-md box-border transition-opacity duration-200 ${disabled ? 'opacity-60' : ''}`}
			onSubmit={handleSubmit}
			role="search"
			aria-label="Chat input form"
		>
			<div className="flex items-end w-full h-full gap-2 justify-between">
				<textarea
					ref={inputRef}
					className={`flex-1 resize-none bg-transparent outline-none border-none ${textColor} ${placeholderColor} text-xs py-1 px-2 min-h-[${minRows * 1.5}rem] max-h-[${maxRows * 1.5}rem]`}
					placeholder={loading ? "Generating response..." : placeholder}
					aria-label={placeholder}
					aria-describedby={showCharacterCount ? 'character-count' : undefined}
					maxLength={maxLength}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
					disabled={disabled || loading}
					autoFocus={autoFocus}
					rows={minRows}
					style={{ maxHeight: `${maxRows * 1.5}rem` }}
				/>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<button
							type="reset"
							onClick={handleClear}
							className={`p-2 rounded ${iconColor} hover:bg-zinc-700 disabled:opacity-50 ${inputValue ? 'visible' : 'invisible'}`}
							disabled={disabled || loading}
							aria-label="Clear input"
						>
							<X className="w-4 h-4" />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top" className="z-50 px-2 py-1 bg-zinc-800 text-xs text-white rounded shadow">
						Clear input
					</Tooltip.Content>
				</Tooltip.Root>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="xs"
							className="text-gray-300 hover:text-white hover:bg-gray-700 gap-2 text-[10px]"
						>
							<BotMessageSquare className="w-4 h-4" />
							BA
							{/* <ChevronDown className="w-4 h-4" /> */}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="bg-[#252526] border-gray-600 text-white"
					>
						<DropdownMenuItem className="hover:bg-gray-700">
							BA
						</DropdownMenuItem>
						<DropdownMenuItem className="hover:bg-gray-700">
							QA
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<button
							type="submit"
							className={`p-2 rounded ${iconColor} hover:bg-primary/20 disabled:opacity-50`}
							aria-label={loading ? 'Sending message...' : 'Send message'}
							disabled={isSubmitDisabled}
							tabIndex={0}
						>
							{loading ? (
								<Loader2 className="w-4 h-4 animate-spin" color='#155dfb' />
							) : (
								<Send className="w-4 h-4" />
							)}
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top" className="z-50 px-2 py-1 bg-zinc-800 text-xs text-white rounded shadow">
						{loading ? 'Sending message...' : 'Send message'}
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
			{showCharacterCount && maxLength && (
				<div
					id="character-count"
					className={`mt-1 text-right text-xs ${isOverLimit ? 'text-red-500' : placeholderColor}`}
					aria-live="polite"
				>
					{characterCount}/{maxLength}
				</div>
			)}
		</form>
	);
};
