import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import Main from './components/Main';

export default function App() {
  return (
    <>
      <MapContainer center={localStorage.bounds?.split(",") || [52.22983095298667, 21.0117354814593]} zoom={localStorage.zoom || 16} minZoom={7} maxZoom={18} style={{ width: "100%", height: `100vh` }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Main />
      </MapContainer>
      <NotificationContainer />
    </>
  );
}