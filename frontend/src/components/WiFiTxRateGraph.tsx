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

export default function WiFiTxRateGraph({
  networkData,
}: {
  networkData: NetworkData[];
}) {
  const [txLimit, setTxLimit] = useState<number>(100);
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
                  ? networkData[networkData.length - 1].tx_rate > txLimit
                    ? "rgb(255, 255, 255)"
                    : "rgb(231, 60, 62)"
                  : "rgb(255, 255, 255)",
              height: "100%",
              border: "2px solid #fff",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            Tx Rate:{" "}
            {networkData.length > 0
              ? networkData[networkData.length - 1].tx_rate
              : ""}
            Mbps
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
              Tx Rate Limit:
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
                      return value > txLimit
                        ? "rgb(0, 145, 218)"
                        : "rgb(231, 60, 62)";
                    },

                    backgroundColor: (ctx) => {
                      const value = (ctx.p1 as any).raw;
                      return value > txLimit
                        ? "rgba(0, 145, 218, 0.3)"
                        : "rgba(231, 60, 62, 0.3)";
                    },
                  },
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
      </Box>
    </>
  );
}
