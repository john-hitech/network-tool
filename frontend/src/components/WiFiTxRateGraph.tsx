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

export default function WiFiTxRateGraph({ isRunning }: { isRunning: boolean }) {
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
  const [txLimit, setTxLimit] = useState<number>(100);
  const [currentTxRate, setCurrentTxRate] = useState<number | null>(null);

  const { height, ref } = useResizeDetector();

  // useEffect(() => {
  //   console.log(width, height);
  // }, [width, height]);

  const getWifiData = async () => {
    const response = await axios.get("http://127.0.0.1:8000/wifi-data");
    const data = response.data;
    // console.log(data);

    setCurrentTxRate(data.tx_rate);

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
            data={currentTxRate}
            unit="dBm"
            textColor={
              !currentTxRate
                ? "#fff"
                : currentTxRate >= txLimit
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
              Tx Rate Threshold:
            </FormLabel>
            <TextField
              type="number"
              value={txLimit}
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
                    min: 0,
                    max: 1000,
                    step: 1,
                  },
                },
              }}
              onChange={(e) => setTxLimit(Number(e.target.value))}
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
                    label: "Tx Rate",
                    data: networkData.map((data) => data.tx_rate),
                    borderColor: "rgb(0, 0, 255)",
                    pointRadius: 0,
                    tension: 0.2,
                    fill: "start",
                    yAxisID: "tx",
                    segment: {
                      borderColor: (ctx) => {
                        const value = (ctx.p1 as any).raw;
                        return value >= txLimit
                          ? "rgb(0, 145, 218)"
                          : "rgb(231, 60, 62)";
                      },

                      backgroundColor: (ctx) => {
                        const value = (ctx.p1 as any).raw;
                        return value >= txLimit
                          ? "rgba(0, 145, 218, 0.3)"
                          : "rgba(231, 60, 62, 0.3)";
                      },
                    },
                  },
                  {
                    label: "RSSI Limit",
                    data: networkData.map(() => txLimit),
                    borderColor: "rgba(231, 60, 62, 0.5)",
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.2,
                    yAxisID: "tx",
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
                  tx: {
                    type: "linear",
                    position: "right",
                    min: 0,
                    max: 1000,
                    ticks: {
                      callback: (value) => `${value} Mbps`,
                      stepSize: 100,
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
