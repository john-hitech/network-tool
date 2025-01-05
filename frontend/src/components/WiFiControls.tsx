import { Box, IconButton } from "@mui/material";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

export default function WiFiControls({
  setNetworkData,
  setIsRunning,
  isRunning,
}: {
  setNetworkData: Function;
  setIsRunning: Function;
  isRunning: boolean;
}) {
  const resetData = () => {
    setNetworkData([]);
  };

  const startStopData = () => {
    setIsRunning(!isRunning);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#000407",
          padding: "10px",
          borderRadius: "10px",
          marginTop: "10px",
        }}
      >
        <IconButton onClick={startStopData}>
          {isRunning ? (
            <PauseCircleOutlineOutlinedIcon fontSize="large" />
          ) : (
            <PlayCircleFilledWhiteOutlinedIcon fontSize="large" />
          )}
        </IconButton>
        <IconButton onClick={resetData}>
          <RestartAltOutlinedIcon fontSize="large" />
        </IconButton>
      </Box>
    </>
  );
}
