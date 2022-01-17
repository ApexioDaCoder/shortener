import React from 'react';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';
import BaseButton from '@/components/BaseButton';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Bold } from '@/components/StyleUtils';

const SaveButton = styled(BaseButton)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
` as typeof BaseButton;

const qrCodeId = 'qrCode';

const handleSaveQrCode = async () => {
  const canvas = document.getElementById(qrCodeId) as HTMLCanvasElement;
  const png = canvas?.toDataURL();
  saveAs(png, `qr-link`);
};

const StyledQRCode = styled(QRCode)`
  display: block;
  height: auto !important;
  width: 100% !important;
  border: 3px solid #fff;
`;

interface UrlQrCodeProps {
  url: string;
  size: number;
}

const UrlQrCode = React.memo<UrlQrCodeProps>(function UrlQrCode({ url, size }) {
  return (
    <Box sx={{ background: '#007FFF', color: 'black', borderRadius: '10px' }}>
      <Typography sx={{ padding: '5px', textAlign: 'center' }}>
        <Bold>QR Code</Bold>
      </Typography>
      <StyledQRCode value={url} renderAs="svg" />
      {/* This hidden qr code is just used to download it easily.
                    Converting the svg to png or jpeg and then downloading didn't work for now. */}
      <Box hidden>
        <StyledQRCode id={qrCodeId} value={url} size={size * 2} />
      </Box>
      <SaveButton
        startIcon={<CloudDownloadOutlinedIcon />}
        variant="contained"
        color="secondary"
        onClick={handleSaveQrCode}
      >
        Save
      </SaveButton>
    </Box>
  );
});

export default UrlQrCode;
