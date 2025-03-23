import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Link, 
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface NewsItem {
  title: string;
  url?: string;
  date?: string;
  source?: string;
  snippet?: string;
}

interface NewsCardProps {
  news: NewsItem[];
  loading: boolean;
  error?: string;
}

export default function NewsCard({ news, loading, error }: NewsCardProps) {
  if (loading) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 2, 
        color: '#666' 
      }}>
        <Typography>Loading news articles...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 2, 
        color: '#bf0a30' 
      }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!news || news.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 2, 
        color: '#666' 
      }}>
        <Typography>No news articles found.</Typography>
      </Box>
    );
  }

  // Detect if we have a raw text response instead of structured data
  const hasRawTextOnly = news.length === 1 && news[0].title === "News Results";

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          color: '#002868' 
        }}
      >
        Recent News
      </Typography>
      
      {hasRawTextOnly ? (
        // Display raw text response
        <Card 
          sx={{ 
            mb: 2, 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
          }}
        >
          <CardContent>
            <Typography 
              sx={{ 
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: 'inherit'
              }}
            >
              {news[0].snippet}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        // Display structured news items
        news.map((item, index) => (
          <Card 
            key={index} 
            sx={{ 
              mb: 2, 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }
            }}
          >
            <CardContent>
              {/* Title and External Link */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#002868',
                    flex: 1,
                    mr: 2
                  }}
                >
                  {item.title}
                </Typography>
                {item.url && (
                  <Tooltip title="Open article in new tab">
                    <IconButton
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ 
                        color: '#002868',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 40, 104, 0.04)',
                        }
                      }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Source and Date */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 1.5,
                  color: '#666',
                  fontSize: '0.875rem',
                  alignItems: 'center'
                }}
              >
                {item.source && (
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {item.source}
                  </Typography>
                )}
                {item.date && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body2">
                      {item.date}
                    </Typography>
                  </>
                )}
              </Box>
              
              {/* Snippet/Summary */}
              {item.snippet && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.6,
                    mt: 1
                  }}
                >
                  {item.snippet}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
} 