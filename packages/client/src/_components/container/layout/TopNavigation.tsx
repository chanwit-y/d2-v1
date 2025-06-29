
import React from 'react';
import Image from "next/image";
import { Button } from '@/_components/common/button';
import {  Moon } from 'lucide-react';

interface TopNavigationProps {
	onToggleSidebar: () => void;
}

const TopNavigation = ({ onToggleSidebar }: TopNavigationProps) => {
	return (
		<header className="bg-[#252526] border-b border-gray-800 h-12 flex items-center justify-between px-2">
			{/* Left side - Menu and Logo */}
			<div className="flex items-center gap-3">
				{/* <Button
					variant="ghost"
					size="sm"
					onClick={onToggleSidebar}
					className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
				>
					<Menu className="w-4 h-4" />
				</Button> */}

				<div className="flex items-center gap-2">
					<div className="w-8 h-8  rounded flex items-center justify-center">
						<Image src={"/asset/logo.png"} alt="logo" width={40} height={40} />
					</div>
					<span className="text-white font-medium">d2~</span>
				</div>
			</div>

			{/* Right side - Theme toggle */}
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="sm"
					className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
				>
					<Moon className="w-4 h-4" />
				</Button>
			</div>
		</header>
	);
};

export default TopNavigation;
