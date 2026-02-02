import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function MeterDetailsPage() {
  const { id } = useParams();
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">Détails du compteur {id}</Typography>
    </Box>
  );
}
