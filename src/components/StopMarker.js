import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export default function StopMarker({ vehicle, stop, clickCallback }) {
    return (
        <Marker
            key={stop.stop_id}
            position={stop.location}
            eventHandlers={{
                click: () => clickCallback(stop)
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
    )
}