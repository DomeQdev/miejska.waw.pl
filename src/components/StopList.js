import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function App({ trip, vehicles }) {
    return (
        <>
            <b>Domyśl się co tu jest napisane. Pozdrawiam.</b><br />
            {JSON.stringify(trip)}
        </>
    );
    function whereBus(location) {
        if(typeof location !== "object") return 0;
        return nearestPointOnLine(lineString(trip.shapes), point(location), { units: 'meters' }).properties.location;
    }
}