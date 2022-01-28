import { Marker, useMapEvents, useMap, Polyline, Popup } from 'react-leaflet';
import { divIcon, latLng } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { useState, useEffect } from 'react';
import { get } from 'axios';
import SlidingPanel from 'react-sliding-side-panel';
import { NotificationManager } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faCircle, faHandPaper } from '@fortawesome/free-solid-svg-icons'
import { nearestPointOnLine, lineString, point } from '@turf/turf';

import StopMarker from './StopMarker';
import StopList from './StopList';

export default function App() {
    const map = useMap();
    const [vehicles, setVehicles] = useState([]);
    const [bounds, setBounds] = useState(map.getBounds());
    const [active, setActive] = useState(null);
    const [selected, setSelected] = useState(null);
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [trip, setTrip] = useState(null);
    const [alrConnected, setAlrConnected] = useState(false);

    useEffect(() => {
        if(alrConnected) return;
        let wss = new WebSocket('wss://ws.domeqalt.repl.co');
        if(!wss) return alert("Could not connect to server");
        NotificationManager.info('Próba połączenia z serwerem...');
        setAlrConnected(true);
        wss.addEventListener("open", () => {
            console.log("[WSS] Connected");
            NotificationManager.success('Pojazdy powinny się pojawić do 20 sekund.', 'Udało się!');
            setAlrConnected(true);
        });
        wss.addEventListener("close", () => {
            console.log("[WSS] Disconnected");
            NotificationManager.error('Połączenie z serwerem zostało przerwane.', 'Błąd!');
            setAlrConnected(false);
        });
        wss.addEventListener("message", ({ data }) => {
            setVehicles(JSON.parse(data));
        });    
    }, [alrConnected]);
    
    return (
        <>
            <Events />
            {trip && active && trip.shapes ? <Polyline positions={trip.shapes} pathOptions={{ color: active?.type === "bus" ? "#006b47" : "#007bff" }} /> : null}
            {vehicles.filter(vehicle => {
                if(active) return vehicle.tab === active.tab && vehicle.type === active.type;
                return bounds.contains(latLng(vehicle.location)) && map.getZoom() > 15
            }).map(vehicle => {
                if(active && vehicle.trip !== active.trip) loadTrip(vehicle.trip, vehicle.location, vehicle);
                return (
                    <Marker
                        key={vehicle.trip}
                        position={vehicle.location}
                        eventHandlers={{
                            click: onMarkerClick
                        }}
                        vehicle={vehicle}
                        icon={divIcon({
                            className: '',
                            html: renderToStaticMarkup(<span className={`vehicle-marker ${vehicle.type} ${!vehicle.trip ? 'blocked' : ''}`}> {vehicle.deg ? <FontAwesomeIcon icon={faArrowUp} style={{ transform: `rotate(${vehicle.deg}deg)` }} /> : <FontAwesomeIcon icon={faCircle} />}&nbsp;<b className={"line-number"}>{vehicle.line}</b><small>/{vehicle.brigade}</small></span>),
                            iconSize: [calcSize(vehicle), 27],
                        })}
                    />
                );
            })}
            {trip && active && trip.stops ? trip.stops.map(stop => {
                return (
                    <StopMarker vehicle={active} stop={stop} />
                )
            }) : null}
            {/*
            <Sheet
                isOpen={active?.tab}
                onClose={close}
                snapPoints={[400,0]}
                initialSnap={0}
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content style={{ maxHeight: "400px" }}>
                        <StopList trip={trip} vehicles={vehicles} />
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
            */}
        </>
    );

    function calcSize(vehicle) {
        let size = 50;
        size += vehicle.brigade.length * 4.2;
        if (vehicle.line.length === 1) size -= 5;
        size += vehicle.line.length * 4;
        return size;
    }

    async function onMarkerClick(e) {
        close();
        let vehicle = e.target.options.vehicle;
        map.setView(e.target._latlng, 17);
        setActive(vehicle);

        Promise.all([
            get(`https://vehicles.domeqalt.repl.co/vehicle?tab=${vehicle.tab}&type=${vehicle.type}`).then(res => {
                setVehicleInfo(res.data);
            }),
            loadTrip(vehicle.trip, Object.values(e.target._latlng))
        ])
    }

    async function loadTrip(trip, location, vehicle) {
        if(vehicle) setActive(vehicle);
        get(`https://api.domeqalt.repl.co/trip?trip=${trip}`).then(res => {
            res.data.stops = res.data.stops.map(stop => {
                stop.onLine = nearestPointOnLine(lineString(res.data.shapes), point(stop.location), { units: 'meters' }).properties.location
                return stop;
            });
            setTrip(res.data);
        })
    }

    function Events() {
        useMapEvents({
            move: () => {
                setBounds(map.getBounds());
                localStorage.setItem("bounds", [map.getCenter().lat, map.getCenter().lng]);
                localStorage.setItem("zoom", map.getZoom());
            }
        });
        return null;
    }

    function close() {
        setActive(null);
        setVehicleInfo(null);
        setTrip(null);
    }
}