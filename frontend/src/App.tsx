// External libraries
import { useEffect, useState } from "react";
import axios from "axios";
// import GridLayout, { Layout } from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Box } from "@mui/material";

// Local components
import MenuBar from "./components/MenuBar";
import WiFiGeneralInfo from "./components/WiFiGeneralInfo";
import WiFiRSSIGraph from "./components/WiFiRSSIGraph";
import WiFiTxRateGraph from "./components/WiFiTxRateGraph";
import WiFiNoiseGraph from "./components/WiFiNoiseGraph";
import PingGraph from "./components/PingGraph";
import LoadingBar from "./components/LoadingBar";

// Styles
import "./App.css";

const GridLayout = WidthProvider(Responsive);

function App() {
  const [backendRunning, setBackendRunning] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeFrame, setTimeFrame] = useState<number>(60); // In Seconds
  const [timeInterval, setTimeInterval] = useState<number>(0.5);
  const [resetTrigger, setResetTrigger] = useState<boolean>(false);

  const layouts = {
    lg: [
      {
        i: "wifiInfo",
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        minW: 3,
      },
      {
        i: "pingGraph1",
        x: 0,
        y: 1,
        w: 6,
        h: 2,
        minW: 3,
        // minH: 3,
      },
      {
        i: "pingGraph2",
        x: 6,
        y: 1,
        w: 6,
        h: 5,
        minW: 3,
        // minH: 3,
      },
      {
        i: "rssiGraph",
        x: 0,
        y: 3,
        w: 6,
        h: 3,
        minW: 3,
        // minH: 3,
      },
      {
        i: "txGraph",
        x: 3,
        y: 4,
        w: 9,
        h: 5,
        minW: 3,
        // minH: 3,
      },
      {
        i: "noiseGraph",
        x: 0,
        y: 6,
        w: 3,
        h: 5,
        minW: 3,
        // minH: 3,
      },
    ],
  };

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
      <MenuBar
        resetTrigger={resetTrigger}
        setResetTrigger={setResetTrigger}
        setIsRunning={setIsRunning}
        isRunning={isRunning}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        timeInterval={timeInterval}
        setTimeInterval={setTimeInterval}
      />
      {backendRunning ? (
        <>
          {/* <WiFiGeneralInfo networkData={networkData[networkData.length - 1]} /> */}
          <Box
            sx={{
              // backgroundColor: "red",
              width: "100vw",
            }}
          >
            <GridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 }}
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
                <PingGraph
                  resetTrigger={resetTrigger}
                  isRunning={isRunning}
                  timeInterval={timeInterval}
                  timeFrame={timeFrame}
                />
              </div>
              <div key="pingGraph2">
                <PingGraph
                  resetTrigger={resetTrigger}
                  isRunning={isRunning}
                  timeInterval={timeInterval}
                  timeFrame={timeFrame}
                />
              </div>
              <div key="rssiGraph">
                <WiFiRSSIGraph
                  resetTrigger={resetTrigger}
                  isRunning={isRunning}
                  timeInterval={timeInterval}
                  timeFrame={timeFrame}
                />
              </div>
              <div key="txGraph">
                <WiFiTxRateGraph
                  resetTrigger={resetTrigger}
                  isRunning={isRunning}
                  timeInterval={timeInterval}
                  timeFrame={timeFrame}
                />
              </div>
              <div key="wifiInfo">
                <WiFiGeneralInfo
                  isRunning={isRunning}
                  resetTrigger={resetTrigger}
                />
              </div>
              <div key="noiseGraph">
                <WiFiNoiseGraph
                  resetTrigger={resetTrigger}
                  isRunning={isRunning}
                  timeInterval={timeInterval}
                  timeFrame={timeFrame}
                />
              </div>
            </GridLayout>
          </Box>
        </>
      ) : (
        <LoadingBar />
      )}
    </Box>
  );
}

export default App;
