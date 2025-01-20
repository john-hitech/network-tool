import { useEffect, useState } from "react";
import { NetworkData } from "../types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useResizeDetector } from "react-resize-detector";

export default function WiFiGeneralInfo({
  isRunning,
  resetTrigger,
}: {
  isRunning: boolean;
  resetTrigger: boolean;
}) {
  const [networkData, setNetworkData] = useState<NetworkData>();

  const { ref } = useResizeDetector();

  // useEffect(() => {
  //   console.log(width, height);
  // }, [width, height]);

  const getWifiData = async () => {
    const response = await axios.get("http://127.0.0.1:8000/wifi-data");
    const data = response.data;
    // console.log(data);
    setNetworkData(data);
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

  useEffect(() => {
    setNetworkData(undefined);
  }, [resetTrigger]);

  return (
    <>
      <Box
        ref={ref}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#000407",
          padding: "10px",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography variant="body2" sx={{ color: "#f2f0f3" }}>
          IPv4: {networkData ? networkData.ip_address : ""}
        </Typography>
        <Typography variant="body2" sx={{ color: "#f2f0f3" }}>
          Router: {networkData ? networkData.router : ""}
        </Typography>
        <Typography variant="body2" sx={{ color: "#f2f0f3" }}>
          Channel: {networkData ? networkData.channel : ""}
        </Typography>
        <Typography variant="body2" sx={{ color: "#f2f0f3" }}>
          Security: {networkData ? networkData.security : ""}
        </Typography>
        <Typography variant="body2" sx={{ color: "#f2f0f3" }}>
          Mode: {networkData ? networkData.physical_mode : ""}
        </Typography>
      </Box>
    </>
  );
}
