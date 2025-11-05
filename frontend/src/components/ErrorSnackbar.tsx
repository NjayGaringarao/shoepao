import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ErrorSnackbarProps {
  error: string | null;
  onClose: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ error, onClose }) => {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;

