import hitechLogo from "../assets/hitech-logo-1.png";
import { Typography, Box } from "@mui/material";

export default function WiFiMenu() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f2f0f3",
          width: "100vw",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          padding: "10px 0px 10px 0px",
        }}
      >
        <img
          src={hitechLogo}
          alt="Hi! Tech Logo"
          className="hitechLogo"
          style={{ filter: "invert(1)" }}
        />
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "#FDDA25",
            color: "#000",
            padding: "7px 20px 7px 20px",
            borderRadius: "20px",
            border: "2px solid #000",
          }}
        >
          WiFi Analysis
        </Typography>
      </Box>
    </>
  );
}
