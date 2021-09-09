import Link from 'next/link';

import type { NextPage } from 'next';
import Layout from '../components/layout';

import commonStyles from '../styles/common.module.scss';

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <div className={commonStyles.container}>
          <h2>倉庫管理</h2>
          <div>
            <Link href="/containers/search">
              <a className={commonStyles.button}>コンテナ照会</a>
            </Link>
            <Link href="/devices/changeContainer">
              <a className={commonStyles.button}>機材格納先更新</a>
            </Link>
            <Link href="/devices/changeStatus">
              <a className={commonStyles.button}>機材状態直接更新</a>
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
      </div>
    </Layout>
  );
};

export default Home;
