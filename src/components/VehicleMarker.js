import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrowUpward, DirectionsBus, Tram } from '@mui/icons-material';

export default function VehicleMarker({ vehicle }) {
    let navigate = useNavigate();
    return (
        <>
            <Marker
                key={vehicle.trip}
                position={vehicle.location}
                eventHandlers={{
                    click: () => navigate(`/track/${vehicle.type}/${vehicle.tab}`)
                }}
                vehicle={vehicle}
                icon={divIcon({
                    className: '',
                    html: renderToStaticMarkup(<span className={`vehicle-marker ${vehicle.type}`}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}{vehicle.type === "bus" ? <DirectionsBus style={{ height: "16px", width: "16px" }} /> : <Tram style={{ height: "16px", width: "16px" }} />}&nbsp;<b className={"line-number"}>{vehicle.line}</b><small>/{vehicle.brigade}</small></span>),
                    iconSize: [vehicle.line.includes("-") ? 90 : "auto", "28"],
                })}
                zIndexOffset={10000}
            />
        </>
    );
}