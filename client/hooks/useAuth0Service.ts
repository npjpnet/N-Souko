import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';

const useAuth0Service = () => {
  const [token, setToken] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      setToken(await getAccessTokenSilently());
    };
    fetchToken();
  }, [token]);

  const getToken = useCallback(() => {
    return token;
  }, [token]);

  return { getToken };
};

export default useAuth0Service;
