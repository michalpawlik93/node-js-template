import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/shared/components/presentational/Button';
import { LanguageSwitcher } from '@/shared/components/presentational/LanguageSwitcher';

export function SidebarNav() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);

  const navStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: isActive ? '#1259c3' : '#25314d',
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <Box
      width={220}
      minHeight="100vh"
      bgcolor="#ffffff"
      borderRight="1px solid #e9ecf5"
      px={2}
      py={3}
    >
      <Stack spacing={2}>
        <Typography variant="h6">{t('app.title')}</Typography>
        <Divider />
        <NavLink to="/products" style={navStyle}>
          {t('nav.products')}
        </NavLink>
        <Divider />
        <LanguageSwitcher />
        <Button onClick={() => void logout()}>{t('auth.logout')}</Button>
      </Stack>
    </Box>
  );
}
