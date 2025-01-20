import { Box, IconButton, Select, MenuItem, FormLabel } from "@mui/material";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

export default function AppControls({
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
  const resetData = () => {
    setResetTrigger(!resetTrigger);
  };

  const startStopData = () => {
    setIsRunning(!isRunning);
  };

  return (
    <>
      <Box
        sx={{
          // backgroundColor: "red",
          width: "100%",
          // padding: "10px",
          // borderRadius: "10px",
          // marginTop: "5px",
        }}
      >
        <IconButton onClick={startStopData} sx={{ color: "#000407" }}>
          {isRunning ? (
            <PauseCircleOutlineOutlinedIcon fontSize="large" />
          ) : (
            <PlayCircleFilledWhiteOutlinedIcon fontSize="large" />
          )}
        </IconButton>
        <IconButton onClick={resetData} sx={{ color: "#000407" }}>
          <RestartAltOutlinedIcon fontSize="large" />
        </IconButton>
        <FormLabel sx={{ color: "#000407" }}>Time Frame</FormLabel>
        <Select
          sx={{
            height: "40px",
            marginRight: "20px",
            marginLeft: "10px",
          }}
          value={timeFrame}
          onChange={(e) => {
            setTimeFrame(e.target.value);
          }}
          disabled={isRunning}
        >
          <MenuItem value={30}>30 Seconds</MenuItem>
          <MenuItem value={60}>1 Minute</MenuItem>
          <MenuItem value={120}>2 Minutes</MenuItem>
          <MenuItem value={300}>5 Minutes</MenuItem>
        </Select>
        <FormLabel sx={{ color: "#000407" }}>Time Interval</FormLabel>
        <Select
          sx={{
            height: "40px",
            marginLeft: "10px",
          }}
          value={timeInterval}
          onChange={(e) => {
            setTimeInterval(e.target.value);
          }}
          disabled={isRunning}
        >
          <MenuItem value={0.5}>0.5 Second</MenuItem>
          <MenuItem value={1}>1 Second</MenuItem>
          <MenuItem value={2}>2 Second</MenuItem>
          <MenuItem value={5}>5 Second</MenuItem>
        </Select>
      </Box>
    </>
  );
}
