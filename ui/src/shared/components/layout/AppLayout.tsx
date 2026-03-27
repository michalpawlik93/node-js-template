import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';

export function AppLayout() {
  return (
    <Box display="flex" minHeight="100vh">
      <SidebarNav />
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
