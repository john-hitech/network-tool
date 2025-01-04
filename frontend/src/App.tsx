import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Slider } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { NetworkData } from "./types";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function App() {
  const [isRunning, setIsRunning] = useState(true);
  const [rssi, setRssi] = useState(0);
  const [txRate, setTxRate] = useState(0);
  const [channel, setChannel] = useState("");
  const [mode, setMode] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
  const [rssiLimit, setRssiLimit] = useState(-75);
  const [txLimit, setTxLimit] = useState(100);
  const [rssiMinMax, setRssiMinMax] = useState([-90, -25]);

  const resetData = () => {
    setNetworkData([]);
  };

  const pauseData = () => {
    setIsRunning(!isRunning);
  };

  const getWifiData = async () => {
    const response = await axios.get("http://127.0.0.1:8000/wifi-data");
    const data = response.data;
    // console.log(data);

    setRssi(data.rssi);
    setTxRate(data.tx_rate);
    setIpAddress(data.ip_address);
    setChannel(data.channel);
    setMode(data.physical_mode);

    setNetworkData((prevArr) => {
      const updatedArr = [...prevArr, data];
      return updatedArr.slice(-100);
    });
  };

  useEffect(() => {
    // Remove these later
    setRssiLimit(-75);
    setTxLimit(100);
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
      <div className="container">
        <p>IPv4 Address: {ipAddress}</p>
        <p>Channel: {channel}</p>
        <p>Mode: {mode}</p>
        <p>RSSI: {rssi} dBm</p>
        <p>Tx Rate: {txRate} Mbps</p>
        <Button type="primary" onClick={pauseData}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button type="primary" onClick={resetData}>
          Reset
        </Button>
        <Slider
          range
          defaultValue={[-25, -90]}
          min={-120}
          max={0}
          onChange={(e) => {
            setRssiMinMax(e);
          }}
        />
      </div>
      <div className="chart-container">
        <Line
          className="chart"
          data={{
            // labels: networkData.map((data) => data.time),
            labels: networkData.map((data) => data.time),
            datasets: [
              {
                label: "RSSI",
                data: networkData.map((data) => data.rssi),
                borderColor: "rgb(255, 0, 0)",
                backgroundColor: "rgba(255, 0, 0, 0.05)",
                fill: "start",
                pointRadius: 0,
                tension: 0.2,
                yAxisID: "rssi",
                segment: {
                  borderColor: (ctx) => {
                    const value = (ctx.p1 as any).raw;
                    return value > rssiLimit
                      ? "rgb(54, 235, 75)"
                      : "rgb(255, 99, 132)";
                  },

                  backgroundColor: (ctx) => {
                    const value = (ctx.p1 as any).raw;
                    return value > rssiLimit
                      ? "rgba(54, 235, 75, 0.3)"
                      : "rgba(255, 99, 132, 0.3)";
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
              rssi: {
                type: "linear",
                position: "right",
                min: rssiMinMax[0],
                max: rssiMinMax[1],
                ticks: {
                  callback: (value) => `${value} dBm`,
                  stepSize: 5,
                },
              },
            },
          }}
        />
      </div>
      <div className="chart-container">
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
                      ? "rgb(63, 54, 235)"
                      : "rgb(255, 99, 132)";
                  },

                  backgroundColor: (ctx) => {
                    const value = (ctx.p1 as any).raw;
                    return value > txLimit
                      ? "rgba(63, 54, 235, 0.3)"
                      : "rgba(255, 99, 132, 0.3)";
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
      </div>
    </>
  );
}

export default App;
