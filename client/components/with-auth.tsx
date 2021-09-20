import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/dist/client/router';

const WithAuth = (props) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth0();

  if (router.isReady && !isLoading && !isAuthenticated) {
    router.push('/');
    return <></>;
  }

  return props.children;
};

export default WithAuth;
