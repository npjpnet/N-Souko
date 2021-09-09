import { useState } from 'react';
import { Souko } from '../../libs/n-souko';

import type { NextPage } from 'next';
import Layout from '../../components/layout';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const souko = new Souko();
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

  const createContainer = async () => {
    console.log('createContainer');
    setAlertMessage('');

    if (!storageId) {
      setAlertMessage('倉庫管理IDを入力してください');
    }
    if (!containerName) {
      setAlertMessage('コンテナ名を入力してください');
    }

    const result = await souko.addContainer({
      storageId,
      name: containerName,
    });
    if (result.error === 'storage not found') {
      setAlertMessage('指定された倉庫が見つかりません');
    }

    setAddContainerResult(result);
  };

  return (
    <Layout title="コンテナ作成">
      <div>
        {alertMessage ? (
          <div className={`${commonStyles.alert} ${commonStyles.alert_danger}`}>
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
          <input
            placeholder="倉庫管理ID"
            className={commonStyles.input}
            value={storageId}
            onChange={(e) => setStorageId(e.target.value)}
          ></input>
          <input
            placeholder="コンテナ名"
            className={commonStyles.input}
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          ></input>
        </div>
      </div>
    </Layout>
  );
};

export default Home;