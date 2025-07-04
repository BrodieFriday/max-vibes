import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, useMapEvents, ZoomControl } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// A component to update the map's view when the position prop changes
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// New component to fetch and display hospitals
function HospitalLayer() {
    const [hospitals, setHospitals] = useState([]);

    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            const overpassQuery = `
                [out:json][timeout:25];
                (
                  node["amenity"="hospital"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
                  way["amenity"="hospital"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
                  relation["amenity"="hospital"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
                );
                out center;
            `;
            
            fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: "data=" + encodeURIComponent(overpassQuery)
            })
            .then(response => response.json())
            .then(data => {
                setHospitals(data.elements);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
        },
    });

    // Custom icon for hospitals
    const hospitalIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1005/1005135.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    return (
        <>
            {hospitals.map(hospital => {
                const pos = hospital.type === 'node' 
                    ? [hospital.lat, hospital.lon] 
                    : [hospital.center.lat, hospital.center.lon];
                return (
                    <Marker key={hospital.id} position={pos} icon={hospitalIcon}>
                        <Popup>
                            <b>{hospital.tags.name || 'Hospital'}</b>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

import 'leaflet-routing-machine';

// ... (rest of the imports and components are the same)

// New component for routing
function Routing({ waypoints }) {
    const map = useMap();

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(waypoints[0][0], waypoints[0][1]),
                L.latLng(waypoints[1][0], waypoints[1][1])
            ],
            routeWhileDragging: true,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, waypoints]);

    return null;
}

function MapComponent({ position, markerInfo, waypoints }) {
    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <ZoomControl position="topright" />
            <ChangeView center={position} zoom={13} />

            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name={`<img src='https://tile.openstreetmap.org/14/8192/5461.png' class='layer-icon' /> <span>Standard</span>`}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={`<img src='https://tile.opentopomap.org/14/8192/5461.png' class='layer-icon' /> <span>Terrain</span>`}>
                    <TileLayer
                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={`<img src='https://a.tile-cyclosm.openstreetmap.fr/cyclosm/14/8192/5461.png' class='layer-icon' /> <span>Bike</span>`}>
                     <TileLayer
                        url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            <HospitalLayer />

            {markerInfo && (
                <Marker position={markerInfo.position}>
                    <Popup>
                        <b>{markerInfo.name}</b>
                        <br />
                        Lat: {markerInfo.position[0].toFixed(5)}, Lon: {markerInfo.position[1].toFixed(5)}
                    </Popup>
                </Marker>
            )}

            {waypoints.length > 0 && <Routing waypoints={waypoints} />}
        </MapContainer>
    );
}

export default MapComponent;
