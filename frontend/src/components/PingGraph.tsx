import { useState, useEffect } from "react";
import { PingData } from "../types";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Typography, FormLabel, TextField } from "@mui/material";

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

export default function PingGraph({ isRunning }: { isRunning: boolean }) {
  const [pingData, setPingData] = useState<PingData[]>(
    new Array(100).fill({
      ip_address: "",
      time_ms: null,
      size: 0,
      time: "",
    })
  );
  const [maxPing, setMaxPing] = useState<number>(0);
  const [minPing, setMinPing] = useState<number>(0);
  const [avgPing, setAvgPing] = useState<number>(0);
  const [pingAddress, setPingAddress] = useState<string>("8.8.8.8");
  const [lossPercentage, setLossPercentage] = useState<number>(0);

  const calculateLoss = (data: PingData[]) => {
    const validData = data.filter((item) => item.ip_address);

    const loss = validData.filter((item) => item.time_ms === null).length;
    return loss / validData.length;
  };

  const ping = async () => {
    const response = await axios.get(
      `http://127.0.0.1:8000/ping?ip_address=${pingAddress}&size=64`
    );

    const data = response.data;
    // console.log(data);

    setPingData((prevArr) => {
      // Add new data to the end of the array
      const updatedArr = [...prevArr, data].slice(-100);

      //   Get only valid time_ms values
      const filteredData = updatedArr
        .map((item) => item.time_ms)
        .filter((item) => item !== null);

      // Calculate the max ping value
      setMaxPing(Math.max(...filteredData.map((item) => item)));

      // Calculate the min ping value
      setMinPing(Math.min(...filteredData.map((item) => item)));

      // Calculate the average ping value
      setAvgPing(
        filteredData.reduce((acc, curr) => acc + curr, 0) / filteredData.length
      );

      //   Calculate the loss percentage
      setLossPercentage(calculateLoss(updatedArr));

      // Return the last 100 elements
      return updatedArr;
    });
  };
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        ping();
      }, 500);
      return () => clearInterval(interval);
    } else {
      return () => {};
    }
  }, [isRunning]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#000407",
          padding: "10px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "center",
          height: "100%",
          width: "100%",
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
            height: "30%",
            gap: "10px",
          }}
        >
          {/* Address */}
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
              Host:
            </FormLabel>
            <TextField
              value={pingAddress}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                marginLeft: "10px",
                height: "30px",
                "& .MuiInputBase-root": {
                  height: "100%",
                },
              }}
              onChange={(e) => setPingAddress(e.target.value)}
            />
          </Box>
          {/* Max Ping */}
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
            <Typography
              sx={{
                color: "#fff",
              }}
            >
              Max: {maxPing.toFixed(1)} ms
            </Typography>
          </Box>
          {/* Min Ping */}
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
            <Typography
              sx={{
                color: "#fff",
              }}
            >
              Min: {minPing.toFixed(1)} ms
            </Typography>
          </Box>
          {/* Avg Ping */}
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
            <Typography
              sx={{
                color: "#fff",
              }}
            >
              Avg: {avgPing.toFixed(1)} ms
            </Typography>
          </Box>
          {/* Loss Percentage */}
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
            <Typography
              sx={{
                color: lossPercentage > 0 ? "rgb(231, 60, 62)" : "#fff",
              }}
            >
              Loss: {(lossPercentage * 100).toFixed(2)}%
            </Typography>
          </Box>
        </Box>
        {/* Graph Stuff */}
        <Box
          sx={{
            width: "100%",
            height: "70%",
            // backgroundColor: "green",
          }}
        >
          <Bar
            data={{
              labels: pingData.map((data) => data.time),
              datasets: [
                {
                  label: "Ping Time (ms)",
                  data: pingData.map((data) =>
                    data.time_ms === null ? 0 : data.time_ms
                  ),
                  backgroundColor: "rgb(99, 146, 221)",
                  barPercentage: 1,
                  categoryPercentage: 1,
                  yAxisID: "ping",
                },
                {
                  label: "Timeout",
                  data: pingData.map((data) =>
                    data.time_ms === null && data.ip_address ? maxPing : null
                  ),
                  backgroundColor: "rgba(231, 60, 62, 1)",
                  barPercentage: 1,
                  categoryPercentage: 1,
                  yAxisID: "ping",
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
                  stacked: true,
                },
                ping: {
                  type: "linear",
                  position: "right",
                  ticks: {
                    callback: (value) => `${value} ms`,
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
