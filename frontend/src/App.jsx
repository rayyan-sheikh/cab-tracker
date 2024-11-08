import React, { useEffect, useState } from 'react'
import Map from './components/Map';

const App = () => {
  const [cabLocation, setCabLocation] = useState(null);

  useEffect(() => {
     const ws = new WebSocket('ws://localhost:4000');

     ws.onmessage = (event) => {
      const location = JSON.parse(event.data);
      setCabLocation(location);
     };

     return ()=> ws.close();
    }, []);

    
  return (
    <div>
      <h1>Cab Tracker</h1>
      <p>Waiting for cab data...</p>
      <Map />
    </div>
  )
}

export default App