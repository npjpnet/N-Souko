import { useState } from 'react';

import type { NextPage } from 'next';
import Layout from '../../components/layout';
import WithAuth from '../../components/withAuth';

import useProduct from '../../hooks/useProduct';
import useDevice from '../../hooks/useDevice';

import commonStyles from '../../styles/common.module.scss';

const Home: NextPage = () => {
  const { addProduct } = useProduct();
  const { addDeviceWithProductId } = useDevice();

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

  const addProductController = async () => {
    console.log('addProduct');

    if (!productName) {
      setAlertMessage('機材の型番等備品名が入力されていません');
      return;
    }
    if (genre === '') {
      setAlertMessage('機材のジャンルが指定されていません');
      return;
    }

    const result = await addProduct({
      name: productName,
      maker: { name: makerName },
      genre,
    });
    if (result.error) {
      setAlertMessage('ログインされていません');
      return;
    }

    setProductId(result.productId);

    return result.productId;
  };

  const addDevice = async () => {
    console.log('addDevice');
    setAlertMessage('');

    const newProductId = !productId ? await addProductController() : productId;
    if (!newProductId) return;

    if (!containerCode) {
      setAlertMessage('コンテナコードが入力されていません');
      return;
    }
    if (status === '') {
      setAlertMessage('機材状態が指定されていません');
      return;
    }

    const result = await addDeviceWithProductId(newProductId, {
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
    <WithAuth>
      <Layout title="製品登録">
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

              <button
                className={commonStyles.button}
                onClick={() => addDevice()}
              >
                製品･機材登録
              </button>
            </div>

            <h2>製品情報</h2>
            <div>
              <div className={commonStyles.formPart}>
                <input
                  placeholder="製品管理ID(自動入力)"
                  className={commonStyles.input}
                  onChange={(e) => setProductId(e.target.value)}
                  value={productId}
                  disabled
                ></input>
                <label className={commonStyles.input_label}>
                  製品管理ID(自動入力)
                </label>
              </div>

              <div className={commonStyles.formPart}>
                <input
                  placeholder="型番等備品名"
                  className={commonStyles.input}
                  onChange={(e) => setProductName(e.target.value)}
                  value={productName}
                  disabled={!!productId}
                ></input>
                <label className={commonStyles.input_label}>型番等備品名</label>
              </div>

              <div className={commonStyles.formPart}>
                <input
                  placeholder="メーカー名"
                  className={commonStyles.input}
                  onChange={(e) => setMakerName(e.target.value)}
                  value={makerName}
                  disabled={!!productId}
                ></input>
                <label className={commonStyles.input_label}>メーカー名</label>
                <span className={commonStyles.help}>
                  ノーブランド、不明な場合は入力しないでください。
                </span>
              </div>

              <div className={commonStyles.formPart}>
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
                <label className={commonStyles.input_label}>ジャンル</label>
              </div>
            </div>

            <hr />

            <h2>機材情報</h2>
            <div>
              <div className={commonStyles.formPart}>
                <input
                  placeholder="格納コンテナコード"
                  type="number"
                  className={commonStyles.input}
                  onChange={(e) => setContainerCode(e.target.value)}
                  value={containerCode}
                  required
                ></input>
                <label className={commonStyles.input_label}>
                  格納コンテナコード
                </label>
                <span className={commonStyles.help}>
                  コンテナのQRコードを読み取るか、併記されている6桁の数字を入力してください。
                </span>
              </div>

              <div className={commonStyles.formPart}>
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
                <label className={commonStyles.input_label}>機材状態</label>
              </div>

              <div className={commonStyles.formPart}>
                <input
                  placeholder="シリアルナンバー"
                  className={commonStyles.input}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  value={serialNumber}
                ></input>
                <label className={commonStyles.input_label}>
                  シリアルナンバー
                </label>
                <span className={commonStyles.help}>
                  不明な場合は入力しないでください。
                </span>
              </div>

              <div className={commonStyles.formPart}>
                <input
                  placeholder="備考"
                  className={commonStyles.input}
                  onChange={(e) => setDeviceRemarks(e.target.value)}
                  value={deviceRemarks}
                ></input>
                <label className={commonStyles.input_label}>備考</label>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </WithAuth>
  );
};

export default Home;
