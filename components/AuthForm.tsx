import styled from '@emotion/styled';
import { Button, TextField, Box, Divider } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import { UserSignInMutationVariables, useSignInWithGoogleMutation } from '../graphql/graphql';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { authWithGoogle } from '../firebase/config';
import { useSnackbar } from 'notistack';
import router from 'next/router';

const SocialButton = styled(Button)`
  border-radius: 4px;
  color: rgb(17, 17, 17);
  font-size: 14px;
  line-height: 1;
  padding-left: 12px;
  padding-right: 12px;
  font-weight: 500;
  background: white;
  border: 1px solid rgba(15, 15, 15, 0.15);
  width: 100%;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 1px 2px;
  margin-bottom: 10px;
`;

interface AuthFormProps {
  fields: {
    label: string;
    type: string;
  }[];
  buttonText: string;
  onSubmit: (values: UserSignInMutationVariables) => void;
  loading: boolean;
}

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too Short!').max(50, 'Too Long!').required('Required'),
});

const AuthForm: React.FC<AuthFormProps> = ({ fields, buttonText, onSubmit, loading }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [signInWithGoogle, { error, loading: mutationLoading }] = useSignInWithGoogleMutation();
  return (
    <>
      <SocialButton
        fullWidth
        startIcon={<GoogleIcon />}
        disabled={mutationLoading}
        onClick={async () => {
          try {
            const { token } = await authWithGoogle();
            if (!token) {
              throw new Error('No token found');
            }

            const { data } = await signInWithGoogle({
              variables: {
                token,
              },
            });

            if (data) {
              router.push('/');
            }
          } catch (error) {
            console.error(error);
            enqueueSnackbar(error as string, {
              variant: 'error',
            });
          }
        }}
      >
        Continue with Google
      </SocialButton>

      <Divider sx={{ width: '100%', marginBottom: '20px' }}>or</Divider>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={onSubmit}
        validationSchema={SignupSchema}
      >
        <Form style={{ width: '100%' }}>
          {fields.map((field, index) => (
            <Box mb={3} key={index}>
              <Field
                as={TextField}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                label={field.label}
                variant='outlined'
                type={field.type}
                name={field.label.toLowerCase()}
              />
              <ErrorMessage name={field.label.toLowerCase()} component='div' />
            </Box>
          ))}
          <Button variant='contained' type='submit' fullWidth disabled={loading}>
            {loading ? 'Loading...' : buttonText}
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default AuthForm;
