import * as api from './api.js';
import database from './database.js';

const db = new database();

const main = async () => {
  // 1. API Count, DB Count get

  const data = await api.getSigunData(1, 10, '수원시');

  db.insertStoreInfo(data);

  const cnt = db.getStoreInfoCount('수원시');
  console.log(cnt);
};

main();
