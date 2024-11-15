// pages/index.js
"use client"; // pages/index.js// pages/index.js
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

export default function Home() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Address submitted:", data);
    // Here, you would send the address data to your backend or API
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: "2em",
        backgroundColor: "#f0f0f0", // Light grey background
        padding: "2em",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: "black" }}>
        Find Your Representatives
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <TextField
            label="Street Address"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("street", { required: true })}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="City"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("city", { required: true })}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="State"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("state", { required: true })}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="ZIP Code"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("zip", { required: true })}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Search
        </Button>
      </form>
      <Box mt={2}>
        <Link href="/dashboards/dashboard" passHref>
          <Button variant="outlined" color="secondary">
            Go to Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
