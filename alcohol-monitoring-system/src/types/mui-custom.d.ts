import '@mui/material/styles';
import '@mui/material';

declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
  }
}