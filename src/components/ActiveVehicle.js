import { Polyline } from 'react-leaflet';
import StopMarker from './StopMarker';
import Sheet from 'react-modal-sheet';

export default function ActiveVehicle({ vehicle, trip }) {
    return (
        <>
            <Polyline positions={trip[0].shapes} pathOptions={{ color: vehicle[0].type === "bus" ? "#006b47" : "#007bff" }} />
            {trip[0].stops.map(stop => <StopMarker key={stop.stop_id} vehicle={vehicle[0]} stop={stop} />)}
            <Sheet
                isOpen={vehicle[0].tab}
                onClose={() => {
                    vehicle[1](null);
                    trip[1](null);
                }}
                snapPoints={[400,0]}
                initialSnap={0}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content style={{ maxHeight: "400px" }}>
                        {JSON.stringify(vehicle[0])}
                        {JSON.stringify(trip[0])}
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    );
}