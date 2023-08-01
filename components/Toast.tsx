import { ClassNames } from '@emotion/react';
import { Close } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';
import type { SnackbarKey } from 'notistack';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { extraColors } from '../lib/theme';

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current?.closeSnackbar(key);
  };
  const theme = useTheme();
  return (
    <ClassNames>
      {({ css }) => (
        <SnackbarProvider
          ref={notistackRef}
          classes={{
            root: css({
              ...theme.typography.body2Bold,
            }),
            // @ts-ignore
            variantSuccess: css({
              '&.SnackbarItem-variantSuccess': {
                backgroundColor: extraColors.medium,
              },
            }),
            variantError: css({
              backgroundColor: extraColors.error,
            }),
          }}
          action={(key) => (
            <IconButton onClick={onClickDismiss(key)}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          )}
        >
          {children}
        </SnackbarProvider>
      )}
    </ClassNames>
  );
};
