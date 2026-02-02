import React from 'react';
import { Box, Typography } from '@mui/material';

export default function MapPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Carte Interactive</Typography>
      <Typography variant="body1" color="text.secondary">
        La carte interactive affichera tous les compteurs avec Mapbox.
        Nécessite REACT_APP_MAPBOX_TOKEN dans le fichier .env
      </Typography>
    </Box>
  );
}
