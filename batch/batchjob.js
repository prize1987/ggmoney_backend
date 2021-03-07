import * as api from './api.js';
import database from './database.js';

const db = new database();

const main = async () => {
  db.connect();
  // 1. API Count, DB Count get

  const data = await api.getSigunData(1, 10, '수원시');

  await db.insertStoreInfo(data);

  const apicnt = await api.getSigunDataCount('수원시');
  const cnt = await db.getStoreInfoCount('수원시');
  console.log(apicnt, cnt);

  db.end();
};

main();
