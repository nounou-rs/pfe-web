import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, Box, Typography } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Fonction appelée quand on choisit une nouvelle langue
  const changeLanguage = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  // 💡 ASTUCE PRO : Gestion de l'Arabe (RTL - Right to Left)
  useEffect(() => {
    // Si la langue est l'arabe, on inverse le sens de lecture du site
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Box>
      <Select
        value={i18n.language || 'fr'} // Langue actuelle
        onChange={changeLanguage}
        size="small"
        sx={{ 
          minWidth: 140, 
          borderRadius: '8px',
          bgcolor: 'white',
          '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1 }
        }}
      >
        <MenuItem value="fr">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>🇫🇷 Français</Typography>
        </MenuItem>
        <MenuItem value="en">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>🇬🇧 English</Typography>
        </MenuItem>
        <MenuItem value="ar">
          <Typography variant="body2" sx={{ fontWeight: 500 }}>🇹🇳 العربية</Typography>
        </MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;