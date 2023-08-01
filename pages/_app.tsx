import * as React from 'react';

import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../lib/createEmotionCache';
import theme from '../lib/theme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apollo';
import { ToastProvider } from '../components/Toast';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apolloClient = useApollo(pageProps.initialApolloState); // Initialize your Apollo Client instance

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </ToastProvider>
        </ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
}
