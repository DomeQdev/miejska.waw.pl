import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Main() {
    const navigate = useNavigate();
    const settings = localStorage.getItem("settings") ? JSON.parse(localStorage.getItem("settings")) : {};
    const [mapstyle, setMapstyle] = useState(settings.mapstyle || "osmdefault");
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
                                <FormControlLabel value="osmdefault" control={<Radio sx={{'&':{color:'white'}}} />} label="OSM Default" />
                                <FormControlLabel value="mapboxbasic" control={<Radio sx={{'&':{color:'white'}}} />} label="Mapbox Basic" />
                                <FormControlLabel value="mapboxmonochrame" control={<Radio sx={{'&':{color:'white'}}} />} label="Mapbox Monochrame" />
                                <FormControlLabel value="mapboxstreets" control={<Radio sx={{'&':{color:'white'}}} />} label="Mapbox Streets" />
                                <FormControlLabel value="mapboxsatellite" control={<Radio sx={{'&':{color:'white'}}} />} label="Mapbox Satellite" />
                                <FormControlLabel value="mapboxnavigation" control={<Radio sx={{'&':{color:'white'}}} />} label="Mapbox Navigation" />                                
                            </RadioGroup>
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/")}>Anuluj</Button>
                    <Button onClick={() => {
                        localStorage.setItem("settings", JSON.stringify({ 
                            mapstyle
                        }));
                        navigate("/");
                        window.location.reload();
                    }}>Zapisz</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}