import { useEffect, useState } from 'react';
import { Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Box } from '@mui/material';
import { Polyline, useMap } from 'react-leaflet';
import AutoChange from './AutoChange';
import VehicleMarker from './VehicleMarker';
import StopMarker from './StopMarker';
import { BrowserView } from 'react-device-detect';
import { useParams, useNavigate } from "react-router-dom";
import { PanTool, DirectionsBus, Tram, Accessible, NotAccessible, AltRoute } from '@mui/icons-material';
import { nearestPointOnLine, lineString, point } from '@turf/turf';
import { NotificationManager } from 'react-notifications';
import Sheet from 'react-modal-sheet';

export default function ActiveVehicle({ vehicles }) {
    const map = useMap();
    const params = useParams();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [displayingVehicle, setDisplayingVehicle] = useState(false);
    const [snap, setSnap] = useState(400);
    const [vehicle, setVehicle] = useState(null);
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        if (!vehicles.length) return;
        let v = vehicles.find(vehicle => vehicle.tab === params.bus);
        if (!v) {
            NotificationManager.error(vehicle ? "Utracono połączenie z pojazdem." : "Nie ma tego pojazdu na trasie.");
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
        });
    }, [vehicles]);

    return (
        <>
            {!vehicle || <VehicleMarker vehicle={vehicle} />}
            {!trip || <Polyline positions={trip?.shapes} pathOptions={{ color: vehicle?.type === "bus" ? "#006b47" : "#007bff", weight: 5 }} />}
            {!trip || trip?.stops.map(stop => <StopMarker key={stop.stop_id} vehicle={vehicle} stop={stop} clickCallback={() => stop.ref.scrollIntoView({ behavior: 'smooth', block: 'start' })} />)}
            <Sheet
                isOpen={true}
                onClose={() => navigate("/")}
                initialSnap={trip && scrolled ? 2 : 0}
                snapPoints={trip && scrolled ? [800,600,400,200,0] : [300,0]}
                onSnap={s => trip && scrolled ? setSnap(s === 0 ? 800 : (s === 1 ? 600 : (s === 2 ? 400 : (s === 3 ? 200 : 0)))) : null}
            >
                <Sheet.Container>
                    <Sheet.Header>
                        <span />
                    </Sheet.Header>
                    <Sheet.Content style={{ maxHeight: `${snap}px` }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1,
                                m: 1
                            }}
                        >
                            <div>
                                <Button
                                    variant="outlined"
                                    style={{ color: "#000000", borderColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}
                                    onClick={() => map.setView(vehicle.location)}
                                >
                                    {vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: "#006b47" }} /> : <Tram style={{ height: "22px", width: "22px", fill: "#007bff" }} />}&nbsp;<b>{trip?.route_id}</b>&nbsp;{trip?.stops.filter(st => st.onLine - whereBus(vehicle.location) > -50)[0].stop_sequence === 1 ? <AutoChange timeout={3500} text={[trip?.trip_headsign, new Date(trip?.stops[0]?.departure_time)]} /> : trip?.trip_headsign}&nbsp;{trip?.wheelchair_accessible ? <Accessible style={{ height: "22px", width: "22px" }} /> : <NotAccessible style={{ height: "22px", width: "22px" }} />}
                                </Button>
                            </div>
                            <div>
                                    <Button
                                        variant="outlined"
                                        style={{ color: "#000000", borderColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}
                                        title={!displayingVehicle ? "Wyświetl informacje o pojeździe" : "Wyświetl trasę"}
                                        onClick={() => {setDisplayingVehicle(!displayingVehicle);setScrolled(false);}}
                                    >
                                        {displayingVehicle ? (vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: "#006b47" }} /> : <Tram style={{ height: "22px", width: "22px", fill: "#007bff" }} />) : <AltRoute style={{ height: "22px", width: "22px", fill: vehicle?.type === "bus" ? "#006b47" : "#007bff" }} />}&nbsp;<BrowserView><b>{displayingVehicle ? "Pojazd" : "Trasa"}</b></BrowserView>
                                    </Button>
                            </div>
                        </Box>
                        <List
                            sx={{
                                overflow: "auto",
                                WebkitOverflowScrolling: "touch",
                                bgcolor: 'background.paper',
                                maxHeight: `calc(${snap}px - 85px)`,
                            }}
                        >

                            {displayingVehicle ? "tu niedługo będą informacje o pojeździe" : (trip?.stops.map(stop => (
                                <ListItem key={stop.stop_id}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 24, height: 24, backgroundColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}>
                                            <span style={{ fontSize: "15px" }}>{stop.stop_sequence}</span>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Button
                                        sx={{ width: "100%", color: stop.onLine - whereBus(vehicle.location) > -50 ? "black" : "gray", textTransform: "none", padding: "0" }}
                                        ref={(ref) => {
                                            stop.ref = ref;
                                            if (!scrolled && trip.stops.filter(st => st.onLine - whereBus(vehicle.location) > -50)[0]?.stop_id === stop.stop_id) {
                                                ref?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                setScrolled(true);
                                            }
                                        }}
                                    >
                                        <ListItemText onClick={() => {
                                            map.setView(stop.location, 16);
                                            stop.ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                        }}>
                                            <div style={{ float: "left" }}>
                                                {stop.on_request ? <PanTool style={{ width: "14px", height: "14px" }} /> : null} {stop.wheelchair_boarding ? null : <NotAccessible style={{ height: "18px", width: "18px", marginBottom: "-2px" }} />} {stop.stop_name}
                                            </div>
                                            <div style={{ float: "right" }}>
                                                {stop.onLine - whereBus(vehicle.location) > -50 ? (stop.onLine - whereBus(vehicle.location) < 85 ? "serving" : `${Math.floor((stop.onLine - whereBus(vehicle.location)) / 10)} metrów`) : null}
                                            </div>
                                        </ListItemText>
                                    </Button>
                                </ListItem>
                            )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} />, curr]))}
                        </List>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </>
    );

    function whereBus(location) {
        if (typeof location !== "object") return 0;
        return nearestPointOnLine(lineString(trip?.shapes), point(location), { units: 'meters' }).properties.location;
    }
}