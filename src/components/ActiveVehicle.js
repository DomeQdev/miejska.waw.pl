import { useEffect, useState } from 'react';
import { Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Box } from '@mui/material';
import { Polyline, useMap } from 'react-leaflet';
import VehicleMarker from './VehicleMarker';
import StopMarker from './StopMarker';
import { useParams, useNavigate } from "react-router-dom";
import { PanTool, DirectionsBus, Tram, Accessible, NotAccessible } from '@mui/icons-material';
import { nearestPointOnLine, lineString, point } from '@turf/turf';
import { NotificationManager } from 'react-notifications';
import Sheet from 'react-modal-sheet';

export default function ActiveVehicle({ vehicles }) {
    const map = useMap();
    const params = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [vehicle, setVehicle] = useState(null);
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        if (!vehicles.length) return;
        let v = vehicles.find(vehicle => vehicle.tab === params.bus);
        if (!v) {
            NotificationManager.error("Nie ma tego pojazdu na trasie.");
            return navigate("/");
        }
        setVehicle(v);
        if (!trip || trip?.trip_id !== v.trip) fetch(`https://api.domeqalt.repl.co/trip?trip=${v.trip}`).then(res => res.json()).then(res => {
            res.stops = res.stops.map(stop => {
                stop.onLine = nearestPointOnLine(lineString(res.shapes), point(stop.location), { units: 'meters' }).properties.location;
                return stop;
            });
            setTrip(res);
            map.setView(v.location, 17);
        })
    }, [vehicles]);

    return (
        <>
            {!vehicle || <VehicleMarker vehicle={vehicle} clickCallback={() => console.log("press")} />}
            {!trip || <Polyline positions={trip?.shapes} pathOptions={{ color: vehicle?.type === "bus" ? "#006b47" : "#007bff" }} />}
            {!trip || trip?.stops.map(stop => <StopMarker key={stop.stop_id} vehicle={vehicle} stop={stop} />)}
            <Sheet
                isOpen={trip}
                onClose={() => navigate("/")}
                snapPoints={[400, 0]}
                initialSnap={0}
            >
                <Sheet.Container>
                    <Sheet.Header>
                        <span />
                    </Sheet.Header>
                    <Sheet.Content style={{ maxHeight: "400px" }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <div>
                                <Button variant="outlined" style={{ color: "#000000", borderColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}>{vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: "#006b47" }} /> : <Tram style={{ height: "22px", width: "22px", fill: "#007bff" }} />} <b>{trip?.route_id}</b>&nbsp;{trip?.trip_headsign} {trip?.wheelchair_accessible ? <Accessible style={{ height: "22px", width: "22px" }} /> : <NotAccessible style={{ height: "22px", width: "22px" }} />}</Button>
                            </div>
                            <div></div>
                        </Box>
                        <List
                            sx={{
                                overflow: "auto",
                                WebkitOverflowScrolling: "touch",
                                bgcolor: 'background.paper',
                                maxHeight: "285px",
                            }}
                        >
                            {trip?.stops.map(stop => (
                                <ListItem key={stop.stop_id}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 24, height: 24, backgroundColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}>
                                            <span style={{ fontSize: "15px" }}>{stop.stop_sequence}</span>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText>
                                        {stop.on_request ? <PanTool style={{ width: "14px", height: "14px" }} /> : null} {stop.stop_name}
                                    </ListItemText>
                                </ListItem>
                            )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} />, curr])}
                        </List>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    );
}
