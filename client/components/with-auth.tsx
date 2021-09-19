import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';

const WithAuth = (props) => {
  const { isLoading, isAuthenticated } = useAuth0();
  const router = useRouter();

  if (router.isReady && !isLoading && !isAuthenticated) {
    router.push('/');
    return <></>;
  }

  return props.children;
};

export default WithAuth;
