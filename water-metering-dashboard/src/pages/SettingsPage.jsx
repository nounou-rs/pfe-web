import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Configuration</Typography>
      <Typography>Paramètres système (Admin uniquement)</Typography>
    </Box>
  );
}
