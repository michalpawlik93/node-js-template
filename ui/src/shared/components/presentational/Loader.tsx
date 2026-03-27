import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface LoaderProps {
  size?: number;
}

export function Loader({ size = 32 }: LoaderProps) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" py={3}>
      <CircularProgress size={size} />
    </Box>
  );
}
