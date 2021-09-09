import { useState } from 'react';
import { Souko } from '../../libs/n-souko';

import type { NextPage } from 'next';
import Layout from '../../components/layout';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const souko = new Souko();
  const [alertMessage, setAlertMessage] = useState('');

  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [makerName, setMakerName] = useState('');
  const [genre, setGenre] = useState('');
  const [containerCode, setContainerCode] = useState('');
  const [status, setStatus] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [deviceRemarks, setDeviceRemarks] = useState('');

  const [addDeviceResult, setAddDeviceResult] = useState({
    deviceId: '',
    code: '',
    productName: '',
  });

  const addProduct = async () => {
    console.log('addProduct');

    if (!productName) {
      setAlertMessage('機材の型番等備品名が入力されていません');
      return;
    }
    if (genre === '') {
      setAlertMessage('機材のジャンルが指定されていません');
      return;
    }

    const result = await souko.addProduct({
      name: productName,
      maker: { name: makerName },
      genre,
    });
    setProductId(result.productId);

    return result.productId;
  };

  const addDevice = async () => {
    console.log('addDevice');
    setAlertMessage('');

    const newProductId = !productId ? await addProduct() : productId;
    if (!newProductId) return;

    if (!containerCode) {
      setAlertMessage('コンテナコードが入力されていません');
      return;
    }
    if (status === '') {
      setAlertMessage('機材状態が指定されていません');
      return;
    }

    const result = await souko.addDevice(newProductId, {
      containerCode: containerCode,
      status,
      serialNumber,
      remarks: deviceRemarks,
    });
    if (result.error === 'container not found') {
      setAlertMessage('指定されたコンテナが見つかりません');
      return;
    }
    setAddDeviceResult(result);
    console.log(result);
  };

  const resetInput = () => {
    setProductId('');
    setProductName('');
    setMakerName('');
    setGenre('');
    setContainerCode('');
    setStatus('');
    setSerialNumber('');
    setDeviceRemarks('');
    setAddDeviceResult({
      deviceId: '',
      code: '',
      productName: '',
    });
  };

  return (
    <Layout title="製品登録">
      <div>
        {alertMessage ? (
          <div className={`${commonStyles.alert} ${commonStyles.alert_danger}`}>
            {alertMessage}
          </div>
        ) : (
          <div></div>
        )}

        <div className={commonStyles.container}>
          <div className={commonStyles.section}>
            {addDeviceResult && addDeviceResult.code ? (
              <div>
                <button
                  className={`${commonStyles.button} ${commonStyles.button_danger}`}
                  onClick={() => resetInput()}
                >
                  入力情報をクリア
                </button>
                <div className={commonStyles.alert}>
                  {addDeviceResult.productName}({addDeviceResult.code}
                  )を登録しました。
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <button className={commonStyles.button} onClick={() => addDevice()}>
              製品･機材登録
            </button>
          </div>

          <h2>製品情報</h2>
          <div>
            <input
              placeholder="製品管理ID(自動入力)"
              className={commonStyles.input}
              onChange={(e) => setProductId(e.target.value)}
              value={productId}
              disabled
            ></input>
            <input
              placeholder="型番等備品名"
              className={commonStyles.input}
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
              disabled={!!productId}
            ></input>
            <input
              placeholder="メーカー名"
              className={commonStyles.input}
              onChange={(e) => setMakerName(e.target.value)}
              value={makerName}
              disabled={!!productId}
            ></input>
            <select
              className={commonStyles.input}
              onChange={(e) => setGenre(e.target.value)}
              value={genre}
              disabled={!!productId}
            >
              <option value="">ジャンルを選択してください</option>
              <option value="broadcast">放送配信</option>
              <option value="pa">会場音響</option>
              <option value="venue-supplies">会場整備</option>
              <option value="pr">広報</option>
              <option value="oa">事務</option>
              <option value="transpotation">運搬用品</option>
              <option value="other">その他</option>
            </select>
          </div>

          <hr />

          <h2>機材情報</h2>
          <div>
            <input
              placeholder="格納コンテナコード"
              type="number"
              className={commonStyles.input}
              onChange={(e) => setContainerCode(e.target.value)}
              value={containerCode}
              required
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
            <input
              placeholder="シリアルナンバー"
              className={commonStyles.input}
              onChange={(e) => setSerialNumber(e.target.value)}
              value={serialNumber}
            ></input>
            <input
              placeholder="備考"
              className={commonStyles.input}
              onChange={(e) => setDeviceRemarks(e.target.value)}
              value={deviceRemarks}
            ></input>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
