import { useState } from 'react';
import { Souko } from '../../libs/n-souko';

import type { NextPage } from 'next';
import Layout from '../../components/layout';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const souko = new Souko();
  const [alertMessage, setAlertMessage] = useState('');

  const [containerCode, setContainerCode] = useState('');
  const [container, setContainer] = useState({
    container: {
      _id: '',
      storageId: '',
      code: '',
      name: '',
    },
    devices: [
      {
        _id: '',
        code: '',
        status: '',
        serialNumber: '',
        remarks: '',
        product: {
          _id: '',
          name: '',
          maker: {
            name: '',
          },
          genre: '',
        },
      },
    ],
  });

  const getContainer = async () => {
    console.log('getContainer');
    setAlertMessage('');

    if (!containerCode) {
      setAlertMessage('コンテナコードを入力してください');
      return;
    }

    const result = await souko.getContainerWithCode(containerCode);
    if (!result) {
      setAlertMessage('指定されたコンテナが見つかりません');
      return;
    }

    console.log(result);
    setContainer(result);
  };

  return (
    <Layout title="コンテナ情報照会">
      <div>
        {alertMessage ? (
          <div className={`${commonStyles.alert} ${commonStyles.alert_danger}`}>
            {alertMessage}
          </div>
        ) : (
          <div></div>
        )}

        <input
          placeholder="コンテナコード"
          type="number"
          className={commonStyles.input}
          value={containerCode}
          onChange={(e) => setContainerCode(e.target.value)}
        ></input>
        <button className={commonStyles.button} onClick={() => getContainer()}>
          照会
        </button>
        {container && container.container._id ? (
          <div>
            <div className={commonStyles.section}>
              <table className={commonStyles.infoTable}>
                <tbody>
                  <tr>
                    <th>格納倉庫ID</th>
                    <td>{container.container.storageId}</td>
                  </tr>
                  <tr>
                    <th>名称</th>
                    <td>{container.container.name}</td>
                  </tr>
                  <tr>
                    <th>コード</th>
                    <td>{container.container.code}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={commonStyles.section}>
              <h2>内容物一覧({container.devices.length}件)</h2>
              <div>
                {container.devices.map((v) => {
                  return (
                    <div key={v._id} className={commonStyles.card}>
                      <div className={commonStyles.card_title}>
                        {v.product.name}({v.code})
                      </div>
                      <div className={commonStyles.card_detail}>
                        S/N : {v.serialNumber ? v.serialNumber : '不明'}
                        <br />
                        {v.remarks ? v.remarks : '備考はありません'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
