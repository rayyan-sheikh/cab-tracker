const express = require("express");
const WebSocket = require("ws");
const redis = require("redis");
const dotenv = require("dotenv");
const { getDistance, getCenter, getRandomPoint } = require("geolib");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const timesSquare = {
  latitude: 40.7580,
  longitude: -73.9855
};

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect();

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });


const generateRandomLocation = () => {
  const radiusInMeters = 2000; // 2 km in meters
  const randomAngle = Math.random() * 2 * Math.PI; 
  const randomDistance = Math.random() * radiusInMeters;


  const deltaLat = (randomDistance * Math.cos(randomAngle)) / 111320;
  const deltaLon = (randomDistance * Math.sin(randomAngle)) / (40008000 * Math.cos(timesSquare.latitude * (Math.PI / 180)) / 360);

  const randomLat = timesSquare.latitude + deltaLat;
  const randomLon = timesSquare.longitude + deltaLon;

  return { lat: randomLat, lon: randomLon };
};


const cabs = {};
const numberOfCabs = 7;

for (let i = 1; i <= numberOfCabs; i++) {
  cabs[`cab_${i}`] = generateRandomLocation();
}


const moveCab = (cabId) => {
  const radiusInMeters = 2000;
  const randomAngle = Math.random() * 2 * Math.PI; 
  const randomDistance = Math.random() * 10; 
  
  const deltaLat = randomDistance * Math.cos(randomAngle) / 111320; 
  const deltaLon = randomDistance * Math.sin(randomAngle) / (40008000 * Math.cos(cabs[cabId].lat * (Math.PI / 180)) / 360);

  
  cabs[cabId].lat += deltaLat;
  cabs[cabId].lon += deltaLon;

  return cabs[cabId];
};


wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (data) => console.log(`Received: ${data}`));
});


setInterval(async () => {
  for (let i = 1; i <= numberOfCabs; i++) {
    const cabId = `cab_${i}`;
    const cabLocation = moveCab(cabId);
    await redisClient.set(`${cabId}_location`, JSON.stringify(cabLocation));

    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ cabId, cabLocation }));
      }
    });
  }
}, 2000);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
