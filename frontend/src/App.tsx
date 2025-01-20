// External libraries
import { useEffect, useState } from "react";
import axios from "axios";
import GridLayout, { Layout } from "react-grid-layout";
import { Box } from "@mui/material";

// Local components
import MenuBar from "./components/MenuBar";
// import WiFiGeneralInfo from "./components/WiFiGeneralInfo";
import WiFiRSSIGraph from "./components/WiFiRSSIGraph";
import WiFiTxRateGraph from "./components/WiFiTxRateGraph";
import PingGraph from "./components/PingGraph";
import LoadingBar from "./components/LoadingBar";

// Styles
import "./App.css";

function App() {
  const [backendRunning, setBackendRunning] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState(false);

  const layout: Layout[] = [
    {
      i: "pingGraph1",
      x: 0,
      y: 0,
      w: 6,
      h: 2,
      minW: 3,
      // minH: 3,
    },
    {
      i: "pingGraph2",
      x: 6,
      y: 0,
      w: 6,
      h: 2,
      minW: 3,
      // minH: 3,
    },
    {
      i: "rssiGraph",
      x: 0,
      y: 2,
      w: 6,
      h: 2,
      minW: 3,
      // minH: 3,
    },
    {
      i: "txGraph",
      x: 6,
      y: 2,
      w: 6,
      h: 2,
      minW: 3,
      // minH: 3,
    },
  ];

  // Check if the backend is running
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

  // // THIS NEEDS TO GET MOVED
  // const getWifiData = async () => {
  //   const response = await axios.get("http://127.0.0.1:8000/wifi-data");
  //   const data = response.data;
  //   // console.log(data);

  //   setNetworkData((prevArr) => {
  //     const updatedArr = [...prevArr, data];
  //     return updatedArr.slice(-100);
  //   });
  // };

  // useEffect(() => {
  //   if (isRunning) {
  //     const interval = setInterval(() => {
  //       getWifiData();
  //     }, 500);
  //     return () => clearInterval(interval);
  //   } else {
  //     return () => {};
  //   }
  // }, [isRunning]);

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
      <MenuBar setIsRunning={setIsRunning} isRunning={isRunning} />
      {backendRunning ? (
        <>
          {/* <WiFiGeneralInfo networkData={networkData[networkData.length - 1]} /> */}
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={60}
            width={window.innerWidth}
            compactType={null}
            preventCollision={true}
            resizeHandles={["s", "e", "se", "sw", "w", "n", "ne", "nw"]}
            draggableCancel=".no-drag"
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
              <WiFiRSSIGraph isRunning={isRunning} />
            </div>
            <div key="txGraph">
              <WiFiTxRateGraph isRunning={isRunning} />
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
