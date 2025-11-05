import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingIndicatorProps {
  size?: number;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 40, fullScreen = false }) => {
  const content = (
    <CircularProgress size={size} />
  );

  if (fullScreen) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {content}
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
      {content}
    </Box>
  );
};

export default LoadingIndicator;

