import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { PanTool } from '@mui/icons-material';

export default function StopMarker({ vehicle, stop }) {
    return (
        <Marker
            key={stop.stop_id}
            position={stop.location}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker bg-${vehicle.type}`} title={`${stop.stop_name} ${stop.on_request ? "(Ż)" : ""}`}><span className={"stop-sequence"}>{stop.stop_sequence}</span></button>),
                iconSize: [12, 12],
                iconAnchor: [12, 12],
                popupAnchor: [0, -11]
            })}
            zIndexOffset={100}
        >
            <Popup keepInView={false} autoPan={false} >
                <div className="stop-info text-1xl">{stop.on_request ? <PanTool style={{ width: "14px", height: "14px" }} /> : null} <b>{stop.stop_name}</b></div>
            </Popup>
        </Marker>
    )
}