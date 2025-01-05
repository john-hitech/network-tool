import { NetworkData } from "../types";
import { Box, Typography } from "@mui/material";

export default function WiFiGeneralInfo({
  networkData,
}: {
  networkData: NetworkData;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "95vw",
          marginTop: "10px",
          backgroundColor: "#000407",
          padding: "10px",
          borderRadius: "10px",
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
