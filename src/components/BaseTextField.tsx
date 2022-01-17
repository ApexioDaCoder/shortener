import React, { useEffect, useRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField, FieldHookConfig } from 'formik';
import { styled } from '@mui/styles';

type Theme = {
  theme: {
    transitions: {
      create(args: string[]): string;
    };
  };
};

export type BaseTextFieldProps = TextFieldProps &
  FieldHookConfig<TextFieldProps['value']>;

const StyledTextField = styled(TextField)(({ theme }: Theme) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: '#1e293b',
    boxShadow: 'inset 0 1px #ffffff0d, 0 1px 2px #0000000d',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: '#29374b',
    },
    '&.Mui-focused': {
      backgroundColor: '#334155',
    },
  },
  '& .MuiFormHelperText-root': {
    marginTop: '15px',
  },
}));

function BaseTextField(props: BaseTextFieldProps) {
  const [field, meta] = useField(props);
  const { error, touched } = meta;
  const hasError = Boolean(error && touched);
  const errorMessage = hasError ? error : undefined;

  const inputRef = useRef<HTMLInputElement>();

  const { autoFocus } = props;

  // To make autoFocus work with Next.js
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <StyledTextField
      {...{ ...props, ...field, variant: props.variant ?? 'filled' }}
      inputRef={inputRef}
      // To be able to set the value as "undefined"
      // or "null" in Formik etc
      value={field.value ?? ''}
      fullWidth
      error={hasError}
      helperText={errorMessage}
      InputProps={{ disableUnderline: true }}
    />
  );
}

export default BaseTextField;
