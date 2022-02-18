import { useState } from 'react';
import { latLng } from 'leaflet';
import { Routes, Route, Navigate } from "react-router-dom";
import { useMapEvents, useMap } from 'react-leaflet';
import VehicleMarker from './VehicleMarker';
import ActiveVehicle from './ActiveVehicle';
import Filter from './Filter';
import Settings from './Settings';

export default function Vehicles({ vehicles }) {
    const map = useMap();
    const [ bounds, setBounds ] = useState(map.getBounds());

    return (
        <>
            <Events />
            <Routes>
                <Route path="/" element={<>
                    {vehicles.filter(vehicle => bounds.contains(latLng(vehicle.location)) && map.getZoom() > 15).map(vehicle => (
                        <VehicleMarker key={vehicle.trip} vehicle={vehicle} clickCallback={() => <Navigate to={`/${vehicle.tab}`} />} />
                    ))}
                </>} />
                <Route path="/track/:type/:bus" element={<ActiveVehicle vehicles={vehicles} />} />
                <Route path="/filter" element={<Filter />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    );

    function Events() {
        useMapEvents({
            moveend: () => {
                setBounds(map.getBounds());
                localStorage.setItem("bounds", [map.getCenter().lat, map.getCenter().lng]);
                localStorage.setItem("zoom", map.getZoom());
            }
        });
        return null;
    }
}