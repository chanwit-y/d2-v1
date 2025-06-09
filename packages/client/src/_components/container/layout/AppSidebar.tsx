
import React from 'react';
import { Button } from '@/_components/common/button';
import { Database, Bot, Settings } from 'lucide-react';


interface AppSidebarProps {
	isOpen: boolean;
}

const AppSidebar = ({ isOpen }: AppSidebarProps) => {

	const menuItems = [
		{
			icon: Bot,
			label: 'Home',
			isActive: true
		},
		{
			icon: Database,
			label: 'Database',
			isActive: false
		},
		{
			icon: Settings,
			label: 'Settings',
			isActive: false
		}
	];

	return (
		<aside className={`bg-[#252526] border-r border-gray-800 h-full transition-all duration-300 ${
			//       isOpen ? 'w-64' : 'w-12'
			'w-12'
			}`}>
			<div className="p-2 h-[calc(100vh-3rem)]">
				<nav className="space-y-1">
					{menuItems.map((item, index) => (
						<Button
							key={index}
							variant="ghost"
							className={`w-8 h-8 p-0 justify-center text-gray-300 hover:text-white hover:bg-gray-700 ${item.isActive
								? 'bg-gray-700 hover:bg-gray-700 '
								: 'hover:bg-gray-700'
								}`}
						>
							<item.icon className="w-4 h-4" />
						</Button>
					))}
				</nav>
			</div>
		</aside>
	);
};

export default AppSidebar;
