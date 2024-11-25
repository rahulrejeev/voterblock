import React from 'react';
import { Card, CardContent, Typography, Box, Link, Chip } from '@mui/material';

interface RepresentativeProps {
  name: string;
  office: string;
  party?: string;
  phones?: string[];
  urls?: string[];
  emails?: string[];
}

export default function RepresentativeCard({
  name,
  office,
  party,
  phones,
  urls,
  emails,
}: RepresentativeProps) {
  const getPartyColor = (party?: string) => {
    if (!party) return '#666';
    const lowerParty = party.toLowerCase();
    if (lowerParty.includes('republican')) return '#bf0a30';
    if (lowerParty.includes('democratic')) return '#002868';
    return '#666';
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom 
          sx={{ 
            color: '#002868',
            fontWeight: 'bold'
          }}
        >
          {name}
        </Typography>
        <Typography 
          color="text.secondary" 
          gutterBottom 
          sx={{ 
            fontSize: '1.1rem',
            mb: 2
          }}
        >
          {office}
        </Typography>
        {party && (
          <Chip
            label={party}
            size="small"
            sx={{
              mb: 2,
              color: 'white',
              backgroundColor: getPartyColor(party),
              fontWeight: 'bold'
            }}
          />
        )}
        <Box sx={{ 
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {phones?.map((phone, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              📞 <Link 
                href={`tel:${phone}`}
                sx={{ 
                  color: '#002868',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {phone}
              </Link>
            </Typography>
          ))}
          {emails?.map((email, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              ✉️ <Link 
                href={`mailto:${email}`}
                sx={{ 
                  color: '#002868',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {email}
              </Link>
            </Typography>
          ))}
          {urls?.map((url, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🌐 <Link 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  color: '#002868',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Official Website
              </Link>
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
