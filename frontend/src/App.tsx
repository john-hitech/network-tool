import axios from "axios";
import { useEffect, useState } from "react";
import { NetworkData } from "./types";
import "./App.css";
import WiFiMenu from "./components/WiFiMenu";
import WiFiGeneralInfo from "./components/WiFiGeneralInfo";
import WiFiControls from "./components/WiFiControls";
import WiFiRSSIGraph from "./components/WiFiRSSIGraph";
import WiFiTxRateGraph from "./components/WiFiTxRateGraph";
import { Box } from "@mui/material";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);

  const getWifiData = async () => {
    const response = await axios.get("http://127.0.0.1:8000/wifi-data");
    const data = response.data;
    // console.log(data);

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
    <Box
      sx={{
        backgroundColor: "#f2f0f3",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <WiFiMenu />
      <WiFiGeneralInfo networkData={networkData[networkData.length - 1]} />
      <WiFiControls
        setNetworkData={setNetworkData}
        setIsRunning={setIsRunning}
        isRunning={isRunning}
      />
      <WiFiRSSIGraph networkData={networkData} />
      <WiFiTxRateGraph networkData={networkData} />
    </Box>
  );
}

export default App;
