import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, OutlinedInput, InputLabel, MenuItem, FormControl, ListItemText, Select, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Main() {
    const navigate = useNavigate();
    const settings = localStorage.getItem("filter") ? JSON.parse(localStorage.getItem("filter")) : {};
    const [data, setData] = useState({});
    const [carrier, setCarrier] = useState(settings?.carrier || []);
    const [depot, setDepot] = useState(settings?.depot || []);

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
            }]
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
                        <FormControl sx={{ m: 1, width: 250 }}>
                            <InputLabel>Przewoźnik</InputLabel>
                            <Select
                                multiple
                                value={carrier}
                                onChange={({ target }) => setCarrier(target.value)}
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
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/")}>Anuluj</Button>
                    <Button onClick={() => {
                        localStorage.setItem("filter", JSON.stringify({
                            carrier,
                            depot: depot.filter(x => carrier.length ? carrier.includes(x.carrier) : true)
                        }));
                        navigate("/");
                        window.location.reload();
                    }}>Zapisz</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}