import { useState } from 'react';
import { Souko } from '../../libs/n-souko';

import type { NextPage } from 'next';
import Layout from '../../components/layout';
import WithAuth from '../../components/with-auth';

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
    storage: {
      _id: '',
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
    <WithAuth>
      <Layout title="コンテナ情報照会">
        <div>
          <div className={commonStyles.formPart}>
            <input
              placeholder="コンテナコード"
              type="number"
              className={commonStyles.input}
              value={containerCode}
              onChange={(e) => setContainerCode(e.target.value)}
            ></input>
            <label className={commonStyles.input_label}>コンテナコード</label>
            <span className={commonStyles.help}>
              コンテナのQRコードを読み取るか、併記されている6桁の数字を入力してください。
            </span>
          </div>

          <button
            className={commonStyles.button}
            onClick={() => getContainer()}
          >
            照会
          </button>
          {alertMessage ? (
            <div
              className={`${commonStyles.alert} ${commonStyles.alert_danger}`}
            >
              {alertMessage}
            </div>
          ) : (
            <div></div>
          )}

          {container && container.container._id ? (
            <div>
              <div className={commonStyles.section}>
                <table className={commonStyles.infoTable}>
                  <tbody>
                    <tr>
                      <th>格納倉庫</th>
                      <td>
                        {container.storage.name}({container.storage._id})
                      </td>
                    </tr>
                    <tr>
                      <th>名称</th>
                      <td>{container.container.name}</td>
                    </tr>
                    <tr>
                      <th>コンテナコード</th>
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
    </WithAuth>
  );
};

export default Home;
