import { useState } from 'react';

import Link from 'next/link';

import type { NextPage } from 'next';
import Layout from '../components/layout';
import useAPIService from '../hooks/useAPIService';

import commonStyles from '../styles/common.module.scss';
import { useAuth0 } from '@auth0/auth0-react';

const Home: NextPage = () => {
  const { isLoading, isAuthenticated, loginWithPopup, logout } = useAuth0();

  const [alertMessage, setAlertMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { checkConnection } = useAPIService();
  const checkConnectionController = async () => {
    setAlertMessage('');
    setSuccessMessage('');

    const result = await checkConnection();
    if (result.error) setAlertMessage(`API接続エラー ${result.error}`);
    if (result.status === 'ok') setSuccessMessage('APIは正常に動作しています');
  };

  const loadingComponent = <span>N-Memkan認証中</span>;

  const unloggedInComponent = (
    <div>
      <div className={commonStyles.container}>
        <h2>N-Memkan 接続管理</h2>
        <div>
          <button
            className={commonStyles.button}
            onClick={() => loginWithPopup()}
          >
            N-Memkanにログイン
          </button>
        </div>
      </div>
    </div>
  );

  const loggedInComponent = (
    <div>
      <div className={commonStyles.container}>
        <h2>倉庫管理</h2>
        <div>
          <Link href="/containers/search">
            <a className={commonStyles.button}>コンテナ照会</a>
          </Link>
          <Link href="/containers/add">
            <a className={commonStyles.button}>コンテナ作成</a>
          </Link>
          <Link href="/devices/changeStatus">
            <a className={commonStyles.button}>機材情報更新</a>
          </Link>
        </div>
      </div>
      <hr />
      <div>
        <h2>機材管理</h2>
        <div>
          <a className={commonStyles.button}>機材横断検索</a>
          <Link href="/products/add">
            <a className={commonStyles.button}>製品登録</a>
          </Link>
        </div>
      </div>
      <hr />
      <div>
        <h2>端末試験</h2>
        <div>
          <button
            className={commonStyles.button}
            onClick={() => checkConnectionController()}
          >
            APIサーバ接続確認
          </button>
          {successMessage ? (
            <div className={commonStyles.alert}>{successMessage}</div>
          ) : (
            <div></div>
          )}
          {alertMessage ? (
            <div
              className={`${commonStyles.alert} ${commonStyles.alert_danger}`}
            >
              {alertMessage}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <hr />
      <div>
        <h2>N-Memkan 接続管理</h2>
        <div>
          <button className={commonStyles.button} onClick={() => logout()}>
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {isLoading
        ? loadingComponent
        : isAuthenticated
        ? loggedInComponent
        : unloggedInComponent}
    </Layout>
  );
};

export default Home;
