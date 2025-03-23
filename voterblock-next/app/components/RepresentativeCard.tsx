import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Link, Chip, Button, CircularProgress } from '@mui/material';
import NewsCard from './NewsCard';

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
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const getPartyColor = (party?: string) => {
    if (!party) return '#666';
    const lowerParty = party.toLowerCase();
    if (lowerParty.includes('republican')) return '#bf0a30';
    if (lowerParty.includes('democratic')) return '#002868';
    return '#666';
  };

  const handleFindNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `${name} ${office}` }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setNews(data.articles);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
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
          
          <Button
            onClick={handleFindNews}
            variant="outlined"
            disabled={loading}
            sx={{
              mt: 2,
              color: '#002868',
              borderColor: '#002868',
              '&:hover': {
                borderColor: '#001845',
                backgroundColor: 'rgba(0, 40, 104, 0.04)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Find Recent News"}
          </Button>
          
          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ mt: 1 }}
            >
              {error}
            </Typography>
          )}
          
          {news.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <NewsCard news={news} loading={false} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
