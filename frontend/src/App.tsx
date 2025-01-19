import axios from "axios";
import { useEffect, useState } from "react";
import { NetworkData } from "./types";
import "./App.css";
import WiFiMenu from "./components/WiFiMenu";
import WiFiGeneralInfo from "./components/WiFiGeneralInfo";
import WiFiControls from "./components/WiFiControls";
import WiFiRSSIGraph from "./components/WiFiRSSIGraph";
import WiFiTxRateGraph from "./components/WiFiTxRateGraph";
import PingGraph from "./components/PingGraph";
import { Box } from "@mui/material";
import LoadingBar from "./components/LoadingBar";
import GridLayout, { Layout } from "react-grid-layout";
// import TestComponent from "./components/TestComponent";

function App() {
  const [backendRunning, setBackendRunning] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState(false);
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);

  const layout: Layout[] = [
    {
      i: "pingGraph1",
      x: 0,
      y: 0,
      w: 8,
      h: 4,
      minW: 8,
      minH: 3,
    },
    {
      i: "pingGraph2",
      x: 8,
      y: 0,
      w: 8,
      h: 4,
      minW: 8,
      minH: 3,
    },
    {
      i: "rssiGraph",
      x: 0,
      y: 3,
      w: 8,
      h: 4,
      minW: 8,
      minH: 3,
    },
    {
      i: "txGraph",
      x: 8,
      y: 3,
      w: 8,
      h: 4,
      minW: 8,
      minH: 3,
    },
  ];

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
    const checkBackend = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/online");
        if (response.data["message"] === "API online.") {
          setBackendRunning(true);
        }
      } catch (error) {}
    };

    if (!backendRunning) {
      const interval = setInterval(() => {
        checkBackend();
      }, 500);
      return () => clearInterval(interval);
    } else {
      return () => {};
    }
  }, [backendRunning]);

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
      {backendRunning ? (
        <>
          <WiFiGeneralInfo networkData={networkData[networkData.length - 1]} />
          <WiFiControls
            setNetworkData={setNetworkData}
            setIsRunning={setIsRunning}
            isRunning={isRunning}
          />
          <GridLayout
            className="layout"
            layout={layout}
            cols={16}
            rowHeight={30}
            width={window.innerWidth}
            compactType={null} // Disable compacting
            preventCollision={true} // Allow overlapping
            resizeHandles={["s", "e", "se", "sw", "w", "n", "ne", "nw"]}
            style={{
              // backgroundColor: "red",
              width: "100%",
              height: "100%",
            }}
          >
            <div key="pingGraph1">
              <PingGraph isRunning={isRunning} />
            </div>
            <div key="pingGraph2">
              <PingGraph isRunning={isRunning} />
            </div>
            <div key="rssiGraph">
              <WiFiRSSIGraph networkData={networkData} />
            </div>
            <div key="txGraph">
              <WiFiTxRateGraph networkData={networkData} />
            </div>
          </GridLayout>
          {/* <WiFiRSSIGraph networkData={networkData} /> */}
          {/* <WiFiTxRateGraph networkData={networkData} /> */}
          {/* <PingGraph isRunning={isRunning} /> */}
        </>
      ) : (
        <LoadingBar />
      )}
    </Box>
  );
}

export default App;
