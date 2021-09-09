import { useState } from 'react';
import { Souko } from '../../libs/n-souko';

import type { NextPage } from 'next';
import Layout from '../../components/layout';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const souko = new Souko();
  const [deviceCode, setDeviceCode] = useState('');
  const [status, setStatus] = useState('');

  const changeStatus = () => {
    console.log('changeStatus');
    souko.changeStatusWithDeviceId();
  };

  return (
    <Layout title="機材状態直接更新">
      <div>
        <button className={commonStyles.button} onClick={() => changeStatus()}>
          機材状態更新
        </button>
        {true ? (
          <div>
            {/* <button
              className={`${commonStyles.button} ${commonStyles.button_danger}`}
              onClick={() => resetInput()}
            >
              入力情報をクリア
            </button> */}
            <div className={commonStyles.alert}>
              FZ-X1(000049)の状態を「故障」に変更しました。
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <input
            placeholder="機材コード"
            type="number"
            className={commonStyles.input}
            value={deviceCode}
            onChange={(e) => setDeviceCode(e.target.value)}
          ></input>
          <select
            className={commonStyles.input}
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="">状態を選択してください</option>
            <option value="available">使用可能</option>
            <option value="reparing">修理中</option>
            <option value="failure">故障</option>
            <option value="remove">破棄･管理対象外</option>
          </select>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
