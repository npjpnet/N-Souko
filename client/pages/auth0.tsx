import type { NextPage } from 'next';
import Layout from '../components/layout';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

import commonStyles from '../styles/common.module.scss';

const Home: NextPage = () => {
  const {
    user,
    loginWithRedirect,
    logout,
    getIdTokenClaims,
    getAccessTokenSilently,
  } = useAuth0();

  const getAccessToken = async () => {
    const accessToken = await getAccessTokenSilently();
    console.log(accessToken);
    // console.log(accessToken.__raw);
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  return (
    <Layout>
      <div>hello world</div>
      <div>{user?.sub}</div>
      <button
        className={commonStyles.button}
        onClick={() => loginWithRedirect()}
      >
        ログイン
      </button>
      <button className={commonStyles.button} onClick={() => logout()}>
        ログアウト
      </button>
    </Layout>
  );
};

export default Home;
