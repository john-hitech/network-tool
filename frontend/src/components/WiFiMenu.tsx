import hitechLogo from "../assets/hitech-logo-1.png";
import { Typography, Box } from "@mui/material";

export default function WiFiMenu() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#000407",
          width: "100vw",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          padding: "10px 0px 10px 0px",
        }}
      >
        <img src={hitechLogo} alt="Hi! Tech Logo" className="hitechLogo" />
        <Typography variant="h4" sx={{ color: "#f2f0f3" }}>
          WiFi Analysis
        </Typography>
      </Box>
    </>
  );
}
