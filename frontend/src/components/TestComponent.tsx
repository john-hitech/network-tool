import { Box, Typography } from "@mui/material";

export default function TestComponent({ content }: { content: string }) {
  return (
    <>
      <Box
        sx={{
          padding: 2,
          backgroundColor: "lightgray",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography>{content}</Typography>
      </Box>
    </>
  );
}
