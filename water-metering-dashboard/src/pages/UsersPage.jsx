import React from 'react';
import { Box, Typography } from '@mui/material';

export default function UsersPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Utilisateurs</Typography>
      <Typography>Gestion des utilisateurs (Admin uniquement)</Typography>
    </Box>
  );
}
