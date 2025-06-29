"use client";
import { createContext, useContext } from 'react';
import '@xyflow/react/dist/style.css';
import { MapToolbar } from './Toolbar';
import { useStore } from './useStore';

type MapContextType = {}
const MapContext = createContext<MapContextType | undefined>(undefined);

export default function MapProvider({ children }: { children: React.ReactNode }) {




	return (

		<MapContext.Provider value={{}}>
			<div className='relative'>
				<MapToolbar />
			</div>
			{children}
		</MapContext.Provider >
	)
}

export const useMap = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error('useMap must be used within a MapProvider');
	}
	return context;
}