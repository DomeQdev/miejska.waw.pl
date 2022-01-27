import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

export default function App({ vehicle, stop }) {
    return (
        <Marker
            key={stop.stop_id}
            position={stop.location}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker bg-${vehicle.type}`} title={`${stop.stop_name} ${stop.on_request ? "(Ż)" : ""}`}><span className={"stop-sequence"}>{stop.stop_sequence}</span></button>),
                iconSize: [12, 12],
                iconAnchor: [12, 12],
                popupAnchor: [0, -10],
            })}
        >
            <Popup>
                {stop.zone === "1/2" ? <p style={{ color: "#ff0000", fontSize: "15px" }}><FontAwesomeIcon icon={faExclamationCircle} /> <b>UWAGA!</b> Granica strefy biletowej.</p> : ""}
                <div className="stop-info text-1xl">{stop.on_request ? <FontAwesomeIcon icon={faHandPaper} /> : null} <b>{stop.stop_name}</b></div>
            </Popup>
        </Marker>
    )
}