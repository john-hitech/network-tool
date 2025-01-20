import { Box, IconButton } from "@mui/material";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

export default function AppControls({
  setIsRunning,
  isRunning,
}: {
  setIsRunning: Function;
  isRunning: boolean;
}) {
  const resetData = () => {
    // setNetworkData([]);
    console.log("Resetting data");
  };

  const startStopData = () => {
    setIsRunning(!isRunning);
  };

  return (
    <>
      <Box
        sx={
          {
            // backgroundColor: "#000407",
            // padding: "10px",
            // borderRadius: "10px",
            // marginTop: "5px",
          }
        }
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
      </Box>
    </>
  );
}
