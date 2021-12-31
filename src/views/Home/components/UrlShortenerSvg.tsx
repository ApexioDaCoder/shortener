import { useTheme } from '@material-ui/core';
import React from 'react';

const UrlShortenerSvg = React.memo(() => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  return (
    <img
      src="https://apexio.dev/logo.svg"
      height={75}
      title="logo"
      className="logo-img"
      onClick={e => {
        e.preventDefault()
        location.reload();
      }}
      style={{
        cursor: "pointer"
      }}
    />
  );
});

export default UrlShortenerSvg;
