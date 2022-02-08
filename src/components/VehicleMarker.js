import { Marker } from 'react-leaflet';
import { divIcon, latLng } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrowUpward, DirectionsBus, Tram } from '@mui/icons-material';
import { useState } from 'react';

const icons = {
    bus: <svg style={{ height: "16px" }} className="fill-bus" viewBox="0 0 24 24"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"></path></svg>,
    tram: <svg style={{ height: "16px" }} className="fill-tram" viewBox="0 0 24 24"><path d="M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z"></path></svg>
}

export default function VehicleMarker({ vehicle, clickCallback }) {
    return (
        <>
            <Marker
                key={vehicle.trip}
                position={vehicle.location}
                eventHandlers={{
                    click: () => clickCallback(vehicle)
                }}
                vehicle={vehicle}
                icon={divIcon({
                    className: '',
                    html: renderToStaticMarkup(<span className={`vehicle-marker ${vehicle.type}`}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}&nbsp;{vehicle.type === "bus" ? <DirectionsBus style={{ height: "16px", width: "16px" }} /> : <Tram style={{ height: "16px", width: "16px" }} />}&nbsp;<b className={"line-number"}>{vehicle.line}</b><small>/{vehicle.brigade}</small></span>),
                    iconSize: [vehicle.line.includes("-") ? 95 : "auto", "28"],
                })}
                zIndexOffset={10000}
            />
        </>
    );
}