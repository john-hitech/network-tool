import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingBar() {
  return (
    <>
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h2">Loading...</Typography>
        <CircularProgress size={100} sx={{ color: "#AFCDD7" }} />
      </Box>
    </>
  );
}
