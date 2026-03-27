import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const onChange = (event: SelectChangeEvent<string>) => {
    void i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      size="small"
      value={i18n.language}
      onChange={onChange}
      sx={{ minWidth: 90 }}
    >
      <MenuItem value="en">EN</MenuItem>
      <MenuItem value="pl">PL</MenuItem>
    </Select>
  );
}
