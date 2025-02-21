import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export const globalStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes ripple {
    0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
    100% { box-shadow: 0 0 0 20px rgba(25, 118, 210, 0); }
  }

  body {
    background: linear-gradient(135deg, #f0f4f8 0%, #d9e8f5 100%);
    min-height: 100vh;
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .recording-pulse {
    animation: pulse 1.5s infinite;
  }
`;