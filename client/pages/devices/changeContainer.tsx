import { useState } from 'react';
import { Souko } from '../../libs/n-souko';

import type { NextPage } from 'next';
import Layout from '../../components/layout';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const souko = new Souko();
  const [deviceCode, setDeviceCode] = useState('');
  const [containerCode, setContainerCode] = useState('');

  const changeContainer = () => {
    console.log('changeContainer');
    souko.changeContainerWithDeviceId();
  };

  return (
    <Layout title="機材格納先変更">
      <div>
        <button
          className={commonStyles.button}
          onClick={() => changeContainer()}
        >
          機材格納先更新
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
              FZ-X1(000049)を共同-機材01に格納しました。
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
          <input
            placeholder="コンテナコード"
            type="number"
            className={commonStyles.input}
            value={containerCode}
            onChange={(e) => setContainerCode(e.target.value)}
          ></input>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
