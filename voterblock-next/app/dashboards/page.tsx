// pages/dashboard.js
import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Container maxWidth="md" style={{ marginTop: "2em", padding: "2em" }}>
      <Typography variant="h4" gutterBottom>
        Voterblock Dashboard
      </Typography>
      <Box mt={2}>
        <Typography variant="h6">Federal Representatives</Typography>
        <Typography>Representative Name - Office</Typography>
        <Typography>Senator Name - Office</Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="h6">State Representatives</Typography>
        <Typography>Governor - Office</Typography>
        <Typography>State Senator - Office</Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="h6">Local Representatives</Typography>
        <Typography>Mayor - Office</Typography>
        <Typography>City Council Member - Office</Typography>
      </Box>
    </Container>
  );
}
