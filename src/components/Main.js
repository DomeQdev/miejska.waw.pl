import { useState, useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import Vehicles from './Vehicles';

export default function Main() {
    const [vehicles, setVehicles] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (connected) return;
        let wss = new WebSocket('wss://ws.domeqalt.repl.co');
        setConnected(true);
        fetch('https://ws.domeqalt.repl.co').then(res => res.json()).then(res => setVehicles(res));

        wss.addEventListener("open", () => { NotificationManager.info('aby zobaczyć pojazdy.', 'Przybliż mapę'); setConnected(true); });
        wss.addEventListener("close", () => {
            NotificationManager.error('Połączenie z serwerem zostało przerwane.', 'Błąd!');
            setConnected(false);
        });
        wss.addEventListener("message", ({ data }) => setVehicles(JSON.parse(data)));
    }, [connected]);

    return (
        <>
            <Vehicles vehicles={vehicles} />
        </>
    );
}
