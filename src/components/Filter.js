import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, OutlinedInput, InputLabel, MenuItem, FormControl, ListItemText, Select, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Main({ vehicles }) {
    const navigate = useNavigate();
    const settings = localStorage.getItem("filter") ? JSON.parse(localStorage.getItem("filter")) : {};
    const [data, setData] = useState({});
    const [carrier, setCarrier] = useState(settings?.carrier || []);
    const [depot, setDepot] = useState(settings?.depot || []);
    const [vehicle, setVehicle] = useState(settings?.vehicle || []);
    const [line, setLine] = useState(settings?.line || []);

    useEffect(() => {
        setData({
            carrier: ["MZA", "Arriva"],
            depot: [{
                name: "Depot 1",
                carrier: "MZA"
            },
            {
                name: "Depot 2",
                carrier: "Arriva"
            }],
            models: [
                {
                    brand: "Solaris",
                    model: "Urbino 18 ultra super pro",
                    used: ["bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus1234", "bus2345", "bus3456", "bus4567", "bus5678", "bus6789", "bus7890", "bus8901", "bus9012", "bus0123", "bus12"]
                }
            ]
        });
    }, [])

    return (
        <div>
            <Dialog
                open={true}
                onClose={() => navigate("/")}
                scroll={'paper'}
                PaperProps={{
                    style: {
                        width: "100%"
                    },
                }}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Filtrowanie pojazdów (nie filtruje, prototyp)</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1} component={"div"} sx={{ color: "black" }}>
                        {/*<FormControl sx={{ m: 1, width: 250 }}>
                            <InputLabel>Przewoźnik</InputLabel>
                            <Select
                                multiple
                                value={carrier}
                                onChange={({ target }) => {setCarrier(target.value);setDepot(depot.filter(x => target.value.length ? target.value.includes(x.carrier) : true))}}
                                input={<OutlinedInput label="Przewoźnik" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {data?.carrier ? data.carrier.map((ca) => (
                                    <MenuItem key={ca} value={ca}>
                                        <Checkbox checked={carrier.indexOf(ca) > -1} />
                                        <ListItemText primary={ca} />
                                    </MenuItem>
                                )) : null}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 250 }}>
                            <InputLabel>Zajezdnia</InputLabel>
                            <Select
                                multiple
                                value={depot}
                                onChange={({ target }) => setDepot(target.value.filter(x => carrier.length ? carrier.includes(x.carrier) : true))}
                                input={<OutlinedInput label="Zajezdnia" />}
                                renderValue={(selected) => selected.filter(x => carrier.length ? carrier.includes(x.carrier) : true).map(x => x.name).join(', ')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {data?.depot ? data.depot.filter(key => carrier.length ? carrier.includes(key.carrier) : true).map((ca) => (
                                    <MenuItem key={ca.name} value={ca}>
                                        <Checkbox checked={depot.find(x => x.name === ca.name) ? true : false} />
                                        <ListItemText primary={ca.name} />
                                    </MenuItem>
                                )) : null}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 250 }}>
                            <InputLabel>Model pojazdu</InputLabel>
                            <Select
                                multiple
                                value={vehicle}
                                onChange={({ target }) => setVehicle(target.value)}
                                input={<OutlinedInput label="Model pojazdu" />}
                                renderValue={(selected) => selected.map(x => `${x.brand} ${x.model}`).join(', ')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {data?.models ? data.models.map((ca) => (
                                    <MenuItem key={`${ca.brand} ${ca.model}`} value={ca}>
                                        <Checkbox checked={vehicle.find(x => x.model === ca.model && x.brand === ca.brand) ? true : false} />
                                        <ListItemText primary={`${ca.brand} ${ca.model}`} />
                                    </MenuItem>
                                )) : null}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 250 }}>
                            <InputLabel>Linia</InputLabel>
                            <Select
                                multiple
                                value={line}
                                onChange={({ target }) => setLine(target.value)}
                                input={<OutlinedInput label="Linia" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {data?.models ? data.models.map((ca) => (
                                    <MenuItem key={`${ca.brand} ${ca.model}`} value={ca}>
                                        <Checkbox checked={vehicle.find(x => x.model === ca.model && x.brand === ca.brand) ? true : false} />
                                        <ListItemText primary={`${ca.brand} ${ca.model}`} />
                                    </MenuItem>
                                )) : null}
                            </Select>
                                </FormControl>*/}
                                <b>Funkcja niedostępna, poczekaj do 10 dni =)</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/")}>Anuluj</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}