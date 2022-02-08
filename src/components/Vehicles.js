import { useState } from 'react';
import { latLng } from 'leaflet';
import { useMapEvents, useMap } from 'react-leaflet';
import VehicleMarker from './VehicleMarker';
import ActiveVehicle from './ActiveVehicle';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function Vehicles({ vehicles }) {
    const map = useMap();
    const [ bounds, setBounds ] = useState(map.getBounds());
    const [ active, setActive ] = useState(null);
    const [ trip, setTrip ] = useState(null);

    return (
        <>
            {vehicles.filter(vehicle => {
                if(active) return vehicle.tab === active.tab && vehicle.type === active.type;
                return bounds.contains(latLng(vehicle.location)) && map.getZoom() > 15
            }).map(vehicle => (
                <VehicleMarker key={vehicle.trip} vehicle={vehicle} clickCallback={() => {
                    setActive(vehicle);
                    loadTrip(vehicle.trip, vehicle);
                }} />
            ))}
            {active && trip ? <ActiveVehicle vehicle={[ active, setActive ]} trip={[ trip, setTrip ]} /> : null}
            <Events />
        </>
    );

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

    async function loadTrip(trip_id, vehicle) {
        if(vehicle) setActive(vehicle);
        let res = await fetch(`https://api.domeqalt.repl.co/trip?trip=${trip_id}`).then(res => res.json())
        res.stops = res.stops.map(stop => {
            stop.onLine = nearestPointOnLine(lineString(res.shapes), point(stop.location), { units: 'meters' }).properties.location;
            return stop;
        });
        setTrip(res);
        console.log(res)
    }
}