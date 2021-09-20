import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

const useAuth0Service = () => {
  const { getAccessTokenSilently } = useAuth0();
  const token = getAccessTokenSilently();

  const getToken = useCallback(() => {
    return token;
  }, [token]);

  return { getToken };
};

export default useAuth0Service;
