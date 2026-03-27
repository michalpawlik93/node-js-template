import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FallbackProps } from 'react-error-boundary';
import { Button } from './Button';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Unexpected error';

  return (
    <Box px={3} py={4}>
      <Stack spacing={2}>
        <Typography variant="h5">Something went wrong</Typography>
        <Alert severity="error">{message}</Alert>
        <Box>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </Box>
      </Stack>
    </Box>
  );
}
