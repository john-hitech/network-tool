import hitechLogo from "../assets/hitech-logo-1.png";
import { Typography, Box } from "@mui/material";
import AppControls from "./AppControls";

export default function MenuBar({
  setIsRunning,
  isRunning,
  timeFrame,
  setTimeFrame,
  timeInterval,
  setTimeInterval,
  resetTrigger,
  setResetTrigger,
}: {
  setIsRunning: Function;
  isRunning: boolean;
  timeFrame: number;
  setTimeFrame: Function;
  timeInterval: number;
  setTimeInterval: Function;
  resetTrigger: boolean;
  setResetTrigger: Function;
}) {
  return (
    <>
      <Box
        sx={{
          // backgroundColor: "green",
          width: "100vw",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: "10px 0px 10px 0px",
        }}
      >
        <Box
          sx={{
            // backgroundColor: "red",
            width: "50%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            // padding: "10px 0px 10px 0px",
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
            Network Tool
          </Typography>
        </Box>
        <Box
          sx={{
            // backgroundColor: "red",
            width: "50%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppControls
            setIsRunning={setIsRunning}
            isRunning={isRunning}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
            resetTrigger={resetTrigger}
            setResetTrigger={setResetTrigger}
          />
        </Box>
      </Box>
    </>
  );
}
