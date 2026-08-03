import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { brand } from '../../brand';

const localeByLang = {
  en: 'en',
  am: 'am',
  om: 'en',
  ti: 'en',
  ge: 'en',
  es: 'es',
  fr: 'fr',
  ar: 'ar',
};

/**
 * Google Sign-In button for login / register pages.
 * Calls onSuccess with the Google ID token (credential JWT).
 */
const GoogleAuthButton = ({
  language = 'en',
  text = 'continue_with',
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [busy, setBusy] = useState(false);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <Alert severity="warning" sx={{ width: '100%', textAlign: 'left' }}>
        Google sign-in is not configured. Set REACT_APP_GOOGLE_CLIENT_ID.
      </Alert>
    );
  }

  const handleSuccess = async (response) => {
    if (!response?.credential) {
      onError?.(new Error('No credential returned from Google'));
      return;
    }
    setBusy(true);
    try {
      await onSuccess(response.credential);
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        opacity: disabled || busy ? 0.7 : 1,
        pointerEvents: disabled || busy ? 'none' : 'auto',
      }}
    >
      {busy && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <CircularProgress size={18} sx={{ color: brand.navy }} />
          <Typography variant="body2" color="text.secondary">
            …
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          '& > div': { width: '100% !important', display: 'flex', justifyContent: 'center' },
        }}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError?.(new Error('Google sign-in was cancelled or failed'))}
          useOneTap={false}
          theme="outline"
          size="large"
          text={text}
          shape="rectangular"
          width="320"
          locale={localeByLang[language] || 'en'}
        />
      </Box>
    </Box>
  );
};

export default GoogleAuthButton;
