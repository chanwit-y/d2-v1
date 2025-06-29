"use client";
import { useState } from 'react';
import { Type, BrainCircuit, Code, Image, Map } from 'lucide-react';

type TabType = 'letter-text' | 'brain-circuit' | 'code' | 'image' | 'map';

const tabs = [
	{ id: 'letter-text', label: 'Text', icon: Type },
	{ id: 'brain-circuit', label: 'Brain', icon: BrainCircuit },
	{ id: 'code', label: 'Code', icon: Code },
	{ id: 'image', label: 'Image', icon: Image },
	{ id: 'map', label: 'Map', icon: Map },
] as const;

const tabContent = {
	'letter-text': 'This is the text content tab',
	'brain-circuit': 'This is the brain circuit content tab',
	'code': 'This is the code content tab',
	'image': 'This is the image content tab',
	'map': 'This is the map content tab',
};

export const MindMapTabs = () => {
	const [activeTab, setActiveTab] = useState<TabType>('letter-text');

	return (
		<div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600">
			{/* Tab Headers */}
			<div className="flex border-b border-gray-600 overflow-hidden">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors overflow-hidden whitespace-nowrap ${
								activeTab === tab.id
									? 'bg-blue-900/50 text-blue-400 border-b-2 border-blue-400'
									: 'text-gray-300 hover:text-white hover:bg-gray-700'
							}`}
						>
							<Icon className="h-4 w-4 flex-shrink-0" />
							{/* <span className="truncate">{tab.label}</span> */}
						</button>
					);
				})}
			</div>

			{/* Tab Content */}
			<div className="p-4">
				<p className="text-gray-300">
					{tabContent[activeTab]}
				</p>
			</div>
		</div>
	);
}; 