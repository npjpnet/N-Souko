import type { NextPage } from 'next';
import Layout from './components/layout';

import commonStyles from '../styles/common.module.scss';

const Home: NextPage = () => {
  return (
    <Layout title="A">
      <div>
        <div className={commonStyles.container}>
          <h2>倉庫管理</h2>
          <div>
            <a className={commonStyles.button}>コンテナ照会</a>
            <a className={commonStyles.button}>機材格納先更新</a>
            <a className={commonStyles.button}>機材状態直接更新</a>
          </div>
        </div>
        <hr />
        <div>
          <h2>機材管理</h2>
          <div>
            <a className={commonStyles.button}>機材登録</a>
            <a className={commonStyles.button}>製品登録</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
