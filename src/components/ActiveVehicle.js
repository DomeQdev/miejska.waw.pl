import { useEffect } from 'react';
import { useParams } from "react-router-dom";

export default function ActiveVehicle() {
    const params = useParams();

    useEffect(() => {
        window.location.href = `https://beta.freewifi.waw.pl/${params.type}/${params.bus}`;
    }, []);

    return (<></>);
}