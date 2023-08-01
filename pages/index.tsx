import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useIsAuth } from '../lib/withAuth';
import { Layout } from '../components/Layout';

export default function Home() {
  useIsAuth();
  return (
    <Layout>
      <Container maxWidth='lg'>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h4' component='h1' gutterBottom>
            App
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}
