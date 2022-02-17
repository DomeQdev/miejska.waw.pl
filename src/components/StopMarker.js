import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function StopMarker({ vehicle, stop, trip, clickCallback }) {
    return (
        <Marker
            key={stop.stop_id}
            position={nearest(stop.location)}
            eventHandlers={{
                click: () => clickCallback()
            }}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker bg-${vehicle.type}`} title={`${stop.stop_name} ${stop.on_request ? "(Ż)" : ""}`}><span className={"stop-sequence"}>{stop.stop_sequence}</span></button>),
                iconSize: [12, 12],
                iconAnchor: [12, 12],
                popupAnchor: [0, -11]
            })}
            zIndexOffset={100}
        />
    );

    function nearest(location) {
        if (typeof location !== "object" || !trip) return null;
        return nearestPointOnLine(lineString(trip?.shapes), point(location), { units: 'meters' }).geometry.coordinates;
    }
}