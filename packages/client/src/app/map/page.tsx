import MapProvider from "@/_components/container/map/Context";
import { Frame } from "@/_components/container/map/Frame";

export default function MapPage() {
	return (
			<MapProvider>
				{/* <MapToolbar /> */}
				<Frame />
			</MapProvider>
	);
} 