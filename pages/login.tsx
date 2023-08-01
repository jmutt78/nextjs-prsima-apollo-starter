/* eslint-disable react/no-unescaped-entities */
import { Container, Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';
import styled from '@emotion/styled';
import {
  UserSignInMutationVariables,
  useMeLazyQuery,
  useUserSignInMutation,
} from '../graphql/graphql';
import { useSnackbar } from 'notistack';
import router from 'next/router';
import { useEffect } from 'react';

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 320px;
  margin: 0px auto;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LoginPage: React.FC = () => {
  const [userSignIn, { error, loading }] = useUserSignInMutation();
  const [me, { error: meError, loading: meLoading, data }] = useMeLazyQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    me();
  }, [me]);

  useEffect(() => {
    if (!meLoading && !meError && data?.me?.id) {
      router.push('/');
    }
  }, [meLoading, meError, data?.me]);

  const handleSubmit = async (values: UserSignInMutationVariables) => {
    try {
      const { data } = await userSignIn({ variables: values });
      if (data) router.push('/');
    } catch (e) {
      console.error(error); // Handle the error here
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    }
  };

  return (
    <Container
      sx={{
        margin: '0px auto',
        width: '100%',
        maxWidth: '960px',
        height: '100vh', // Set the height to fill the viewport
        display: 'flex', // Enable flexbox
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'center', // Center children vertically
      }}
    >
      <FormWrapper>
        <FormContainer>
          <Typography variant='h4' fontWeight={600} component='h1' gutterBottom>
            Login
          </Typography>
          <AuthForm
            fields={[
              { label: 'Email', type: 'email' },
              { label: 'Password', type: 'password' },
            ]}
            buttonText='Continue with Email'
            onSubmit={handleSubmit}
            loading={loading}
          />
        </FormContainer>
        <Typography mt={3}>
          Don't have an account?{' '}
          <Typography
            component='a'
            sx={{ color: 'primary.main', cursor: 'pointer' }}
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </Typography>
        </Typography>
      </FormWrapper>
    </Container>
  );
};

export default LoginPage;
