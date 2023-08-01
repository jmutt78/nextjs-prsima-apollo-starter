import { Grid } from '@mui/material';
import { Wrapper, WrapperVariant } from './Wrapper';
import SideBar from './SideBar';

interface LayoutProps {
  variant?: WrapperVariant;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <Grid
      gridTemplateColumns={{
        base: 'repeat(0, 1fr)',
        md: 'repeat(4, 1fr)',
        lg: 'repeat(6, 1fr)',
      }}
      gridTemplateRows='repeat(1, 1fr)'
      height='100vh'
      gap={2}
    >
      <Grid item xs={false} md={false} lg={2}>
        <SideBar />
      </Grid>
      <Grid item xs={12} md={12} lg={10} style={{ padding: '2px' }}>
        {/* <DrawerBar /> */}
        <Wrapper variant={variant}>{children}</Wrapper>
      </Grid>
    </Grid>
  );
};
