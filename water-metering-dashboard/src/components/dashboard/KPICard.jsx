import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

export default function KPICard({ title, value, subtitle, icon, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{
            backgroundColor: color,
            borderRadius: '10px',
            p: 1,
            ml: 1,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            '& svg': { fontSize: '1.3rem' }
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}