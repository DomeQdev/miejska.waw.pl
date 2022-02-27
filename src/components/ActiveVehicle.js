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
    const settings = localStorage.getItem("settings") ? JSON.parse(localStorage.getItem("settings")) : {};
    const [scrolled, setScrolled] = useState(false);
    const [displayingVehicle, setDisplayingVehicle] = useState(false);
    const [vehicle, setVehicle] = useState(null);
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        if (!vehicles.length) return;
        let v = vehicles.find(vehicle => vehicle.tab === params.bus && vehicle.type === params.type);
        if (!v) {
            if(params.bus === "egg") {
                NotificationManager.success("Za parę miesięcy, będzie tu tramwaj.");
            } else {
                NotificationManager.error(vehicle ? "Utracono połączenie z pojazdem." : "Nie ma tego pojazdu na trasie.");
            }
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
        if (!vehicleInfo) fetch(`https://vehicles.domeqalt.repl.co/?vehicle=${v.type}${v.tab.split("+")[0]}`).then(res => res.json()).then(res => setVehicleInfo(res)).catch(() => setVehicleInfo({ error: "Przepraszamy, pojazdu nadal nie ma w naszej bazie danych. Daj nam do 10 minut na pobranie go." }));
    }, [vehicles]);

    return (
        <>
            {!vehicle || <VehicleMarker vehicle={vehicle} active={true} trip={trip} />}
            {!trip || <Polyline positions={trip?.shapes} pathOptions={{ color: vehicle?.type === "bus" ? "#006b47" : "#007bff", weight: 7 }} />}
            {!trip || trip?.stops.map(stop => <StopMarker key={stop.stop_id} vehicle={vehicle} stop={stop} trip={trip} clickCallback={() => stop.ref.scrollIntoView({ behavior: 'smooth', block: 'start' })} />)}
            <Sheet
                isOpen={true}
                onClose={() => navigate("/")}
                initialSnap={0}
                snapPoints={trip ? [settings.height || 400, 0] : [100, 0]}
            >
                <Sheet.Container>
                    <Sheet.Header>
                        <span />
                    </Sheet.Header>
                    <Sheet.Content style={{ maxHeight: `${settings.height || 400}px` }}>
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
                                    {vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: "#006b47" }} /> : <Tram style={{ height: "22px", width: "22px", fill: "#007bff" }} />}&nbsp;<b>{trip?.route_id}</b>&nbsp;<span style={{ maxWidth: "calc(100vw - 220px)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{trip ? (trip?.stops.filter(st => st.onLine - whereBus(vehicle.location) > -50)[0].stop_sequence === 1 ? <AutoChange timeout={3500} text={[trip?.trip_headsign, new Date(trip?.stops[0]?.departure_time)]} /> : trip?.trip_headsign) : "Ładowanie..."}</span>&nbsp;{trip?.wheelchair_accessible ? <Accessible style={{ height: "22px", width: "22px" }} /> : <NotAccessible style={{ height: "22px", width: "22px" }} />}
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="outlined"
                                    style={{ color: "#000000", borderColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}
                                    title={!displayingVehicle ? "Wyświetl informacje o pojeździe" : "Wyświetl trasę"}
                                    onClick={() => {
                                        if (vehicleInfo.error) return NotificationManager.error(displayingVehicle.error);
                                        setDisplayingVehicle(!displayingVehicle);
                                        setScrolled(false);
                                    }}
                                >
                                    {displayingVehicle ? (vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: "#006b47" }} /> : <Tram style={{ height: "22px", width: "22px", fill: "#007bff" }} />) : <AltRoute style={{ height: "22px", width: "22px", fill: vehicle?.type === "bus" ? "#006b47" : "#007bff" }} />}&nbsp;<BrowserView><b>{displayingVehicle ? "Pojazd" : "Trasa"}</b></BrowserView>
                                </Button>
                            </div>
                        </Box>
                        {displayingVehicle ?
                            <div style={{ maxHeight: `${(settings.height || 400) - 85}px`, WebkitOverflowScrolling: "touch", paddingLeft: "20px", overflow: "auto" }}>
                                <h3>{vehicleInfo?.brand} {vehicleInfo?.model}</h3>
                                <b>Rok produkcji:</b> {vehicleInfo?.prodYear}<br />
                                <b>Numer boczny:</b> {vehicle?.tab}<br />
                                <b>Brygada:</b> {vehicle?.brigade}<br />
                                {vehicleInfo?.description ? <><b>Opis pojazdu:</b> {vehicleInfo?.description}<br /></> : null}
                                {vehicleInfo?.registration ? <><b>Numer rejestracyjny:</b> {vehicleInfo?.registration}<br /></> : null}
                                {vehicleInfo?.carrier ? <><b>Przewoźnik:</b> {vehicleInfo?.carrier}<br /></> : null}
                                {vehicleInfo?.depot ? <><b>Zajezdnia:</b> {vehicleInfo?.depot}<br /></> : null}
                                {vehicleInfo?.features?.length ? <><b>Wyposażenie:</b> {vehicleInfo?.features?.join(", ")}<br /></> : null}
                                {vehicle?.tab?.includes("+") ? `Informacje są pobierane z wagonu #${vehicle?.tab?.split("+")[0]}.` : null}
                            </div> : <List sx={{ overflow: "auto", WebkitOverflowScrolling: "touch", bgcolor: 'background.paper', maxHeight: `${(settings.height || 400) - 85}px` }}>
                                {trip?.stops.map(stop => (
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
                                                <div style={{ float: "left", textAlign: "left" }}>
                                                    {stop.on_request ? <PanTool style={{ width: "14px", height: "14px" }} /> : null} {stop.wheelchair_boarding ? null : <NotAccessible style={{ height: "18px", width: "18px", marginBottom: "-2px" }} />} {stop.stop_name}
                                                </div>
                                                <div style={{ float: "right", textAlign: "right" }}>
                                                    {stop.onLine - whereBus(vehicle.location) > -50 ? (stop.onLine - whereBus(vehicle.location) < 85 ? null : `${Math.floor((stop.onLine - whereBus(vehicle.location)) / 10)} metrów`) : null}
                                                </div>
                                            </ListItemText>
                                        </Button>
                                    </ListItem>
                                )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} />, curr])}
                            </List>}
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