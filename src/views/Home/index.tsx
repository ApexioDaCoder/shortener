import React, { useCallback, useReducer, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { isServer } from '@/utils';
import { Formik, Form, FormikConfig } from 'formik';
import { Maybe } from '@/types';
import BaseTextField from '@/components/BaseTextField';
import { ShortUrlData } from '@/api/models/ShortUrl';
import UrlShortenerSvg from './components/UrlShortenerSvg';
import ExternalLink from '@/components/ExternalLink';
import ShareButtons from './components/ShareButtons';
import UrlQrCode from './components/UrlQrCode';
import { ShortUrlInput, shortUrlInputSchema } from '@/utils/validationSchemas';
import { Box, InputAdornment, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import BaseButton from '@/components/BaseButton';
import Spacer from '@/components/Spacer';
import Alert from '@mui/material/Alert';
import { Bold } from '@/components/StyleUtils';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError;
}

const qrCodeSize = 256;

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit'];

const initialValues: ShortUrlInput = shortUrlInputSchema.getDefault();

interface State {
  data: Maybe<ShortUrlData>;
  error: Maybe<string>;
}

type Action =
  | { type: 'request' }
  | { type: 'success'; response: AxiosResponse }
  | { type: 'error'; error: AxiosError | Error };

const doRequest = (): Action => ({
  type: 'request',
});

const doSuccess = (response: AxiosResponse): Action => ({
  type: 'success',
  response,
});

const doError = (error: AxiosError | Error): Action => ({
  type: 'error',
  error,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'request':
      return { ...state, data: undefined, error: undefined };
    case 'success':
      return { ...state, data: action.response.data };
    case 'error':
      const { error } = action;
      let errorMessage = error.message;
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message ?? errorMessage;
      }
      return {
        ...state,
        error: errorMessage,
      };
    default:
      throw new Error();
  }
};

const initialState: State = {
  data: undefined,
  error: undefined,
};

const HomeView = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = useCallback<OnSubmit<ShortUrlInput>>(
    async (values, formikHelpers) => {
      dispatch(doRequest());
      try {
        const response = await axios.post('/api/shorturl', values);
        dispatch(doSuccess(response));
        formikHelpers.resetForm();
      } catch (error) {
        dispatch(doError(error));
      } finally {
        formikHelpers.setSubmitting(false);
      }
    },
    [],
  );

  const { data } = state;
  const url = data?.url;
  const alias = data?.alias;
  const origin = isServer()
    ? process.env.NEXT_PUBLIC_BASE_URL
    : window.location.origin;
  const shortenedUrl = alias ? `${origin}/${alias}` : null;

  const { error } = state;

  const [hasCopied, setHasCopied] = useState(false);

  return (
    <>
      <Box
        height="200px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <UrlShortenerSvg />
      </Box>
      <Alert severity={'info'} variant="outlined">
        Based on{' '}
        <ExternalLink href="https://onurl.vercel.app/" hasIcon>
          OnURL
        </ExternalLink>
      </Alert>
      <Spacer flexDirection="column" marginY={1} spacing={1}></Spacer>
      <Formik<ShortUrlInput>
        initialValues={initialValues}
        validationSchema={shortUrlInputSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting }) => {
          return (
            <>
              <Form noValidate>
                <Box display="flex" flexDirection="column" gap="10px">
                  <BaseTextField
                    name="url"
                    label="URL"
                    required
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <BaseTextField
                    name="customAlias"
                    label="Custom Alias (Optional)"
                  />
                  <Box display="flex" justifyContent="flex-end">
                    <BaseButton
                      type="submit"
                      color="primary"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={!isValid}
                    >
                      Submit
                    </BaseButton>
                  </Box>
                </Box>
              </Form>
              <Spacer flexDirection="column" spacing={2} marginY={1}>
                {error && (
                  <Box marginY={2}>
                    <Alert severity={'error'} variant="outlined">
                      {error}
                    </Alert>
                  </Box>
                )}
                {url && (
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                    }}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography noWrap>
                        <ExternalLink href={url}>{url}</ExternalLink>
                      </Typography>
                    </Box>
                    {shortenedUrl && (
                      <Box display="flex" justifyContent="end">
                        <Typography noWrap>
                          <ExternalLink href={shortenedUrl}>
                            {shortenedUrl}
                          </ExternalLink>
                        </Typography>
                        <Box marginLeft={1}>
                          <CopyToClipboard
                            text={shortenedUrl}
                            onCopy={() => {
                              setHasCopied(true);
                              setTimeout(() => {
                                setHasCopied(false);
                              }, 2000);
                            }}
                          >
                            <BaseButton
                              startIcon={<FileCopyOutlinedIcon />}
                              size="small"
                              variant="contained"
                            >
                              {hasCopied ? 'Copied' : 'Copy'}
                            </BaseButton>
                          </CopyToClipboard>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
                {shortenedUrl && (
                  <Box maxWidth={qrCodeSize}>
                    <UrlQrCode url={shortenedUrl} size={qrCodeSize} />
                  </Box>
                )}
              </Spacer>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default HomeView;
