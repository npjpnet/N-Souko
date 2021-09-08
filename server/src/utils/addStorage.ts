import dotenv from 'dotenv';
dotenv.config();

import { Db } from '../libs/core';

const main = async () => {
  if (!process.env.DB_URI || !process.env.DB_NAME) {
    console.error('.envファイルが正しく設定されていません');
    return;
  }

  if (process.argv.length != 3) {
    console.error('引数が不正です');
    return;
  }

  const db = new Db(process.env.DB_URI, process.env.DB_NAME);
  db.start().then(async () => {
    const objectId = await db.addStorage({ name: process.argv[2] });
    console.log(`倉庫「${process.argv[2]}」を作成しました(${objectId})`);
  });
};

main();
