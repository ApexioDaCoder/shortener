import React from 'react';
import theme from '@/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import StylesProvider from '@mui/styles/StylesProvider';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface BaseThemeProviderProps {
  children: React.ReactNode;
}

function BaseThemeProvider({ children }: BaseThemeProviderProps) {
  return (
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </StyledThemeProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
}

export default BaseThemeProvider;
