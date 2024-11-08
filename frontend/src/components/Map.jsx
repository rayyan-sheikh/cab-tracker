import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

const Map = () => {
  const [cabs, setCabs] = useState({});

  useEffect(() => {
    
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const { cabId, cabLocation } = JSON.parse(event.data);

      // Update cab location in state
      setCabs((prevCabs) => ({
        ...prevCabs,
        [cabId]: cabLocation,
      }));
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Car icon using a local PNG image
  const carIcon = new L.Icon({
    iconUrl: '/icons/car-icon.png', 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });

  // Pin icon for Times Square
  const pinIcon = new L.Icon({
    iconUrl: '/icons/pin-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32],
  });

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer center={[40.7580, -73.9855]} zoom={13} style={{ height: "80%", width: "80%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* 2km radius circle around Times Square */}
        <Circle
          center={[40.7580, -73.9855]}
          radius={2000} // 2km radius
          color="blue"
          fillColor="blue"
          fillOpacity={0.2}
        />

        {/* Marker for Times Square with Pin icon */}
        <Marker position={[40.7580, -73.9855]} icon={pinIcon}>
          <Popup>Times Square</Popup>
        </Marker>

        {/* Markers for each cab with Car icon */}
        {Object.keys(cabs).map((cabId) => (
          <Marker key={cabId} position={[cabs[cabId].lat, cabs[cabId].lon]} icon={carIcon}>
            <Popup>{`Cab ID: ${cabId}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
