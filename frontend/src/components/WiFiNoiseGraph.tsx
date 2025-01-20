import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { NetworkData } from "../types";
import InfoDisplayBox from "./InfoDisplayBox";
import { Box, TextField, FormLabel } from "@mui/material";
import { useResizeDetector } from "react-resize-detector";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const heightThreshold = 77;

export default function WiFiNoiseGraph({
  resetTrigger,
  isRunning,
  timeFrame,
  timeInterval,
}: {
  resetTrigger: boolean;
  isRunning: boolean;
  timeFrame: number;
  timeInterval: number;
}) {
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
  const [noiseLimit, setNoiseLimit] = useState<number>(-80);
  const [currentNoise, setCurrentNoise] = useState<number | null>(null);

  const { height, ref } = useResizeDetector();

  // useEffect(() => {
  //   console.log(width, height);
  // }, [width, height]);

  const getWifiData = async () => {
    const response = await axios.get("http://127.0.0.1:8000/wifi-data");
    const data = response.data;
    // console.log(data);

    setCurrentNoise(data.noise);

    setNetworkData((prevArr) => {
      const updatedArr = [...prevArr, data];
      return updatedArr.slice(-(timeFrame / timeInterval));
    });
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        getWifiData();
      }, 500);
      return () => clearInterval(interval);
    } else {
      return () => {};
    }
  }, [isRunning]);

  useEffect(() => {
    setNetworkData([]);
  }, [timeFrame, timeInterval, resetTrigger]);

  return (
    <>
      <Box
        ref={ref}
        sx={{
          backgroundColor: "#000407",
          padding: "10px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Top Bar Stuff */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "red",
            width: "100%",
            height: (height ?? 0) > heightThreshold ? "30%" : "100%",
            gap: "10px",
          }}
        >
          <InfoDisplayBox
            title="Noise"
            data={currentNoise}
            unit="dBm"
            textColor={
              !currentNoise
                ? "#fff"
                : currentNoise <= noiseLimit
                ? "#fff"
                : "rgb(231, 60, 62)"
            }
          />
          <Box
            className="no-drag"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <FormLabel
              sx={{
                color: "#fff",
              }}
            >
              Noise Threshold:
            </FormLabel>
            <TextField
              type="number"
              value={noiseLimit}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                marginLeft: "10px",
                height: "30px",
                "& .MuiInputBase-root": {
                  height: "100%",
                },
              }}
              slotProps={{
                input: {
                  inputProps: {
                    min: -100,
                    max: 0,
                    step: 1,
                  },
                },
              }}
              onChange={(e) => setNoiseLimit(Number(e.target.value))}
            />
          </Box>
        </Box>
        {/* Graph Stuff */}
        {(height ?? 0) > heightThreshold ? (
          <Box
            sx={{
              width: "100%",
              height: "70%",
            }}
          >
            <Line
              data={{
                labels: networkData.map((data) => data.time),
                datasets: [
                  {
                    label: "Noise",
                    data: networkData.map((data) => data.noise),
                    pointRadius: 0,
                    tension: 0.2,
                    fill: "start",
                    yAxisID: "noise",
                    segment: {
                      borderColor: (ctx) => {
                        const value = (ctx.p1 as any).raw;
                        return value <= noiseLimit
                          ? "rgb(0, 218, 153)"
                          : "rgb(231, 60, 62)";
                      },

                      backgroundColor: (ctx) => {
                        const value = (ctx.p1 as any).raw;
                        return value <= noiseLimit
                          ? "rgba(0, 218, 153, 0.3)"
                          : "rgba(231, 60, 62, 0.3)";
                      },
                    },
                  },
                  {
                    label: "Noise Limit",
                    data: networkData.map(() => noiseLimit),
                    borderColor: "rgba(231, 60, 62, 0.5)",
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.2,
                    yAxisID: "noise",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 0,
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,
                    intersect: false,
                  },
                },
                scales: {
                  x: {
                    display: false,
                  },
                  noise: {
                    type: "linear",
                    position: "right",
                    min: -100,
                    max: -25,
                    ticks: {
                      callback: (value) => `${value} dBm`,
                      stepSize: 5,
                    },
                  },
                },
              }}
            />
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}
