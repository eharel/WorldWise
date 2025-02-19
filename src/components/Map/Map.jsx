// import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./Map.module.css";
import { useCitiesContext } from "../../hooks/useContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import Button from "../Button/Button";
import { useUrlPosition } from "../../hooks/useUrlPosition";

/* -------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-------------------------------------------------------------------------- MAP COMPONENT
----------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */
function Map() {
  const { cities } = useCitiesContext();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const navigate = useNavigate();

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition: getGeolocationPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);

        navigate(
          `form?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`
        );

        // setMapPosition(geolocationPosition.lat, geolocationPosition.lng);
      }
    },
    [geolocationPosition, navigate]
  );

  /* -------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------- MAIN RETURN
  ------------------------------------------------------------------------------------- */
  return (
    <div
      className={styles.mapContainer}
      // onClick={() => navigate(`form?lat=${123}&lng=${567}`)}
    >
      {!geolocationPosition && (
        <Button type="position" onClick={getGeolocationPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={7}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span> <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={[mapPosition[0], mapPosition[1]]} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.closePopup();
  map.setView(position);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
