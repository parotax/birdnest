import express from "express";
import dotenv from "dotenv";
import * as https from "https";
import convert from "xml-js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Lists containing drone information.
const violatingDrones = [];
const dronePositions = [];

// Calculates the distance of the drone from the nest using Pythagorean theorem.
const pythagoras = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

// Function for updating lists containing drone information.
const getDrones = () => {
  https
    .get("https://assignments.reaktor.com/birdnest/drones", (res) => {
      let data = "";
      dronePositions.length = 0;
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          convert
            .xml2js(data, { compact: true })
            .report.capture.drone.forEach((drone) => {
              // Replace old drone positions with current positions.
              dronePositions.push({
                x: drone.positionX._text,
                y: drone.positionY._text,
              });

              // Check if the drone is violating the no-fly zone.
              if (checkViolation(drone)) {
                // If the drone is already in the violatingDrones list, update its information.
                if (
                  violatingDrones.some(
                    (element) =>
                      element.serialNumber === drone.serialNumber._text
                  )
                ) {
                  updateViolatingDrone(drone);
                } else {
                  // If the drone is not in the violatingDrones list, add it.
                  addViolatingDrone(drone);
                }
              }
            });
        } catch {
          console.log("invalid drone data");
        }
      });
    })
    .on("error", (error) => {
      console.log("getDrones() failed.", error);
    });
};

// Function to update violating drone in violatingDrones
const updateViolatingDrone = (drone) => {
  drone.lastViolation = Date.now();

  // Update the closest distance of the drone to the nest if necessary.
  if (
    drone.closestToNest >
    pythagoras(250000, 250000, drone.positionX._text, drone.positionY._text)
  ) {
    drone.closestToNest = pythagoras(
      250000,
      250000,
      drone.positionX._text,
      drone.positionY._text
    );
  }

  Object.assign(
    violatingDrones.filter(
      (element) => element.serialNumber._text === drone.serialNumber._text
    ),
    drone
  );
};

// Function to add violating drone to violatingDrones.
const addViolatingDrone = (drone) => {
  const violatingDrone = {
    lastViolation: Date.now(),
    closestToNest: pythagoras(
      250000,
      250000,
      drone.positionX._text,
      drone.positionY._text
    ),
    serialNumber: drone.serialNumber._text,
  };

  fetch(
    `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber._text}`
  )
    .then((response) => {
      if (response.status === 404) {
        console.log(
          "Pilot not found for serial number",
          drone.serialNumber._text
        );
      } else {
        return response.json();
      }
    })
    .then((data) => {
      Object.assign(data, violatingDrone);
      violatingDrones.push(data);
    })
    .catch((error) => {
      console.log("addViolatingDrone() failed.", error);
    });
};

// Function for checking if drone is violating the NDZ.
const checkViolation = (drone) => {
  if (
    pythagoras(250000, 250000, drone.positionX._text, drone.positionY._text) <
    100000
  ) {
    return true;
  } else {
    return false;
  }
};

// Function for removing drone from violatingDrones list after being there for 10 minutes.
const removeOutdated = () => {
  for (let i = 0; i < violatingDrones.length; i++) {
    if (Date.now() - violatingDrones[i].lastViolation > 600000) {
      violatingDrones.splice(i, 1);
      i--;
    }
  }
};

// Gets list of violating drones.
app.get("/api/violatingDrones", (request, response) => {
  response.send(violatingDrones);
});

// Gets list of positions of all the drones.
app.get("/api/dronePositions", (request, response) => {
  response.send(dronePositions);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run function to update lists containing drone information and
// removing outdated violations every time the snapshot updates.
setInterval(() => {
  getDrones();
  removeOutdated();
}, 2000);
