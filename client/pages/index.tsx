import { useState } from 'react';
import { Souko } from '../libs/n-souko';

import Link from 'next/link';

import type { NextPage } from 'next';
import Layout from '../components/layout';

import commonStyles from '../styles/common.module.scss';

const Home: NextPage = () => {
  const souko = new Souko();

  const [alertMessage, setAlertMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const checkConnection = async () => {
    setAlertMessage('');
    setSuccessMessage('');

    const result = await souko.checkConnection();
    if (result.error) setAlertMessage(`API接続エラー ${result.error}`);
    if (result.status === 'ok') setSuccessMessage('APIは正常に動作しています');
  };

  return (
    <Layout>
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
              onClick={() => checkConnection()}
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
      </div>
    </Layout>
  );
};

export default Home;
