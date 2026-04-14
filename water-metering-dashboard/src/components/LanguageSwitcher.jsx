import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    
    // Si on choisit l'Arabe, on inverse le sens de lecture (RTL)
    document.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <Globe size={18} color="#64748b" />
      <select 
        onChange={changeLanguage} 
        value={i18n.resolvedLanguage}
        style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#334155', fontWeight: '500', cursor: 'pointer' }}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}