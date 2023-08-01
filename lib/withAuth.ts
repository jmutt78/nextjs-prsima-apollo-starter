import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../graphql/graphql';
import { log } from 'console';

export const useIsAuth = () => {
  const { data, loading, error } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    console.log('data', data);
    if (!loading && !data?.me) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [loading, data, router, error]);
};
