import { useState } from 'react';

import useDevice from '../../hooks/useDevice';

import type { NextPage } from 'next';
import Layout from '../../components/layout';
import WithAuth from '../../components/withAuth';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [deviceCode, setDeviceCode] = useState('');
  const [containerCode, setContainerCode] = useState('');
  const [status, setStatus] = useState('');

  const { changeDeviceWithCode } = useDevice();

  const changeStatus = async () => {
    console.log('changeStatus');
    setAlertMessage('');
    setSuccessMessage('');

    if (!deviceCode) {
      setAlertMessage('機材コードを入力してください');
      return;
    }

    const result = await changeDeviceWithCode(deviceCode, {
      status,
      containerCode,
    });
    console.log(result);
    if (result.error) {
      setAlertMessage(
        result.error === 'unauthorized'
          ? 'ログインされていません'
          : result.error === 'device not found'
          ? '指定された機材が見つかりません'
          : result.error === 'container not found'
          ? '指定されたコンテナが見つかりません'
          : ''
      );
    }
    if (result.status === 'ok') {
      setSuccessMessage(
        `${result.product.name}(${result.device.code})の状態の変更が完了しました`
      );
    }
  };

  return (
    <WithAuth>
      <Layout title="機材状態直接更新">
        <div>
          <button
            className={commonStyles.button}
            onClick={() => changeStatus()}
          >
            機材状態更新
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
          <div>
            <div className={commonStyles.formPart}>
              <input
                placeholder="機材コード"
                type="number"
                className={commonStyles.input}
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value)}
              ></input>
              <label className={commonStyles.input_label}>機材コード</label>
              <span className={commonStyles.help}>
                状態を変更する機材に貼付されているQRコードを読み取るか、併記されている6桁の数字を入力してください。
              </span>
            </div>

            <div className={commonStyles.formPart}>
              <input
                placeholder="移動先コンテナコード"
                type="number"
                className={commonStyles.input}
                value={containerCode}
                onChange={(e) => setContainerCode(e.target.value)}
              ></input>
              <label className={commonStyles.input_label}>
                移動先コンテナコード
              </label>
              <span className={commonStyles.help}>
                変更しない場合は何も入力しないでください。
              </span>
            </div>

            <div className={commonStyles.formPart}>
              <select
                className={commonStyles.input}
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value="">現状維持</option>
                <option value="available">使用可能</option>
                <option value="reparing">修理中</option>
                <option value="failure">故障</option>
                <option value="remove">破棄･管理対象外</option>
              </select>
              <label className={commonStyles.input_label}>機材状態</label>
              <span className={commonStyles.help}>
                変更しない場合は「現状維持」にしてください。
              </span>
            </div>
          </div>
        </div>
      </Layout>
    </WithAuth>
  );
};

export default Home;
