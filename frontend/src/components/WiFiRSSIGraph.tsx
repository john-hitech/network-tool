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
import { Box, TextField, FormLabel } from "@mui/material";
import InfoDisplayBox from "./InfoDisplayBox";
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

export default function WiFiRSSIGraph({ isRunning }: { isRunning: boolean }) {
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
  const [rssiLimit, setRssiLimit] = useState<number>(-75);
  const [currentRSSI, setCurrnetRSSI] = useState<number>(0);

  const { height, ref } = useResizeDetector();

  // useEffect(() => {
  //   console.log(width, height);
  // }, [width, height]);

  const getWifiData = async () => {
    const response = await axios.get("http://127.0.0.1:8000/wifi-data");
    const data = response.data;
    // console.log(data);

    setCurrnetRSSI(data.rssi);

    setNetworkData((prevArr) => {
      const updatedArr = [...prevArr, data];
      return updatedArr.slice(-100);
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
            title="RSSI"
            data={currentRSSI}
            unit="dBm"
            textColor={currentRSSI >= rssiLimit ? "#fff" : "rgb(231, 60, 62)"}
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
              RSSI Threshold:
            </FormLabel>
            <TextField
              type="number"
              value={rssiLimit}
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
              onChange={(e) => setRssiLimit(Number(e.target.value))}
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
                    label: "RSSI",
                    data: networkData.map((data) => data.rssi),
                    fill: "start",
                    pointRadius: 0,
                    tension: 0.2,
                    yAxisID: "rssi",
                    segment: {
                      borderColor: (ctx) => {
                        const value = (ctx.p1 as any).raw;
                        return value > rssiLimit
                          ? "rgb(67, 176, 42)"
                          : "rgb(231, 60, 62)";
                      },

                      backgroundColor: (ctx) => {
                        const value = (ctx.p1 as any).raw;
                        return value >= rssiLimit
                          ? "rgba(67, 176, 42, 0.3)"
                          : "rgba(231, 60, 62, 0.3)";
                      },
                    },
                  },
                  {
                    label: "RSSI Limit",
                    data: networkData.map(() => rssiLimit),
                    borderColor: "rgba(231, 60, 62, 0.5)",
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.2,
                    yAxisID: "rssi",
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
                  rssi: {
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
