import { Box, Typography } from "@mui/material";

export default function InfoDisplayBox({
  title,
  data,
  unit,
  textColor = "#fff",
}: {
  title: string;
  data: any;
  unit: string;
  textColor?: string;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          //   border: "1px solid #fff",
          //   borderRadius: "10px",
          padding: "5px",
          // backgroundColor: "red",
        }}
      >
        <Typography
          fontSize={"15px"}
          sx={{
            color: textColor,
          }}
        >
          {title}:
        </Typography>
        <Typography
          fontSize={"14px"}
          sx={{
            color: textColor,
          }}
        >
          {data} {unit}
        </Typography>
      </Box>
    </>
  );
}
