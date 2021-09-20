import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/dist/client/router';
import { ReactChild, ReactNode } from 'react';

const WithAuth = ({ children }: { children: any }) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth0();

  if (router.isReady && !isLoading && !isAuthenticated) {
    router.push('/');
    return <></>;
  }

  return children;
};

export default WithAuth;
