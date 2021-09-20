import { useState } from 'react';

import useContainer from '../../hooks/useContainer';

import type { NextPage } from 'next';
import Layout from '../../components/layout';
import WithAuth from '../../components/with-auth';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const [alertMessage, setAlertMessage] = useState('');

  const [storageId, setStorageId] = useState('');
  const [containerName, setContainerName] = useState('');

  const [addContainerResult, setAddContainerResult] = useState({
    containerId: '',
    code: '',
    name: '',
    storage: {
      _id: '',
      name: '',
    },
  });

  const { addContainer } = useContainer();

  const createContainer = async () => {
    console.log('createContainer');
    setAlertMessage('');

    if (!storageId) {
      setAlertMessage('倉庫管理IDを入力してください');
      return;
    }
    if (!containerName) {
      setAlertMessage('コンテナ名を入力してください');
      return;
    }

    const result = await addContainer({
      storageId,
      name: containerName,
    });
    if (result.error === 'storage not found') {
      setAlertMessage('指定された倉庫が見つかりません');
      return;
    }

    setAddContainerResult(result);
  };

  return (
    <WithAuth>
      <Layout title="コンテナ作成">
        <div>
          {alertMessage ? (
            <div
              className={`${commonStyles.alert} ${commonStyles.alert_danger}`}
            >
              {alertMessage}
            </div>
          ) : (
            <div></div>
          )}

          {addContainerResult.containerId ? (
            <div>
              <div className={commonStyles.alert}>
                {addContainerResult.storage.name}に{addContainerResult.name}(
                {addContainerResult.code}
                )を作成しました。
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <button
            className={commonStyles.button}
            onClick={() => createContainer()}
          >
            コンテナ作成
          </button>
          <div>
            <div className={commonStyles.formPart}>
              <input
                placeholder="倉庫管理ID"
                className={commonStyles.input}
                value={storageId}
                onChange={(e) => setStorageId(e.target.value)}
              ></input>
              <label className={commonStyles.input_label}>倉庫管理ID</label>
              <span className={commonStyles.help}>
                倉庫に掲示されている倉庫管理QRコードを読み取ってください。
              </span>
            </div>

            <div className={commonStyles.formPart}>
              <input
                placeholder="コンテナ名"
                className={commonStyles.input}
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
              ></input>
              <label className={commonStyles.input_label}>コンテナ名</label>
            </div>
          </div>
        </div>
      </Layout>
    </WithAuth>
  );
};

export default Home;
