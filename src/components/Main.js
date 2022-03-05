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

        wss.addEventListener("open", () => { NotificationManager.info('aby zobaczyć pojazdy.', 'Przybliż mapę'); setConnected(true); });
        wss.addEventListener("close", () => {
            NotificationManager.error('Połączenie z serwerem zostało przerwane.', 'Błąd!');
            setConnected(false);
        });
        wss.addEventListener("message", ({ data }) => setVehicles(JSON.parse(data)));
    }, [connected]);
    
    useEffect(() => NotificationManager.info('Załadowanie pojazdów może potrwać trochę dłużej. Przepraszamy.'), [])

    return (
        <>
            <Vehicles vehicles={vehicles} />
        </>
    );
}
