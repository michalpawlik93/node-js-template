import MuiButton, { type ButtonProps } from '@mui/material/Button';

export function Button(props: ButtonProps) {
  return <MuiButton variant="contained" {...props} />;
}
