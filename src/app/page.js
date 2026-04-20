import GeocoderMap  from "./comp/GeocoderMap";
import attStyle from './pages/attrantions/attrantions.scss';

export default function Home() {
  return (
    <main className={attStyle}>
      <h1>Google Geocoder</h1>
      <GeocoderMap />
    </main>
  );
}