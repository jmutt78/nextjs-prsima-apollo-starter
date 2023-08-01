import { Box } from '@mui/material';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  variant?: WrapperVariant;
  children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <>
      <Box mx='auto' pt={30} maxWidth={variant === 'regular' ? '1000px' : '400px'} width='100%'>
        {children}
      </Box>
    </>
  );
};
