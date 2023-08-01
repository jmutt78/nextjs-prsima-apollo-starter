import { Container, Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { FormWrapper, FormContainer } from './login';
import {
  CreateUserMutationVariables,
  useCreateUserMutation,
  useMeLazyQuery,
} from '../graphql/graphql';
import { useSnackbar } from 'notistack';
import router from 'next/router';
import { useEffect } from 'react';

const SignupPage: React.FC = () => {
  const [createUser, { error, loading }] = useCreateUserMutation();
  const [me, { error: meError, loading: meLoading, data }] = useMeLazyQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    me();
  }, [me]);

  useEffect(() => {
    if (!meLoading && !meError && data?.me?.id) {
      router.push('/');
    }
  }, [meLoading, meError, data?.me?.id]);

  const handleSubmit = async (values: CreateUserMutationVariables) => {
    try {
      const { data } = await createUser({ variables: values });
      console.log(data); // Handle the response here
      enqueueSnackbar('Sign up successful', {
        variant: 'success',
      });
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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <FormWrapper>
        <FormContainer>
          <Typography variant='h4' fontWeight={600} component='h1' gutterBottom>
            Sign Up
          </Typography>
          <AuthForm
            fields={[
              { label: 'Email', type: 'email' },
              { label: 'Password', type: 'password' },
            ]}
            buttonText='Sign Up with Email'
            onSubmit={handleSubmit}
            loading={loading}
          />
        </FormContainer>
        <Typography mt={3}>
          Already have an account?{' '}
          <Typography
            component='a'
            sx={{ color: 'primary.main', cursor: 'pointer' }}
            onClick={() => router.push('/login')}
          >
            Login
          </Typography>
        </Typography>
      </FormWrapper>
    </Container>
  );
};

export default SignupPage;
