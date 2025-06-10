"use client"

import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_components/common/select";
import { Input } from "@/_components/common/input";
import { Button } from "@/_components/common/button";
import { ChevronDown, Save } from "lucide-react";

type WorkItemModalProps = {
	type?: 'Epic' | 'Feature' | 'User Story';
	isOpen: boolean;
	onClose: () => void;
}

const DialogDemo = ({ isOpen, onClose, type = 'Epic' }: WorkItemModalProps) => {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const handleSave = () => {
		onClose();
	};

	return (
		<Dialog.Root open={isOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
				<Dialog.Content className="max-w-[80vw] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-3 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
					<Dialog.Title className="m-0 text-sm tracking-wider font-bold text-mauve12">
						{`[${type}] Work Item`}
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

					<div className=" grid grid-cols-12 gap-4">
						<div className="col-span-12">

							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter title"
								className={`bg-[#1e1e1e] border-gray-600 text-white text-xs   `}
							/>

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
							<MDEditor
								value={description}
								onChange={val => setDescription(val || '')}
								preview="edit"
								hideToolbar={false}
								data-color-mode="dark"
								height={250}
							/>
						</div>

					</div>
					<div className="">
						<div className="flex items-center justify-end">
							<Button
								onClick={handleSave}
								size="xs"
								className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
								<Save className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}


export default DialogDemo;
