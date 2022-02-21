import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrowUpward, DirectionsBus, Tram } from '@mui/icons-material';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function VehicleMarker({ vehicle, active, trip }) {
    const navigate = useNavigate();

    if (active && trip) {
        const { geometry, properties } = distance(vehicle.location);
        return (
            <>
                <Marker
                    key={vehicle.trip}
                    position={properties?.dist < 30 ? geometry.coordinates : vehicle.location}
                    vehicle={vehicle}
                    icon={divIcon({
                        className: '',
                        html: renderToStaticMarkup(<span className={`vehicle-marker-active`}>{vehicle.type === "bus" ? <DirectionsBus style={{ height: "20px", width: "20px", fill: "#000" }} /> : <Tram style={{ height: "20px", width: "20px" }} />}</span>),
                        iconSize: [5, 5],
                        iconAnchor: [12, 12]
                    })}
                    zIndexOffset={1000}
                />
            </>
        );
    } else {
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
                        iconSize: [vehicle.line.includes("-") ? 95 : "auto", 28],
                    })}
                    zIndexOffset={10000}
                />
            </>
        );
    }

    function distance(location) {
        if (typeof location !== "object" || !trip) return null;
        return nearestPointOnLine(lineString(trip?.shapes), point(location), { units: 'meters' });
    }
}