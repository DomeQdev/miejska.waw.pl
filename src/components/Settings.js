import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { NotificationManager } from 'react-notifications';

export default function Main() {
    const navigate = useNavigate();
    const settings = localStorage.getItem("settings") ? JSON.parse(localStorage.getItem("settings")) : {};
    const [mapstyle, setMapstyle] = useState(settings.mapstyle || "osmdefault");
    const [customMapStyle, setcustomMapStyle] = useState(settings.customMapStyle || "");
    const [height, setHeight] = useState(settings.height || 400);

    return (
        <div>
            <Dialog
                open={true}
                onClose={() => navigate("/")}
                scroll={'paper'}
                PaperProps={{
                    style: {
                        backgroundColor: '#232a2f',
                        color: "white",
                        width: "100%"
                    },
                }}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Ustawienia mapy</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1} style={{ color: "white" }} component={"div"}>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label" style={{ color: "white" }}>Styl mapy</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                value={mapstyle}
                                onChange={({ target }) => setMapstyle(target.value)}
                            >
                                <FormControlLabel value="osmdefault" control={<Radio sx={{ '&': { color: 'white' } }} />} label="OSM Default" />
                                <FormControlLabel value="mapboxbasic" control={<Radio sx={{ '&': { color: 'white' } }} />} label="Mapbox Basic" />
                                <FormControlLabel value="mapboxmonochrame" control={<Radio sx={{ '&': { color: 'white' } }} />} label="Mapbox Monochrame" />
                                <FormControlLabel value="mapboxstreets" control={<Radio sx={{ '&': { color: 'white' } }} />} label="Mapbox Streets" />
                                <FormControlLabel value="mapboxsatellite" control={<Radio sx={{ '&': { color: 'white' } }} />} label="Mapbox Satellite" />
                                <FormControlLabel value="mapboxnavigation" control={<Radio sx={{ '&': { color: 'white' } }} />} label="Mapbox Navigation" />
                                <FormControlLabel value="custom" control={<Radio sx={{ '&': { color: 'white' } }} />} label="Własna mapa (zaawansowane)" />
                                {mapstyle === "custom" ? <><TextField
                                    autoFocus
                                    margin="dense"
                                    label="Tile Layer URL"
                                    placeholder='https://moja_mapa.org/{z}/{x}/{y}.png'
                                    type="url"
                                    fullWidth
                                    variant="standard"
                                    sx={{ color: 'white' }}
                                    value={customMapStyle}
                                    onChange={({ target }) => setcustomMapStyle(target.value)}
                                /><b>Jest to funkcja przeznaczona dla osób, które hostują własne mapy!</b><p>Link powinien zawierać {`{x}, {y} i {z}`} aby wszystko poprawnie działało. Link nie jest sprawdzany pod względem poprawności.</p></> : null}
                            </RadioGroup>
                        </FormControl>
                        <p style={{ height: "20px" }} />
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label" style={{ color: "white" }}>Długość okna z trasą pojazdu</FormLabel>
                            <TextField
                                margin="dense"
                                label="Długość w pikselach"
                                type="number"
                                fullWidth
                                variant="standard"
                                sx={{ color: 'white' }}
                                value={height}
                                onChange={({ target }) => setHeight(Number(target.value))}
                            />
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/")}>Anuluj</Button>
                    <Button onClick={() => {
                        if (mapstyle === "custom" && !customMapStyle) return NotificationManager.error("Podaj link do spersonalizowanej mapy lub zmień styl mapy.");
                        localStorage.setItem("settings", JSON.stringify({
                            mapstyle,
                            customMapStyle: mapstyle === "custom" ? customMapStyle : null,
                            height
                        }));
                        navigate("/");
                        window.location.reload();
                    }}>Zapisz</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}