// pages/index.js
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RepresentativeCard from "./components/RepresentativeCard";

interface FormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Representative {
  name: string;
  office: string;
  party?: string;
  phones?: string[];
  urls?: string[];
  emails?: string[];
  level: string;
  divisionId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getDivisionLevel = (divisionId: string): string => {
    // Example divisionIds:
    // country: "ocd-division/country:us"
    // state: "ocd-division/country:us/state:ca"
    // county: "ocd-division/country:us/state:ca/county:los_angeles"
    // city: "ocd-division/country:us/state:ca/place:los_angeles"
    
    const parts = divisionId.split('/');
    const lastPart = parts[parts.length - 1];
    
    if (parts.length === 2 && lastPart.startsWith('country:')) return 'federal';
    if (lastPart.startsWith('state:')) return 'state';
    if (lastPart.startsWith('county:')) return 'county';
    if (lastPart.startsWith('place:') || lastPart.startsWith('city:')) return 'local';
    
    // Special cases for federal offices
    if (divisionId.includes('cd:') || // Congressional district
        divisionId.includes('senate')) { // Senate
      return 'federal';
    }
    
    return 'other';
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/representatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch representatives');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      const reps: Representative[] = [];
      
      // Process the API response
      for (const [officeIndex, office] of Object.entries(result.offices)) {
        const divisionId = (office as any).divisionId;
        let level = getDivisionLevel(divisionId);
        
        // Special handling for federal positions
        const officeName = (office as any).name.toLowerCase();
        if (officeName.includes('president') || 
            officeName.includes('senator') || 
            officeName.includes('representative')) {
          level = 'federal';
        }

        const officialIndices = (office as any).officialIndices;
        officialIndices.forEach((officialIndex: number) => {
          const official = result.officials[officialIndex];
          reps.push({
            name: official.name,
            office: (office as any).name,
            party: official.party,
            phones: official.phones,
            urls: official.urls,
            emails: official.emails,
            level,
            divisionId
          });
        });
      }

      console.log('Processed representatives:', reps.map(r => ({ name: r.name, level: r.level, office: r.office })));
      setRepresentatives(reps);
      setTabValue(0); // Reset to first tab when new results come in
    } catch (err: any) {
      setError(err.message || 'Failed to fetch representatives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupedReps = {
    federal: representatives.filter(rep => rep.level === 'federal'),
    state: representatives.filter(rep => rep.level === 'state'),
    county: representatives.filter(rep => rep.level === 'county'),
    local: representatives.filter(rep => rep.level === 'local'),
    other: representatives.filter(rep => rep.level === 'other'),
  };

  return (
    <Container maxWidth="md" sx={{ 
      py: 4, 
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <Box sx={{
        textAlign: 'center',
        mb: 4,
        '& h4': {
          color: '#002868', // Dark blue
          fontWeight: 'bold',
          textTransform: 'uppercase',
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 3,
            background: 'linear-gradient(to right, #bf0a30, #002868)', // Red to blue gradient
          }
        },
        '& h5': {
          color: '#002868', // Dark blue
          fontWeight: 'bold',
          textTransform: 'uppercase',
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 3,
            background: 'linear-gradient(to right, #bf0a30, #002868)', // Red to blue gradient
          }
        }

      }}>
        <Typography variant="h4" gutterBottom>
          Voterblock 
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Enter your address to discover who represents you in government
        </Typography>
      </Box>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit(onSubmit)} 
        sx={{ 
          mb: 4,
          p: 3,
          backgroundColor: '#f8f8f8',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}
      >
        <TextField
          label="Street Address"
          fullWidth
          margin="normal"
          {...register("street", { required: "Street address is required" })}
          error={!!errors.street}
          helperText={errors.street?.message}
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          label="City"
          fullWidth
          margin="normal"
          {...register("city", { required: "City is required" })}
          error={!!errors.city}
          helperText={errors.city?.message}
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          label="State"
          fullWidth
          margin="normal"
          {...register("state", { required: "State is required" })}
          error={!!errors.state}
          helperText={errors.state?.message}
          sx={{ backgroundColor: 'white' }}
        />
        <TextField
          label="ZIP Code"
          fullWidth
          margin="normal"
          {...register("zipCode", { required: "ZIP code is required" })}
          error={!!errors.zipCode}
          helperText={errors.zipCode?.message}
          sx={{ backgroundColor: 'white' }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ 
            mt: 3,
            backgroundColor: '#bf0a30', // American red
            '&:hover': {
              backgroundColor: '#a00926'
            },
            height: 48,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Find My Representatives"}
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            border: '1px solid #ff0000',
            backgroundColor: '#fff'
          }}
        >
          {error}
        </Alert>
      )}

      {representatives.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: 3,
              color: '#002868',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Your Representatives
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: '#666',
                  '&.Mui-selected': {
                    color: '#002868',
                    fontWeight: 'bold',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#002868',
                },
              }}
            >
              <Tab label="Federal" />
              <Tab label="State" />
              <Tab label="County" />
              <Tab label="Local" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {groupedReps.federal.length > 0 ? (
              groupedReps.federal.map((rep, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: '#f8f8f8',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: '#002868' }}>
                      {rep.office}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RepresentativeCard {...rep} />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: '#666',
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
                mt: 2
              }}>
                <Typography>No federal representatives found for this address.</Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {groupedReps.state.length > 0 ? (
              groupedReps.state.map((rep, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: '#f8f8f8',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: '#002868' }}>
                      {rep.office}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RepresentativeCard {...rep} />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: '#666',
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
                mt: 2
              }}>
                <Typography>No state representatives found for this address.</Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {groupedReps.county.length > 0 ? (
              groupedReps.county.map((rep, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: '#f8f8f8',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: '#002868' }}>
                      {rep.office}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RepresentativeCard {...rep} />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: '#666',
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
                mt: 2
              }}>
                <Typography>No county representatives found for this address.</Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {groupedReps.local.length > 0 ? (
              groupedReps.local.map((rep, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: '#f8f8f8',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: '#002868' }}>
                      {rep.office}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RepresentativeCard {...rep} />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: '#666',
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
                mt: 2
              }}>
                <Typography>No local representatives found for this address.</Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      )}
    </Container>
  );
}
