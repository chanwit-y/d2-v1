"use client"

import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/_components/common/input";
import { Button } from "@/_components/common/button";
import {  Save, Eye, Edit, Layout, Type } from "lucide-react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkItem, updateWorkItem } from "@/app/_server/backlog";
import { Spinner } from "@/_components/common/spinner";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/common/select";

type WorkItemModalProps = {
	type?: 'Epic' | 'Feature' | 'User Story';
	isOpen: boolean;
	onClose: () => void;
	mode?: 'view' | 'edit';
	editWorkItem?: {
		id: number;
		title: string;
		description: string;
		type: string;
		parentId: number;
	} | null;
	parentWorkItem?: {
		id: number;
		type: 'Epic' | 'Feature' | 'User Story';
		title: string;
	} | null;
}

// Zod schema for form validation
const workItemSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	parentId: z.number().optional(),
	type: z.string().min(1, 'Type is required'),
});

type WorkItemForm = z.infer<typeof workItemSchema>;

const DialogDemo = ({ isOpen, onClose, type = 'Epic', mode = 'edit', editWorkItem, parentWorkItem }: WorkItemModalProps) => {
	const [loading, setLoading] = useState(false);
	const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'live'>(mode === 'view' ? 'preview' : 'edit');
	const [fontSize, setFontSize] = useState<string>('14');

	// Update preview mode when mode prop changes
	useEffect(() => {
		setPreviewMode(mode === 'view' ? 'preview' : 'edit');
	}, [mode]);

	// Determine child type based on parent type
	const getChildType = (parentType: 'Epic' | 'Feature' | 'User Story'): 'Epic' | 'Feature' | 'User Story' => {
		switch (parentType) {
			case 'Epic':
				return 'Feature';
			case 'Feature':
				return 'User Story';
			default:
				return 'User Story'; // Default fallback
		}
	};

	// Determine the work item type (edit mode, parent mode, or default)
	const workItemType = editWorkItem?.type || (parentWorkItem ? getChildType(parentWorkItem.type) : type);

	// useForm with Zod resolver
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<WorkItemForm>({
		resolver: zodResolver(workItemSchema),
		defaultValues: {
			title: editWorkItem?.title || '',
			description: editWorkItem?.description || '',
			parentId: editWorkItem?.parentId || parentWorkItem?.id || 0,
			type: workItemType,
		},
	});

	// Reset form when editWorkItem or parentWorkItem changes
	useEffect(() => {
		if (editWorkItem) {
			reset({
				title: editWorkItem.title,
				description: editWorkItem.description,
				parentId: editWorkItem.parentId,
				type: editWorkItem.type,
			});
		} else if (parentWorkItem) {
			reset({
				title: '',
				description: '',
				parentId: parentWorkItem.id,
				type: getChildType(parentWorkItem.type),
			});
		} else {
			reset({
				title: '',
				description: '',
				parentId: 0,
				type,
			});
		}
	}, [editWorkItem, parentWorkItem, type, reset]);

	// For MDEditor, since it's not a native input, we need to manually set value
	const description = watch('description');

	// Handle image upload for MDEditor
	const handleImageUpload = async (file: File): Promise<string> => {
		try {
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Upload failed');
			}

			const data = await response.json();
			return data.url;
		} catch (error) {
			console.error('Image upload error:', error);
			toast.error('Failed to upload image');
			throw error;
		}
	};

	// Handle image paste/drop
	const handleImagePasted = async (dataTransfer: DataTransfer) => {
		console.log("handleImagePasted", dataTransfer);
		const files: File[] = [];
		for (let index = 0; index < dataTransfer.items.length; index += 1) {
			const file = dataTransfer.files.item(index);
			if (file && file.type.startsWith('image/')) {
				files.push(file);
			}
		}

		if (files.length > 0) {
			toast.info(`Uploading ${files.length} image(s)...`);
			
			try {
				for (const file of files) {
					const url = await handleImageUpload(file);
					const currentValue = description || '';
					const imageMarkdown = `![${file.name}](${url})`;
					setValue('description', currentValue + '\n' + imageMarkdown);
				}
				
				toast.success('Image(s) uploaded successfully!');
			} catch (error) {
				// Error toast is already shown in handleImageUpload
			}
		}
	};

	const onSubmit = useCallback(async (data: WorkItemForm) => {
		setLoading(true);
		try {
			const workItemData = {
				title: data.title,
				description: data.description || '',
				type: data.type,
				parentId: data.parentId || 0,
			};
			
			if (editWorkItem) {
				await updateWorkItem(editWorkItem.id, workItemData);
				toast.success('Work item has been updated');
			} else {
				await createWorkItem(workItemData);
				toast.success('Work item has been created');
			}
			onClose();
		} catch(err) {
			toast.error('Failed to create work item');
		} finally {
			setLoading(false);
		}
	}, [onClose, editWorkItem]);

	

	return (
		<>
			{loading && <Spinner withBackdrop className="w-12 h-12" />}
			<Dialog.Root open={isOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
					<Dialog.Content className="max-w-[80vw] h-[60vh] fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-3 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
						<Dialog.Title className="m-0 text-sm tracking-wider font-bold text-mauve12">
							{editWorkItem 
								? `[${editWorkItem.type}] Edit Work Item` 
								: parentWorkItem 
									? `[${workItemType}] Create Child of ${parentWorkItem.title}`
									: `[${workItemType}] Create Work Item`
							}
						</Dialog.Title>
						{/* <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
						Make changes to your profile here. Click save when you're done.
					</Dialog.Description> */}

						<Dialog.Close asChild>
							<button
								className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
								aria-label="Close"
								onClick={onClose}
							>
								<Cross2Icon />
							</button>
						</Dialog.Close>

						<form onSubmit={handleSubmit(onSubmit)}>
							<div className=" grid grid-cols-12 gap-4">
								<div className="col-span-12">
									<Input
										{...register('title')}
										placeholder="Enter title"
										disabled={mode === 'view'}
										className={`bg-[#1e1e1e] border-gray-600 text-white text-xs ${errors.title ? 'border-red-500' : ''} ${mode === 'view' ? 'opacity-60' : ''}`}
									/>
									{errors.title && (
										<p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
									)}
								</div>
								{/* <div className="col-span-6">
									<Select>
										<SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px]">
											<SelectValue placeholder="Types" />
										</SelectTrigger>
										<SelectContent className="bg-[#252526] border-gray-600 text-white">
											<SelectItem value="epic">Epic</SelectItem>
											<SelectItem value="feature">Feature</SelectItem>
											<SelectItem value="user-story">User Story</SelectItem>
										</SelectContent>
									</Select>
								</div> */}

								<div className="col-span-12">
									<div
										onPaste={async (event) => {
											if (mode === 'view') return;
											await handleImagePasted(event.clipboardData);
										}}
										onDrop={async (event) => {
											if (mode === 'view') return;
											event.preventDefault();
											await handleImagePasted(event.dataTransfer);
										}}
										onDragOver={(event) => {
											event.preventDefault();
										}}
										className="md-editor-font-container"
										style={{ 
											fontSize: `${fontSize}px`,
											'--md-editor-font-size': `${fontSize}px`
										} as React.CSSProperties}
									>
										<MDEditor
											value={description}
											onChange={mode === 'view' ? undefined : (val => setValue('description', val || ''))}
											preview={previewMode}
											data-color-mode="dark"
											height={380}
										/>
									</div>
								</div>

							</div>
							{mode !== 'view' && (
								<div className="mt-2">
									<div className="flex items-center justify-end">
										<Button
											type="submit"
											size="xs"
											className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
											<Save className="w-4 h-4" />
										</Button>
									</div>
								</div>
							)}
						</form>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	)
}


export default DialogDemo;
