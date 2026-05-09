import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, MenuItem, Select, Typography } from '@mui/material';

const SUPPORTED_LANGUAGES = ['fr', 'en'];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = SUPPORTED_LANGUAGES.includes(i18n.language) ? i18n.language : 'fr';

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    if (!SUPPORTED_LANGUAGES.includes(i18n.language)) {
      i18n.changeLanguage('fr');
      return;
    }

    document.dir = 'ltr';
  }, [i18n]);

  return (
    <Box>
      <Select
        value={currentLanguage}
        onChange={changeLanguage}
        size="small"
        sx={{
          minWidth: 140,
          borderRadius: '8px',
          bgcolor: 'white',
          '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1 },
        }}
      >
        <MenuItem value="fr">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Francais</Typography>
        </MenuItem>
        <MenuItem value="en">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>English</Typography>
        </MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;
