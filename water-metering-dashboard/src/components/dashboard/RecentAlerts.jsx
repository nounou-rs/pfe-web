import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material';

const alerts = [
  { id: 1, title: 'Fuite suspectée', meter_id: 'MTR-A-001234', severity: 9, time: 'Il y a 15 min' },
  { id: 2, title: 'Hausse anormale', meter_id: 'MTR-B-002345', severity: 6, time: 'Il y a 1h' },
];

export default function RecentAlerts() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Alertes Récentes</Typography>
        <List>
          {alerts.map(a => (
            <ListItem key={a.id} sx={{ backgroundColor: '#f8fafc', borderRadius: 2, mb: 1 }}>
              <ListItemText
                primary={<Box sx={{ display: 'flex', gap: 1 }}><Typography variant="body2" fontWeight="bold">{a.title}</Typography><Chip label={`${a.severity}/10`} size="small" color="error" /></Box>}
                secondary={<Typography variant="caption">{a.meter_id} • {a.time}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
