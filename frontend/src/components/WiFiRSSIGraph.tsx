import { useState } from "react";
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
import { Box, Typography, TextField, FormLabel } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function WiFiRSSIGraph({
  networkData,
}: {
  networkData: NetworkData[];
}) {
  const [rssiLimit, setRssiLimit] = useState<number>(-75);
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#000407",
          padding: "10px",
          borderRadius: "10px",
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
            gap: "10px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color:
                networkData.length > 0
                  ? networkData[networkData.length - 1].rssi >= rssiLimit
                    ? "rgb(255, 255, 255)"
                    : "rgb(231, 60, 62)"
                  : "rgb(255, 255, 255)",
              height: "100%",
              border: "2px solid #fff",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            RSSI:{" "}
            {networkData.length > 0
              ? networkData[networkData.length - 1].rssi
              : ""}
            dBm
          </Typography>
          <Box
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
        <Box
          sx={{
            width: "90vw",
            height: "20vh",
          }}
        >
          <Line
            className="chart"
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
      </Box>
    </>
  );
}
