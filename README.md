# Real Time Cab Tracker Node.js, React.js, WebSockets, Redis
This is a page to track cab location on a map in real time. 
I used a simulation to change location of cabs because I dont have access to the real time location of cabs.
# Right now there is only one point and from there we can see the cabs available, but to scale up the project the following features can be added:
# 1. Ability to choose current location.
# 2. Ability to change search radius.
# 3. Real-time location of actaul cabs can be used.

If using real location, Redis Geospatial Data Structure can be used instead of JSON that I used here.

I used docker container to run Redis, Backend and Frontend
