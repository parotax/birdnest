import { useState, useEffect } from "react";
import "../styles.css";

const Map = () => {
  const [pos, setPos] = useState<{ x: number; y: number }[]>([]);

  const getDrones = async () => {
    const data = await (
      await fetch("https://birdnest-backend.fly.dev/api/dronePositions")
    ).json();

    setPos(data);
  };

  useEffect(() => {
    const setDrones = setInterval(() => {
      getDrones();
    }, 2000);
    return () => {
      clearInterval(setDrones);
    };
  }, []);

  return (
    <div className="map">
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        height={Math.min(window.innerHeight, window.innerWidth) * 0.95}
      >
        <rect
          width="100%"
          height="100%"
          rx="8"
          fill="none"
          stroke="gray"
          strokeOpacity="0.6"
        />
        <circle cx="250" cy="250" r="3" fill="green" />
        <circle
          cx="250"
          cy="250"
          r="100"
          stroke="red"
          fill="none"
          strokeWidth="5"
          strokeOpacity="0.6"
        />
        {pos.map((drone, i) => {
          return Math.sqrt((250000 - drone.x) ** 2 + (250000 - drone.y) ** 2) >
            100000 ? (
            <circle
              cx={drone.x / 1000}
              cy={drone.y / 1000}
              r="5"
              fill="blue"
              key={i}
            />
          ) : (
            <circle
              cx={drone.x / 1000}
              cy={drone.y / 1000}
              r="5"
              fill="red"
              key={i}
              fillOpacity="0.6"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Map;
